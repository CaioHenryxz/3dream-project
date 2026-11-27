import translations from './translations.json';
export type Locale='pt'|'en'|'es';
let locale:Locale='pt';
const listeners=new Set<()=>void>();
export const getLocale=()=>locale;
export const subscribeLocale=(fn:()=>void)=>{listeners.add(fn);return()=>{listeners.delete(fn)}};
export function setLocale(next:Locale){locale=next;if(typeof document!=='undefined')document.documentElement.lang=next==='pt'?'pt-BR':next;try{localStorage.setItem('dream-language',next)}catch{}listeners.forEach(fn=>fn())}
const dictionary=translations as Record<string,string[]>;
const fragments=Object.keys(dictionary).filter(k=>k.length>2||k==='ou').sort((a,b)=>b.length-a.length);
const pattern=new RegExp('(?<![\\p{L}])('+fragments.map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')(?![\\p{L}])','gu');
export function t(value:any):any{if(locale==='pt'||typeof value!=='string')return value;const index=locale==='en'?0:1;const key=value.trim();const direct=dictionary[key];if(direct)return value.replace(key,direct[index]);return value.replace(pattern,match=>dictionary[match][index])}
