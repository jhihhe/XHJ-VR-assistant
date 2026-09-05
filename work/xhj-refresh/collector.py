"""Loopback-only receiver for front-end documents exported via the browser UI."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import json, hashlib, urllib.parse

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent / 'pages'
OUT.mkdir(exist_ok=True)

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def do_GET(self):
        if self.path.startswith('/source/'):
            name = urllib.parse.unquote(self.path.split('/source/', 1)[1])
            file = ROOT / name
            if file.is_file() and file.suffix == '.js':
                import html
                body = '<meta charset="utf-8"><pre id="source">' + html.escape(file.read_text()) + '</pre>'
                self.send_response(200); self.send_header('Content-Type', 'text/html; charset=utf-8'); self.end_headers(); self.wfile.write(body.encode()); return
        if self.path.startswith('/houseadmin/'):
            route = urllib.parse.urlparse(self.path).path
            if not Path(route).suffix: route += '/index.html'
            self.path = '/work/xhj-refresh/preview' + route
        if self.path != '/capture':
            return super().do_GET()
        body = '<!doctype html><meta charset="utf-8"><title>本地源码归档</title><form method="post" action="/capture"><label>页面源码<textarea name="payload" aria-label="页面源码"></textarea></label><button>保存到本地</button></form>'
        self.send_response(200); self.send_header('Content-Type', 'text/html; charset=utf-8'); self.end_headers(); self.wfile.write(body.encode())
    def do_POST(self):
        if self.path != '/capture' or self.headers.get('Origin') != 'http://127.0.0.1:8765':
            self.send_error(403); return
        size = int(self.headers.get('Content-Length', 0))
        if size > 20_000_000:
            self.send_error(413); return
        data = json.loads(urllib.parse.parse_qs(self.rfile.read(size).decode())['payload'][0])
        manifest_path = OUT / 'manifest.json'
        manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
        for page in data:
            url = page['url']; parsed = urllib.parse.urlparse(url)
            if parsed.hostname != 'vr.xhj.com':
                continue
            name = parsed.path.strip('/').replace('/', '_') + '-' + hashlib.sha256(url.encode()).hexdigest()[:8] + '.html'
            html = page['html']
            (OUT / name).write_text(html)
            manifest[url] = {'file': name, 'sha256': hashlib.sha256(html.encode()).hexdigest(), 'bytes': len(html.encode()), 'kind': 'rendered DOM including inline scripts'}
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
        self.send_response(200); self.send_header('Content-Type', 'text/html; charset=utf-8'); self.end_headers()
        self.wfile.write(f'<meta charset="utf-8"><p>已归档 {len(manifest)} 个页面</p><a href="/capture">继续归档</a>'.encode())

ThreadingHTTPServer(('127.0.0.1', 8765), Handler).serve_forever()
