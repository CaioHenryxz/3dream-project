import {env} from 'cloudflare:workers';
const json=(body:unknown)=>Response.json(body,{headers:{'Cache-Control':'no-store'}});
export async function GET(request:Request){
 const config=env as unknown as {GOOGLE_PLACES_API_KEY?:string;GOOGLE_PLACE_ID?:string};
 if(!config.GOOGLE_PLACES_API_KEY||!config.GOOGLE_PLACE_ID)return json({available:false});
 const language=new URL(request.url).searchParams.get('lang');const lang=language==='en'?'en':language==='es'?'es':'pt-BR';
 try{
  const response=await fetch('https://places.googleapis.com/v1/places/'+encodeURIComponent(config.GOOGLE_PLACE_ID)+'?languageCode='+lang,{headers:{'X-Goog-Api-Key':config.GOOGLE_PLACES_API_KEY,'X-Goog-FieldMask':'displayName,rating,userRatingCount,reviews,googleMapsUri,attributions'},signal:AbortSignal.timeout(7000)});
  if(!response.ok)return json({available:false});
  const place:any=await response.json();
  if(!/3\s*dream/i.test(place.displayName?.text||''))return json({available:false});
  return json({available:true,rating:place.rating,count:place.userRatingCount,url:place.googleMapsUri,attributions:place.attributions||[],reviews:(place.reviews||[]).map((review:any)=>({rating:review.rating,text:review.text?.text||review.originalText?.text||'',author:review.authorAttribution?.displayName||'',authorUrl:review.authorAttribution?.uri||'',url:review.googleMapsUri||place.googleMapsUri,date:review.publishTime})).slice(0,5)});
 }catch{return json({available:false})}
}
