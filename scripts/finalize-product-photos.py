"""Validate and connect the complete studio set after image generation finishes."""
from pathlib import Path
import json,subprocess,concurrent.futures
from PIL import Image
root=Path(__file__).resolve().parents[1]
products=json.loads((root/'lib/printers.json').read_text())+json.loads((root/'lib/filaments.json').read_text())
studio=root/'public/images/studio'
missing=[p['id'] for p in products if not (studio/(p['id']+'.webp')).exists()]
if missing:raise SystemExit('Missing: '+', '.join(missing))
for p in products:
 with Image.open(studio/(p['id']+'.webp')) as image:
  image.verify()
backup=root/'source-assets/filament-originals';backup.mkdir(parents=True,exist_ok=True)
def convert(p):
 out=p.with_suffix('.webp')
 subprocess.run(['ffmpeg','-loglevel','error','-i',str(p),'-quality','92','-y',str(out)],check=True)
 p.rename(backup/p.name)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:list(pool.map(convert,(root/'public/images/portfolio').glob('*.png')))
f=root/'lib/filaments.json';data=json.loads(f.read_text())
for p in data:p['image']=p['image'].replace('.png','.webp')
f.write_text(json.dumps(data,ensure_ascii=False,indent=2))
mp={p['id']:'/images/studio/'+p['id']+'.webp' for p in products}
(root/'lib/studio-images.json').write_text(json.dumps(mp,ensure_ascii=False,indent=2))
for p in json.loads((root/'lib/printers.json').read_text())+data:
 assert (root/('public'+p['image'])).is_file(),p['image']
assert len(mp)==len(products)
print('Complete studio coverage:',len(mp),'products; original galleries retained.')
