"""Download only source dependencies referenced by archived documents/CSS."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen
from concurrent.futures import ThreadPoolExecutor
import json, re, hashlib, subprocess
BASE = Path(__file__).resolve().parent
OUT = BASE / 'source-assets'; OUT.mkdir(exist_ok=True)
class Parser(HTMLParser):
    def __init__(self): super().__init__(); self.urls = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'script' and a.get('src'): self.urls.append(a['src'])
        if tag == 'link' and a.get('rel') == 'stylesheet': self.urls.append(a['href'])
def allowed(url):
    p = urlparse(url)
    return p.scheme in ('http','https') and (p.hostname == 'vr.xhj.com' and p.path.startswith('/static/') or p.hostname == 'unpkg.com' and p.path.startswith('/element-ui'))
pending = set()
for url, info in json.loads((BASE / 'pages/manifest.json').read_text()).items():
    text = (BASE / 'pages' / info['file']).read_text()
    parser = Parser(); parser.feed(text)
    pending.update(urljoin(url, u) for u in parser.urls if allowed(urljoin(url,u)))
    inline = '\n'.join(re.findall(r'<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)</script>', text))
    (BASE / 'pages' / (info['file'] + '.inline.js')).write_text(inline)
def fetch(url):
    try:
        result = subprocess.run(['curl','--fail','--silent','--show-error','--location','--max-time','25',url], capture_output=True, check=True)
        body = result.stdout; mime = 'text/css' if '.css' in urlparse(url).path else 'application/octet-stream'; final = url
        name = hashlib.sha256(url.encode()).hexdigest()[:12] + '-' + Path(urlparse(url).path).name
        (OUT/name).write_bytes(body)
        return url, {'file':name,'bytes':len(body),'sha256':hashlib.sha256(body).hexdigest(),'contentType':mime,'resolvedUrl':final}, body
    except Exception as e: return url, {'error':str(e)}, b''
manifest = {}; seen = set()
while pending:
    batch = pending - seen; pending = set()
    if not batch: break
    seen.update(batch)
    with ThreadPoolExecutor(max_workers=4) as pool:
        for url, result, body in pool.map(fetch, sorted(batch)):
            manifest[url] = result
            if 'css' in result.get('contentType',''):
                for ref in re.findall(r'url\([\s\"\x27]*([^\)\"\x27\s]+)',body.decode(errors='replace')):
                    target=urljoin(result['resolvedUrl'],ref)
                    if allowed(target): pending.add(target)
(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print(json.dumps({'downloaded':sum('file' in x for x in manifest.values()),'failed':{u:v for u,v in manifest.items() if 'error' in v}},ensure_ascii=False))
