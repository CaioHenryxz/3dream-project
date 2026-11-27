import Store from '@/app/page';
import {catalog} from '@/lib/catalog';
import {notFound} from 'next/navigation';
export default async function ProductPage({params}:{params:Promise<{id:string}>}){const {id}=await params;if(!catalog.some(p=>p.id===id))notFound();return <Store initialProductId={id}/>}
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;const p=catalog.find(p=>p.id===id);return {title:p?p.name+' | 3Dream Project':'Produto não encontrado | 3Dream Project',description:p?.description}}
