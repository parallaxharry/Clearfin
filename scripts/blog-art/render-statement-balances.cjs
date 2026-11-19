/* Exact educational diagrams; figures match the article's illustrative account. */
const fs = require('node:fs');
const sharp = require('sharp');
const slug = 'statement-balance-vs-current-balance-canada';
const t = (x,y,s,size=28,color='#112c49',weight=500) => `<text x="${x}" y="${y}" fill="${color}" font-family="Arial,sans-serif" font-size="${size}" font-weight="${weight}">${s}</text>`;
const box = (x,y,w,h,c,r=24) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}"/>`;
const save = (name,w,h,b) => sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${b}</svg>`)).webp({quality:90}).toFile(`public/images/blog/${name}.webp`);
(async()=>{
  for (const square of [false,true]) {
    const w=square?1000:1672,h=square?1000:941;
    let b=box(0,0,w,h,'#e4efff',0)+t(60,80,'ClearFin',36,'#0875e1',800)+t(60,143,'THE PAYMENT GUIDE',23,'#315678',700);
    const x=square?60:860,y=square?395:195,bw=square?880:740;
    b+=t(60,245,'Two balances.',square?73:83,'#102d51',800)+t(60,340,'One due date.',square?73:83,'#102d51',800);
    if(!square)b+=t(60,460,'Know which amount your bill requires.',29);
    b+=box(x,y,bw,205,'#fff')+t(x+38,y+57,'STATEMENT BALANCE',24,'#456381',700)+t(x+38,y+143,'$1,200',70,'#102d51',800);
    b+=box(x,y+235,bw,205,'#102d51')+t(x+38,y+292,'CURRENT BALANCE',24,'#a5cfff',700)+t(x+38,y+378,'$1,550',70,'#fff',800);
    b+=t(60,h-62,'Illustrative purchases-only account',24,'#456381');
    await save(slug+(square?'-hero':''),w,h,b);
  }
  let b=box(0,0,1200,1120,'#e4efff',0)+t(55,72,'ClearFin',32,'#0875e1',800)+t(55,155,'Follow the $350 difference.',48,'#102d51',800);
  const rows=[['Statement closes','$1,200','The bill for the completed cycle.'],['New purchases post','+ $350','Spending after the statement closed.'],['Current balance','$1,550','Statement balance plus newer purchases.'],['After a $1,200 payment','$350','Remains for the next statement.']];
  rows.forEach(([label,amount,note],i)=>{let y=210+i*190;b+=box(45,y,1110,165,i===3?'#102d51':'#fff')+t(75,y+48,label,29,i===3?'#fff':'#102d51',700)+t(75,y+110,note,25,i===3?'#c8deff':'#456381')+t(900,y+65,amount,43,i===3?'#fff':'#102d51',800);});
  b+=t(55,1020,'Example only: previous statement paid in full; purchases only.',25)+t(55,1060,'No fees, interest, transfers, refunds or instalment plans.',25);
  await save('statement-balance-vs-current-balance-example',1200,1120,b);
})();
