#!/usr/bin/env bash
# Runs on GitHub's servers (see .github/workflows/fetch-assets.yml).
# Reads the Grab product list (saved to the database from the browser) and downloads every product photo.
set -u
OUT=_incoming/grab; mkdir -p $OUT
KEY=sb_publishable_ssLuTnisZZylfUF_usPuLQ_mbryrJrX
curl -s "https://nmbyvevxdrlgxjepxtuh.supabase.co/rest/v1/tmp_grab_import?select=data&order=id.desc&limit=1" -H "apikey: $KEY" -H "Authorization: Bearer $KEY" -o $OUT/raw.json
python3 - <<'PY'
import json, urllib.request, os
d = json.load(open('_incoming/grab/raw.json'))[0]['data']
for it in d['items']:
    it['files'] = []
    for n, u in enumerate(it.get('images') or []):
        for c in [u.replace('/compressed_webp/', '/'), u]:
            try:
                data = urllib.request.urlopen(urllib.request.Request(c, headers={'Accept': 'image/*'}), timeout=40).read()
                if len(data) < 2000: continue
                ext = '.webp' if data[:4] == b'RIFF' else ('.png' if data[:4] == b'\x89PNG' else '.jpg')
                fn = f"{it['id']}_{n}{ext}"
                open('_incoming/grab/' + fn, 'wb').write(data); it['files'].append(fn); break
            except Exception as e:
                print('fail', c[:80], e)
json.dump(d, open('_incoming/grab/items.json', 'w'), ensure_ascii=False, indent=1)
print(sum(len(i['files']) for i in d['items']), 'photos')
PY
rm -f $OUT/raw.json
