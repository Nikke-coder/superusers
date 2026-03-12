import React from "react";
import { useState, useEffect, useCallback } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import * as SupabaseClient from "@supabase/supabase-js";


// ── Targetflow logo (base64) ─────────────────────────────────────────────────
const TF_LOGO = "data:image/png;base64,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";

// ── Supabase (shared project) ─────────────────────────────────────────────────
const SUPA_URL  = "https://jzqgndcrukggcwthxyrv.supabase.co";
const SUPA_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6cWduZGNydWtnZ2N3dGh4eXJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTA3NDIsImV4cCI6MjA4ODUyNjc0Mn0.6nSM1D1P36Did6pT27IBvO-tSQ2ihSrxhlZLlaEhvEc";
const supabase  = SupabaseClient.createClient(SUPA_URL, SUPA_KEY);

// ── Access control ────────────────────────────────────────────────────────────
const ALLOWED = ["niklas.isaksson@targetflow.fi","virpi.lamsa@targetflow.fi"];

// ── Client registry ───────────────────────────────────────────────────────────
const CLIENTS = [
  { name:"Stremet Oy",       accent:"#818cf8", url:"https://stremet-dashboard.vercel.app"     },
  { name:"Manutec Oy",       accent:"#38bdf8", url:"https://manutec-dashboard.vercel.app"     },
  { name:"Accrease Oy",      accent:"#86efac", url:"https://accrease-dashboard.vercel.app"    },
  { name:"Drop Design Pool", accent:"#38bdf8", url:"https://drop-dashboard-blue.vercel.app"   },
  { name:"Niittysiemen Oy",  accent:"#4ade80", url:"https://niittysiemen-dashboard.vercel.app"},
  { name:"Strand Group",     accent:"#60a5fa", url:"https://strand-dashboard.vercel.app"      },
  { name:"Cuuma",            accent:"#60a5fa", url:"https://cuuma-dashboard.vercel.app"       },
  { name:"Tepcomp Group",    accent:"#2dd4bf", url:"https://tepcomp-dashboard.vercel.app"     },
];

const MONTHS_A = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (v) => {
  if(v==null||isNaN(v)) return "—";
  const abs = Math.abs(v);
  if(abs>=1000000) return (v/1000000).toFixed(1)+"M";
  if(abs>=1000)    return (v/1000).toFixed(0)+"k";
  return v.toFixed(0);
};
const fmtPct = (v) => v==null||isNaN(v) ? "—" : (v>=0?"+":"")+v.toFixed(1)+"%";
const sum = (arr) => (arr||[]).reduce((a,b)=>(a||0)+(b||0),0);

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#05060f;color:#c8d8f0;font-family:'DM Sans',sans-serif;}
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-track{background:#05060f;}
  ::-webkit-scrollbar-thumb{background:rgba(160,200,255,0.2);border-radius:2px;}

  /* ─── Dashboard (post-login) ─── */
  .card{background:rgba(6,10,22,0.8);border:1px solid rgba(100,160,255,0.1);border-radius:10px;
    transition:border-color 0.2s,transform 0.2s,box-shadow 0.2s;backdrop-filter:blur(16px);}
  .card:hover{border-color:rgba(150,200,255,0.22);transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.5);}
  .open-btn{background:rgba(20,50,120,0.25);border:1px solid rgba(100,160,255,0.18);border-radius:6px;
    color:#7ab4e8;font-family:'DM Mono',monospace;font-size:9px;padding:5px 11px;cursor:pointer;
    transition:all 0.15s;white-space:nowrap;}
  .open-btn:hover{border-color:#60a5fa;color:#bde0ff;background:rgba(30,70,160,0.35);}

  /* ══════════ KEYFRAMES ══════════ */
  @keyframes tw1{0%,100%{opacity:0.2;r:1}50%{opacity:1;r:2}}
  @keyframes tw2{0%,100%{opacity:0.3}50%{opacity:0.9}}
  @keyframes tw3{0%,100%{opacity:0.15}50%{opacity:0.7}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes panelIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}

  /* Halo rings */
  @keyframes haloSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes haloSpinRev{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
  @keyframes haloPulse{0%,100%{opacity:0.35;transform:scale(1)}50%{opacity:0.7;transform:scale(1.04)}}
  @keyframes logoGlow{
    0%,100%{filter:drop-shadow(0 0 18px rgba(255,255,255,0.55)) drop-shadow(0 0 50px rgba(200,230,255,0.25)) brightness(1.1)}
    50%    {filter:drop-shadow(0 0 32px rgba(255,255,255,0.9))  drop-shadow(0 0 90px rgba(210,235,255,0.45)) brightness(1.3)}
  }

  /* Floating particles */
  @keyframes float{
    0%  {opacity:0;transform:translateY(0) translateX(0)}
    15% {opacity:var(--op,0.6)}
    85% {opacity:calc(var(--op,0.6)*0.4)}
    100%{opacity:0;transform:translateY(-180px) translateX(var(--dx,10px))}
  }
  /* Ambient orb */
  @keyframes orbDrift{
    0%,100%{transform:translate(-50%,-50%) scale(1)}
    50%{transform:translate(-50%,-50%) scale(1.08)}
  }

  /* Button enter animation */
  @keyframes btnEnter{
    0%  {box-shadow:0 0 0 0 rgba(200,220,255,0.7);background:rgba(255,255,255,0.15)}
    30% {box-shadow:0 0 0 20px rgba(200,220,255,0.0);background:rgba(255,255,255,0.25)}
    60% {background:rgba(255,255,255,0.08)}
    100%{background:rgba(255,255,255,0.0);box-shadow:none}
  }
  @keyframes btnTextFade{
    0%{opacity:1;transform:scale(1)}
    40%{opacity:0;transform:scale(0.92)}
    100%{opacity:0}
  }
  @keyframes spinnerIn{
    0%{opacity:0;transform:scale(0.5)}
    100%{opacity:1;transform:scale(1)}
  }

  /* ── Heaven (post-login) static bg ── */
  .heaven-bg{position:fixed;inset:0;pointer-events:none;z-index:0;
    background:radial-gradient(ellipse 120% 50% at 50% -5%,rgba(60,100,255,0.08) 0%,transparent 65%),#05060f;}
  .heaven-orb1,.heaven-orb2,.heaven-orb3{display:none;}
  .heaven-rays{display:none;}
  .heaven-logo{width:110px;height:auto;}

  /* ══════════ LOGIN ══════════ */
  .lx-bg{
    position:fixed;inset:0;
    background:radial-gradient(ellipse 160% 120% at 38% 50%,#090d1f 0%,#05060f 60%);
    overflow:hidden;
  }
  /* Very subtle dot grid */
  .lx-bg::before{
    content:'';position:absolute;inset:0;
    background-image:radial-gradient(rgba(140,180,255,0.12) 1px,transparent 1px);
    background-size:32px 32px;
    mask-image:radial-gradient(ellipse 80% 80% at 38% 50%,black,transparent);
  }

  /* Ambient glow behind logo */
  .lx-glow{
    position:absolute;border-radius:50%;
    top:50%;left:38%;transform:translate(-50%,-50%);
    width:640px;height:640px;
    background:radial-gradient(circle,rgba(140,180,255,0.07) 0%,rgba(100,150,255,0.03) 40%,transparent 70%);
    filter:blur(40px);
    animation:orbDrift 12s ease-in-out infinite;
  }

  /* Right panel */
  .lx-panel{
    position:fixed;top:0;right:0;bottom:0;width:400px;
    display:flex;flex-direction:column;justify-content:center;
    padding:60px 52px;
    background:rgba(4,6,16,0.7);
    border-left:1px solid rgba(140,180,255,0.07);
    backdrop-filter:blur(32px) saturate(1.5);
    animation:panelIn 0.8s cubic-bezier(0.16,1,0.3,1) both;
    z-index:10;
  }
  .lx-panel::before{
    content:'';position:absolute;top:0;left:0;bottom:0;width:1px;
    background:linear-gradient(to bottom,
      transparent 0%,
      rgba(180,210,255,0.15) 25%,
      rgba(200,225,255,0.3) 50%,
      rgba(180,210,255,0.15) 75%,
      transparent 100%);
  }

  /* Inputs */
  .lx-label{
    font-family:'DM Mono',monospace;font-size:9px;font-weight:400;
    letter-spacing:0.18em;text-transform:uppercase;
    color:rgba(200,220,255,0.55);margin-bottom:9px;
  }
  .login-input{
    width:100%;background:rgba(255,255,255,0.04);
    border:1px solid rgba(180,210,255,0.12);
    border-radius:6px;padding:13px 16px;
    color:#ffffff;font-size:14px;font-weight:300;
    outline:none;font-family:'DM Sans',sans-serif;
    transition:border-color 0.25s,background 0.25s;
  }
  .login-input:focus{
    border-color:rgba(180,210,255,0.4);
    background:rgba(255,255,255,0.07);
  }
  .login-input::placeholder{color:rgba(255,255,255,0.18);}

  /* Enter God Mode button */
  .god-btn{
    position:relative;overflow:hidden;
    width:100%;padding:15px 20px;
    border-radius:7px;cursor:pointer;
    font-family:'DM Mono',monospace;font-size:11px;font-weight:500;
    letter-spacing:0.18em;text-transform:uppercase;
    color:#ffffff;
    background:rgba(255,255,255,0.07);
    border:1px solid rgba(200,220,255,0.25);
    transition:background 0.2s,border-color 0.2s,box-shadow 0.2s;
  }
  .god-btn:not(:disabled):hover{
    background:rgba(255,255,255,0.11);
    border-color:rgba(220,235,255,0.45);
    box-shadow:0 0 30px rgba(180,210,255,0.1);
  }
  .god-btn:disabled{opacity:0.35;cursor:not-allowed;}
  .god-btn.entering{animation:btnEnter 0.9s ease forwards;}
  /* Shimmer */
  .god-btn::after{
    content:'';position:absolute;top:0;left:-80%;width:50%;height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent);
    transform:skewX(-15deg);transition:left 0.5s;
  }
  .god-btn:not(:disabled):hover::after{left:140%;}
  .god-btn .btn-text{position:relative;z-index:2;display:flex;align-items:center;justify-content:center;gap:10px;}
  /* hide old bolt classes */
  .god-btn .bolt,.god-btn .bolt2,.god-btn .bolt3{display:none;}
  .god-btn .btn-icon{display:none;}

  /* Error */
  .lx-err{
    display:flex;align-items:center;gap:8px;
    padding:10px 14px;margin-bottom:14px;
    background:rgba(255,80,80,0.05);
    border:1px solid rgba(255,100,100,0.15);
    border-radius:6px;
  }
  .lx-err-dot{width:4px;height:4px;border-radius:50%;background:#f87171;flex-shrink:0;}
  .lx-err-text{font-size:11px;color:#fca5a5;font-family:'DM Mono',monospace;}

  /* Diviner glow & heaven */
  @keyframes divineGlow{
    0%,100%{filter:drop-shadow(0 0 8px rgba(180,220,255,0.4)) brightness(1.05)}
    50%{filter:drop-shadow(0 0 22px rgba(200,230,255,0.75)) brightness(1.2)}
  }
  @keyframes heavenPulse{0%,100%{opacity:0.5}50%{opacity:1}}
  @keyframes heavenDrift{0%,100%{transform:translateX(-50%)}50%{transform:translateX(-50%) translateY(10px)}}
  @keyframes aureoleSpin{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
  @keyframes aureoleSpinRev{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(-360deg)}}
`;

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Spark({data, color, actLast}) {
  if(!data||!data.length) return <div style={{height:48,display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(100,140,200,0.3)",fontSize:10,fontFamily:"'DM Mono',monospace"}}>no data</div>;
  const chartData = data.slice(0, (actLast??11)+1).map((v,i)=>({m:MONTHS_A[i], v:v||0}));
  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={chartData} margin={{top:4,right:0,bottom:0,left:0}}>
        <defs>
          <linearGradient id={"g"+color.replace("#","")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#g${color.replace("#","")})`} dot={false}/>
        <Tooltip
          contentStyle={{background:"#0c1420",border:"1px solid #1e2d45",borderRadius:6,fontSize:10,fontFamily:"'DM Mono',monospace",color:"#c0d8f0",padding:"4px 8px"}}
          formatter={v=>[fmt(v),"EBITDA"]} labelFormatter={l=>l}/>
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── KPI pill ──────────────────────────────────────────────────────────────────
function KPIPill({label, value, color, pct}) {
  return (
    <div style={{flex:1,minWidth:80}}>
      <div style={{fontSize:9,color:"rgba(160,200,255,0.55)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3}}>{label}</div>
      <div style={{fontSize:16,fontWeight:600,color:color||"#e2e8f0",fontFamily:"'DM Mono',monospace"}}>{value}</div>
      {pct!=null && <div style={{fontSize:9,color:pct>=0?"#4ade80":"#f87171",fontFamily:"'DM Mono',monospace",marginTop:1}}>{fmtPct(pct)}</div>}
    </div>
  );
}

// ── Client Card ───────────────────────────────────────────────────────────────
function ClientCard({client, snap}) {
  const revenue   = snap?.revenue   ? JSON.parse(snap.revenue)   : null;
  const ebitda    = snap?.ebitda    ? JSON.parse(snap.ebitda)    : null;
  const netProfit = snap?.net_profit? JSON.parse(snap.net_profit): null;
  const actLast   = snap?.act_last  ?? 11;
  const yr        = snap?.year      ?? new Date().getFullYear();

  const totRev = revenue   ? sum(revenue.slice(0,actLast+1))   : null;
  const totEBT = ebitda    ? sum(ebitda.slice(0,actLast+1))    : null;
  const totNet = netProfit ? sum(netProfit.slice(0,actLast+1)) : null;
  const ebitdaMgn = totRev&&totEBT ? (totEBT/totRev)*100 : null;

  const lastMon = snap?.last_month || null;
  const updatedAt = snap?.updated_at ? new Date(snap.updated_at) : null;
  const timeSince = updatedAt ? (() => {
    const diff = Math.floor((Date.now()-updatedAt.getTime())/60000);
    if(diff<60)   return diff+"min ago";
    if(diff<1440) return Math.floor(diff/60)+"h ago";
    return Math.floor(diff/1440)+"d ago";
  })() : null;

  return (
    <div className="card" style={{padding:"20px 22px",display:"flex",flexDirection:"column",gap:14}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:client.accent,flexShrink:0}}/>
            <div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{client.name}</div>
          </div>
          <div style={{fontSize:10,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",paddingLeft:16}}>
            {lastMon ? `Last data: ${lastMon} ${yr}` : "No data yet"}
            {timeSince && <span style={{color:"rgba(100,150,220,0.35)",marginLeft:8}}>{timeSince}</span>}
          </div>
        </div>
        <button className="open-btn" onClick={()=>window.open(client.url,"_blank")}>
          Open ↗
        </button>
      </div>

      {/* Sparkline */}
      <Spark data={ebitda} color={client.accent} actLast={actLast}/>

      {/* KPIs */}
      <div style={{display:"flex",gap:12,borderTop:"1px solid #0a1628",paddingTop:12}}>
        <KPIPill label="Revenue"  value={totRev!=null?fmt(totRev):"—"} color="#c0d8f0"/>
        <KPIPill label="EBITDA"   value={totEBT!=null?fmt(totEBT):"—"} color={client.accent} pct={ebitdaMgn}/>
        <KPIPill label="Net"      value={totNet!=null?fmt(totNet):"—"} color={totNet!=null?(totNet>=0?"#4ade80":"#f87171"):null}/>
      </div>
    </div>
  );
}

// ── MFA Screen ────────────────────────────────────────────────────────────────
function MfaScreen({onVerified}) {
  const [code, setCode]       = useState("");
  const [err,  setErr]        = useState(false);
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    if(loading||code.length<6) return;
    setLoading(true);
    try {
      const {data:factors} = await supabase.auth.mfa.listFactors();
      const totp = factors?.totp?.[0];
      if(!totp){ setErr(true); setLoading(false); return; }
      const {data:challenge} = await supabase.auth.mfa.challenge({factorId:totp.id});
      const {error} = await supabase.auth.mfa.verify({factorId:totp.id, challengeId:challenge.id, code:code.trim()});
      if(error){ setErr(true); setLoading(false); setTimeout(()=>setErr(false),1400); }
      else { setTimeout(()=>onVerified(), 500); }
    } catch(e){ setErr(true); setLoading(false); }
  };

  return (
    <div style={{minHeight:"100vh",background:"#080b12",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"rgba(8,14,28,0.95)",border:"1px solid #1e2d45",borderRadius:16,padding:"40px 36px",width:360,boxSizing:"border-box"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#1d4ed8,#0ea5e9)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:20}}>🔐</div>
          <div style={{fontSize:18,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>Two-factor auth</div>
          <div style={{fontSize:12,color:"#64748b"}}>Enter the 6-digit code from your authenticator</div>
        </div>
        <input value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,"").slice(0,6))}
          onKeyDown={e=>e.key==="Enter"&&verify()} placeholder="000000" maxLength={6}
          style={{width:"100%",background:"#0c1420",border:"1px solid "+(err?"#f87171":"rgba(100,140,200,0.3)"),
            borderRadius:10,padding:"14px 16px",color:"#e2e8f0",fontSize:22,outline:"none",
            fontFamily:"'DM Mono',monospace",letterSpacing:8,textAlign:"center",boxSizing:"border-box",marginBottom:14}}/>
        {err&&<div style={{color:"#f87171",fontSize:11,textAlign:"center",marginBottom:10,fontFamily:"'DM Mono',monospace"}}>Invalid code — try again</div>}
        <button onClick={verify} disabled={code.length<6||loading}
          style={{width:"100%",padding:"13px",borderRadius:10,
            background:code.length===6&&!loading?"linear-gradient(135deg,#1d4ed8,#0ea5e9)":"#0c1420",
            border:"1px solid "+(code.length===6&&!loading?"#3b82f6":"rgba(100,140,200,0.3)"),
            color:code.length===6&&!loading?"#fff":"#64748b",fontSize:13,fontWeight:600,cursor:code.length===6?"pointer":"not-allowed"}}>
          {loading?"Verifying…":"Verify"}
        </button>
      </div>
    </div>
  );
}

// ── MFA Enroll Screen ─────────────────────────────────────────────────────────
function MfaEnrollScreen({onDone}) {
  const [qr,       setQr]       = useState(null);
  const [secret,   setSecret]   = useState(null);
  const [factorId, setFactorId] = useState(null);
  const [code,     setCode]     = useState("");
  const [err,      setErr]      = useState(false);
  const [loading,  setLoading]  = useState(false);

  useEffect(()=>{
    (async()=>{
      const {data,error} = await supabase.auth.mfa.enroll({factorType:"totp",friendlyName:"Authenticator"});
      if(error||!data){ setErr(true); return; }
      setFactorId(data.id); setQr(data.totp.qr_code); setSecret(data.totp.secret);
    })();
  },[]);

  const verify = async () => {
    if(loading||code.length<6) return;
    setLoading(true);
    const {data:challenge} = await supabase.auth.mfa.challenge({factorId});
    const {error} = await supabase.auth.mfa.verify({factorId, challengeId:challenge.id, code:code.trim()});
    if(error){ setErr(true); setLoading(false); setTimeout(()=>setErr(false),1400); }
    else { setTimeout(()=>onDone(), 500); }
  };

  return (
    <div style={{minHeight:"100vh",background:"#080b12",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"rgba(8,14,28,0.95)",border:"1px solid #1e2d45",borderRadius:16,padding:"40px 36px",width:380,boxSizing:"border-box",textAlign:"center"}}>
        <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#1d4ed8,#0ea5e9)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:20}}>🔐</div>
        <div style={{fontSize:18,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>Set up two-factor auth</div>
        <div style={{fontSize:12,color:"#64748b",marginBottom:24}}>Scan this QR code with your authenticator app</div>
        {qr
          ? <img src={qr} alt="QR" style={{width:180,height:180,borderRadius:12,background:"#fff",padding:8,marginBottom:20}}/>
          : <div style={{width:180,height:180,background:"#0c1420",borderRadius:12,margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{color:"rgba(160,200,255,0.55)",fontSize:11,fontFamily:"'DM Mono',monospace"}}>{err?"Error":"Loading…"}</div>
            </div>
        }
        {secret&&(
          <div style={{marginBottom:20}}>
            <div style={{fontSize:10,color:"rgba(160,200,255,0.55)",fontFamily:"'DM Mono',monospace",marginBottom:6}}>Or enter manually:</div>
            <div style={{fontSize:12,color:"#93c5fd",fontFamily:"'DM Mono',monospace",letterSpacing:2,background:"#0c1420",padding:"8px 12px",borderRadius:8,border:"1px solid #1e2d45"}}>{secret}</div>
          </div>
        )}
        <div style={{fontSize:11,color:"#64748b",marginBottom:12}}>Enter the 6-digit code to confirm</div>
        <input value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,"").slice(0,6))}
          onKeyDown={e=>e.key==="Enter"&&verify()} placeholder="000000" maxLength={6}
          style={{width:"100%",background:"#0c1420",border:"1px solid "+(err?"#f87171":"rgba(100,140,200,0.3)"),borderRadius:10,
            padding:"14px 16px",color:"#e2e8f0",fontSize:22,outline:"none",fontFamily:"'DM Mono',monospace",
            letterSpacing:8,textAlign:"center",boxSizing:"border-box",marginBottom:14}}/>
        {err&&<div style={{color:"#f87171",fontSize:11,marginBottom:10,fontFamily:"'DM Mono',monospace"}}>Invalid code — try again</div>}
        <button onClick={verify} disabled={code.length<6||loading}
          style={{width:"100%",padding:"13px",borderRadius:10,
            background:code.length===6&&!loading?"linear-gradient(135deg,#1d4ed8,#0ea5e9)":"#0c1420",
            border:"1px solid "+(code.length===6&&!loading?"#3b82f6":"rgba(100,140,200,0.3)"),
            color:code.length===6&&!loading?"#fff":"#64748b",fontSize:13,fontWeight:600,cursor:code.length===6?"pointer":"not-allowed"}}>
          {loading?"Verifying…":"Activate & continue →"}
        </button>
      </div>
    </div>
  );
}

// ── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({onLogin}) {
  const [email, setEmail]     = useState("");
  const [pw,    setPw]        = useState("");
  const [err,   setErr]       = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setErr(""); setLoading(true);
    const {error} = await supabase.auth.signInWithPassword({email:email.trim(), password:pw});
    if(error){ setErr("Invalid credentials"); setLoading(false); return; }
    const {data:{session}} = await supabase.auth.getSession();
    const userEmail = session?.user?.email||"";
    if(!ALLOWED.includes(userEmail)){
      await supabase.auth.signOut();
      setErr("Access denied");
      setLoading(false); return;
    }
    setLoading(false);
    onLogin();
  };

  const [entering, setEntering] = useState(false);

  const handleLogin = async () => {
    setEntering(true);
    // short pause for animation then proceed
    await new Promise(r => setTimeout(r, 600));
    await login();
    setEntering(false);
  };

  // Particles
  const PARTICLES = Array.from({length:12},(_,i)=>({
    left: `${8 + i*7.5}%`,
    bottom: `${4 + (i%4)*6}%`,
    size: `${1 + (i%3)*0.8}px`,
    dur:  `${8 + (i%5)*2.5}s`,
    delay:`${(i*1.3)%7}s`,
    dx:   `${(i%2===0?1:-1)*(8+i%12)}px`,
    op:   0.3 + (i%4)*0.15,
  }));

  // Constellation nodes around logo
  const NODES = Array.from({length:8},(_,i)=>{
    const angle = (i/8)*Math.PI*2 - Math.PI/2;
    const r = 155;
    return {
      x: Math.cos(angle)*r,
      y: Math.sin(angle)*r,
      size: i%3===0 ? 3 : i%3===1 ? 2 : 1.5,
      delay: `${i*0.4}s`,
      dur: `${2.8+i*0.35}s`,
    };
  });
  // Constellation lines — connect some nodes
  const LINES = [[0,2],[2,4],[4,6],[6,0],[1,5],[3,7]];

  return (
    <div style={{minHeight:"100vh",position:"relative",background:"#05060f",overflow:"hidden"}}>

      {/* ── Background ── */}
      <div className="lx-bg"/>
      <div className="lx-glow"/>

      {/* ── Floating particles ── */}
      {PARTICLES.map((p,i)=>(
        <div key={i} style={{
          position:"fixed",bottom:p.bottom,left:p.left,
          width:p.size,height:p.size,borderRadius:"50%",
          background:"rgba(200,225,255,0.9)",
          boxShadow:"0 0 4px rgba(200,225,255,0.6)",
          "--dx":p.dx,"--op":p.op,
          animation:`float ${p.dur} ease-in-out infinite ${p.delay}`,
          pointerEvents:"none",zIndex:1,
        }}/>
      ))}

      {/* ── Centered logo + halo ── */}
      <div style={{
        position:"fixed",
        top:"50%",left:"38%",
        transform:"translate(-50%,-50%)",
        display:"flex",flexDirection:"column",alignItems:"center",
        pointerEvents:"none",zIndex:2,
        animation:"fadeIn 1.4s ease both 0.2s",
      }}>
        {/* Constellation */}
        <svg style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
          overflow:"visible",pointerEvents:"none",opacity:0.55}} width="400" height="400">
          {/* Lines between nodes */}
          {LINES.map(([a,b],i)=>(
            <line key={i}
              x1={200+NODES[a].x} y1={200+NODES[a].y}
              x2={200+NODES[b].x} y2={200+NODES[b].y}
              stroke="rgba(180,210,255,0.12)" strokeWidth="0.5"/>
          ))}
          {/* Outer faint circle */}
          <circle cx="200" cy="200" r="155" fill="none"
            stroke="rgba(180,210,255,0.06)" strokeWidth="1" strokeDasharray="2 8"/>
          <circle cx="200" cy="200" r="105" fill="none"
            stroke="rgba(180,210,255,0.04)" strokeWidth="1" strokeDasharray="1 12"/>
          {/* Nodes */}
          {NODES.map((n,i)=>(
            <g key={i}>
              <circle cx={200+n.x} cy={200+n.y} r={n.size+3}
                fill="rgba(160,200,255,0.04)"/>
              <circle cx={200+n.x} cy={200+n.y} r={n.size}
                fill="rgba(200,225,255,0.7)"
                style={{animation:`tw${(i%3)+1} ${n.dur} ease-in-out infinite ${n.delay}`}}/>
            </g>
          ))}
        </svg>
        {/* Soft bloom */}
        <div style={{
          position:"absolute",top:"50%",left:"50%",
          width:480,height:280,borderRadius:"50%",
          transform:"translate(-50%,-50%)",
          background:"radial-gradient(ellipse,rgba(200,220,255,0.09) 0%,transparent 70%)",
          filter:"blur(30px)",
          animation:"haloPulse 6s ease-in-out infinite",
        }}/>
        {/* Logo */}
        <img src={TF_LOGO} alt="Targetflow"
          style={{
            width:240,height:"auto",position:"relative",zIndex:3,
            animation:"logoGlow 5s ease-in-out infinite",
            display:"block",
          }}/>
      </div>

      {/* ── Right panel ── */}
      <div className="lx-panel">

        {/* Tag */}
        <div style={{
          fontFamily:"'DM Mono',monospace",fontSize:8,
          letterSpacing:"0.3em",color:"rgba(180,210,255,0.3)",
          textTransform:"uppercase",marginBottom:44,
        }}>
          Targetflow · Internal System
        </div>

        {/* Fields */}
        <div style={{display:"flex",flexDirection:"column",gap:22,marginBottom:12}}>
          <div>
            <div className="lx-label">Email</div>
            <input className="login-input" type="email" placeholder="name@domain.com"
              value={email} onChange={e=>setEmail(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleLogin()} autoComplete="email"/>
          </div>
          <div>
            <div className="lx-label">Password</div>
            <input className="login-input" type="password" placeholder="••••••••••••"
              value={pw} onChange={e=>setPw(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleLogin()} autoComplete="current-password"/>
          </div>
        </div>

        {err && (
          <div className="lx-err">
            <div className="lx-err-dot"/>
            <div className="lx-err-text">{err}</div>
          </div>
        )}

        {/* CTA */}
        <button
          className={`god-btn${entering?" entering":""}`}
          onClick={handleLogin}
          disabled={loading||!email||!pw}
          style={{marginTop:10,marginBottom:32}}
        >
          <div className="btn-text">
            {loading ? (
              <>
                <span style={{
                  width:11,height:11,flexShrink:0,
                  border:"1.5px solid rgba(255,255,255,0.2)",
                  borderTopColor:"rgba(255,255,255,0.8)",
                  borderRadius:"50%",display:"inline-block",
                  animation:"spin 0.7s linear infinite, spinnerIn 0.3s ease both",
                }}/>
                <span style={{color:"rgba(255,255,255,0.6)",fontSize:10}}>Authenticating…</span>
              </>
            ) : (
              <span style={{animation:entering?"btnTextFade 0.4s ease forwards":"none"}}>
                Enter God Mode
              </span>
            )}
          </div>
        </button>

        {/* Divider */}
        <div style={{
          height:1,marginBottom:24,
          background:"linear-gradient(90deg,transparent,rgba(180,210,255,0.1),transparent)",
        }}/>

        {/* MFA notice */}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{
            width:4,height:4,borderRadius:"50%",flexShrink:0,
            background:"rgba(160,200,255,0.5)",
            boxShadow:"0 0 6px rgba(160,200,255,0.4)",
          }}/>
          <div style={{
            fontFamily:"'DM Mono',monospace",fontSize:9,
            color:"rgba(160,200,255,0.35)",letterSpacing:"0.1em",
          }}>
            Two-factor authentication required
          </div>
        </div>

        {/* Bottom label */}
        <div style={{
          marginTop:"auto",paddingTop:48,
          fontFamily:"'DM Mono',monospace",fontSize:7,
          color:"rgba(140,170,220,0.2)",letterSpacing:"0.15em",
          lineHeight:1.9,
        }}>
          RESTRICTED ACCESS ONLY<br/>
          UNAUTHORISED USE PROHIBITED
        </div>
      </div>

    </div>
  );
}

// ── User registry ────────────────────────────────────────────────────────────
const USER_REGISTRY = [
  {name:"Niklas Isaksson",   email:"niklas.isaksson@targetflow.fi", role:"God Mode",     color:"#93c5fd"},
  {name:"Virpi Lämsa",       email:"virpi.lamsa@targetflow.fi",      role:"God Mode",     color:"#93c5fd"},
  {name:"Matias Soini",      email:"matias.soini@stremet.fi",        role:"Stremet",      color:"#818cf8"},
  {name:"Carl Axel Schauman",email:"acke@niittysiemen.fi",           role:"Niittysiemen", color:"#4ade80"},
  {name:"Kristina Luhtala",  email:"kristina@niittysiemen.fi",       role:"Niittysiemen", color:"#4ade80"},
  {name:"Teemu Sipilä",      email:"teemu.sipila@cuuma.com",         role:"Cuuma",        color:"#60a5fa"},
  {name:"Christine Leisti",  email:"christine@drop.fi",              role:"Drop Design",  color:"#38bdf8"},
  {name:"Kirsi Junnilainen", email:"kirsi.junnilainen@manutec.fi",   role:"Manutec",      color:"#38bdf8"},
  {name:"Meria Rahkola",     email:"merkku@1306.fi",                 role:"Strand",       color:"#60a5fa"},
  {name:"Jenni Kyönnös",     email:"jenni.kynnos@itsybitsy.fi",      role:"Strand",       color:"#60a5fa"},
  {name:"Sirena Kiviranta",  email:"sirena@strand.es",               role:"Strand",       color:"#60a5fa"},
  {name:"Anssi Kiviranta",   email:"anssi@kiviranta.fi",             role:"Strand",       color:"#60a5fa"},
  {name:"Lukas Paulikas",    email:"lukas.paulikas@accrease.com",    role:"Accrease",     color:"#86efac"},
  {name:"Richard Nilsen",    email:"richard.nilsen@tepcomp.fi",      role:"Tepcomp",      color:"#2dd4bf"},
  {name:"Masi Lehtisalo",    email:"masi.lehtisalo@tepcomp.fi",      role:"Tepcomp",      color:"#2dd4bf"},
];

// ── Main Dashboard ────────────────────────────────────────────────────────────
function SuperDashboard({userEmail, onSignOut}) {
  const [snaps,      setSnaps]      = useState({});
  const [loading,    setLoading]    = useState(true);
  const [lastRefresh,setLastRefresh]= useState(null);
  const [activity,   setActivity]   = useState([]);
  const [users,      setUsers]      = useState([]);
  const [userTab,    setUserTab]    = useState("overview");
  const [aiUsage,    setAiUsage]    = useState([]);
  const [comments,   setComments]   = useState([]);
  const [dash,       setDash]       = useState("portfolio"); // portfolio | health | users | activity | errors

  const load = useCallback(async () => {
    const [snapRes, userRes, errRes, aiRes, commRes] = await Promise.all([
      supabase.from("client_snapshots").select("*"),
      supabase.rpc("get_user_stats"),
      supabase.from("error_logs").select("*").order("created_at",{ascending:false}).limit(50),
      supabase.from("ai_usage").select("client,tokens,created_at").order("created_at",{ascending:false}).limit(200),
      supabase.from("comments").select("client,author,created_at").order("created_at",{ascending:false}).limit(200),
    ]);
    if(snapRes.data){
      const map = {};
      snapRes.data.forEach(r => { map[r.client] = r; });
      setSnaps(map);
      const acts = snapRes.data
        .filter(r=>r.updated_at && r.last_month)
        .sort((a,b)=>new Date(b.updated_at)-new Date(a.updated_at))
        .slice(0,10)
        .map(r=>({client:r.client,month:r.last_month,at:new Date(r.updated_at),type:"import"}));
      setActivity(acts);
    }
    if(userRes.data){
      setUsers(userRes.data.map(u=>({
        ...u,
        errors: errRes.data?.filter(e=>e.user_email===u.email)||[],
      })));
    }
    setAiUsage(aiRes.data||[]);
    setComments(commRes.data||[]);
    setLastRefresh(new Date());
    setLoading(false);
  },[]);

  useEffect(()=>{
    load();
    const iv = setInterval(load, 60000); // refresh every minute
    return ()=>clearInterval(iv);
  },[load]);

  const totalRevenue = CLIENTS.reduce((acc,c)=>{
    const snap = snaps[c.name];
    const rev = snap?.revenue ? sum(JSON.parse(snap.revenue).slice(0,(snap.act_last??11)+1)) : 0;
    return acc + rev;
  },0);

  const totalEBITDA = CLIENTS.reduce((acc,c)=>{
    const snap = snaps[c.name];
    const ebt = snap?.ebitda ? sum(JSON.parse(snap.ebitda).slice(0,(snap.act_last??11)+1)) : 0;
    return acc + ebt;
  },0);

  const clientsWithData = CLIENTS.filter(c=>snaps[c.name]?.last_month).length;

  return (
    <div style={{minHeight:"100vh",background:"transparent",position:"relative",zIndex:1,color:"#dde8ff"}}>
      {/* Heaven background */}
      <div className="heaven-bg"/>
      <div className="heaven-orb1"/>
      <div className="heaven-orb2"/>
      <div className="heaven-orb3"/>
      <div className="heaven-rays"/>

      {/* Top bar */}
      <div style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:"rgba(2,4,8,0.85)",
        backdropFilter:"blur(12px)",padding:"13px 32px",position:"sticky",top:0,zIndex:10,
        display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <img src={TF_LOGO} className="heaven-logo" alt="Targetflow"/>
          <div style={{width:1,height:18,background:"rgba(255,255,255,0.06)"}}/>
          <div style={{fontSize:11,fontFamily:"'Cinzel',serif",fontWeight:600,letterSpacing:"0.15em",
            color:"rgba(147,197,253,0.7)",textTransform:"uppercase"}}>God Mode</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          {lastRefresh && (
            <div style={{fontSize:10,color:"rgba(100,150,220,0.35)",fontFamily:"'DM Mono',monospace"}}>
              Refreshed {lastRefresh.toLocaleTimeString("fi-FI",{hour:"2-digit",minute:"2-digit"})}
            </div>
          )}
          <div style={{fontSize:11,color:"rgba(160,200,255,0.55)",fontFamily:"'DM Mono',monospace"}}>{userEmail.split("@")[0]}</div>
          <button onClick={onSignOut}
            style={{background:"none",border:"1px solid #1e2d45",borderRadius:7,color:"rgba(160,200,255,0.55)",
              fontFamily:"'DM Mono',monospace",fontSize:10,padding:"4px 10px",cursor:"pointer"}}>
            Sign out
          </button>
        </div>
      </div>

      {/* ── Top nav tabs ── */}
      <div style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:"rgba(2,4,8,0.8)",
        backdropFilter:"blur(8px)",padding:"0 32px",display:"flex",alignItems:"center",gap:0}}>
        {[
          ["portfolio","Portfolio"],
          ["health","Health Scores"],
          ["users","Users & Access"],
          ["activity","Activity"],
          ["errors","Error Log"],
        ].map(([id,label])=>(
          <button key={id} onClick={()=>setDash(id)} style={{
            background:"none",border:"none",
            borderBottom:`2px solid ${dash===id?"#60a5fa":"transparent"}`,
            color:dash===id?"#93c5fd":"rgba(160,200,255,0.4)",
            fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",
            textTransform:"uppercase",padding:"12px 16px",cursor:"pointer",
            transition:"all 0.15s",whiteSpace:"nowrap",
          }}>{label}</button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:20}}>
          {lastRefresh && <div style={{fontSize:9,color:"rgba(100,140,200,0.3)",fontFamily:"'DM Mono',monospace"}}>
            ↻ {lastRefresh.toLocaleTimeString("fi-FI",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
          </div>}
          <button onClick={load} style={{background:"none",border:"1px solid rgba(100,160,255,0.12)",
            borderRadius:5,color:"rgba(100,160,255,0.4)",fontFamily:"'DM Mono',monospace",
            fontSize:9,padding:"4px 10px",cursor:"pointer",letterSpacing:"0.08em"}}>Refresh</button>
        </div>
      </div>

      <div style={{padding:"24px 32px 48px",position:"relative",zIndex:1}}>

      {/* ════════════════════════════
          PORTFOLIO TAB
      ════════════════════════════ */}
      {dash==="portfolio" && (<>

        {/* KPI strip */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
          {[
            {label:"Portfolio Revenue",   val:fmt(totalRevenue),      sub:"ACT YTD",         color:"#c0d8f0"},
            {label:"Portfolio EBITDA",    val:fmt(totalEBITDA),       sub:"ACT YTD",         color:"#2dd4bf"},
            {label:"EBITDA Margin",       val:totalRevenue>0?fmtPct(totalEBITDA/totalRevenue*100):"—", sub:"blended", color:totalEBITDA>=0?"#4ade80":"#f87171"},
            {label:"Clients with Data",   val:`${clientsWithData}/${CLIENTS.length}`, sub:"have uploaded ACT", color:"#60a5fa"},
          ].map((k,i)=>(
            <div key={i} style={{background:"rgba(6,10,24,0.7)",border:"1px solid rgba(100,150,255,0.08)",
              borderRadius:10,padding:"16px 20px",backdropFilter:"blur(12px)"}}>
              <div style={{fontSize:9,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",
                textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6}}>{k.label}</div>
              <div style={{fontSize:22,fontWeight:600,color:k.color,fontFamily:"'DM Mono',monospace",lineHeight:1}}>{k.val}</div>
              <div style={{fontSize:9,color:"rgba(100,140,200,0.35)",marginTop:4}}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Client grid */}
        {loading ? (
          <div style={{textAlign:"center",color:"rgba(140,180,255,0.4)",fontFamily:"'DM Mono',monospace",
            fontSize:11,paddingTop:60}}>Loading…</div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14}}>
            {CLIENTS.map(c=><ClientCard key={c.name} client={c} snap={snaps[c.name]||null}/>)}
          </div>
        )}
      </>)}

      {/* ════════════════════════════
          HEALTH SCORES TAB
      ════════════════════════════ */}
      {dash==="health" && (() => {
        // Compute health score per client: 0-100
        const scored = CLIENTS.map(c=>{
          const snap = snaps[c.name];
          const hasData   = snap?.last_month ? 25 : 0;
          const daysAgo   = snap?.updated_at ? Math.floor((Date.now()-new Date(snap.updated_at))/86400000) : 999;
          const freshness = daysAgo<=7?25:daysAgo<=30?15:daysAgo<=90?5:0;
          const clientUsers = USER_REGISTRY.filter(u=>u.role===c.name||u.role==="God Mode");
          const usersData = clientUsers.map(u=>users.find(x=>x.email===u.email)).filter(Boolean);
          const mfaScore  = usersData.length>0 ? Math.round((usersData.filter(u=>u.mfa_enabled).length/usersData.length)*25) : 0;
          const hasLogin  = usersData.some(u=>u.last_sign_in_at) ? 15 : 0;
          const aiTokens  = aiUsage.filter(a=>a.client===c.name).reduce((s,a)=>s+(a.tokens||0),0);
          const aiScore   = aiTokens>5000?10:aiTokens>1000?6:aiTokens>0?3:0;
          const score     = hasData+freshness+mfaScore+hasLogin+aiScore;
          return {c, score, hasData:!!snap?.last_month, daysAgo, mfaScore, aiTokens, usersData};
        }).sort((a,b)=>b.score-a.score);
        return (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <div style={{display:"grid",gridTemplateColumns:"200px 1fr 80px 80px 80px 80px 80px",
              gap:8,padding:"6px 16px",fontSize:8,color:"rgba(120,160,220,0.4)",
              fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.1em"}}>
              <div>Client</div><div>Health Score</div>
              <div>Data</div><div>Freshness</div><div>MFA</div><div>Login</div><div>AI Usage</div>
            </div>
            {scored.map(({c,score,hasData,daysAgo,mfaScore,aiTokens,usersData})=>{
              const col = score>=70?"#4ade80":score>=45?"#facc15":"#f87171";
              const freshCol = daysAgo<=7?"#4ade80":daysAgo<=30?"#facc15":daysAgo<=90?"#fb923c":"#f87171";
              const freshLabel = daysAgo===0?"Today":daysAgo<=1?"1d":daysAgo<=7?daysAgo+"d":daysAgo<=30?Math.floor(daysAgo/7)+"w":daysAgo<999?Math.floor(daysAgo/30)+"mo":"—";
              return (
                <div key={c.name} style={{display:"grid",gridTemplateColumns:"200px 1fr 80px 80px 80px 80px 80px",
                  gap:8,padding:"12px 16px",alignItems:"center",
                  background:"rgba(6,10,24,0.6)",border:`1px solid ${col}14`,
                  borderRadius:8,backdropFilter:"blur(8px)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:c.accent,flexShrink:0}}/>
                    <span style={{fontSize:12,color:"#d0e8ff",fontWeight:500}}>{c.name}</span>
                  </div>
                  {/* Bar */}
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{flex:1,height:5,background:"rgba(255,255,255,0.05)",borderRadius:3}}>
                      <div style={{height:"100%",width:`${score}%`,background:`linear-gradient(90deg,${col}88,${col})`,
                        borderRadius:3,transition:"width 0.6s"}}/>
                    </div>
                    <span style={{fontSize:13,fontWeight:700,color:col,fontFamily:"'DM Mono',monospace",
                      minWidth:28,textAlign:"right"}}>{score}</span>
                  </div>
                  {/* Data */}
                  <div style={{textAlign:"center"}}>
                    <span style={{fontSize:10,color:hasData?"#4ade80":"#f87171",fontFamily:"'DM Mono',monospace"}}>
                      {hasData?"✓":"✗"}
                    </span>
                  </div>
                  {/* Freshness */}
                  <div style={{textAlign:"center",fontSize:10,color:freshCol,fontFamily:"'DM Mono',monospace"}}>{freshLabel}</div>
                  {/* MFA */}
                  <div style={{textAlign:"center",fontSize:10,color:mfaScore>=25?"#4ade80":mfaScore>0?"#facc15":"#f87171",fontFamily:"'DM Mono',monospace"}}>
                    {usersData.length>0?`${usersData.filter(u=>u.mfa_enabled).length}/${usersData.length}`:"—"}
                  </div>
                  {/* Login */}
                  <div style={{textAlign:"center",fontSize:10,fontFamily:"'DM Mono',monospace",
                    color:usersData.some(u=>u.last_sign_in_at)?"#4ade80":"rgba(200,100,100,0.7)"}}>
                    {usersData.some(u=>u.last_sign_in_at)?"✓":"✗"}
                  </div>
                  {/* AI */}
                  <div style={{textAlign:"center",fontSize:10,color:"rgba(160,200,255,0.6)",fontFamily:"'DM Mono',monospace"}}>
                    {aiTokens>0?aiTokens.toLocaleString():"—"}
                  </div>
                </div>
              );
            })}
            <div style={{marginTop:12,padding:"10px 16px",background:"rgba(6,10,24,0.5)",
              border:"1px solid rgba(100,150,255,0.06)",borderRadius:8,
              fontSize:9,color:"rgba(120,160,220,0.4)",fontFamily:"'DM Mono',monospace",lineHeight:1.8}}>
              Score breakdown: Data uploaded (25pt) · Freshness 0-7d (25pt) / 8-30d (15pt) / 31-90d (5pt) · MFA compliance (25pt) · Has logged in (15pt) · AI usage (10pt)
            </div>
          </div>
        );
      })()}

      {/* ════════════════════════════
          USERS & ACCESS TAB
      ════════════════════════════ */}
      {dash==="users" && (<>
        {/* MFA compliance banner */}
        {(() => {
          const total = users.length;
          const mfaOn = users.filter(u=>u.mfa_enabled).length;
          const neverIn = users.filter(u=>!u.last_sign_in_at).length;
          const pct = total>0?Math.round(mfaOn/total*100):0;
          return (
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
              {[
                {label:"MFA Compliant",    val:`${mfaOn}/${total}`, sub:`${pct}% enforced`, color:pct===100?"#4ade80":pct>=70?"#facc15":"#f87171"},
                {label:"Never Logged In",  val:neverIn,             sub:"accounts dormant", color:neverIn>0?"#f59e0b":"#4ade80"},
                {label:"Inactive (>30d)",  val:users.filter(u=>u.last_sign_in_at&&(Date.now()-new Date(u.last_sign_in_at))/86400000>30).length, sub:"last login >30 days", color:"#fb923c"},
                {label:"Active Today",     val:users.filter(u=>u.last_sign_in_at&&(Date.now()-new Date(u.last_sign_in_at))/86400000<1).length,  sub:"signed in today",   color:"#4ade80"},
              ].map((k,i)=>(
                <div key={i} style={{background:"rgba(6,10,24,0.7)",border:`1px solid ${k.color}18`,
                  borderRadius:10,padding:"14px 18px",backdropFilter:"blur(12px)"}}>
                  <div style={{fontSize:9,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",
                    textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6}}>{k.label}</div>
                  <div style={{fontSize:24,fontWeight:700,color:k.color,fontFamily:"'DM Mono',monospace",lineHeight:1}}>{k.val}</div>
                  <div style={{fontSize:9,color:"rgba(100,140,200,0.35)",marginTop:4}}>{k.sub}</div>
                </div>
              ))}
            </div>
          );
        })()}
        {/* User table */}
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 110px 70px 90px 90px 110px 130px",
            gap:8,padding:"6px 16px",fontSize:8,color:"rgba(120,160,220,0.4)",
            fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.1em"}}>
            <div>Name</div><div>Email</div><div>Client</div>
            <div>Sessions</div><div>MFA</div><div>Status</div><div>Registered</div><div>Last Login</div>
          </div>
          {USER_REGISTRY.map(reg=>{
            const live = users.find(u=>u.email===reg.email);
            const lastLogin  = live?.last_sign_in_at ? new Date(live.last_sign_in_at) : null;
            const registered = live?.created_at      ? new Date(live.created_at)      : null;
            const sessions   = live?.sign_in_count??0;
            const mfa        = live?.mfa_enabled??false;
            const confirmed  = live?.email_confirmed_at!=null;
            const daysSince  = lastLogin?Math.floor((Date.now()-lastLogin)/86400000):null;
            const stale      = daysSince!==null&&daysSince>30;
            const statusColor= !confirmed?"#f87171":!lastLogin?"#f59e0b":stale?"#fb923c":"#4ade80";
            const statusLabel= !confirmed?"Unconfirmed":!lastLogin?"Never":stale?"Inactive":"Active";
            const agoStr     = !lastLogin?"—":daysSince===0?"Today":daysSince===1?"Yesterday":daysSince<7?daysSince+"d ago":daysSince<30?Math.floor(daysSince/7)+"w ago":Math.floor(daysSince/30)+"mo ago";
            return (
              <div key={reg.email} style={{display:"grid",gridTemplateColumns:"1fr 1fr 110px 70px 90px 90px 110px 130px",
                gap:8,padding:"10px 16px",
                background:!lastLogin?"rgba(245,158,11,0.03)":stale?"rgba(251,146,60,0.02)":"rgba(6,10,24,0.55)",
                border:`1px solid ${!lastLogin?"rgba(245,158,11,0.1)":stale?"rgba(251,146,60,0.07)":"rgba(100,150,255,0.05)"}`,
                borderRadius:8,alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,minWidth:0}}>
                  <div style={{width:24,height:24,borderRadius:"50%",flexShrink:0,
                    background:`${reg.color}16`,border:`1px solid ${reg.color}28`,
                    display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontSize:9,fontWeight:700,color:reg.color}}>{reg.name.charAt(0)}</span>
                  </div>
                  <span style={{fontSize:12,color:"#d0e8ff",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{reg.name}</span>
                </div>
                <div style={{fontSize:10,color:"rgba(160,200,255,0.45)",fontFamily:"'DM Mono',monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{reg.email}</div>
                <div style={{fontSize:9,color:reg.color,fontFamily:"'DM Mono',monospace",
                  background:`${reg.color}10`,border:`1px solid ${reg.color}20`,
                  borderRadius:4,padding:"2px 6px",textAlign:"center",overflow:"hidden",textOverflow:"ellipsis"}}>{reg.role}</div>
                <div style={{fontSize:12,color:sessions>0?"#93c5fd":"rgba(100,140,200,0.3)",fontFamily:"'DM Mono',monospace",textAlign:"center"}}>{live?sessions:"—"}</div>
                <div style={{textAlign:"center"}}>
                  {live?<span style={{fontSize:9,fontFamily:"'DM Mono',monospace",padding:"2px 7px",borderRadius:4,
                    background:mfa?"rgba(74,222,128,0.08)":"rgba(248,113,113,0.08)",
                    border:`1px solid ${mfa?"rgba(74,222,128,0.2)":"rgba(248,113,113,0.2)"}`,
                    color:mfa?"#4ade80":"#f87171"}}>{mfa?"✓ ON":"✗ OFF"}</span>
                  :<span style={{color:"rgba(100,140,200,0.3)",fontSize:10}}>—</span>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:statusColor,boxShadow:`0 0 4px ${statusColor}88`,flexShrink:0}}/>
                  <span style={{fontSize:9,color:statusColor,fontFamily:"'DM Mono',monospace"}}>{statusLabel}</span>
                </div>
                <div style={{fontSize:9,color:"rgba(140,180,255,0.4)",fontFamily:"'DM Mono',monospace"}}>
                  {registered?registered.toLocaleDateString("fi-FI",{day:"2-digit",month:"2-digit",year:"2-digit"}):"—"}
                </div>
                <div style={{fontSize:11,color:!lastLogin?"#f59e0b":stale?"#fb923c":"#c0d8f0",fontFamily:"'DM Mono',monospace"}}>{agoStr}</div>
              </div>
            );
          })}
        </div>
      </>)}

      {/* ════════════════════════════
          ACTIVITY TAB
      ════════════════════════════ */}
      {dash==="activity" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {/* Data imports */}
          <div style={{background:"rgba(6,10,24,0.7)",border:"1px solid rgba(100,150,255,0.07)",
            borderRadius:12,padding:"20px 24px",backdropFilter:"blur(12px)"}}>
            <div style={{fontSize:9,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",
              letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:16}}>Data Imports</div>
            {activity.length===0?(
              <div style={{fontSize:11,color:"rgba(100,150,220,0.3)",textAlign:"center",paddingTop:24}}>No imports yet</div>
            ):activity.map((a,i)=>{
              const cl = CLIENTS.find(c=>c.name===a.client);
              const color = cl?.accent||"#64748b";
              const diff=(Date.now()-a.at)/1000;
              const ago=diff<60?"just now":diff<3600?Math.floor(diff/60)+"min ago":diff<86400?Math.floor(diff/3600)+"h ago":Math.floor(diff/86400)+"d ago";
              return (
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,
                  padding:"8px 10px",background:"rgba(8,14,35,0.5)",borderRadius:7}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:color,flexShrink:0,boxShadow:`0 0 5px ${color}88`}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,color:"#d0e8ff"}}><span style={{color,fontWeight:600}}>{a.client}</span>
                      <span style={{color:"rgba(160,200,255,0.45)"}}> → {a.month}</span></div>
                    <div style={{fontSize:9,color:"rgba(120,160,220,0.4)",fontFamily:"'DM Mono',monospace",marginTop:1}}>
                      {a.at.toLocaleString("fi-FI",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})} · {ago}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comments activity */}
          <div style={{background:"rgba(6,10,24,0.7)",border:"1px solid rgba(100,150,255,0.07)",
            borderRadius:12,padding:"20px 24px",backdropFilter:"blur(12px)"}}>
            <div style={{fontSize:9,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",
              letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:16}}>
              Comment Activity <span style={{color:"rgba(100,140,200,0.3)",marginLeft:6}}>{comments.length} total</span>
            </div>
            {comments.length===0?(
              <div style={{fontSize:11,color:"rgba(100,150,220,0.3)",textAlign:"center",paddingTop:24}}>No comments yet</div>
            ):comments.slice(0,10).map((cm,i)=>{
              const cl = CLIENTS.find(c=>c.name===cm.client);
              const color = cl?.accent||"#64748b";
              const diff=(Date.now()-new Date(cm.created_at))/1000;
              const ago=diff<60?"just now":diff<3600?Math.floor(diff/60)+"min ago":diff<86400?Math.floor(diff/3600)+"h ago":Math.floor(diff/86400)+"d ago";
              return (
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:8,
                  padding:"8px 10px",background:"rgba(8,14,35,0.5)",borderRadius:7}}>
                  <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,marginTop:1,
                    background:`${color}18`,border:`1px solid ${color}28`,
                    display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontSize:8,fontWeight:700,color}}>{(cm.author||"?").charAt(0)}</span>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,color:"#c0d8f0"}}><span style={{color,fontWeight:500}}>{cm.client}</span></div>
                    <div style={{fontSize:9,color:"rgba(120,160,220,0.35)",fontFamily:"'DM Mono',monospace",marginTop:1}}>
                      {cm.author||"unknown"} · {ago}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI usage breakdown */}
          <div style={{background:"rgba(6,10,24,0.7)",border:"1px solid rgba(100,150,255,0.07)",
            borderRadius:12,padding:"20px 24px",backdropFilter:"blur(12px)"}}>
            <div style={{fontSize:9,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",
              letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:16}}>AI Usage (EBITDA-9000)</div>
            {aiUsage.length===0?(
              <div style={{fontSize:11,color:"rgba(100,150,220,0.3)",textAlign:"center",paddingTop:24}}>No AI usage recorded</div>
            ):(()=>{
              const byClient = CLIENTS.map(c=>({
                name:c.name,accent:c.accent,
                tokens:aiUsage.filter(a=>a.client===c.name).reduce((s,a)=>s+(a.tokens||0),0),
                calls:aiUsage.filter(a=>a.client===c.name).length,
              })).filter(c=>c.tokens>0).sort((a,b)=>b.tokens-a.tokens);
              const maxTok = Math.max(...byClient.map(c=>c.tokens),1);
              return byClient.map((c,i)=>(
                <div key={i} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:11,color:"#c0d8f0"}}>{c.name}</span>
                    <span style={{fontSize:10,color:"rgba(160,200,255,0.5)",fontFamily:"'DM Mono',monospace"}}>
                      {c.tokens.toLocaleString()} tok · {c.calls} calls</span>
                  </div>
                  <div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:2}}>
                    <div style={{height:"100%",width:`${(c.tokens/maxTok)*100}%`,
                      background:`linear-gradient(90deg,${c.accent}88,${c.accent})`,borderRadius:2}}/>
                  </div>
                </div>
              ));
            })()}
          </div>

          {/* Login frequency heatmap-style */}
          <div style={{background:"rgba(6,10,24,0.7)",border:"1px solid rgba(100,150,255,0.07)",
            borderRadius:12,padding:"20px 24px",backdropFilter:"blur(12px)"}}>
            <div style={{fontSize:9,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",
              letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:16}}>Login Frequency</div>
            {[...users].sort((a,b)=>(b.sign_in_count||0)-(a.sign_in_count||0)).slice(0,8).map((u,i)=>{
              const reg=USER_REGISTRY.find(r=>r.email===u.email);
              const color=reg?.color||"#64748b";
              const max=Math.max(...users.map(x=>x.sign_in_count||0),1);
              const pct=Math.round(((u.sign_in_count||0)/max)*100);
              const lastLogin=u.last_sign_in_at?new Date(u.last_sign_in_at):null;
              const days=lastLogin?Math.floor((Date.now()-lastLogin)/86400000):null;
              return (
                <div key={u.email} style={{display:"flex",alignItems:"center",gap:8,marginBottom:9}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:`${color}18`,
                    border:`1px solid ${color}25`,display:"flex",alignItems:"center",
                    justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:7,fontWeight:700,color}}>{(reg?.name||u.email).charAt(0)}</span>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <span style={{fontSize:11,color:"#c0d8f0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{reg?.name||u.email.split("@")[0]}</span>
                      <span style={{fontSize:9,color:"rgba(160,200,255,0.4)",fontFamily:"'DM Mono',monospace",flexShrink:0,marginLeft:6}}>
                        {u.sign_in_count||0}× · {days===null?"never":days===0?"today":days+"d ago"}
                      </span>
                    </div>
                    <div style={{height:3,background:"rgba(255,255,255,0.05)",borderRadius:2}}>
                      <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${color}88,${color})`,borderRadius:2}}/>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ════════════════════════════
          ERROR LOG TAB
      ════════════════════════════ */}
      {dash==="errors" && (
        <div style={{background:"rgba(6,10,24,0.7)",border:"1px solid rgba(100,150,255,0.07)",
          borderRadius:12,padding:"20px 24px",backdropFilter:"blur(12px)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{fontSize:9,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",
              letterSpacing:"0.15em",textTransform:"uppercase"}}>Error Log</div>
            <div style={{fontSize:9,color:"rgba(100,140,200,0.4)",fontFamily:"'DM Mono',monospace"}}>last 50 events</div>
          </div>
          {users.flatMap(u=>u.errors||[]).length===0?(
            <div style={{textAlign:"center",padding:"40px 0"}}>
              <div style={{fontSize:28,marginBottom:8}}>✓</div>
              <div style={{fontSize:12,color:"#4ade80",fontFamily:"'DM Mono',monospace"}}>No errors recorded</div>
              <div style={{fontSize:10,color:"rgba(100,150,220,0.3)",marginTop:6}}>Client dashboard errors will appear here once error_logs is set up</div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {users.flatMap(u=>(u.errors||[]).map(e=>({...e,userName:USER_REGISTRY.find(r=>r.email===u.email)?.name||u.email})))
                .sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))
                .map((e,i)=>(
                  <div key={i} style={{padding:"10px 14px",background:"rgba(248,113,113,0.03)",
                    border:"1px solid rgba(248,113,113,0.1)",borderRadius:7,
                    display:"flex",alignItems:"flex-start",gap:10}}>
                    <div style={{width:5,height:5,borderRadius:"50%",background:"#f87171",
                      marginTop:4,flexShrink:0,boxShadow:"0 0 4px #f8717188"}}/>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:8,marginBottom:3,alignItems:"center"}}>
                        <span style={{fontSize:11,color:"#fca5a5",fontWeight:600}}>{e.error_type||"Error"}</span>
                        <span style={{fontSize:9,color:"rgba(160,140,180,0.5)",fontFamily:"'DM Mono',monospace"}}>{e.client}</span>
                        <span style={{fontSize:9,color:"rgba(140,160,200,0.35)",fontFamily:"'DM Mono',monospace",marginLeft:"auto"}}>
                          {new Date(e.created_at).toLocaleString("fi-FI",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}
                        </span>
                      </div>
                      <div style={{fontSize:11,color:"rgba(200,180,200,0.65)"}}>{e.error_message}</div>
                      <div style={{fontSize:9,color:"rgba(140,160,200,0.35)",fontFamily:"'DM Mono',monospace",marginTop:2}}>
                        {e.userName} · {e.user_email}</div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Session footer */}
      <div style={{marginTop:24,padding:"10px 16px",background:"rgba(6,10,24,0.55)",
        border:"1px solid rgba(74,222,128,0.1)",borderRadius:9,backdropFilter:"blur(8px)",
        display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 6px #4ade8088"}}/>
        <span style={{fontSize:11,color:"#c0d8f0",fontFamily:"'DM Mono',monospace"}}>{userEmail}</span>
        <span style={{fontSize:9,color:"#4ade80",fontFamily:"'DM Mono',monospace",
          background:"rgba(74,222,128,0.07)",border:"1px solid rgba(74,222,128,0.14)",
          borderRadius:4,padding:"2px 7px"}}>ONLINE · GOD MODE</span>
        {lastRefresh&&<span style={{marginLeft:"auto",fontSize:9,color:"rgba(100,140,200,0.3)",
          fontFamily:"'DM Mono',monospace"}}>
          Updated {lastRefresh.toLocaleTimeString("fi-FI",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
        </span>}
      </div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [stage,     setStage]     = useState("checking");
  const [userEmail, setUserEmail] = useState(null);

  const goIn = useCallback(async () => {
    try {
      const {data:{session}} = await supabase.auth.getSession();
      if(!session){ setStage("login"); return; }
      const email = session.user?.email||"";
      if(!ALLOWED.includes(email)){
        await supabase.auth.signOut();
        setStage("login"); return;
      }
      const {data:factors} = await supabase.auth.mfa.listFactors().catch(()=>({data:null}));
      const hasTotp = factors?.totp?.length > 0;
      if(!hasTotp){ setStage("enroll"); return; }
      const {data:aal} = await supabase.auth.mfa.getAuthenticatorAssuranceLevel().catch(()=>({data:null}));
      if(aal?.nextLevel==="aal2" && aal?.currentLevel!=="aal2"){ setStage("mfa"); return; }
      setUserEmail(email);
      setStage("done");
    } catch(e){ setStage("login"); }
  },[]);

  useEffect(()=>{ goIn(); },[goIn]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setStage("login"); setUserEmail(null);
  };

  return (
    <>
      <style>{STYLE}</style>
      {stage==="checking" && (
        <div style={{minHeight:"100vh",background:"#080b12",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{color:"rgba(100,150,220,0.35)",fontFamily:"'DM Mono',monospace",fontSize:11}}>Initialising…</div>
        </div>
      )}
      {stage==="login"   && <LoginScreen  onLogin={goIn}/>}
      {stage==="enroll"  && <MfaEnrollScreen onDone={goIn}/>}
      {stage==="mfa"     && <MfaScreen onVerified={goIn}/>}
      {stage==="done"    && <SuperDashboard userEmail={userEmail} onSignOut={signOut}/>}
    </>
  );
}
