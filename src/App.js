import React, { useState, useRef } from "react";

// ── SALES DATA ────────────────────────────────────────────────────────────────
const SALES = [
  {sku:50761,name:"HENNESSY VS 375ml",dept:"Spirit",sold:126,qty:14,rev:2566,cost:126*11.47},
  {sku:50890,name:"DON JULIO REPO 375ml",dept:"Spirit",sold:80,qty:50,rev:2022.79,cost:80*18.67},
  {sku:50757,name:"HENNESSY VS 750ml",dept:"Spirit",sold:34,qty:42,rev:1330.08,cost:34*58},
  {sku:50005,name:"LIQUOR MISC",dept:"Spirit",sold:106,qty:0,rev:1881.66,cost:1881.66*0.6},
  {sku:50116,name:"HEINEKEN BTL",dept:"beer",sold:498,qty:-371,rev:1002.65,cost:498*0.8},
  {sku:50156,name:"D'USSE VSOP 375ml",dept:"Spirit",sold:38,qty:47,rev:907.63,cost:38*19.4},
  {sku:50190,name:"CORONA EXTRA",dept:"beer",sold:449,qty:-420,rev:905.19,cost:449*0.9},
  {sku:50756,name:"HENNESSY VS 200ml",dept:"Spirit",sold:74,qty:174,rev:972.72,cost:74*11.47},
  {sku:50636,name:"REMY MARTIN VSOP 375ml",dept:"Spirit",sold:30,qty:30,rev:741.12,cost:30*18.49},
  {sku:50417,name:"NEW AMSTERDAM VDK 50ml",dept:"Spirit",sold:675,qty:-392,rev:743.99,cost:675*0.68},
  {sku:50887,name:"DON JULIO REPO 750ml",dept:"Spirit",sold:18,qty:25,rev:876.85,cost:18*39},
  {sku:50715,name:"FIREBALL CINN 50ml",dept:"Spirit",sold:469,qty:-400,rev:596.18,cost:469*0.67},
  {sku:50634,name:"REMY MARTIN VSOP 200ml",dept:"Spirit",sold:27,qty:24,rev:436.17,cost:27*11.24},
  {sku:50991,name:"JOSE CUERVO GOLD 200ml",dept:"Spirit",sold:52,qty:-10,rev:421.68,cost:52*5.62},
  {sku:50855,name:"TITOS VODKA 200ml",dept:"Spirit",sold:61,qty:200,rev:430.26,cost:61*5.25},
  {sku:50219,name:"JIM BEAM 80PF 50ml",dept:"Spirit",sold:386,qty:-75,rev:496.31,cost:386*0.85},
  {sku:50688,name:"PAUL MASSON VS 50ml",dept:"Spirit",sold:377,qty:-326,rev:474.55,cost:377*0.88},
  {sku:50022,name:"BUSCH CAN",dept:"beer",sold:419,qty:-384,rev:418.87,cost:419*0.5},
  {sku:50888,name:"DON JULIO REPO 50ml",dept:"Spirit",sold:74,qty:7,rev:373.16,cost:74*2.49},
  {sku:50857,name:"TITOS VODKA 50ml",dept:"Spirit",sold:162,qty:-93,rev:327.09,cost:162*1.63},
  {sku:50270,name:"CIROC APPLE 50ml",dept:"Spirit",sold:165,qty:-29,rev:332.28,cost:165*1.12},
  {sku:50276,name:"CIROC PASSION 50ml",dept:"Spirit",sold:160,qty:9,rev:323.35,cost:160*1.12},
  {sku:50019,name:"BUDWEISER CAN",dept:"beer",sold:251,qty:-181,rev:336.35,cost:251*0.65},
  {sku:50155,name:"D'USSE VSOP 750ml",dept:"Spirit",sold:7,qty:10,rev:329.26,cost:7*48},
  {sku:50109,name:"COORS LIGHT",dept:"beer",sold:285,qty:-127,rev:381.42,cost:285*0.55},
  {sku:50779,name:"JW BLACK 50ml",dept:"Spirit",sold:154,qty:-29,rev:310.01,cost:154*1.5},
  {sku:50023,name:"NATURAL ICE CAN",dept:"beer",sold:353,qty:-323,rev:356.59,cost:353*0.45},
  {sku:50021,name:"NATURAL LIGHT",dept:"beer",sold:306,qty:-251,rev:309.41,cost:306*0.45},
  {sku:50994,name:"JOSE CUERVO 50ml",dept:"Spirit",sold:148,qty:332,rev:297.18,cost:148*1.21},
  {sku:50266,name:"CIROC COCONUT 50ml",dept:"Spirit",sold:145,qty:0,rev:296.61,cost:145*1.12},
  {sku:50267,name:"CIROC PEACH 50ml",dept:"Spirit",sold:99,qty:52,rev:202.02,cost:99*1.12},
  {sku:50816,name:"LUNAZUL REPO 375ml",dept:"Spirit",sold:38,qty:70,rev:580.54,cost:38*9.26},
  {sku:50856,name:"TITOS VODKA 375ml",dept:"Spirit",sold:20,qty:167,rev:243.18,cost:20*9.49},
  {sku:50086,name:"MILLER HIGH LIFE BTL",dept:"beer",sold:272,qty:-200,rev:346.88,cost:272*0.55},
  {sku:50112,name:"COORS LIGHT 24OZ",dept:"beer",sold:100,qty:-72,rev:275.79,cost:100*0.75},
  {sku:50025,name:"BUD LIGHT",dept:"beer",sold:200,qty:-188,rev:270.26,cost:200*0.65},
  {sku:50993,name:"JOSE CUERVO GOLD 50ml",dept:"Spirit",sold:119,qty:141,rev:240.16,cost:119*1.21},
  {sku:50192,name:"MODELO ESPECIAL",dept:"beer",sold:166,qty:-142,rev:333.88,cost:166*0.8},
  {sku:50920,name:"PATRON SILVER 375ml",dept:"Spirit",sold:11,qty:32,rev:261.46,cost:11*20.71},
  {sku:50839,name:"RED BULL 8.4oz",dept:"Drinks",sold:68,qty:-68,rev:220.25,cost:68*1.5},
  {sku:50265,name:"CAPT MORGAN SPICED",dept:"Spirit",sold:115,qty:-82,rev:145.25,cost:115*0.66},
  {sku:50041,name:"BUD LIGHT 25OZ",dept:"beer",sold:66,qty:-43,rev:184.18,cost:66*0.75},
  {sku:50880,name:"ESPOLON REPO 375ml",dept:"Spirit",sold:10,qty:-10,rev:190.67,cost:10*12},
  {sku:50421,name:"E&J BRANDY XO 375ml",dept:"Spirit",sold:20,qty:-20,rev:188.75,cost:20*10},
  {sku:50758,name:"HENNESSY VS 1.75L",dept:"Spirit",sold:2,qty:10,rev:183.61,cost:2*64.66},
  {sku:50207,name:"MODELO 12PK CAN",dept:"beer",sold:9,qty:-2,rev:181.83,cost:9*12},
  {sku:50820,name:"LUNAZUL REPO 1L",dept:"Spirit",sold:13,qty:6,rev:364.45,cost:13*17.41},
  {sku:50185,name:"D'USSE VSOP 200ml",dept:"Spirit",sold:11,qty:-5,rev:177.26,cost:11*12},
  {sku:50591,name:"MCCORMICK VODKA",dept:"Spirit",sold:42,qty:55,rev:173.73,cost:42*3.09},
  {sku:50661,name:"TAAKA VODKA 200ml",dept:"Spirit",sold:87,qty:-34,rev:174.27,cost:87*3},
  {sku:50193,name:"CORONITA SINGLES",dept:"beer",sold:111,qty:-93,rev:168.15,cost:111*0.7},
  {sku:50363,name:"RED STRIPE",dept:"beer",sold:84,qty:-79,rev:168.27,cost:84*0.8},
  {sku:50044,name:"NATURAL ICE 25OZ",dept:"beer",sold:89,qty:-55,rev:179.09,cost:89*0.6},
  {sku:50398,name:"NEW AMSTERDAM APPLE 50ml",dept:"Spirit",sold:88,qty:-4,rev:97.48,cost:88*0.68},
  {sku:50040,name:"BUDWEISER 25OZ",dept:"beer",sold:35,qty:-5,rev:97.94,cost:35*0.75},
  {sku:50043,name:"BUD ICE 25OZ",dept:"beer",sold:49,qty:-11,rev:86.09,cost:49*0.7},
  {sku:50658,name:"STELLA ROSA BLACK",dept:"wine",sold:6,qty:4,rev:84.55,cost:6*10.5},
  {sku:50492,name:"E&J BRANDY APPLE 50ml",dept:"Spirit",sold:76,qty:-2,rev:97.97,cost:76*0.7},
  {sku:50374,name:"E&J BRANDY VSOP 50ml",dept:"Spirit",sold:65,qty:-2,rev:82.34,cost:65*0.7},
  {sku:50635,name:"REMY MARTIN VSOP 750ml",dept:"Spirit",sold:6,qty:13,rev:313.88,cost:6*47.91},
  {sku:50822,name:"LUNAZUL REPO 50ml",dept:"Spirit",sold:37,qty:49,rev:94.11,cost:37*0.83},
  {sku:50919,name:"PATRON SILVER 50ml",dept:"Spirit",sold:22,qty:-16,rev:134.84,cost:22*5},
  {sku:50781,name:"TANQUERAY GIN 50ml",dept:"Spirit",sold:102,qty:47,rev:147.15,cost:102*0.75},
  {sku:50142,name:"SEAGRAM GIN 50ml",dept:"Spirit",sold:84,qty:-6,rev:105.88,cost:84*0.6},
  {sku:50676,name:"PARROT BAY COCO 50ml",dept:"Spirit",sold:83,qty:251,rev:106.12,cost:83*0.5},
  {sku:50108,name:"COORS LIGHT BTL",dept:"beer",sold:104,qty:-7,rev:140.98,cost:104*0.6},
  {sku:50838,name:"RED BULL 12oz",dept:"Drinks",sold:42,qty:-42,rev:147.51,cost:42*2},
  {sku:50054,name:"BUD LIGHT LEMON RITA",dept:"beer",sold:38,qty:3,rev:116.03,cost:38*0.7},
  {sku:50034,name:"MICHELOB ULTRA",dept:"beer",sold:207,qty:-87,rev:264.71,cost:207*0.65},
  {sku:50130,name:"STEEL RESERVE 24OZ",dept:"beer",sold:70,qty:0,rev:140.28,cost:70*0.7},
  {sku:50202,name:"CORONA 24OZ CAN",dept:"beer",sold:41,qty:-1,rev:144.20,cost:41*1},
  {sku:50859,name:"TITOS HANDMADE 50ml",dept:"Spirit",sold:19,qty:831,rev:163.24,cost:19*1.63},
  {sku:50678,name:"YUKON JACK 50ml",dept:"Spirit",sold:104,qty:-36,rev:114.91,cost:104*0.6},
  {sku:50910,name:"WRAY & NEPHEW 750ml",dept:"Spirit",sold:7,qty:6,rev:164.41,cost:7*22},
  {sku:50689,name:"PAUL MASSON PEACH 50ml",dept:"Spirit",sold:105,qty:21,rev:129.30,cost:105*0.88},
  {sku:50662,name:"TAAKA VODKA 375ml",dept:"Spirit",sold:36,qty:-8,rev:144.27,cost:36*3.5},
  {sku:50929,name:"MIONETTO PROSECCO",dept:"wine",sold:8,qty:-4,rev:135.96,cost:8*9},
  {sku:50140,name:"SEAGRAMS JAMAICAN ME HAPPY",dept:"Spirit",sold:66,qty:13,rev:134.70,cost:66*1.2},
  {sku:50821,name:"LUNAZUL BLANCO 1L",dept:"Spirit",sold:4,qty:12,rev:113.65,cost:4*17.41},
  {sku:50045,name:"MICHELOB ULTRA 25OZ",dept:"beer",sold:41,qty:-21,rev:120.69,cost:41*0.7},
  {sku:50584,name:"AMSTERDAM BLUE TOP 50ml",dept:"Spirit",sold:10,qty:470,rev:111.61,cost:0},
  {sku:50504,name:"NEW AMSTERDAM APPLE 200ml",dept:"Spirit",sold:20,qty:31,rev:102.26,cost:20*3.61},
  {sku:50505,name:"NEW AMSTERDAM APPLE 375ml",dept:"Spirit",sold:23,qty:-21,rev:162.25,cost:23*6},
  {sku:51002,name:"JOSE CUERVO SILVER 100ml",dept:"Spirit",sold:79,qty:48,rev:316.47,cost:79*4},
  {sku:50871,name:"WHITE CLAW 19.2oz",dept:"Seltzers",sold:54,qty:-48,rev:215.59,cost:54*2},
  {sku:50359,name:"GUINNESS STOUT",dept:"beer",sold:55,qty:-33,rev:109.76,cost:55*1.2},
  {sku:50966,name:"DRAGON STOUT",dept:"beer",sold:40,qty:-28,rev:90.25,cost:40*1.1},
  {sku:50016,name:"PEPSI",dept:"Mixers",sold:57,qty:-44,rev:72.12,cost:57*0.5},
  {sku:50099,name:"COCA COLA",dept:"Mixers",sold:39,qty:-20,rev:47.00,cost:39*0.5},
];

// ── DATES & HOURS ─────────────────────────────────────────────────────────────
const START = new Date("2026-04-06");
const END   = new Date("2026-05-10");
const DAYS_OPEN = Math.round((END - START) / 86400000); // 34 days

// Count Sundays vs Mon-Sat between Apr 6 and May 9 (34 days)
let sundays = 0, weekdays = 0;
for(let i=0;i<DAYS_OPEN;i++){
  const d=new Date(START); d.setDate(d.getDate()+i);
  d.getDay()===0 ? sundays++ : weekdays++;
}
const MON_SAT_HRS = 14;   // 8AM–10PM
const SUN_HRS     = 8;    // 10AM–6PM
const HOURLY_RATE = 13;
const totalHours  = weekdays*MON_SAT_HRS + sundays*SUN_HRS;
const laborCost   = totalHours * HOURLY_RATE;

// ── EXPENSES ──────────────────────────────────────────────────────────────────
const MONTHLY_EXPENSES = {
  Rent: 1700, Internet: 60, Electricity: 250, Garbage: 50, Miscellaneous: 300
};
const TOTAL_MONTHLY_EXP = Object.values(MONTHLY_EXPENSES).reduce((s,v)=>s+v,0);
const periodMonths = DAYS_OPEN / 30;
const periodExpenses = TOTAL_MONTHLY_EXP * periodMonths;
const totalOpEx = laborCost + periodExpenses;

// ── P&L METRICS ───────────────────────────────────────────────────────────────
const totalRev    = SALES.reduce((s,i)=>s+i.rev,0);
const totalCOGS   = SALES.reduce((s,i)=>s+i.cost,0);
const grossProfit = totalRev - totalCOGS;
const grossMargin = (grossProfit/totalRev*100);
const netProfit   = grossProfit - totalOpEx;
const netMargin   = (netProfit/totalRev*100);
const totalSold   = SALES.reduce((s,i)=>s+i.sold,0);
const negStock    = SALES.filter(i=>i.qty<0).length;
const avgDailyRev = totalRev/DAYS_OPEN;
const estTax      = totalRev * 0.085;
const weeklyRev   = avgDailyRev * 7;
const monthlyRev  = avgDailyRev * 30;

const topBySales = [...SALES].sort((a,b)=>b.rev-a.rev).slice(0,8);
const topByQty   = [...SALES].sort((a,b)=>b.sold-a.sold).slice(0,8);
const oversold   = [...SALES].filter(i=>i.qty<0).sort((a,b)=>a.qty-b.qty).slice(0,6);

const deptRev = SALES.reduce((acc,i)=>{
  const d=["Spirit","LIQUOR","Vodka","Flavored Whiskey","Gin","Tequila","Moonshine/White Whiskey"].includes(i.dept)?"Spirits":i.dept==="beer"?"Beer":i.dept==="wine"?"Wine":i.dept;
  acc[d]=(acc[d]||0)+i.rev; return acc;
},{});
const topDepts = Object.entries(deptRev).sort((a,b)=>b[1]-a[1]).slice(0,5);

const SUMMARY = `Liquor store open since April 6, 2026 (${DAYS_OPEN} days). Revenue: $${totalRev.toFixed(0)}. COGS: $${totalCOGS.toFixed(0)}. Gross Profit: $${grossProfit.toFixed(0)} (${grossMargin.toFixed(1)}%). Labor: $${laborCost.toFixed(0)} (${totalHours}hrs at $13/hr, ${weekdays} weekdays + ${sundays} Sundays). Fixed Expenses: $${periodExpenses.toFixed(0)}. Total OpEx: $${totalOpEx.toFixed(0)}. Net Profit: $${netProfit.toFixed(0)} (${netMargin.toFixed(1)}%). Est Tax: $${estTax.toFixed(0)}. Monthly expenses: Rent $1700, Internet $60, Electricity $250, Garbage $50, Misc $300 = $${TOTAL_MONTHLY_EXP}/mo. Store hours: Mon-Sat 8AM-10PM (14hr), Sun 10AM-6PM (8hr). Avg daily rev: $${avgDailyRev.toFixed(0)}.`;

// ── AGENTS ────────────────────────────────────────────────────────────────────
const AGENTS = [
  {id:"owner",     name:"Owner",     icon:"👑", color:"#FBBF24"},
  {id:"finance",   name:"Finance",   icon:"💵", color:"#34D399"},
  {id:"inventory", name:"Inventory", icon:"📦", color:"#4ECDC4"},
  {id:"orders",    name:"Orders",    icon:"🚚", color:"#F472B6"},
  {id:"marketing", name:"Marketing", icon:"📣", color:"#F87171"},
];
const QUICK = {
  owner:     ["Full P&L summary","Am I profitable?","What's my net profit?"],
  finance:   ["Break down all expenses","What's my net margin?","Estimate monthly profit","Tax liability estimate"],
  inventory: ["What's critically oversold?","Urgent restocks needed","Stock health overview"],
  orders:    ["Draft urgent reorder list","Top 10 priority restocks","Weekly order recommendations"],
  marketing: ["Instagram post for Hennessy","Weekend promo for Don Julio","Google Ad ideas"],
};
const SYSTEMS = {
  owner:    `You are the Owner AI. Give executive P&L summaries. ${SUMMARY}`,
  finance:  `You are the Finance Agent. Full P&L data: ${SUMMARY} Monthly expenses breakdown: ${JSON.stringify(MONTHLY_EXPENSES)}. Total monthly fixed costs: $${TOTAL_MONTHLY_EXP}. Labor: $13/hr, ${totalHours} hrs worked = $${laborCost.toFixed(0)} total labor. Net Profit after all expenses: $${netProfit.toFixed(0)}. Projected monthly revenue: $${monthlyRev.toFixed(0)}. Projected monthly net profit: $${(netProfit/periodMonths).toFixed(0)}.`,
  inventory:`You are the Inventory Agent. Negative qty = oversold/OUT OF STOCK. ${SUMMARY} Oversold: ${JSON.stringify(oversold)}. Full data: ${JSON.stringify(SALES)}`,
  orders:   `You are the Orders Agent. Create prioritized reorder lists. Negative qty = URGENT. ${SUMMARY} Oversold items: ${JSON.stringify(oversold)}`,
  marketing:`You are Marketing Agent. Top sellers: Hennessy 375ml $2566, Don Julio Repo $2023, Hennessy 750ml $1330. Total rev: $${totalRev.toFixed(0)}. Create compliant alcohol ads.`,
};

async function askClaude(agentId, q) {
  const res = await fetch("/api/claude",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:SYSTEMS[agentId],messages:[{role:"user",content:q}]})
  });
  const d=await res.json();
  if(!res.ok) throw new Error(d?.error?.message||"API Error");
  return d.content.map(b=>b.text||"").join("");
}

// ── UI HELPERS ────────────────────────────────────────────────────────────────
const fmt = (n,dec=0) => n<0?`-$${Math.abs(n).toFixed(dec)}`:`$${n.toFixed(dec)}`;

function KPICard({label,value,sub,color="#fff",bg="rgba(255,255,255,0.05)"}) {
  return(
    <div style={{background:bg,border:`1px solid ${color}20`,borderRadius:10,padding:"9px 11px",flex:1,minWidth:0}}>
      <div style={{fontSize:8.5,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:0.5,marginBottom:2}}>{label}</div>
      <div style={{fontSize:16,fontWeight:800,color,lineHeight:1.1}}>{value}</div>
      {sub&&<div style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginTop:2}}>{sub}</div>}
    </div>
  );
}

function MiniBar({label,value,max,color,prefix="$"}) {
  return(
    <div style={{marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
        <span style={{fontSize:10.5,color:"rgba(255,255,255,0.65)",maxWidth:"68%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{label}</span>
        <span style={{fontSize:10.5,fontWeight:700,color}}>{prefix}{value.toFixed(0)}</span>
      </div>
      <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:3}}>
        <div style={{height:"100%",width:`${Math.min(100,value/max*100).toFixed(1)}%`,background:color,borderRadius:3}}/>
      </div>
    </div>
  );
}

function PLRow({label,value,indent=false,bold=false,color="#fff",border=false}) {
  return(
    <div style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderTop:border?"1px solid rgba(255,255,255,0.08)":"none",marginTop:border?4:0}}>
      <span style={{fontSize:11,color:indent?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.8)",paddingLeft:indent?12:0,fontWeight:bold?700:400}}>{label}</span>
      <span style={{fontSize:11,fontWeight:bold?700:400,color}}>{fmt(value)}</span>
    </div>
  );
}

function OwnerView() {
  const [tab,setTab]=useState("pl");
  return(
    <div style={{flex:1,overflowY:"auto",padding:"10px"}}>
      {/* Top KPIs */}
      <div style={{display:"flex",gap:5,marginBottom:7}}>
        <KPICard label="Revenue" value={`$${(totalRev/1000).toFixed(1)}k`} sub={`$${avgDailyRev.toFixed(0)}/day`} color="#FBBF24"/>
        <KPICard label="Gross Profit" value={`$${(grossProfit/1000).toFixed(1)}k`} sub={`${grossMargin.toFixed(0)}% margin`} color="#34D399"/>
      </div>
      <div style={{display:"flex",gap:5,marginBottom:10}}>
        <KPICard label="Net Profit" value={fmt(netProfit)} sub={`${netMargin.toFixed(1)}% net margin`} color={netProfit>=0?"#A78BFA":"#F87171"}/>
        <KPICard label="Total OpEx" value={fmt(totalOpEx)} sub={`Labor+Fixed`} color="#F472B6"/>
        <KPICard label="Est. Tax" value={fmt(estTax)} sub="~8.5% rate" color="#94A3B8"/>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:5,marginBottom:10}}>
        {[["pl","📊 P&L"],["top","💰 Top Sales"],["alerts","🚨 Alerts"]].map(([v,l])=>(
          <button key={v} onClick={()=>setTab(v)} style={{background:tab===v?"rgba(251,191,36,0.15)":"rgba(255,255,255,0.04)",border:`1px solid ${tab===v?"#FBBF24":"rgba(255,255,255,0.08)"}`,borderRadius:20,padding:"4px 11px",color:tab===v?"#FBBF24":"rgba(255,255,255,0.35)",fontSize:10.5,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
        ))}
      </div>

      {/* P&L Statement */}
      {tab==="pl"&&(
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"12px"}}>
          <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Profit & Loss · Apr 6 – May 10</div>
          <PLRow label="Total Revenue" value={totalRev} bold color="#FBBF24"/>
          <PLRow label="Cost of Goods (COGS)" value={-totalCOGS} indent color="#F87171"/>
          <PLRow label="GROSS PROFIT" value={grossProfit} bold color="#34D399" border/>
          <div style={{marginTop:6,marginBottom:2,fontSize:9.5,color:"rgba(255,255,255,0.3)",textTransform:"uppercase"}}>Operating Expenses</div>
          <PLRow label={`Labor (${totalHours} hrs @ $13/hr)`} value={-laborCost} indent color="#F472B6"/>
          <PLRow label={`Rent (${DAYS_OPEN} days)`} value={-(1700*periodMonths)} indent color="#94A3B8"/>
          <PLRow label={`Electricity`} value={-(250*periodMonths)} indent color="#94A3B8"/>
          <PLRow label={`Misc Expenses`} value={-((60+50+300)*periodMonths)} indent color="#94A3B8"/>
          <PLRow label="Total OpEx" value={-totalOpEx} bold color="#F472B6" border/>
          <PLRow label="NET PROFIT" value={netProfit} bold color={netProfit>=0?"#A78BFA":"#F87171"} border/>
          <PLRow label="Est. Sales Tax" value={-estTax} indent color="#94A3B8"/>
          <div style={{marginTop:8,padding:"6px 8px",background:"rgba(167,139,250,0.08)",borderRadius:6,fontSize:10,color:"rgba(255,255,255,0.45)"}}>
            📅 Projected Monthly Net: <span style={{color:"#A78BFA",fontWeight:700}}>{fmt(netProfit/periodMonths)}</span> &nbsp;·&nbsp; Weekly Rev: <span style={{color:"#FBBF24",fontWeight:700}}>{fmt(weeklyRev)}</span>
          </div>
        </div>
      )}

      {/* Top Sales */}
      {tab==="top"&&(
        <div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginBottom:7,textTransform:"uppercase",letterSpacing:0.5}}>Top Revenue Producers</div>
          {topBySales.map(i=><MiniBar key={i.sku} label={i.name} value={i.rev} max={topBySales[0].rev} color="#FBBF24"/>)}
        </div>
      )}

      {/* Alerts */}
      {tab==="alerts"&&(
        <div>
          <div style={{background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:8,padding:"10px",marginBottom:8}}>
            <div style={{fontSize:10,fontWeight:700,color:"#F87171",marginBottom:6}}>🚨 OVERSOLD — RESTOCK IMMEDIATELY</div>
            {oversold.map(i=>(
              <div key={i.sku} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.7)",maxWidth:"75%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{i.name}</span>
                <span style={{fontSize:11,fontWeight:700,color:"#F87171"}}>{i.qty} units</span>
              </div>
            ))}
          </div>
          <div style={{background:"rgba(52,211,153,0.07)",border:"1px solid rgba(52,211,153,0.15)",borderRadius:8,padding:"10px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#34D399",marginBottom:6}}>✅ STORE HOURS & LABOR</div>
            {[["Mon–Sat","8:00 AM – 10:00 PM","14 hrs/day"],["Sunday","10:00 AM – 6:00 PM","8 hrs/day"],["Weekly Total",`${6*14+8} hrs/week`,`$${(92*13).toFixed(0)}/week`],["Period Total",`${totalHours} hrs`,`$${laborCost.toFixed(0)} labor`]].map(([d,t,h])=>(
              <div key={d} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                <span style={{fontSize:10.5,color:"rgba(255,255,255,0.6)"}}>{d}</span>
                <span style={{fontSize:10.5,color:"rgba(255,255,255,0.4)"}}>{t}</span>
                <span style={{fontSize:10.5,fontWeight:600,color:"#34D399"}}>{h}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FinanceView() {
  const [tab,setTab]=useState("expenses");
  return(
    <div style={{flex:1,overflowY:"auto",padding:"10px"}}>
      <div style={{display:"flex",gap:5,marginBottom:8}}>
        <KPICard label="Gross Margin" value={`${grossMargin.toFixed(1)}%`} sub="Revenue minus COGS" color="#34D399"/>
        <KPICard label="Net Margin" value={`${netMargin.toFixed(1)}%`} sub="After all expenses" color={netProfit>=0?"#A78BFA":"#F87171"}/>
      </div>
      <div style={{display:"flex",gap:5,marginBottom:10}}>
        <KPICard label="Monthly Revenue" value={fmt(monthlyRev)} sub="projected" color="#FBBF24"/>
        <KPICard label="Monthly Expenses" value={fmt(TOTAL_MONTHLY_EXP+laborCost/periodMonths*1)} sub="fixed+labor" color="#F472B6"/>
      </div>
      <div style={{display:"flex",gap:5,marginBottom:10}}>
        {[["expenses","💸 Expenses"],["margins","📊 Margins"],["chat","💬 Ask AI"]].map(([v,l])=>(
          <button key={v} onClick={()=>setTab(v)} style={{background:tab===v?"rgba(52,211,153,0.15)":"rgba(255,255,255,0.04)",border:`1px solid ${tab===v?"#34D399":"rgba(255,255,255,0.08)"}`,borderRadius:20,padding:"4px 10px",color:tab===v?"#34D399":"rgba(255,255,255,0.35)",fontSize:10.5,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
        ))}
      </div>
      {tab==="expenses"&&(
        <div>
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"12px",marginBottom:8}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",marginBottom:8}}>Monthly Fixed Costs</div>
            {Object.entries(MONTHLY_EXPENSES).map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>{k}</span>
                <span style={{fontSize:11,fontWeight:600,color:"#F472B6"}}>${v}/mo</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0 0",marginTop:2}}>
              <span style={{fontSize:11,fontWeight:700,color:"#fff"}}>Total Fixed</span>
              <span style={{fontSize:11,fontWeight:800,color:"#F472B6"}}>${TOTAL_MONTHLY_EXP}/mo</span>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"12px"}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",marginBottom:8}}>Labor Cost ({DAYS_OPEN} days)</div>
            {[["Mon–Sat hours",`${weekdays} days × 14hrs = ${weekdays*14}hrs`],["Sunday hours",`${sundays} days × 8hrs = ${sundays*8}hrs`],["Total hours",`${totalHours} hrs @ $13/hr`],["Total labor",fmt(laborCost)]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>{l}</span>
                <span style={{fontSize:11,fontWeight:600,color:"#34D399"}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==="margins"&&(
        <div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginBottom:7,textTransform:"uppercase"}}>Revenue vs Cost</div>
          {[["Revenue",totalRev,"#FBBF24"],["COGS",totalCOGS,"#F87171"],["Gross Profit",grossProfit,"#34D399"],["Labor",laborCost,"#F472B6"],["Fixed Expenses",periodExpenses,"#94A3B8"],["Net Profit",netProfit,"#A78BFA"]].map(([l,v,c])=>(
            <MiniBar key={l} label={l} value={Math.abs(v)} max={totalRev} color={c}/>
          ))}
        </div>
      )}
      {tab==="chat"&&<ChatInline agentId="finance" color="#34D399"/>}
    </div>
  );
}

function ChatInline({agentId,color}) {
  const [msgs,setMsgs]=useState([]);
  const [input,setInput]=useState("");
  const [busy,setBusy]=useState(false);
  const ref=useRef(null);
  const send=async(text)=>{
    const q=(text||input).trim();if(!q||busy)return;
    setInput("");setBusy(true);
    setMsgs(m=>[...m,{f:"user",t:q},{f:"ai",t:"…",l:true}]);
    setTimeout(()=>ref.current?.scrollIntoView({behavior:"smooth"}),50);
    try{const r=await askClaude(agentId,q);setMsgs(m=>{const u=[...m];u[u.length-1]={f:"ai",t:r};return u;});}
    catch(e){setMsgs(m=>{const u=[...m];u[u.length-1]={f:"ai",t:"Error: "+e.message};return u;});}
    setBusy(false);setTimeout(()=>ref.current?.scrollIntoView({behavior:"smooth"}),100);
  };
  return(
    <div style={{display:"flex",flexDirection:"column",minHeight:200}}>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>
        {QUICK[agentId].map(p=><button key={p} onClick={()=>send(p)} style={{background:`${color}15`,border:`1px solid ${color}30`,color,borderRadius:14,padding:"3px 9px",fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>{p}</button>)}
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:7,maxHeight:250,overflowY:"auto"}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.f==="user"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"88%",padding:"7px 11px",borderRadius:m.f==="user"?"12px 12px 3px 12px":"12px 12px 12px 3px",background:m.f==="user"?`${color}18`:"rgba(255,255,255,0.06)",fontSize:12,lineHeight:1.65,whiteSpace:"pre-wrap",color:m.f==="user"?color:m.l?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.85)"}}>{m.t}</div>
          </div>
        ))}
        <div ref={ref}/>
      </div>
      <div style={{display:"flex",gap:7,marginTop:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask finance anything…" disabled={busy}
          style={{flex:1,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:8,padding:"7px 10px",color:"#fff",fontSize:12,fontFamily:"inherit",outline:"none"}}/>
        <button onClick={()=>send()} disabled={busy||!input.trim()} style={{background:busy?"rgba(255,255,255,0.06)":color,border:"none",borderRadius:8,padding:"7px 13px",color:"#000",fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{busy?"…":"→"}</button>
      </div>
    </div>
  );
}

function Chat({agentId,color}) {
  const [msgs,setMsgs]=useState([]);
  const [input,setInput]=useState("");
  const [busy,setBusy]=useState(false);
  const ref=useRef(null);
  const send=async(text)=>{
    const q=(text||input).trim();if(!q||busy)return;
    setInput("");setBusy(true);
    setMsgs(m=>[...m,{f:"user",t:q},{f:"ai",t:"Thinking…",l:true}]);
    setTimeout(()=>ref.current?.scrollIntoView({behavior:"smooth"}),50);
    try{const r=await askClaude(agentId,q);setMsgs(m=>{const u=[...m];u[u.length-1]={f:"ai",t:r};return u;});}
    catch(e){setMsgs(m=>{const u=[...m];u[u.length-1]={f:"ai",t:"Error: "+e.message};return u;});}
    setBusy(false);setTimeout(()=>ref.current?.scrollIntoView({behavior:"smooth"}),100);
  };
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",padding:"7px 10px",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
        {QUICK[agentId].map(p=><button key={p} onClick={()=>send(p)} style={{background:`${color}15`,border:`1px solid ${color}30`,color,borderRadius:14,padding:"3px 10px",fontSize:10.5,cursor:"pointer",fontFamily:"inherit"}}>{p}</button>)}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"10px",display:"flex",flexDirection:"column",gap:8}}>
        {msgs.length===0&&<div style={{textAlign:"center",color:"rgba(255,255,255,0.2)",marginTop:40,fontSize:12}}>Tap a prompt or type below ↓</div>}
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.f==="user"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"86%",padding:"8px 12px",borderRadius:m.f==="user"?"13px 13px 3px 13px":"13px 13px 13px 3px",background:m.f==="user"?`${color}18`:"rgba(255,255,255,0.06)",border:`1px solid ${m.f==="user"?color+"30":"rgba(255,255,255,0.08)"}`,fontSize:12.5,lineHeight:1.7,whiteSpace:"pre-wrap",color:m.f==="user"?color:m.l?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.88)"}}>{m.t}</div>
          </div>
        ))}
        <div ref={ref}/>
      </div>
      <div style={{padding:"8px 10px",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",gap:7,flexShrink:0}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask anything…" disabled={busy}
          style={{flex:1,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:8,padding:"8px 11px",color:"#fff",fontSize:12.5,fontFamily:"inherit",outline:"none"}}/>
        <button onClick={()=>send()} disabled={busy||!input.trim()} style={{background:busy?"rgba(255,255,255,0.07)":color,border:"none",borderRadius:8,padding:"8px 14px",color:"#000",fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>{busy?"…":"→"}</button>
      </div>
    </div>
  );
}

export default function App() {
  const [active,setActive]=useState("owner");
  const agent=AGENTS.find(a=>a.id===active);
  return(
    <div style={{height:"100vh",background:"#0a0a0f",fontFamily:"-apple-system,BlinkMacSystemFont,sans-serif",color:"#fff",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:3px}`}</style>
      <div style={{padding:"9px 12px 7px",borderBottom:"1px solid rgba(255,255,255,0.07)",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:21}}>🥃</span>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:800}}>Liquor Store Command Center</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>Apr 6 – May 10, 2026 · {DAYS_OPEN} days · {totalHours} labor hrs</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:13,fontWeight:800,color:"#FBBF24"}}>${(totalRev/1000).toFixed(1)}k rev</div>
            <div style={{fontSize:9,color:netProfit>=0?"#34D399":"#F87171"}}>Net: {fmt(netProfit)}</div>
          </div>
        </div>
      </div>
      <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
        {AGENTS.map(a=>(
          <button key={a.id} onClick={()=>setActive(a.id)} style={{flex:1,background:active===a.id?`${a.color}10`:"transparent",border:"none",borderBottom:active===a.id?`2px solid ${a.color}`:"2px solid transparent",padding:"7px 4px",display:"flex",flexDirection:"column",alignItems:"center",gap:1.5,cursor:"pointer"}}>
            <span style={{fontSize:15}}>{a.icon}</span>
            <span style={{fontSize:8,color:active===a.id?a.color:"rgba(255,255,255,0.28)",fontWeight:active===a.id?700:400}}>{a.name}</span>
          </button>
        ))}
      </div>
      <div style={{padding:"4px 12px",background:`${agent.color}08`,borderBottom:"1px solid rgba(255,255,255,0.04)",flexShrink:0}}>
        <span style={{fontSize:10,color:agent.color,fontWeight:700}}>{agent.icon} {agent.name}</span>
        <span style={{fontSize:9,color:"rgba(255,255,255,0.25)",marginLeft:6}}>
          {active==="owner"&&"P&L · Revenue · Net Profit · Alerts"}
          {active==="finance"&&"Expenses · Labor · Margins · Tax"}
          {active==="inventory"&&"Stock · Oversold · Alerts"}
          {active==="orders"&&"Reorders · Priority · POs"}
          {active==="marketing"&&"Social · Ads · Promos"}
        </span>
      </div>
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        {active==="owner"&&<OwnerView/>}
        {active==="finance"&&<FinanceView/>}
        {(active==="inventory"||active==="orders"||active==="marketing")&&<Chat key={active} agentId={active} color={agent.color}/>}
      </div>
    </div>
  );
}
