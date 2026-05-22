import React, { useState, useRef, useEffect } from "react";

// ── SUPABASE CONFIG ──────────────────────────────────────────────────────────
const SUPABASE_URL = "https://zvzevjnuznxqsdbhqnkb.supabase.co";
const SUPABASE_KEY = "sb_publishable_iwATytOrZtRaBcadfqAXOA_p1ijoIhL";

// ── DATES & CONSTANTS ─────────────────────────────────────────────────────────
const START      = new Date("2026-04-06");
const END        = new Date();
const DAYS_OPEN  = Math.max(1, Math.round((END - START) / 86400000));
const HOURLY_RATE = 13;
const MONTHLY_EXPENSES = { Rent:1700, Internet:60, Electricity:250, Garbage:50, Miscellaneous:300 };
const TOTAL_MONTHLY_EXP = Object.values(MONTHLY_EXPENSES).reduce((s,v)=>s+v,0);

let sundays=0, weekdays=0;
for(let i=0;i<DAYS_OPEN;i++){
  const d=new Date(START); d.setDate(d.getDate()+i);
  d.getDay()===0?sundays++:weekdays++;
}
const totalHours   = weekdays*14 + sundays*8;
const laborCost    = totalHours * HOURLY_RATE;
const periodMonths = DAYS_OPEN / 30;
const periodExpenses = TOTAL_MONTHLY_EXP * periodMonths;
const totalOpEx    = laborCost + periodExpenses;

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

async function askClaude(agentId, q, summary) {
  const SYSTEMS = {
    owner:    `You are the Owner AI for Park City Liquor store. Give executive P&L summaries. Be direct. ${summary}`,
    finance:  `You are the Finance Agent for Park City Liquor. Full P&L: ${summary}. Monthly expenses: ${JSON.stringify(MONTHLY_EXPENSES)}. Total monthly fixed: $${TOTAL_MONTHLY_EXP}. Labor: $13/hr, ${totalHours}hrs = $${laborCost.toFixed(0)}.`,
    inventory:`You are the Inventory Agent. Negative qty = oversold/OUT OF STOCK URGENT. ${summary}`,
    orders:   `You are the Orders Agent. Create prioritized reorder lists. Negative qty = URGENT. ${summary}`,
    marketing:`You are Marketing Agent for Park City Liquor store. Create engaging, compliant alcohol marketing. ${summary}`,
  };
  const res = await fetch("/api/claude", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      model:"claude-sonnet-4-5", max_tokens:1000,
      system: SYSTEMS[agentId],
      messages:[{role:"user", content:q}]
    })
  });
  const d = await res.json();
  if(!res.ok) throw new Error(d?.error?.message||"API Error");
  return d.content.map(b=>b.text||"").join("");
}

// ── UI HELPERS ────────────────────────────────────────────────────────────────
const fmt = (n,dec=0) => n<0?`-$${Math.abs(n).toFixed(dec)}`:`$${n.toFixed(dec)}`;

function KPICard({label,value,sub,color="#fff"}) {
  return(
    <div style={{background:"rgba(255,255,255,0.05)",border:`1px solid ${color}20`,borderRadius:10,padding:"9px 11px",flex:1,minWidth:0}}>
      <div style={{fontSize:8.5,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:0.5,marginBottom:2}}>{label}</div>
      <div style={{fontSize:16,fontWeight:800,color,lineHeight:1.1}}>{value}</div>
      {sub&&<div style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginTop:2}}>{sub}</div>}
    </div>
  );
}

function MiniBar({label,value,max,color,prefix="$"}) {
  return(
    <div style={{marginBottom:9}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
        <span style={{fontSize:10.5,color:"rgba(255,255,255,0.65)",maxWidth:"68%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{label}</span>
        <span style={{fontSize:10.5,fontWeight:700,color}}>{prefix}{typeof value==="number"?value.toFixed(0):value}</span>
      </div>
      <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:3}}>
        <div style={{height:"100%",width:`${Math.min(100,Math.abs(value)/Math.abs(max)*100).toFixed(1)}%`,background:color,borderRadius:3}}/>
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

// ── OWNER VIEW ────────────────────────────────────────────────────────────────
function OwnerView({sales, loading}) {
  const [tab,setTab]=useState("pl");

  const totalRev    = sales.reduce((s,i)=>s+i.rev,0);
  const totalCOGS   = sales.reduce((s,i)=>s+i.cost,0);
  const grossProfit = totalRev - totalCOGS;
  const grossMargin = totalRev>0?(grossProfit/totalRev*100):0;
  const netProfit   = grossProfit - totalOpEx;
  const netMargin   = totalRev>0?(netProfit/totalRev*100):0;
  const estTax      = totalRev * 0.085;
  const avgDailyRev = totalRev / DAYS_OPEN;
  const weeklyRev   = avgDailyRev * 7;
  const oversold    = sales.filter(i=>i.qty<0).sort((a,b)=>a.qty-b.qty).slice(0,6);
  const topBySales  = [...sales].sort((a,b)=>b.rev-a.rev).slice(0,8);

  if(loading) return(
    <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,0.3)",fontSize:13}}>
      Loading live data from Supabase...
    </div>
  );

  return(
    <div style={{flex:1,overflowY:"auto",padding:"10px"}}>
      <div style={{display:"flex",gap:5,marginBottom:7}}>
        <KPICard label="Revenue" value={`$${(totalRev/1000).toFixed(1)}k`} sub={`$${avgDailyRev.toFixed(0)}/day`} color="#FBBF24"/>
        <KPICard label="Gross Profit" value={`$${(grossProfit/1000).toFixed(1)}k`} sub={`${grossMargin.toFixed(0)}% margin`} color="#34D399"/>
      </div>
      <div style={{display:"flex",gap:5,marginBottom:10}}>
        <KPICard label="Net Profit" value={fmt(netProfit)} sub={`${netMargin.toFixed(1)}% net`} color={netProfit>=0?"#A78BFA":"#F87171"}/>
        <KPICard label="Total OpEx" value={fmt(totalOpEx)} sub="Labor+Fixed" color="#F472B6"/>
        <KPICard label="Est. Tax" value={fmt(estTax)} sub="~8.5% rate" color="#94A3B8"/>
      </div>
      <div style={{display:"flex",gap:5,marginBottom:10}}>
        {[["pl","📊 P&L"],["top","💰 Top Sales"],["alerts","🚨 Alerts"]].map(([v,l])=>(
          <button key={v} onClick={()=>setTab(v)} style={{background:tab===v?"rgba(251,191,36,0.15)":"rgba(255,255,255,0.04)",border:`1px solid ${tab===v?"#FBBF24":"rgba(255,255,255,0.08)"}`,borderRadius:20,padding:"4px 11px",color:tab===v?"#FBBF24":"rgba(255,255,255,0.35)",fontSize:10.5,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
        ))}
      </div>
      {tab==="pl"&&(
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"12px"}}>
          <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>P&L · Apr 6 – Today · LIVE DATA</div>
          <PLRow label="Total Revenue" value={totalRev} bold color="#FBBF24"/>
          <PLRow label="Cost of Goods (COGS)" value={-totalCOGS} indent color="#F87171"/>
          <PLRow label="GROSS PROFIT" value={grossProfit} bold color="#34D399" border/>
          <div style={{marginTop:6,marginBottom:2,fontSize:9.5,color:"rgba(255,255,255,0.3)",textTransform:"uppercase"}}>Operating Expenses</div>
          <PLRow label={`Labor (${totalHours} hrs @ $13/hr)`} value={-laborCost} indent color="#F472B6"/>
          <PLRow label="Rent" value={-(1700*periodMonths)} indent color="#94A3B8"/>
          <PLRow label="Electricity" value={-(250*periodMonths)} indent color="#94A3B8"/>
          <PLRow label="Other Expenses" value={-((60+50+300)*periodMonths)} indent color="#94A3B8"/>
          <PLRow label="Total OpEx" value={-totalOpEx} bold color="#F472B6" border/>
          <PLRow label="NET PROFIT" value={netProfit} bold color={netProfit>=0?"#A78BFA":"#F87171"} border/>
          <PLRow label="Est. Sales Tax" value={-estTax} indent color="#94A3B8"/>
          <div style={{marginTop:8,padding:"6px 8px",background:"rgba(167,139,250,0.08)",borderRadius:6,fontSize:10,color:"rgba(255,255,255,0.45)"}}>
            📅 Projected Monthly Net: <span style={{color:"#A78BFA",fontWeight:700}}>{fmt(netProfit/periodMonths)}</span> &nbsp;·&nbsp; Weekly Rev: <span style={{color:"#FBBF24",fontWeight:700}}>{fmt(weeklyRev)}</span>
          </div>
        </div>
      )}
      {tab==="top"&&(
        <div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginBottom:7,textTransform:"uppercase"}}>Top Revenue Producers — Live</div>
          {topBySales.map((i,idx)=><MiniBar key={idx} label={i.name} value={i.rev} max={topBySales[0]?.rev||1} color="#FBBF24"/>)}
        </div>
      )}
      {tab==="alerts"&&(
        <div>
          <div style={{background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:8,padding:"10px",marginBottom:8}}>
            <div style={{fontSize:10,fontWeight:700,color:"#F87171",marginBottom:6}}>🚨 OVERSOLD — RESTOCK NOW</div>
            {oversold.length===0?<div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>No oversold items!</div>:
            oversold.map((i,idx)=>(
              <div key={idx} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.7)",maxWidth:"75%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{i.name}</span>
                <span style={{fontSize:11,fontWeight:700,color:"#F87171"}}>{i.qty} units</span>
              </div>
            ))}
          </div>
          <div style={{background:"rgba(52,211,153,0.07)",border:"1px solid rgba(52,211,153,0.15)",borderRadius:8,padding:"10px"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#34D399",marginBottom:6}}>🕐 Store Hours & Labor</div>
            {[["Mon–Sat","8AM–10PM","14 hrs/day"],["Sunday","10AM–6PM","8 hrs/day"],["This Period",`${totalHours} total hrs`,`${fmt(laborCost)} labor`]].map(([d,t,h])=>(
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

// ── FINANCE VIEW ──────────────────────────────────────────────────────────────
function FinanceView({sales, loading}) {
  const [tab,setTab]=useState("expenses");
  const totalRev    = sales.reduce((s,i)=>s+i.rev,0);
  const totalCOGS   = sales.reduce((s,i)=>s+i.cost,0);
  const grossProfit = totalRev - totalCOGS;
  const grossMargin = totalRev>0?(grossProfit/totalRev*100):0;
  const netProfit   = grossProfit - totalOpEx;
  const netMargin   = totalRev>0?(netProfit/totalRev*100):0;
  const monthlyRev  = (totalRev/DAYS_OPEN)*30;
  const summary     = `Revenue $${totalRev.toFixed(0)}, COGS $${totalCOGS.toFixed(0)}, Gross Profit $${grossProfit.toFixed(0)} (${grossMargin.toFixed(1)}%), Net Profit $${netProfit.toFixed(0)} (${netMargin.toFixed(1)}%), Labor $${laborCost.toFixed(0)}, Fixed Expenses $${periodExpenses.toFixed(0)}`;

  return(
    <div style={{flex:1,overflowY:"auto",padding:"10px"}}>
      <div style={{display:"flex",gap:5,marginBottom:7}}>
        <KPICard label="Gross Margin" value={`${grossMargin.toFixed(1)}%`} sub="Revenue minus COGS" color="#34D399"/>
        <KPICard label="Net Margin" value={`${netMargin.toFixed(1)}%`} sub="After all expenses" color={netProfit>=0?"#A78BFA":"#F87171"}/>
      </div>
      <div style={{display:"flex",gap:5,marginBottom:10}}>
        <KPICard label="Monthly Revenue" value={fmt(monthlyRev)} sub="projected" color="#FBBF24"/>
        <KPICard label="Monthly Expenses" value={fmt(TOTAL_MONTHLY_EXP+(laborCost/periodMonths))} sub="fixed+labor" color="#F472B6"/>
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
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0 0"}}>
              <span style={{fontSize:11,fontWeight:700,color:"#fff"}}>Total Fixed</span>
              <span style={{fontSize:11,fontWeight:800,color:"#F472B6"}}>${TOTAL_MONTHLY_EXP}/mo</span>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"12px"}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",marginBottom:8}}>Labor ({DAYS_OPEN} days)</div>
            {[["Mon–Sat",`${weekdays} days × 14hrs = ${weekdays*14}hrs`],["Sundays",`${sundays} days × 8hrs = ${sundays*8}hrs`],["Total",`${totalHours} hrs @ $13/hr`],["Total Labor",fmt(laborCost)]].map(([l,v])=>(
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
          <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginBottom:7,textTransform:"uppercase"}}>Revenue vs Cost — Live Data</div>
          {[["Revenue",totalRev,"#FBBF24"],["COGS",totalCOGS,"#F87171"],["Gross Profit",grossProfit,"#34D399"],["Labor",laborCost,"#F472B6"],["Fixed Expenses",periodExpenses,"#94A3B8"],["Net Profit",Math.abs(netProfit),"#A78BFA"]].map(([l,v,c])=>(
            <MiniBar key={l} label={l} value={Math.abs(v)} max={totalRev} color={c}/>
          ))}
        </div>
      )}
      {tab==="chat"&&<ChatInline agentId="finance" color="#34D399" summary={summary}/>}
    </div>
  );
}

// ── CHAT COMPONENTS ───────────────────────────────────────────────────────────
function ChatInline({agentId, color, summary}) {
  const [msgs,setMsgs]=useState([]);
  const [input,setInput]=useState("");
  const [busy,setBusy]=useState(false);
  const ref=useRef(null);
  const send=async(text)=>{
    const q=(text||input).trim();if(!q||busy)return;
    setInput("");setBusy(true);
    setMsgs(m=>[...m,{f:"user",t:q},{f:"ai",t:"…",l:true}]);
    setTimeout(()=>ref.current?.scrollIntoView({behavior:"smooth"}),50);
    try{const r=await askClaude(agentId,q,summary);setMsgs(m=>{const u=[...m];u[u.length-1]={f:"ai",t:r};return u;});}
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
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask anything…" disabled={busy}
          style={{flex:1,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:8,padding:"7px 10px",color:"#fff",fontSize:12,fontFamily:"inherit",outline:"none"}}/>
        <button onClick={()=>send()} disabled={busy||!input.trim()} style={{background:busy?"rgba(255,255,255,0.06)":color,border:"none",borderRadius:8,padding:"7px 13px",color:"#000",fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{busy?"…":"→"}</button>
      </div>
    </div>
  );
}

function Chat({agentId, color, summary}) {
  const [msgs,setMsgs]=useState([]);
  const [input,setInput]=useState("");
  const [busy,setBusy]=useState(false);
  const ref=useRef(null);
  const send=async(text)=>{
    const q=(text||input).trim();if(!q||busy)return;
    setInput("");setBusy(true);
    setMsgs(m=>[...m,{f:"user",t:q},{f:"ai",t:"Thinking…",l:true}]);
    setTimeout(()=>ref.current?.scrollIntoView({behavior:"smooth"}),50);
    try{const r=await askClaude(agentId,q,summary);setMsgs(m=>{const u=[...m];u[u.length-1]={f:"ai",t:r};return u;});}
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

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [active,setActive] = useState("owner");
  const [sales,setSales]   = useState([]);
  const [loading,setLoading] = useState(true);
  const [lastSync,setLastSync] = useState(null);

  useEffect(()=>{
    fetch(`${SUPABASE_URL}/rest/v1/sales?select=*&limit=2000&order=created_at.desc`,{
      headers:{
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      }
    })
    .then(r=>r.json())
    .then(data=>{
      if(Array.isArray(data)){
        setSales(data.map(r=>({
          sku: r.sku||"",
          name: r.itemname||r.item_name||"Unknown",
          dept: r.depname||r.dep_name||"Other",
          sold: parseFloat(r.qtysold||r.qty_sold)||0,
          qty:  parseFloat(r.totalqty||r.total_qty)||0,
          rev:  parseFloat(r.salesamount||r.sales_amount)||0,
          cost: (parseFloat(r.salesamount||r.sales_amount)||0)*0.65,
        })));
        setLastSync(new Date().toLocaleTimeString());
      }
      setLoading(false);
    })
    .catch(e=>{ console.error(e); setLoading(false); });
  },[]);

  const totalRev  = sales.reduce((s,i)=>s+i.rev,0);
  const netProfit = sales.reduce((s,i)=>s+i.rev-i.cost,0) - totalOpEx;
  const negStock  = sales.filter(i=>i.qty<0).length;

  const summary = `Park City Liquor store. ${DAYS_OPEN} days open since April 6, 2026. Revenue: $${totalRev.toFixed(0)}. Net Profit after all expenses: $${netProfit.toFixed(0)}. Oversold SKUs: ${negStock}. Labor: ${totalHours}hrs @ $13/hr = $${laborCost.toFixed(0)}. Monthly fixed costs: $${TOTAL_MONTHLY_EXP}. Top sellers: ${[...sales].sort((a,b)=>b.rev-a.rev).slice(0,5).map(i=>`${i.name} $${i.rev.toFixed(0)}`).join(", ")}`;

  const agent = AGENTS.find(a=>a.id===active);

  return(
    <div style={{height:"100vh",background:"#0a0a0f",fontFamily:"-apple-system,BlinkMacSystemFont,sans-serif",color:"#fff",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:3px}`}</style>

      {/* Header */}
      <div style={{padding:"9px 12px 7px",borderBottom:"1px solid rgba(255,255,255,0.07)",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:21}}>🥃</span>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:800}}>Park City Liquor — Command Center</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>
              {loading?"Loading live data...": `${sales.length} SKUs · Live Supabase · Last sync: ${lastSync}`}
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:13,fontWeight:800,color:"#FBBF24"}}>${(totalRev/1000).toFixed(1)}k</div>
            <div style={{fontSize:9,color:netProfit>=0?"#34D399":"#F87171"}}>Net: ${netProfit.toFixed(0)}</div>
          </div>
        </div>
        {negStock>0&&(
          <div style={{marginTop:6,background:"rgba(248,113,113,0.09)",border:"1px solid rgba(248,113,113,0.22)",borderRadius:6,padding:"4px 10px",fontSize:10.5,color:"#F87171"}}>
            ⚠ {negStock} oversold SKUs need restocking NOW
          </div>
        )}
      </div>

      {/* Agent Nav */}
      <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
        {AGENTS.map(a=>(
          <button key={a.id} onClick={()=>setActive(a.id)} style={{flex:1,background:active===a.id?`${a.color}10`:"transparent",border:"none",borderBottom:active===a.id?`2px solid ${a.color}`:"2px solid transparent",padding:"7px 4px",display:"flex",flexDirection:"column",alignItems:"center",gap:1.5,cursor:"pointer"}}>
            <span style={{fontSize:15}}>{a.icon}</span>
            <span style={{fontSize:8,color:active===a.id?a.color:"rgba(255,255,255,0.28)",fontWeight:active===a.id?700:400}}>{a.name}</span>
          </button>
        ))}
      </div>

      {/* Agent Label */}
      <div style={{padding:"4px 12px",background:`${agent.color}08`,borderBottom:"1px solid rgba(255,255,255,0.04)",flexShrink:0}}>
        <span style={{fontSize:10,color:agent.color,fontWeight:700}}>{agent.icon} {agent.name}</span>
        <span style={{fontSize:9,color:"rgba(255,255,255,0.25)",marginLeft:6}}>
          {active==="owner"&&"P&L · Revenue · Net Profit · Alerts · LIVE"}
          {active==="finance"&&"Expenses · Labor · Margins · Tax"}
          {active==="inventory"&&"Stock · Oversold · Alerts · LIVE"}
          {active==="orders"&&"Reorders · Priority · Purchase Orders"}
          {active==="marketing"&&"Social · Ads · Promotions"}
        </span>
      </div>

      {/* Content */}
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        {active==="owner"  && <OwnerView sales={sales} loading={loading}/>}
        {active==="finance"&& <FinanceView sales={sales} loading={loading}/>}
        {(active==="inventory"||active==="orders"||active==="marketing")&&
          <Chat key={active} agentId={active} color={agent.color} summary={summary}/>}
      </div>
    </div>
  );
}
