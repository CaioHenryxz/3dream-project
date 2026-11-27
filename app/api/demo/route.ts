import {validateAddress} from '@/lib/account';
import {getDb} from '@/db';
import {demos} from '@/db/schema';
import {and,eq} from 'drizzle-orm';
import {catalog,initialState} from '@/lib/catalog';
function migrate(state:any){if(state.inventoryRevision!==2){state.stock=Object.fromEntries(catalog.map(p=>[p.id,100]));state.inventoryRevision=2;}state.profile??={name:'Cliente demonstração',phone:'',city:'',newsletter:false};return state;}
async function session(req:Request){
 const match=req.headers.get('cookie')?.match(/(?:^|;\s*)dream_proto4=([a-f0-9-]{36})(?:;|$)/);
 const id=match?.[1]||crypto.randomUUID(),db=getDb();
 await db.insert(demos).values({id,state:JSON.stringify(initialState())}).onConflictDoNothing();
 const row=(await db.select().from(demos).where(eq(demos.id,id)))[0];return {id,db,row,state:migrate(JSON.parse(row.state))};
}
const products=(state:any)=>catalog.map(p=>({...p,...state.overrides[p.id]}));
function reply(id:string,data:any,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store','Set-Cookie':`dream_proto4=${id}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`}})}
const payload=(state:any,version:number)=>({...state,stock:{...Object.fromEntries(catalog.map(p=>[p.id,p.stock])),...state.stock},version,products:products(state),mode:'prototype'});
export async function GET(req:Request){const {id,state,row}=await session(req);return reply(id,payload(state,row.version));}
export async function POST(req:Request){
 if(req.headers.get('origin')!==new URL(req.url).origin)return Response.json({error:'Origem inválida'},{status:403});
 const {id,db,row,state}=await session(req);let b:any;try{b=await req.json()}catch{return reply(id,{error:'Dados inválidos'},400)}
 state.stock={...Object.fromEntries(catalog.map(p=>[p.id,p.stock])),...state.stock};
 const event=(text:string)=>state.events.unshift({id:crypto.randomUUID(),text,time:new Date().toISOString()});
 if(['stock','edit','status','reset'].includes(b.action)&&state.user?.role!=='admin')return reply(id,{error:'Entre no perfil de administrador da demonstração.'},403);
 if(b.action==='login'){
 const role=b.email==='admin@3dream.demo'?'admin':b.email==='cliente@3dream.demo'?'customer':null;
 if(!role||b.password!=='demo1234')return reply(id,{error:'Use o acesso de demonstração indicado abaixo.'},401);
 state.user={role,name:role==='admin'?'Administrador 3Dream':'Cliente demonstração',email:b.email};
 }else if(b.action==='profile'){
 if(!state.user)return reply(id,{error:'Entre na demonstração para salvar.'},401);
 if(typeof b.name!=='string'||!b.name.trim()||b.name.length>80||typeof b.phone!=='string'||b.phone.length>25||typeof b.city!=='string'||b.city.length>80||typeof b.newsletter!=='boolean')return reply(id,{error:'Confira os campos do perfil.'},400);
 if(b.preferredPayment!==undefined&&!['pix','card'].includes(b.preferredPayment))return reply(id,{error:'Preferência inválida.'},400);
 state.profile={...state.profile,name:b.name.trim(),phone:b.phone.trim(),city:b.city.trim(),newsletter:b.newsletter,preferredPayment:b.preferredPayment||state.profile.preferredPayment||'pix'};state.user.name=state.profile.name;
 }else if(b.action==='address'){
 if(!state.user)return reply(id,{error:'Entre na demonstração para continuar.'},401);
 try{state.address=validateAddress(b.address)}catch(e:any){return reply(id,{error:e.message},400)}
 }else if(b.action==='logout'){state.user=null;}
 else if(b.action==='reset'){const user=state.user;Object.assign(state,initialState());state.user=user;event('Demonstração reiniciada');}
 else if(b.action==='edit'){
 if(!catalog.some(p=>p.id===b.id)||typeof b.name!=='string'||!b.name.trim()||b.name.length>100||!Number.isInteger(b.price)||b.price<1||b.price>10000000||!Number.isInteger(b.cardPrice)||b.cardPrice<b.price||!Number.isInteger(b.stock)||b.stock<0||b.stock>10000)return reply(id,{error:'Confira nome, preços e estoque.'},400);
 state.overrides[b.id]={name:b.name.trim(),price:b.price,cardPrice:b.cardPrice,cardPriceConfirmed:true};state.stock[b.id]=b.stock;event('Produto atualizado no protótipo');
 }else if(b.action==='stock'){
 if(!catalog.some(p=>p.id===b.id)||![-1,1,5].includes(b.delta)||state.stock[b.id]+b.delta<0)return reply(id,{error:'Movimentação inválida ou saldo insuficiente'},409);
 state.stock[b.id]+=b.delta;event(`${b.delta<0?'Venda física':'Reposição'} simulada: ${b.id}`);
 }else if(b.action==='status'){
 const o=state.orders.find((o:any)=>o.id===b.id);if(!o||!['Em separação','Pronto para retirada','Concluído','Cancelado'].includes(b.status))return reply(id,{error:'Status inválido'},400);
 if(o.status==='Cancelado')return reply(id,{error:'Pedido já cancelado'},409);
 if(b.status==='Cancelado')for(const i of o.items)state.stock[i.id]+=i.qty;
 o.status=b.status;event(`Pedido ${o.id.slice(0,8)}: ${b.status}`);
 }else if(b.action==='order'){
 if(!state.user)return reply(id,{error:'Entre na conta de demonstração para continuar.'},401);
 if(!['pix','card'].includes(b.payment)||!Array.isArray(b.items)||!b.items.length||b.items.length>30)return reply(id,{error:'Pedido inválido'},400);
 const quantities:Record<string,number>={};
 for(const i of b.items){if(!catalog.some(p=>p.id===i.id)||!Number.isInteger(i.qty)||i.qty<1||i.qty>100)return reply(id,{error:'Item inválido'},400);quantities[i.id]=(quantities[i.id]||0)+i.qty;}
 for(const [pid,q] of Object.entries(quantities))if(q>100||state.stock[pid]<q)return reply(id,{error:'O estoque mudou. Revise seu carrinho.'},409);
 const list=products(state);if(b.payment==='card'&&Object.keys(quantities).some(pid=>list.find(p=>p.id===pid)?.cardPriceConfirmed===false))return reply(id,{error:'Preço no cartão pendente para um dos itens. Consulte a loja ou use Pix no protótipo.'},400);const items=Object.entries(quantities).map(([pid,qty])=>{const p=list.find(p=>p.id===pid)!;state.stock[pid]-=qty;return {id:pid,name:p.name,qty,price:b.payment==='pix'?p.price:p.cardPrice}});
 const order={id:crypto.randomUUID(),date:new Date().toISOString(),items,total:items.reduce((t,i)=>t+i.price*i.qty,0),status:'Em separação',payment:b.payment==='pix'?'Pix · simulado':'Cartão · simulado',delivery:'Retirada na loja',customer:'Cliente demonstração'};
 state.orders.unshift(order);event(`Pedido de teste ${order.id.slice(0,8)} criado — sem cobrança`);
 }else return reply(id,{error:'Ação inválida'},400);
 state.events=state.events.slice(0,40);state.orders=state.orders.slice(0,30);
 const updated=await db.update(demos).set({state:JSON.stringify(state),version:row.version+1}).where(and(eq(demos.id,id),eq(demos.version,row.version))).returning({id:demos.id});
 if(!updated.length)return reply(id,{error:'Outra atualização ocorreu. Atualize e tente novamente.'},409);
 return reply(id,payload(state,row.version+1));
}
