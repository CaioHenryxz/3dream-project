import fitz,json,re,unicodedata
from pathlib import Path
pdf=fitz.open('public/catalog/filamentos-setembro.pdf')
products=[]
def slug(s):return re.sub(r'[^a-z0-9]+','-',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()).strip('-')
def add(page,brand,line,price,card,rows,colors,extrusion='190–220 °C',bed='0–60 °C'):
 names=colors.split('|');rects=[]
 for xs,y0,y1 in rows:
  for x0,x1 in zip(xs,xs[1:]):rects.append((x0,y0,x1,y1))
 assert len(names)==len(rects),(page,len(names),len(rects))
 family=slug(brand+' '+line)
 for n,(color,rect) in enumerate(zip(names,rects)):
  pid=family+'-'+slug(color)
  # The source repeats Elegoo Silk red: one catalog entry avoids an invented SKU.
  if any(p['id']==pid for p in products):continue
  image='/images/portfolio/'+pid+'.png'
  clip=fitz.Rect(rect)&pdf[page-1].rect
  if page not in (30,31):
   candidates=[i for i in pdf[page-1].get_image_info(xrefs=True) if i['bbox'][1]>350 and i['bbox'][3]-i['bbox'][1]>80 and i['xref']!=199]
   cx,cy=(clip.x0+clip.x1)/2,(clip.y0+clip.y1)/2
   best=min(candidates,key=lambda i:(((i['bbox'][0]+i['bbox'][2])/2-cx)**2+((i['bbox'][1]+i['bbox'][3])/2-cy)**2))
   xref=best['xref'];pix=fitz.Pixmap(pdf,xref);smask=pdf.extract_image(xref).get('smask',0)
   if smask:pix=fitz.Pixmap(pix,fitz.Pixmap(pdf,smask))
   while max(pix.width,pix.height)>850:pix.shrink(1)
   pix.save('public'+image)
  else:
   pdf[page-1].get_pixmap(matrix=fitz.Matrix(1.4,1.4),clip=clip,alpha=False).save('public'+image)
  products.append(dict(id=pid,name=f'Filamento {line} {color}',brand=brand,category='Filamentos',material=line,color=color,hex='',price=price,cardPrice=card,image=image,stock=0,detail=f'1,75 mm · {line}',description=f'{brand} {line}, cor {color}. Referência do portfólio: extrusão de {extrusion}; mesa de {bed}; diâmetro de 1,75 mm. Consulte a disponibilidade com a loja.',tag='',family=family,sourcePage=page,availabilityUnknown=True))
x4=[0,203,405,608,810];x5=[0,163,325,487,650,810]
add(6,'Elegoo','PLA+',9990,11200,[([65,240,410,585,755],374,524),([65,240,410,585,755],578,729),([65,240,410,585,755],786,938),([65,240,410,585,755],1000,1149),([65,240],1198,1351)],'Preto|Branco|Amarelo|Azul|Bege|Cinza|Laranja|Marrom|Verde|Vermelho|Azul Céu|Madeira|Verde-mar|Cinza Espacial|Rosa|Roxo|Transparente')
standard=[(x4,387,570),(x4,634,819),([0,203,405,608],889,1073)]
add(7,'Elegoo','Rapid PLA+',9990,11200,standard,'Preto|Branco|Amarelo|Azul|Bege|Cinza|Laranja|Marrom|Verde|Vermelho|Prata')
add(8,'Elegoo','PLA+ Mármore',11990,13400,[([130,686],496,1140)],'Mármore')
add(9,'Elegoo','PLA Matte',10990,12300,[([85,250,410,573,740],392,546),([85,250,410,573,740],588,742),([85,250,410,573,740],787,941),([85,254,417],985,1140)],'Preto|Branco|Amarelo Sunshine|Azul Gelo|Bege|Cinza Ardósia|Rosa Sakura|Roxo Lavanda|Verde Menta|Vermelho Rubi|Verde Azulado|Azul Marinho|Marrom Terra|Laranja')
add(10,'Elegoo','PLA Silk',11990,13400,[(x5,376,539),(x5,579,730),(x5,772,922),([0,164,325,495],978,1130)],'Prata|Vermelho|Ouro|Vermelho e Verde|Bronze Avermelhado|Bronze|Branco|Azul e Verde|Azul Roxo e Preto|Azul Magenta|Preto e Roxo|Preto e Verde|Rosa Coral|Azul Verde Laranja|Preto e Vermelho|Verde Menta|Verde Sagrado|Vermelho')
add(11,'Elegoo','Rapid PETG',10990,12300,standard,'Preto|Branco|Amarelo|Azul|Bege|Cinza Espacial|Laranja|Marrom|Verde|Vermelho|Cinza','230–260 °C','65–75 °C')
add(12,'Elegoo','TPU 95A',11990,13400,[([25,260,520,787],522,754),([155,395,650],868,1108)],'Preto|Branco|Azul|Verde|Vermelho','210–240 °C','30–60 °C')
add(13,'Elegoo','ASA',10990,12300,[([25,275,530,790],522,753),([25,275,530,790],832,1073)],'Preto|Branco|Azul|Verde|Vermelho|Cinza','240–260 °C','80–100 °C')
add(14,'Elegoo','ABS',11990,13400,[([58,757],404,1100)],'Preto','240–280 °C','90–100 °C')
add(15,'Elegoo','PLA-CF',15000,16700,[([58,757],404,1100)],'Preto','210–240 °C','35–65 °C')
bambu='Preto|Branco|Amarelo|Azul|Bege|Cinza|Amarelo Girassol|Marrom|Verde|Vermelho|Laranja|Cinza Escuro|Azul Ciano'
for page,line,price,card in [(17,'PLA Lite com Carretel',11900,13300),(18,'PLA Lite Refil',9900,11100)]:add(page,'Bambu Lab',line,price,card,[(x4,387,571),(x4,635,820),(x4,889,1073),([0,185],1150,1329)],bambu)
add(20,'National 3D','PLA Max High Speed',9990,11200,[(x5,390,535),(x5,580,725),(x5,770,915),(x5,983,1128),(x5,1199,1344)],'Amarelo|Azul Cobalto|Azul Perolado|Azul Tiffany|Bege Areia|Branco|Branco Azulado|Branco Dental|Cinza Chumbo|Cinza Claro|Cobre|Dourado|Laranja|Laranja Neon|Marrom Mogno|Natural Translúcido|Prata Metálico|Preto|Rosa Bebê|Rosa Fúcsia|Rosa Perolado|Verde Cítrico|Verde Floresta|Vermelho|Violeta')
add(21,'National 3D','PLA Max High Speed',9990,11200,[([20,275,535,790],388,625),([20,275,535,790],693,927),([150,410,660],1035,1274)],'Amarelo Girassol|Azul Céu|Azul Oceano|Lavanda|Verde Grama|Vermelho Coração|Bege Osso|Creme')
add(23,'Multfila','PLA Especial Oliva',11990,12990,[([25,195],394,558)],'Verde Matcha')
add(23,'Multfila','PLA Especial Rainbow',17990,18990,[([25,200,390,570],664,839)],'Fada|Algodão Doce|Candy Colors')
add(23,'Multfila','PLA Especial Luminoso',15990,16990,[([18,192,385],907,1074)],'Azul|Verde')
add(26,'Polymaker','PLA',11160,12400,[([25,260,545,800],476,734),([25,260,545,800],852,1096)],'Amarelo|Azul|Verde|Marrom|Branco Frio|Laranja')
add(27,'Polymaker','PLA Matte',11160,12400,[(x5,370,545),(x5,572,729),([30,180],762,923)],'Branco Cotton|Lavanda|Bege Army|Azul Army|Marrom Terra|Verde Floresta|Vermelho Lava|Pastel Peanut|Azul Safira|Amarelo Savana|Marrom Woody')
add(27,'Polymaker','PLA Matte Rainbow',14200,15900,[([231,522],934,1318)],'Pastel Rainbow')
add(29,'Sunlu','PLA Meta',10990,12300,[(x5,362,533),(x5,568,700),(x5,725,862),([0,163,325,487,650],901,1037)],'Amarelo Limão|Azul Céu|Azul Gelo|Azul Petróleo|Branco|Branco Creme|Café|Chocolate|Cinza|Laranja|Laranja Ensolarado|Preto|Rosa Pink|Rosa Sakura|Roxo Taro|Maçã Verde|Verde Menta|Verde Oliva|Vermelho Cereja')
add(30,'Sunlu','PLA Matte',10990,12300,[(x5,386,528),(x5,564,698),(x5,725,865),(x5,931,1056)],'Amarelo|Amarelo Vivo|Argila|Azul Claro|Azul|Azul Klein|Azul Bebê|Branco|Branco Osso|Laranja|Laranja Ensolarado|Carvalho|Rosa|Cinza|Preto|Roxo|Lavanda|Verde Oliva|Vermelho|Verde')
add(31,'Sunlu','PLA High Speed',10990,12300,[(x5,386,525),(x5,542,682),(x5,737,864),([0,163,325,487],916,1050)],'Amarelo|Azul|Azul Klein|Azul Claro|Azul Céu|Branco|Cinza|Laranja|Laranja Ensolarado|Mocha Mousse|Rosa Coral|Rosa|Preto|Lavanda|Verde Oliva|Verde Jelly|Verde|Vermelho')
add(32,'Sunlu','PLA Rainbow',16800,18700,[([176,395,640],344,522),([180,395,640],604,782)],'Rainbow 01|Rainbow 02|Rainbow 03|Rainbow 04')
add(32,'Sunlu','PLA Silk',11990,13400,[([100,295,515,715],1034,1231)],'Branco|Preto|Prata')
add(34,'F3D','PLA Silk',11990,13400,[([116,681],473,1067)],'Ouro Copa')
# Stable IDs retain existing demo references and featured selections.
alias={'elegoo-pla-preto':'elegoo-black','elegoo-pla-branco':'elegoo-white','elegoo-pla-amarelo':'elegoo-yellow','national-3d-pla-max-high-speed-azul-cobalto':'national-blue','multfila-pla-especial-oliva-verde-matcha':'multfila-green','polymaker-pla-azul':'polymaker-blue','sunlu-pla-meta-azul-ceu':'sunlu-blue','f3d-pla-silk-ouro-copa':'f3d-gold'}
for p in products:p['id']=alias.get(p['id'],p['id'])
assert len({p['id'] for p in products})==len(products)
Path('lib/filaments.json').write_text(json.dumps(products,ensure_ascii=False,indent=2))
print('Imported',len(products),'variants;',len(set(p['family'] for p in products)),'families')
from collections import Counter
print(Counter(p['brand'] for p in products))
