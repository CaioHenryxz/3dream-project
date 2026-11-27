import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: '3Dream Project | Sua loja de impressão 3D', description: 'Impressoras, filamentos e novas possibilidades. Protótipo de e-commerce 3Dream Project.' };
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="pt-BR"><body>{children}</body></html>}
