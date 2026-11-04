"""Serve local userscript updates with explicit UTF-8. Author: @Jhih he."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class UserscriptHandler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map,
                      '.js': 'text/javascript; charset=utf-8'}

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


if __name__ == '__main__':
    root = Path(__file__).resolve().parents[2]
    handler = partial(UserscriptHandler, directory=str(root))
    ThreadingHTTPServer(('127.0.0.1', 8768), handler).serve_forever()
