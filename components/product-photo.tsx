'use client';
import {t} from '@/lib/i18n';
export function ProductPhoto({src,alt,loading='lazy'}:{src:string;alt:string;loading?:'lazy'|'eager'}){const studio=src.startsWith('/images/studio/');return <span className={'product-photo-frame'+(studio?' studio-photo':'')}><img className="product-photo-main" src={src} alt={t(alt)} loading={loading}/>{studio&&<img className="studio-watermark" src="/images/brand-logo.png" alt="" aria-hidden="true"/>}</span>}
