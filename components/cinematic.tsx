'use client';
import {t} from '@/lib/i18n';
import {useEffect,useRef,useState} from 'react';
import {ArrowRight} from 'lucide-react';
export function CinematicHero({onPrinters,onFilaments}:{onPrinters:()=>void;onFilaments:()=>void}){
 const video=useRef<HTMLVideoElement>(null);const [playing,setPlaying]=useState(false);
 useEffect(()=>{
  const el=video.current;if(!el)return;el.muted=true;el.defaultMuted=true;
  let visible=true;
  const sync=()=>{
   if(visible&&!document.hidden){el.play().catch(()=>{});}
   else el.pause();
  };
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()},{threshold:.1});
  observer.observe(el);el.addEventListener('canplay',sync);window.addEventListener('pointerdown',sync);document.addEventListener('visibilitychange',sync);sync();
  return()=>{observer.disconnect();el.removeEventListener('canplay',sync);window.removeEventListener('pointerdown',sync);document.removeEventListener('visibilitychange',sync);el.pause();};
 },[]);
 return <section className="studio-hero campaign-hero wrap" aria-label={t("Seu próximo projeto começa na 3Dream")}>
  <div className="studio-copy"><span className="campaign-kicker"><i/> {t(" SEU UNIVERSO DE IMPRESSÃO 3D")}</span><h1>{t("Grandes ideias.")}<br/><span>{t("Criações reais.")}</span></h1><p>{t("Encontre a impressora e o filamento")}<br className="desktop-break"/> {t(" para dar forma ao seu próximo projeto.")}</p><div className="campaign-actions"><button className="campaign-main" onClick={onPrinters}>{t("Explorar impressoras ")}<ArrowRight size={18}/></button><button className="campaign-secondary" onClick={onFilaments}>{t("Escolher filamentos ")}<ArrowRight size={17}/></button></div><span className="campaign-signature">{t("3DREAM PROJECT ")}<span>{t("•")}</span> {t(" IMAGINE. CRIE. TRANSFORME.")}</span></div>
  <div className="studio-media"><img src="/images/dream-bambu-poster.jpg" alt={t("Impressão da marca 3Dream em branco e vermelho")} fetchPriority="high"/><video ref={video} className={playing?'is-playing':''} onPlaying={()=>setPlaying(true)} onError={()=>setPlaying(false)} src="/videos/dream-bambu-intro.mp4" autoPlay poster="/images/dream-bambu-poster.jpg" muted playsInline loop preload="auto" disablePictureInPicture aria-hidden="true" tabIndex={-1}/><div className="campaign-media-label"><span>{t("DA IDEIA À PRIMEIRA CAMADA.")}</span><b>{t("O próximo projeto é seu.")}</b></div></div>
 </section>;
}
