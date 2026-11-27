import assert from 'node:assert/strict';
import ts from 'typescript';
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
const dir=await mkdtemp(join(tmpdir(),'dream-shipping-'));
try{
const source=await readFile(new URL('../lib/shipping.ts',import.meta.url),'utf8');
const file=join(dir,'shipping.mjs');await writeFile(file,ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
const {quoteCorreios,parsePrice,validateItems,parcelsFor}=await import(pathToFileURL(file));
assert.equal(parsePrice('1.234,56'),123456);assert.equal(parsePrice('19,90'),1990);assert.throws(()=>parsePrice(''));assert.throws(()=>parsePrice('-1'));
assert.deepEqual(validateItems([{id:'a',qty:1},{id:'a',qty:2}],['a']),[{id:'a',qty:3}]);assert.throws(()=>validateItems([{id:'a',qty:11}],['a']));assert.throws(()=>validateItems([{id:'bad',qty:1}],['a']));
assert.throws(()=>parcelsFor([{id:'a',qty:1}],'{}'));
let calls=0;globalThis.fetch=async()=>{calls++;throw Error('Unexpected fetch')};
await assert.rejects(()=>quoteCorreios('12345678',[{id:'a',qty:1}],{}),e=>e.code==='NOT_CONFIGURED');assert.equal(calls,0);
const config={CORREIOS_USER:'test',CORREIOS_API_KEY:'test',CORREIOS_POSTING_CARD:'test',CORREIOS_ORIGIN_CEP:'12345678',CORREIOS_ENV:'homologation',CORREIOS_SERVICES_JSON:JSON.stringify([{code:'03220',name:'SEDEX'},{code:'03298',name:'PAC'}]),CORREIOS_PACKAGES_JSON:JSON.stringify({a:{weight:1234,length:30,width:20,height:10}})};
let tokenCalls=0;const prices=[];
globalThis.fetch=async(url,init)=>{assert.ok(url.startsWith('https://apihom.correios.com.br/'));if(url.includes('/token/')){tokenCalls++;return Response.json({token:'test-token'})}assert.equal(init.headers.Authorization,'Bearer test-token');if(url.includes('/prazo/'))return Response.json({prazoEntrega:3,entregaDomiciliar:'N'});prices.push(new URL(url));return Response.json({pcFinal:'12,34'})};
let q=await quoteCorreios('87654321',[{id:'a',qty:2}],config);assert.equal(q.options.length,2);assert.equal(q.options[0].price,2468);assert.equal(q.parcels,2);assert.equal(q.mode,'sandbox');assert.equal(q.options[0].homeDelivery,false);assert.equal(prices[0].searchParams.get('psObjeto'),'1234');assert.equal(prices[0].searchParams.get('cepDestino'),'87654321');assert.equal(tokenCalls,1);
globalThis.fetch=async(url)=>url.includes('03220')?Response.json({error:'unavailable'},{status:503}):Response.json(url.includes('/prazo/')?{prazoEntrega:4,entregaDomiciliar:'S'}:{pcFinal:'15,00'});
q=await quoteCorreios('87654321',[{id:'a',qty:1}],config);assert.equal(q.options.length,1);assert.equal(q.options[0].name,'PAC');
globalThis.fetch=async()=>Response.json({txErro:'not available'});
await assert.rejects(()=>quoteCorreios('87654321',[{id:'a',qty:1}],config),e=>e.code==='UNAVAILABLE');
console.log('PASS: validation, missing credentials, parcel data, service quotes, partial outage and unavailable services.');
}finally{await rm(dir,{recursive:true,force:true})}
