// Server-only Correios adapter. Physical parcel data must be supplied by the store.
export type Parcel={weight:number;length:number;width:number;height:number};
export type ShippingItem={id:string;qty:number};
export type ShippingConfig=Record<string,string|undefined>;
export class ShippingError extends Error{constructor(public code:string,message:string,public status=503){super(message)}}
export function validateItems(items:unknown,knownIds:string[]):ShippingItem[]{
 if(!Array.isArray(items)||!items.length||items.length>20)throw new ShippingError('INVALID','Revise os produtos para calcular o frete.',400);
 const grouped=new Map<string,number>();
 for(const i of items){if(!i||!knownIds.includes(i.id)||!Number.isInteger(i.qty)||i.qty<1||i.qty>10)throw new ShippingError('INVALID','Quantidade ou produto inválido.',400);grouped.set(i.id,(grouped.get(i.id)||0)+i.qty)}
 if([...grouped.values()].reduce((a,b)=>a+b,0)>10)throw new ShippingError('MANUAL','Para esta quantidade, consulte a equipe para uma cotação de transporte.',422);
 return [...grouped].map(([id,qty])=>({id,qty}));
}
export function isConfigured(c:ShippingConfig){return Boolean(c.CORREIOS_USER&&c.CORREIOS_API_KEY&&c.CORREIOS_POSTING_CARD&&/^\d{8}$/.test(c.CORREIOS_ORIGIN_CEP||'')&&c.CORREIOS_SERVICES_JSON&&c.CORREIOS_PACKAGES_JSON)}
export function parcelsFor(items:ShippingItem[],raw:string):Parcel[]{
 let map:Record<string,Parcel>;try{map=JSON.parse(raw)}catch{throw new ShippingError('CONFIG','Cotação temporariamente indisponível. Fale com a equipe.')}
 const result:Parcel[]=[];
 for(const item of items){const p=map[item.id];if(!p||![p.weight,p.length,p.width,p.height].every(n=>Number.isFinite(n)&&n>0))throw new ShippingError('PACKAGING','Estamos confirmando a embalagem deste produto. Consulte o frete com a equipe.',422);for(let n=0;n<item.qty;n++)result.push(p)}
 return result;
}
export function parsePrice(value:unknown){const s=String(value??'').trim();if(!/^\d+(?:\.\d{3})*,\d{2}$/.test(s)&&!/^\d+(?:\.\d{1,2})?$/.test(s))throw new Error('Invalid price');const n=Number(s.includes(',')?s.replaceAll('.','').replace(',','.'):s);if(!Number.isFinite(n)||n<=0)throw new Error('Invalid price');return Math.round(n*100)}
let cachedToken:{key:string;token:string;until:number}|undefined;
async function jsonRequest(url:string,init:RequestInit={}){const res=await fetch(url,{...init,signal:AbortSignal.timeout(8000)});if(!res.ok)throw new ShippingError(res.status===401?'AUTH':'UPSTREAM','Não foi possível consultar os Correios agora. Tente novamente em alguns instantes.');return res.json() as Promise<any>}
export async function quoteCorreios(cep:string,items:ShippingItem[],c:ShippingConfig){
 if(!/^\d{8}$/.test(cep))throw new ShippingError('INVALID_CEP','Informe um CEP com 8 números.',400);
 if(!isConfigured(c))throw new ShippingError('NOT_CONFIGURED','O cálculo de frete está em configuração. Consulte a entrega com nossa equipe.');
 const parcels=parcelsFor(items,c.CORREIOS_PACKAGES_JSON!);
 let services:{code:string;name:string}[];try{services=JSON.parse(c.CORREIOS_SERVICES_JSON!);if(!Array.isArray(services)||!services.length||services.length>3||services.some(s=>!/^\d{5}$/.test(s.code)||typeof s.name!=='string'))throw Error()}catch{throw new ShippingError('CONFIG','Cotação temporariamente indisponível. Fale com a equipe.')}
 const base=c.CORREIOS_ENV==='production'?'https://api.correios.com.br':'https://apihom.correios.com.br';
 const key=[base,c.CORREIOS_USER,c.CORREIOS_API_KEY,c.CORREIOS_POSTING_CARD].join('|');
 async function token(){if(cachedToken?.key===key&&cachedToken.until>Date.now())return cachedToken.token;
 const body:any={numero:c.CORREIOS_POSTING_CARD};if(c.CORREIOS_CONTRACT)body.contrato=c.CORREIOS_CONTRACT;if(c.CORREIOS_DR)body.dr=Number(c.CORREIOS_DR);
 const d=await jsonRequest(base+'/token/v1/autentica/cartaopostagem',{method:'POST',headers:{Authorization:'Basic '+btoa(c.CORREIOS_USER+':'+c.CORREIOS_API_KEY),'Content-Type':'application/json'},body:JSON.stringify(body)});
 if(typeof d.token!=='string')throw new ShippingError('AUTH','Cotação temporariamente indisponível.');cachedToken={key,token:d.token,until:Date.now()+5*60*1000};return d.token;}
 let bearer=await token();
 async function api(path:string){try{return await jsonRequest(base+path,{headers:{Authorization:'Bearer '+bearer,Accept:'application/json'}})}catch(e){if(e instanceof ShippingError&&e.code==='AUTH'){cachedToken=undefined;bearer=await token();return jsonRequest(base+path,{headers:{Authorization:'Bearer '+bearer,Accept:'application/json'}})}throw e}}
 const outcomes=await Promise.allSettled(services.map(async service=>{
  const route=new URLSearchParams({cepOrigem:c.CORREIOS_ORIGIN_CEP!,cepDestino:cep});
  const deadline=await api('/prazo/v1/nacional/'+service.code+'?'+route);
  if(deadline.txErro||!Number.isInteger(Number(deadline.prazoEntrega))||Number(deadline.prazoEntrega)<0||deadline.prazoEntrega==null)throw Error('Unavailable');
  let cents=0;
  // Each configured unit is sent in its own approved parcel; never invent a combined box.
  for(const p of parcels){const params=new URLSearchParams(route);Object.entries({psObjeto:p.weight,tpObjeto:2,comprimento:p.length,largura:p.width,altura:p.height}).forEach(([k,v])=>params.set(k,String(v)));if(c.CORREIOS_CONTRACT&&c.CORREIOS_DR){params.set('nuContrato',c.CORREIOS_CONTRACT);params.set('nuDR',c.CORREIOS_DR)}
   const price=await api('/preco/v1/nacional/'+service.code+'?'+params);if(price.txErro)throw Error('Unavailable');cents+=parsePrice(price.pcFinal);
  }
  return {code:service.code,name:service.name,price:cents,days:Number(deadline.prazoEntrega),homeDelivery:deadline.entregaDomiciliar!=='N'};
 }));
 const options=outcomes.flatMap(r=>r.status==='fulfilled'?[r.value]:[]).sort((a,b)=>a.price-b.price);
 if(!options.length)throw new ShippingError('UNAVAILABLE','Não encontramos uma cotação para este envio. Consulte nossa equipe.',422);
 return {options,parcels:parcels.length,mode:c.CORREIOS_ENV==='production'?'live':'sandbox',notice:'Estimativa dos Correios a partir da postagem. Prazo de preparação não incluído. Embalagens individuais; confirmação com a loja.'};
}
