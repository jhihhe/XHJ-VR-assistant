"""Build isolated DOM replays; original business scripts never execute."""
from pathlib import Path
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import json, re
BASE = Path(__file__).resolve().parent
OUT = BASE / 'preview'; OUT.mkdir(exist_ok=True)
assets = json.loads((BASE/'source-assets/manifest.json').read_text())
def asset(url):
    entry=assets.get(url)
    return '/work/xhj-refresh/preview/assets/'+entry['file'] if entry and 'file' in entry else ''
(OUT/'assets').mkdir(exist_ok=True)
for url, entry in assets.items():
    if 'file' not in entry: continue
    body=(BASE/'source-assets'/entry['file']).read_bytes()
    if entry['file'].endswith('.css'):
        text=body.decode(errors='replace')
        text=re.sub(r'url\([\s\"\x27]*([^\)\"\x27\s]+)[\s\"\x27]*\)',lambda m:'url("'+(asset(urljoin(url,m[1])) or 'data:,')+'")',text)
        body=text.encode()
    (OUT/'assets'/entry['file']).write_bytes(body)
for url, entry in json.loads((BASE/'pages/manifest.json').read_text()).items():
    soup=BeautifulSoup((BASE/'pages'/entry['file']).read_text(),'html.parser')
    for node in soup.select('script'): node.decompose()
    for node in soup.select('[id^="codex-browser"]'): node.decompose()
    for node in soup.find_all(True):
        for key in list(node.attrs):
            if key.startswith('on'): del node[key]
    for node in soup.select('link[rel="stylesheet"]'):
        node['href']=asset(urljoin(url,node.get('href','')))
    for node in soup.select('img'): node['src']='data:,'
    for node in soup.select('iframe'):
        parsed=urlparse(urljoin(url,node.get('src','')));node['src']=parsed.path
    for node in soup.select('form'): node['onsubmit']='return false'
    if not soup.head: continue
    csp=soup.new_tag('meta'); csp['http-equiv']='Content-Security-Policy';csp['content']="default-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'none'; form-action 'none'; img-src 'self' data:"
    setup=soup.new_tag('script');setup.string="localStorage.setItem('xhj_auto_scale_enabled','false');"
    script=soup.new_tag('script',src='/xhj_assistant_260905.user.js')
    soup.head.insert(0,script);soup.head.insert(0,setup);soup.head.insert(0,csp)
    target=OUT/urlparse(url).path.strip('/')
    if not target.suffix: target=target/'index.html'
    target.parent.mkdir(parents=True,exist_ok=True);target.write_text(str(soup))
print('Built isolated DOM replays in',OUT)
