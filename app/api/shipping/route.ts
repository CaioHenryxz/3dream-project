import {env} from 'cloudflare:workers';
import {catalog} from '@/lib/catalog';
import {isConfigured,quoteCorreios,validateItems,ShippingError,ShippingConfig} from '@/lib/shipping';
const config=()=>env as unknown as ShippingConfig;
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){return reply({configured:isConfigured(config()),mode:config().CORREIOS_ENV==='production'?'live':'sandbox'})}
export async function POST(req:Request){
 if(req.headers.get('origin')!==new URL(req.url).origin)return reply({error:'Origem inválida'},403);
 try{
 const text=await req.text();if(text.length>4000)return reply({error:'Pedido inválido'},400);
 let body:any;try{body=JSON.parse(text)}catch{return reply({error:'Pedido inválido'},400)}
 if(!body||typeof body!=='object'||typeof body.cep!=='string'||!/^\d{5}-?\d{3}$/.test(body.cep))return reply({error:'Informe um CEP válido com 8 números.'},400);
 const items=validateItems(body.items,catalog.map(p=>p.id));
 return reply(await quoteCorreios(body.cep.replace('-',''),items,config()));
 }catch(e){if(e instanceof ShippingError)return reply({error:e.message,code:e.code},e.status);return reply({error:'Não foi possível calcular o frete agora. Tente novamente.'},503)}
}
