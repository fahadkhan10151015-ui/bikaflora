import json, re, os, urllib.request
html = open('_incoming/grab/page.html', encoding='utf-8', errors='ignore').read()
m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.S)
if not m:
    print('NO NEXT DATA', len(html)); raise SystemExit
d = json.loads(m.group(1)); items = {}; depts = {}
def walk(o):
    if isinstance(o, list):
        for x in o: walk(x)
    elif isinstance(o, dict):
        i = o.get('ID')
        if isinstance(i, str) and i.startswith('MYITE') and o.get('name'):
            it = items.get(i, {})
            it.update({k: v for k, v in {'id': i, 'name': o.get('name'), 'desc': o.get('description'), 'price': o.get('takeawayPriceInMin', o.get('priceInMin')), 'dept': (o.get('searchMeta') or {}).get('departmentID'), 'images': o.get('images')}.items() if v})
            items[i] = it
        if isinstance(i, str) and i.startswith('MYCAT') and o.get('name'): depts[i] = o['name']
        for v in o.values(): walk(v)
walk(d)
out = []
for it in items.values():
    it['category'] = depts.get(it.get('dept'), '')
    files = []
    for n, u in enumerate(it.get('images') or []):
        for c in [u.replace('/compressed_webp/', '/'), u]:
            try:
                data = urllib.request.urlopen(urllib.request.Request(c, headers={'Accept': 'image/*'}), timeout=30).read()
                ext = '.webp' if data[:4] == b'RIFF' else ('.png' if data[:4] == b'\x89PNG' else '.jpg')
                fn = f"_incoming/grab/{it['id']}_{n}{ext}"; open(fn, 'wb').write(data); files.append(os.path.basename(fn)); break
            except Exception:
                pass
    it['files'] = files; out.append(it)
json.dump({'depts': depts, 'items': out}, open('_incoming/grab/items.json', 'w'), ensure_ascii=False, indent=1)
print(len(out), 'items')
