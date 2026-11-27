import ts from 'typescript';import fs from 'node:fs';
const files=['app/page.tsx','components/cinematic.tsx','components/customer-space.tsx','components/mobile-navigation.tsx','components/shipping-estimator.tsx','components/store-community.tsx'];
const strings=new Set();
for(const file of files){let source=fs.readFileSync(file,'utf8');const sf=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);const edits=[];
 function walk(n){
 if(ts.isJsxText(n)&&n.text.trim()){const raw=n.text;const s=raw.replace(/\s+/g,' ');strings.add(s.trim());edits.push([n.getStart(sf),n.end,'{t('+JSON.stringify(s)+')}']);return}
 if(ts.isJsxExpression(n)&&n.expression&&!ts.isJsxAttribute(n.parent)&&!ts.isJsxSpreadAttribute(n.parent)){edits.push([n.expression.getStart(sf),n.expression.getStart(sf),'t('],[n.expression.end,n.expression.end,')']);}
 if(ts.isJsxAttribute(n)&&['placeholder','aria-label','title','alt'].includes(n.name.text)&&n.initializer&&ts.isStringLiteral(n.initializer)&&n.initializer.text){strings.add(n.initializer.text);edits.push([n.initializer.getStart(sf),n.initializer.end,'{t('+JSON.stringify(n.initializer.text)+')}']);}
 if(ts.isJsxElement(n)&&n.openingElement.tagName.getText(sf)==='option'&&!n.openingElement.attributes.properties.some(a=>a.name?.text==='value')){const child=n.children.find(c=>ts.isJsxExpression(c)&&c.expression);if(child)edits.push([n.openingElement.end-1,n.openingElement.end-1,' value={'+child.expression.getText(sf)+'}']);}
 if(ts.isStringLiteral(n)&&/[a-zA-Záéíóúãõç]/.test(n.text))strings.add(n.text);
 ts.forEachChild(n,walk);
 }walk(sf);edits.sort((a,b)=>b[0]-a[0]||b[1]-a[1]);for(const [a,b,s] of edits)source=source.slice(0,a)+s+source.slice(b);source=source.replace("'use client';","'use client';\nimport {t} from '@/lib/i18n';");fs.writeFileSync(file,source);
}fs.writeFileSync('/workspace/scratch/7b51d5a04c80/ui-strings.json',JSON.stringify([...strings].sort(),null,2));
