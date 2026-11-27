export type DemoAddress={recipient:string;cep:string;street:string;number:string;complement:string;district:string;city:string;uf:string};
export function validateAddress(value:unknown):DemoAddress|null{
 if(value===null)return null;
 if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Confira os dados do endereço.');
 const x=value as Record<string,unknown>,limits={recipient:80,cep:9,street:100,number:15,complement:60,district:80,city:80,uf:2};const result:Record<string,string>={};
 for(const [key,max] of Object.entries(limits)){if(typeof x[key]!=='string'||(x[key] as string).length>max)throw Error('Confira os dados do endereço.');result[key]=(x[key] as string).trim();if(key!=='complement'&&!result[key])throw Error('Preencha os campos obrigatórios.');}
 result.cep=result.cep.replace('-','');result.uf=result.uf.toUpperCase();
 if(!/^\d{8}$/.test(result.cep)||!['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].includes(result.uf))throw Error('Confira o CEP e o estado.');
 return result as DemoAddress;
}
