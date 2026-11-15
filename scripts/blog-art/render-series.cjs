/* Original layouts use existing catalogue artwork without changing card faces. */
const fs=require('node:fs');const sharp=require('sharp');const series=require('./editorial-series.json');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
const txt=(x,y,s,n=28,c='#11243c',weight=500)=>`<text x="${x}" y="${y}" fill="${c}" font-family="Arial,sans-serif" font-size="${n}" font-weight="${weight}">${esc(s)}</text>`;
const rect=(x,y,w,h,c,r=24)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}"/>`;
const themes={blue:['#071e3f','#dceaff','#71b8ff'],mint:['#123e36','#d9eee4','#80dac0'],amber:['#3e2b16','#f5e6c9','#f7c267'],orange:['#4a2026','#fae3d5','#ffae83'],violet:['#292046','#e9e3f5','#c8adff']};
const wrap=(s,n)=>{let a=[''];for(const v of s.split(' ')){if((a.at(-1)+' '+v).trim().length>n)a.push(v);else a[a.length-1]=(a.at(-1)+' '+v).trim();}return a;};
(async()=>{const cache={};for(const f of new Set(series.flatMap(x=>x.cards))){cache[f]=(await sharp('public/cards/'+f).png().toBuffer()).toString('base64');}
const card=(f,x,y,w,a=0)=>`<g transform="rotate(${a} ${x+w/2} ${y+w*.315})"><image href="data:image/png;base64,${cache[f]}" x="${x}" y="${y}" width="${w}" height="${w*.63}" preserveAspectRatio="xMidYMid meet"/></g>`;
const save=async(name,w,h,b)=>{await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${b}</svg>`)).webp({quality:90}).toFile('public/images/blog/'+name+'.webp');};
for(const p of series){const [ink,pale,accent]=themes[p.theme];for(const sq of [false,true]){const w=sq?1000:1672,h=sq?1000:941;let b=rect(0,0,w,h,pale,0);const dark=p.layout%2===0;
if(dark)b=rect(0,0,w,h,ink,0);const fg=dark?'#fff':ink;
if(p.layout===0)b+=`<circle cx="${sq?780:1350}" cy="${sq?640:450}" r="${sq?370:530}" fill="${accent}"/>`;
if(p.layout===1)b+=`<path d="M ${w*.65} 0 H ${w} V ${h} H ${w*.42} Z" fill="${accent}"/>`;
if(p.layout===2)b+=rect(sq?45:850,sq?350:85,sq?910:740,sq?600:770,pale,35)+`<path d="M 0 ${h-70} H ${w}" stroke="${accent}" stroke-width="4" stroke-dasharray="14 14"/>`;
if(p.layout===3)b+=`<circle cx="${w-120}" cy="${h-80}" r="520" fill="${accent}" opacity=".32"/>`;
b+=txt(58,74,'Clear',34,fg,800)+txt(146,74,'Fin',34,dark?accent:'#0076df',800)+txt(58,137,p.label,22,dark?accent:ink,700);
const size=sq?Math.min(70,870/(Math.max(...p.lines.map(x=>x.length))*.57)):Math.min(92,735/(Math.max(...p.lines.map(x=>x.length))*.57));
p.lines.forEach((l,i)=>b+=txt(58,(sq?235:280)+i*(size+12),l,size,fg,800));
if(!sq){wrap(p.sub,44).forEach((l,i)=>b+=txt(60,480+i*42,l,28,fg));b+=txt(60,865,p.slug.includes('august')?'ARCHIVED FOR REFERENCE':'THE CLEARFIN EDITORIAL SERIES',22,dark?accent:ink,700);}
if(p.cards.length===1)b+=card(p.cards[0],sq?160:890,sq?450:275,sq?680:680,-8);
else if(p.layout===3){p.cards.forEach((f,i)=>b+=card(f,sq?90+i*160:900+i*80,sq?410+i*155:130+i*210,sq?580:560,i%2?7:-6));}
else{b+=card(p.cards[0],sq?85:900,sq?400:155,sq?620:610,-7)+card(p.cards[1],sq?330:1040,sq?600:470,sq?570:550,7);}
await save(p.slug+(sq?'-hero-v3':'-v3'),w,h,b);}
let b=rect(0,0,1200,1160,pale,0)+txt(55,67,'Clear',32,ink,800)+txt(137,67,'Fin',32,'#0076df',800)+txt(55,120,p.label,20,ink,700);
wrap(p.guide,40).forEach((l,i)=>b+=txt(55,190+i*52,l,44,ink,800));
p.steps.forEach(([title,body],i)=>{const y=290+i*240;b+=rect(45,y,1110,210,'#fff')+rect(70,y+30,72,72,ink,20)+txt(86,y+79,'0'+(i+1),32,'#fff',800)+txt(175,y+65,title,34,ink,700);wrap(body,51).forEach((l,j)=>b+=txt(175,y+116+j*38,l,28,ink));});
b+=txt(55,1088,'A visual reading guide · See the article for details and issuer terms.',22,ink);await save(p.slug+'-guide-v3',1200,1160,b);
console.log(p.slug);
}
})();
