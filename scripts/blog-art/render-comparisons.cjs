/* Original ClearFin editorial layouts. Existing card assets remain unaltered.
   Run: node scripts/blog-art/render-comparisons.cjs */
const fs=require('node:fs');
const path=require('node:path');
const sharp=require('sharp');
const out='public/images/blog';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(x,y,s,size=28,fill='#11243c',weight=500)=>`<text x="${x}" y="${y}" fill="${fill}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}">${esc(s)}</text>`;
const rect=(x,y,w,h,fill,r=24)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
const svg=(w,h,body)=>`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
const brand=(x,y,dark=false)=>text(x,y,'Clear',34,dark?'#fff':'#11243c',800)+text(x+88,y,'Fin',34,'#168cff',800);
(async()=>{
const arts={};for(const [id,file] of Object.entries({cobalt:'amex-cobalt.webp',scotia:'Scotiabank-gold-amex.avif',bmo:'bmo-preferred-rate.webp',mbna:'MBNA-true-line.png',cibc:'cibc_select_visa.avif'})) arts[id]=(await sharp('public/cards/'+file).png().toBuffer()).toString('base64');
const card=(id,x,y,w,angle=0)=>`<g transform="rotate(${angle} ${x+w/2} ${y+w*.315})">${rect(x+4,y+14,w,w*.63,'#00000022',20)}<image x="${x}" y="${y}" width="${w}" height="${w*.63}" preserveAspectRatio="xMidYMid meet" xlink:href="data:image/png;base64,${arts[id]}"/></g>`;
const save=async(name,w,h,body)=>{const source=svg(w,h,body);await sharp(Buffer.from(source)).webp({quality:94}).toFile(`${out}/${name}.webp`);};
for(const square of [false,true]){
const w=square?1000:1672,h=square?1000:941;
let b=rect(0,0,w,h,'#071d3b',0)+`<path d="M ${w*.57} 0 H ${w} V ${h} H ${w*.35} Z" fill="#e9d8b2"/>`;
b+=brand(60,70,true)+text(60,130,'THE CARD MATCHUP',22,'#84baff',700);
if(square){b+=text(60,200,'Cobalt',62,'white',800)+text(60,268,'vs Gold',62,'white',800)+card('cobalt',75,295,610,-7)+card('scotia',340,540,590,7);}
else{b+=text(60,250,'Cobalt',100,'white',800)+text(60,360,'vs Gold',100,'white',800)+text(60,440,'One routine. Two rewards strategies.',30,'#a8c7ed')+card('cobalt',650,180,630,-9)+card('scotia',950,460,610,8)+text(60,820,'AMEX COBALT',24,'#86baff',700)+text(60,868,'SCOTIABANK GOLD AMEX',24,'#fff',700);}
await save('amex-cobalt-vs-scotia-gold'+(square?'-hero-v2':'-v2'),w,h,b);
b=rect(0,0,w,h,'#edf4ff',0)+`<circle cx="${w}" cy="70" r="520" fill="#d7e8ff"/>`+brand(60,70)+text(60,130,'THE PAYOFF PLAN',22,'#0069d9',700);
if(square){b+=text(60,210,'Make room',74,'#10294b',800)+text(60,295,'to pay it down.',74,'#10294b',800)+card('bmo',90,360,470,-7)+card('mbna',420,510,470,7)+card('cibc',140,690,390,-3);}
else{b+=text(60,270,'Make room',92,'#10294b',800)+text(60,375,'to pay it down.',92,'#10294b',800)+text(60,455,'Balance transfers, beyond the headline.',30,'#45607e')+card('bmo',930,130,540,-7)+card('mbna',1050,385,520,7)+card('cibc',820,630,430,-5)+text(60,815,'THE FEE  /  THE WINDOW  /  THE PLAN',25,'#0069d9',700)+text(60,870,'BMO · MBNA · CIBC',26,'#45607e');}
await save('best-balance-transfer-credit-cards-canada'+(square?'-hero-v2':'-v2'),w,h,b);
}
// Three independently labelled panels remain readable when stacked by the article.
let b=rect(0,0,1200,1320,'#f1f5fc',0)+brand(55,65)+text(55,135,'Same spending. Different result.',51,'#11243c',800)+text(55,185,'Annual rewards value after fees',27,'#52708f');
const profiles=[['01','Everyday spending',450.12,540],['02','Scotia 6-point grocer',450.12,612],['03','Everyday + $3,000 in foreign currency',405.12,570]];
profiles.forEach(([n,label,c,s],i)=>{const y=230+i*300;b+=rect(40,y,1120,275,'white')+text(65,y+50,n,25,'#0078ed',800)+text(125,y+50,label,30,'#11243c',700);[[c,'Cobalt','#1776e5'],[s,'Scotia Gold','#ae8743']].forEach(([v,l,color],j)=>{const yy=y+85+j*80;b+=text(65,yy+34,l,25)+rect(235,yy,v/650*670,48,color,8)+text(930,yy+35,'$'+v.toFixed(2),34,color,800);});});
b+=text(55,1180,'$1,500 monthly domestic spend · 1¢ per point · welcome bonuses excluded',22,'#52708f')+text(55,1220,'Profile 3 includes Cobalt’s $75 FX markup. Assumptions and workings in article.',22,'#52708f')+text(55,1270,'CLEARFIN CALCULATIONS  /  TERMS CHECKED NOV 14, 2026',20,'#0069d9',700);
await save('cobalt-scotia-value-comparison',1200,1320,b);
b=rect(0,0,1200,1380,'#071d3b',0)+brand(55,65,true)+text(55,140,'A $5,000 balance. Three timelines.',48,'white',800)+text(55,190,'Lower fee or more time? Your payment budget decides.',27,'#a8c7ed');
[['CIBC Select',10,50,'$500.00','#75c9ff'],['MBNA True Line',12,150,'$416.67','#6e9dff'],['BMO Preferred Rate',18,179,'$277.78','#beceea']].forEach(([name,periods,fees,pay,color],i)=>{const y=240+i*305;b+=rect(40,y,1120,275,'#102d50')+text(65,y+50,name,32,'white',700)+text(65,y+104,'$'+fees,49,color,800)+text(245,y+100,'total fees*',25,'#c5d9ee')+text(670,y+104,pay,49,'white',800)+text(670,y+143,'principal / payment',24,'#c5d9ee');const end=65+periods/18*1010;b+=`<line x1="65" y1="${y+190}" x2="${end}" y2="${y+190}" stroke="${color}" stroke-width="12" stroke-linecap="round"/>`+text(65,y+242,periods+' planned payments before promo expiry',25,'#c5d9ee');});
b+=text(55,1205,'*Transfer fees paid separately. BMO includes the $29 second-year fee.',23,'#b7cde6')+text(55,1245,'Full offer window assumed: CIBC up to 10 months; MBNA 12 / BMO 18 statement periods.',22,'#b7cde6')+text(55,1285,'No new purchases. Fee interest excluded. Pay on time; see article for conditions.',22,'#b7cde6')+text(55,1340,'CLEARFIN CALCULATIONS  /  TERMS CHECKED NOV 14, 2026',20,'#75c9ff',700);
await save('balance-transfer-payoff-comparison',1200,1380,b);
})();
