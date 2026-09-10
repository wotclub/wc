import json
import os
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

CONFIG = 'config.js'
OUT = 'data/videos.json'

with open(CONFIG, 'r', encoding='utf-8') as f:
    text = f.read()
marker = 'youtubeChannelId:'
try:
    value = text.split(marker, 1)[1].split(',', 1)[0].strip().strip('"\'')
except Exception:
    value = ''

if not value or value.startswith('YOUR_'):
    data = {'updatedAt': datetime.now(timezone.utc).isoformat(), 'videos': []}
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print('YouTube Channel ID is not configured; wrote an empty feed.')
    raise SystemExit(0)

url = f'https://www.youtube.com/feeds/videos.xml?channel_id={value}'
req = urllib.request.Request(url, headers={'User-Agent': 'WOT-CLUB-GitHub-Pages/1.0'})
with urllib.request.urlopen(req, timeout=30) as response:
    xml = response.read()

root = ET.fromstring(xml)
ns = {'yt': 'http://www.youtube.com/xml/schemas/2015', 'media': 'http://search.yahoo.com/mrss/', 'atom': 'http://www.w3.org/2005/Atom'}
videos = []
for entry in root.findall('atom:entry', ns):
    title = entry.findtext('atom:title', default='', namespaces=ns)
    link_el = entry.find('atom:link', ns)
    link = link_el.attrib.get('href', '') if link_el is not None else ''
    video_id = entry.findtext('yt:videoId', default='', namespaces=ns)
    published = entry.findtext('atom:published', default='', namespaces=ns)
    thumb = f'https://i.ytimg.com/vi/{video_id}/hqdefault.jpg' if video_id else ''
    videos.append({'title': title, 'link': link, 'videoId': video_id, 'published': published, 'thumbnail': thumb})

out = {'updatedAt': datetime.now(timezone.utc).isoformat(), 'videos': videos[:12]}
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
print(f'Wrote {len(out["videos"])} videos.')
