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
  { name:"Drop Design Pool", accent:"#38bdf8", url:"https://droppool-dashboard.vercel.app"    },
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
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,300&family=Syne:wght@400;500;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#03050a;color:#c8d8f0;font-family:'Space Grotesk',sans-serif;}
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-track{background:#03050a;}
  ::-webkit-scrollbar-thumb{background:rgba(0,200,120,0.25);border-radius:2px;}

  /* ─── Dashboard card (post-login) ─── */
  .card{background:rgba(6,10,22,0.8);border:1px solid rgba(0,180,100,0.1);border-radius:4px;
    transition:border-color 0.2s,transform 0.2s,box-shadow 0.2s;backdrop-filter:blur(16px);}
  .card:hover{border-color:rgba(0,220,130,0.25);transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.6);}
  .open-btn{background:rgba(0,180,100,0.08);border:1px solid rgba(0,180,100,0.2);border-radius:2px;
    color:#00c878;font-family:'JetBrains Mono',monospace;font-size:9px;padding:4px 10px;cursor:pointer;
    transition:all 0.15s;white-space:nowrap;letter-spacing:0.08em;}
  .open-btn:hover{border-color:#00c878;color:#00ff9d;background:rgba(0,180,100,0.14);}

  /* ═══════════════════════════════════
     LOGIN SCENE
  ═══════════════════════════════════ */
  .lx-root{
    position:fixed;inset:0;display:flex;
    background:#03050a;overflow:hidden;
    font-family:'JetBrains Mono',monospace;
  }

  /* Scanlines overlay */
  .lx-root::before{
    content:'';position:fixed;inset:0;pointer-events:none;z-index:100;
    background:repeating-linear-gradient(
      0deg,transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 4px
    );
  }

  /* Fine grid */
  .lx-grid{
    position:fixed;inset:0;pointer-events:none;z-index:0;
    background-image:
      linear-gradient(rgba(0,200,100,0.028) 1px,transparent 1px),
      linear-gradient(90deg,rgba(0,200,100,0.028) 1px,transparent 1px);
    background-size:40px 40px;
  }

  /* Diagonal accent line */
  .lx-diag{
    position:fixed;top:0;left:0;width:100%;height:100%;
    pointer-events:none;z-index:0;overflow:hidden;
  }
  .lx-diag::before{
    content:'';position:absolute;
    top:-20%;left:42%;
    width:1px;height:140%;
    background:linear-gradient(to bottom,transparent 0%,rgba(0,200,100,0.15) 30%,rgba(0,220,120,0.3) 50%,rgba(0,200,100,0.15) 70%,transparent 100%);
    transform:rotate(8deg);
  }
  .lx-diag::after{
    content:'';position:absolute;
    top:-20%;left:44%;
    width:1px;height:140%;
    background:linear-gradient(to bottom,transparent 0%,rgba(0,200,100,0.06) 40%,rgba(0,200,100,0.1) 50%,transparent 100%);
    transform:rotate(8deg);
  }

  /* ── LEFT PANEL ── */
  .lx-left{
    flex:1;display:flex;flex-direction:column;justify-content:space-between;
    padding:48px 56px;position:relative;z-index:2;
    border-right:1px solid rgba(0,200,100,0.07);
  }

  .lx-logo{width:180px;height:auto;filter:brightness(1.1);}

  .lx-headline{
    font-family:'Syne',sans-serif;
    font-size:clamp(44px,5.5vw,72px);
    font-weight:800;
    line-height:0.95;
    letter-spacing:-0.03em;
    color:#ffffff;
  }
  .lx-headline em{
    font-style:normal;
    color:transparent;
    -webkit-text-stroke:1px rgba(0,220,120,0.7);
  }

  .lx-sub{
    font-size:11px;color:rgba(0,200,100,0.6);
    letter-spacing:0.25em;text-transform:uppercase;
    margin-top:20px;line-height:1.8;
  }

  /* Status readouts */
  .lx-status-grid{
    display:grid;grid-template-columns:1fr 1fr;gap:1px;
    border:1px solid rgba(0,200,100,0.1);
    background:rgba(0,200,100,0.06);
    margin-top:0;
  }
  .lx-status-cell{
    background:#03050a;padding:16px 18px;
  }
  .lx-status-label{
    font-size:8px;letter-spacing:0.2em;text-transform:uppercase;
    color:rgba(0,200,100,0.45);margin-bottom:6px;
  }
  .lx-status-val{
    font-size:22px;font-weight:700;color:#ffffff;font-family:'Syne',sans-serif;
    letter-spacing:-0.02em;line-height:1;
  }
  .lx-status-val.green{color:#00dc7a;}
  .lx-status-meta{font-size:8px;color:rgba(0,180,80,0.4);margin-top:4px;letter-spacing:0.1em;}

  /* Ticker tape */
  .lx-ticker{
    border-top:1px solid rgba(0,200,100,0.08);
    border-bottom:1px solid rgba(0,200,100,0.08);
    padding:8px 0;overflow:hidden;white-space:nowrap;
  }
  .lx-ticker-inner{
    display:inline-flex;gap:48px;
    animation:tickerScroll 30s linear infinite;
  }
  .lx-ticker-item{
    font-size:9px;letter-spacing:0.15em;color:rgba(0,200,100,0.35);text-transform:uppercase;
  }
  .lx-ticker-item span{color:rgba(0,200,100,0.6);margin-right:10px;}

  @keyframes tickerScroll{
    0%{transform:translateX(0)}
    100%{transform:translateX(-50%)}
  }

  /* Corner brackets */
  .lx-bracket{position:absolute;width:16px;height:16px;}
  .lx-bracket.tl{top:0;left:0;border-top:1px solid rgba(0,200,100,0.5);border-left:1px solid rgba(0,200,100,0.5);}
  .lx-bracket.tr{top:0;right:0;border-top:1px solid rgba(0,200,100,0.5);border-right:1px solid rgba(0,200,100,0.5);}
  .lx-bracket.bl{bottom:0;left:0;border-bottom:1px solid rgba(0,200,100,0.5);border-left:1px solid rgba(0,200,100,0.5);}
  .lx-bracket.br{bottom:0;right:0;border-bottom:1px solid rgba(0,200,100,0.5);border-right:1px solid rgba(0,200,100,0.5);}

  /* ── RIGHT PANEL ── */
  .lx-right{
    width:420px;display:flex;flex-direction:column;justify-content:center;
    padding:64px 52px;position:relative;z-index:2;
    background:rgba(0,4,12,0.6);
    backdrop-filter:blur(20px);
  }

  .lx-form-header{
    font-size:8px;letter-spacing:0.3em;text-transform:uppercase;
    color:rgba(0,200,100,0.5);margin-bottom:32px;
    display:flex;align-items:center;gap:10px;
  }
  .lx-form-header::before{content:'';display:block;width:20px;height:1px;background:rgba(0,200,100,0.4);}

  .lx-field-label{
    font-size:9px;letter-spacing:0.2em;text-transform:uppercase;
    color:rgba(255,255,255,0.65);margin-bottom:8px;
    display:flex;align-items:center;gap:8px;
  }
  .lx-field-label::before{content:'//';color:rgba(0,200,100,0.5);font-size:9px;}

  .login-input{
    width:100%;
    background:rgba(0,8,20,0.8);
    border:none;
    border-bottom:1px solid rgba(0,200,100,0.2);
    padding:12px 4px;
    color:#ffffff;font-size:14px;font-weight:400;
    outline:none;font-family:'JetBrains Mono',monospace;
    transition:border-color 0.2s;
    border-radius:0;
  }
  .login-input:focus{border-bottom-color:rgba(0,220,120,0.7);}
  .login-input::placeholder{color:rgba(255,255,255,0.18);}

  /* God Mode button */
  .god-btn{
    position:relative;overflow:hidden;
    width:100%;padding:15px 24px;border-radius:0;
    background:transparent;
    border:1px solid rgba(0,220,120,0.5);
    color:#00dc7a;font-size:10px;font-weight:700;
    cursor:pointer;font-family:'JetBrains Mono',monospace;
    letter-spacing:0.25em;text-transform:uppercase;
    transition:all 0.2s;
  }
  .god-btn:hover:not(:disabled){
    background:rgba(0,220,120,0.08);
    border-color:#00dc7a;
    color:#ffffff;
    box-shadow:0 0 30px rgba(0,200,100,0.15),inset 0 0 20px rgba(0,200,100,0.04);
  }
  .god-btn:active:not(:disabled){background:rgba(0,220,120,0.12);}
  .god-btn:disabled{border-color:rgba(0,200,100,0.1);color:rgba(0,200,100,0.2);cursor:not-allowed;}
  .god-btn::before{
    content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;
    background:linear-gradient(90deg,transparent,rgba(0,220,120,0.08),transparent);
    transition:left 0.4s;
  }
  .god-btn:hover::before{left:150%;}
  .god-btn .btn-text{position:relative;z-index:2;display:flex;align-items:center;justify-content:center;gap:12px;}
  .god-btn .bolt{display:none;}
  .god-btn .bolt2{display:none;}
  .god-btn .bolt3{display:none;}
  .god-btn .btn-icon{font-size:12px;}

  /* Divider */
  .lx-divider{
    display:flex;align-items:center;gap:12px;margin:20px 0;
  }
  .lx-divider::before,.lx-divider::after{
    content:'';flex:1;height:1px;background:rgba(0,200,100,0.08);
  }
  .lx-divider span{
    font-size:8px;color:rgba(0,200,100,0.25);letter-spacing:0.2em;text-transform:uppercase;
  }

  /* MFA badge */
  .lx-mfa{
    display:flex;align-items:center;gap:10px;padding:10px 14px;
    border:1px solid rgba(0,200,100,0.1);background:rgba(0,200,100,0.03);
  }
  .lx-mfa-dot{width:5px;height:5px;border-radius:50%;background:#00dc7a;
    box-shadow:0 0 6px #00dc7a;flex-shrink:0;}
  .lx-mfa-text{font-size:9px;color:rgba(0,200,100,0.55);letter-spacing:0.15em;text-transform:uppercase;}

  /* Error */
  .lx-err{
    display:flex;align-items:center;gap:8px;padding:10px 14px;margin-bottom:14px;
    border:1px solid rgba(255,80,80,0.2);background:rgba(255,50,50,0.04);
  }
  .lx-err-dot{width:5px;height:5px;border-radius:50%;background:#ff4444;flex-shrink:0;}
  .lx-err-text{font-size:10px;color:#ff8888;letter-spacing:0.05em;}

  /* Spinner */
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideRight{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
  @keyframes divineGlow{
    0%,100%{filter:brightness(1) drop-shadow(0 0 6px rgba(0,200,100,0.3))}
    50%    {filter:brightness(1.15) drop-shadow(0 0 14px rgba(0,220,120,0.5))}
  }
  @keyframes heavenPulse{0%,100%{opacity:0.6}50%{opacity:1}}
  @keyframes heavenDrift{0%,100%{transform:translateX(-50%)}50%{transform:translateX(-50%) translateY(12px)}}
  @keyframes aureoleSpin{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
  @keyframes aureoleSpinRev{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(-360deg)}}

  /* Cursor blink for terminal feel */
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  .cursor{display:inline-block;width:8px;height:14px;background:#00dc7a;
    vertical-align:middle;animation:blink 1s step-end infinite;margin-left:2px;}

  /* ── Heaven (post-login) — minimal, no animation ── */
  .heaven-bg{position:fixed;inset:0;pointer-events:none;z-index:0;
    background:
      radial-gradient(ellipse 100% 40% at 50% 0%,rgba(0,180,80,0.06) 0%,transparent 60%),
      #03050a;
  }
  .heaven-orb1,.heaven-orb2,.heaven-orb3{display:none;}
  .heaven-rays{display:none;}
  .heaven-logo{width:110px;height:auto;}
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

  const TICKER = [
    {label:"CLIENTS",val:"08"},
    {label:"ACTIVE USERS",val:"15"},
    {label:"MFA ENFORCED",val:"100%"},
    {label:"UPTIME",val:"99.9%"},
    {label:"ENCRYPTION",val:"AES-256"},
    {label:"ACCESS LEVEL",val:"GOD"},
    {label:"PROJECTS",val:"02"},
    {label:"PROTOCOL",val:"TLS 1.3"},
  ];

  const STATUS = [
    {label:"Active Clients",   val:"08",    sub:"portfolios monitored",   green:false},
    {label:"Portal Users",     val:"15",    sub:"registered accounts",    green:false},
    {label:"System Status",    val:"LIVE",  sub:"all systems operational", green:true},
    {label:"Security Level",   val:"AAL2",  sub:"MFA enforced",           green:true},
  ];

  return (
    <div className="lx-root">
      <div className="lx-grid"/>
      <div className="lx-diag"/>

      {/* ══════════════════════════════
          LEFT — branding + status
      ══════════════════════════════ */}
      <div className="lx-left">

        {/* Top */}
        <div>
          <img src={TF_LOGO} alt="Targetflow" className="lx-logo"
            style={{marginBottom:56,filter:"brightness(1.1) drop-shadow(0 0 8px rgba(0,200,100,0.2))"}}/>
        </div>

        {/* Headline */}
        <div>
          <div className="lx-headline">
            <div>Portfolio</div>
            <div>Intelligence</div>
            <div><em>Command.</em></div>
          </div>
          <div className="lx-sub">
            Superuser · Restricted System · Internal Use Only
          </div>
        </div>

        {/* Status grid */}
        <div>
          <div style={{fontSize:8,letterSpacing:"0.25em",color:"rgba(0,200,100,0.35)",
            textTransform:"uppercase",marginBottom:12}}>// System Status</div>
          <div className="lx-status-grid">
            {STATUS.map((s,i)=>(
              <div key={i} className="lx-status-cell" style={{position:"relative"}}>
                <div className="lx-bracket tl"/>
                <div className="lx-bracket br"/>
                <div className="lx-status-label">{s.label}</div>
                <div className={`lx-status-val${s.green?" green":""}`}>{s.val}</div>
                <div className="lx-status-meta">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticker */}
        <div className="lx-ticker">
          <div className="lx-ticker-inner">
            {[...TICKER,...TICKER].map((t,i)=>(
              <div key={i} className="lx-ticker-item">
                <span>{t.label}</span>{t.val}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom label */}
        <div style={{fontSize:8,color:"rgba(0,200,100,0.2)",letterSpacing:"0.2em",textTransform:"uppercase"}}>
          © TARGETFLOW OY · INTERNAL SYSTEM · UNAUTHORISED ACCESS PROHIBITED
        </div>
      </div>

      {/* ══════════════════════════════
          RIGHT — auth form
      ══════════════════════════════ */}
      <div className="lx-right">

        {/* Corner brackets */}
        <div style={{position:"absolute",top:32,left:32,right:32}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{width:12,height:12,borderTop:"1px solid rgba(0,200,100,0.4)",borderLeft:"1px solid rgba(0,200,100,0.4)"}}/>
            <div style={{fontSize:8,color:"rgba(0,200,100,0.3)",letterSpacing:"0.25em",fontFamily:"'JetBrains Mono',monospace"}}>
              AUTH_MODULE v2.4
            </div>
            <div style={{width:12,height:12,borderTop:"1px solid rgba(0,200,100,0.4)",borderRight:"1px solid rgba(0,200,100,0.4)"}}/>
          </div>
        </div>

        {/* Form header */}
        <div className="lx-form-header">Authentication Required</div>

        {/* Terminal prompt line */}
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,
          color:"rgba(0,200,100,0.4)",marginBottom:32,lineHeight:1.6}}>
          <div>$ auth --level=god --mfa=required</div>
          <div style={{marginTop:2}}>
            <span style={{color:"rgba(0,200,100,0.25)"}}>›</span>
            <span style={{color:"rgba(255,255,255,0.3)",marginLeft:6}}>Awaiting credentials</span>
            <span className="cursor"/>
          </div>
        </div>

        {/* Fields */}
        <div style={{display:"flex",flexDirection:"column",gap:28,marginBottom:10}}>
          <div>
            <div className="lx-field-label">Email Address</div>
            <input className="login-input" type="email" placeholder="user@domain.com"
              value={email} onChange={e=>setEmail(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&login()} autoComplete="email"/>
          </div>
          <div>
            <div className="lx-field-label">Passphrase</div>
            <input className="login-input" type="password" placeholder="••••••••••••••"
              value={pw} onChange={e=>setPw(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&login()} autoComplete="current-password"/>
          </div>
        </div>

        {err && (
          <div className="lx-err" style={{marginBottom:16}}>
            <div className="lx-err-dot"/>
            <div className="lx-err-text">ERROR: {err}</div>
          </div>
        )}

        <button className="god-btn" onClick={login} disabled={loading||!email||!pw}
          style={{marginBottom:24,marginTop:8}}>
          <div className="btn-text">
            {loading ? (
              <>
                <span style={{width:11,height:11,border:"1px solid rgba(0,200,100,0.3)",borderTopColor:"#00dc7a",
                  borderRadius:"50%",display:"inline-block",animation:"spin 0.8s linear infinite"}}/>
                <span>Verifying credentials…</span>
              </>
            ) : (
              <span>_ Enter God Mode</span>
            )}
          </div>
        </button>

        <div className="lx-divider"><span>security</span></div>

        <div className="lx-mfa">
          <div className="lx-mfa-dot"/>
          <div className="lx-mfa-text">MFA — TOTP required on next step</div>
        </div>

        {/* Bottom corner brackets */}
        <div style={{position:"absolute",bottom:32,left:32,right:32}}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div style={{width:12,height:12,borderBottom:"1px solid rgba(0,200,100,0.4)",borderLeft:"1px solid rgba(0,200,100,0.4)"}}/>
            <div style={{width:12,height:12,borderBottom:"1px solid rgba(0,200,100,0.4)",borderRight:"1px solid rgba(0,200,100,0.4)"}}/>
          </div>
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
  const [userTab,    setUserTab]    = useState("overview"); // overview | detail

  const load = useCallback(async () => {
    const [snapRes, userRes, errRes] = await Promise.all([
      supabase.from("client_snapshots").select("*"),
      supabase.rpc("get_user_stats"),
      supabase.from("error_logs").select("*").order("created_at",{ascending:false}).limit(50),
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

      {/* Summary bar */}
      <div style={{borderBottom:"1px solid rgba(255,255,255,0.03)",background:"rgba(2,4,8,0.7)",backdropFilter:"blur(8px)",padding:"12px 32px",
        display:"flex",gap:32,alignItems:"center"}}>
        <div>
          <div style={{fontSize:9,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Portfolio Revenue</div>
          <div style={{fontSize:20,fontWeight:600,color:"#e2e8f0",fontFamily:"'DM Mono',monospace"}}>{fmt(totalRevenue)}</div>
        </div>
        <div style={{width:1,height:32,background:"#0f1e30"}}/>
        <div>
          <div style={{fontSize:9,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Portfolio EBITDA</div>
          <div style={{fontSize:20,fontWeight:600,color:"#2dd4bf",fontFamily:"'DM Mono',monospace"}}>{fmt(totalEBITDA)}</div>
        </div>
        <div style={{width:1,height:32,background:"#0f1e30"}}/>
        <div>
          <div style={{fontSize:9,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Clients with data</div>
          <div style={{fontSize:20,fontWeight:600,color:"#c0d8f0",fontFamily:"'DM Mono',monospace"}}>{clientsWithData}/{CLIENTS.length}</div>
        </div>
        <div style={{marginLeft:"auto"}}>
          <button onClick={load}
            style={{background:"rgba(45,212,191,0.06)",border:"1px solid #0d9488",borderRadius:8,
              color:"#2dd4bf",fontFamily:"'DM Mono',monospace",fontSize:10,padding:"6px 14px",cursor:"pointer"}}>
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={{padding:"28px 32px 0 32px",position:"relative",zIndex:1}}>
        {loading ? (
          <div style={{textAlign:"center",color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",fontSize:12,marginTop:60}}>Loading snapshots…</div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16}}>
            {CLIENTS.map(c => (
              <ClientCard key={c.name} client={c} snap={snaps[c.name]||null}/>
            ))}
          </div>
        )}
      </div>

      {/* ── User Intelligence Panel ── */}
      <div style={{padding:"0 32px 48px",position:"relative",zIndex:1,marginTop:8}}>

        {/* Section header with tabs */}
        <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:16,borderBottom:"1px solid rgba(100,150,255,0.08)"}}>
          {[["overview","👥 Users"],["activity","⚡ Activity"],["errors","🔴 Errors"]].map(([id,label])=>(
            <button key={id} onClick={()=>setUserTab(id)}
              style={{background:"none",border:"none",borderBottom:`2px solid ${userTab===id?"#60a5fa":"transparent"}`,
                color:userTab===id?"#93c5fd":"rgba(160,200,255,0.45)",
                fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",
                padding:"8px 18px",cursor:"pointer",transition:"all 0.2s"}}>
              {label}
            </button>
          ))}
          <div style={{marginLeft:"auto",fontSize:9,color:"rgba(100,140,200,0.35)",fontFamily:"'DM Mono',monospace"}}>
            {users.length} registered · auto-refresh 60s
          </div>
        </div>

        {/* ── OVERVIEW TAB ── */}
        {userTab==="overview" && (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {/* Column headers */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 100px 80px 90px 90px 100px 120px",
              gap:8,padding:"6px 16px",fontSize:9,color:"rgba(120,160,220,0.5)",
              fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",textTransform:"uppercase"}}>
              <div>User</div><div>Email</div><div>Client</div><div>Sessions</div>
              <div>MFA</div><div>Status</div><div>Registered</div><div>Last Login</div>
            </div>
            {USER_REGISTRY.map(reg=>{
              const live = users.find(u=>u.email===reg.email);
              const lastLogin = live?.last_sign_in_at ? new Date(live.last_sign_in_at) : null;
              const registered = live?.created_at ? new Date(live.created_at) : null;
              const sessions = live?.sign_in_count ?? 0;
              const mfa = live?.mfa_enabled ?? false;
              const confirmed = live?.email_confirmed_at != null;
              const neverLoggedIn = !lastLogin;
              const daysSince = lastLogin ? Math.floor((Date.now()-lastLogin)/86400000) : null;
              const stale = daysSince !== null && daysSince > 30;
              const statusColor = !confirmed?"#f87171":neverLoggedIn?"#f59e0b":stale?"#fb923c":"#4ade80";
              const statusLabel = !confirmed?"Unconfirmed":neverLoggedIn?"Never logged in":stale?"Inactive":"Active";
              const agoStr = lastLogin ? (()=>{
                if(daysSince===0) return "Today";
                if(daysSince===1) return "Yesterday";
                if(daysSince<7)   return daysSince+"d ago";
                if(daysSince<30)  return Math.floor(daysSince/7)+"w ago";
                return Math.floor(daysSince/30)+"mo ago";
              })() : "—";
              return (
                <div key={reg.email}
                  style={{display:"grid",gridTemplateColumns:"1fr 1fr 100px 80px 90px 90px 100px 120px",
                    gap:8,padding:"10px 16px",
                    background:neverLoggedIn?"rgba(245,158,11,0.04)":stale?"rgba(251,146,60,0.03)":"rgba(6,12,30,0.5)",
                    border:`1px solid ${neverLoggedIn?"rgba(245,158,11,0.12)":stale?"rgba(251,146,60,0.08)":"rgba(100,150,255,0.06)"}`,
                    borderRadius:10,backdropFilter:"blur(8px)",alignItems:"center"}}>

                  {/* Name + avatar */}
                  <div style={{display:"flex",alignItems:"center",gap:8,minWidth:0}}>
                    <div style={{width:26,height:26,borderRadius:"50%",flexShrink:0,
                      background:`${reg.color}18`,border:`1px solid ${reg.color}30`,
                      display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{fontSize:10,fontWeight:700,color:reg.color}}>{reg.name.charAt(0)}</span>
                    </div>
                    <span style={{fontSize:12,color:"#d0e8ff",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{reg.name}</span>
                  </div>

                  {/* Email */}
                  <div style={{fontSize:10,color:"rgba(160,200,255,0.5)",fontFamily:"'DM Mono',monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{reg.email}</div>

                  {/* Client badge */}
                  <div style={{fontSize:9,color:reg.color,fontFamily:"'DM Mono',monospace",
                    background:`${reg.color}12`,border:`1px solid ${reg.color}25`,
                    borderRadius:5,padding:"2px 7px",textAlign:"center",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{reg.role}</div>

                  {/* Sessions */}
                  <div style={{fontSize:12,color:sessions>0?"#93c5fd":"rgba(100,140,200,0.35)",fontFamily:"'DM Mono',monospace",textAlign:"center"}}>
                    {live ? sessions : <span style={{color:"rgba(100,140,200,0.3)"}}>—</span>}
                  </div>

                  {/* MFA */}
                  <div style={{textAlign:"center"}}>
                    {live ? (
                      <span style={{fontSize:9,fontFamily:"'DM Mono',monospace",padding:"2px 8px",borderRadius:5,
                        background:mfa?"rgba(74,222,128,0.08)":"rgba(248,113,113,0.08)",
                        border:`1px solid ${mfa?"rgba(74,222,128,0.2)":"rgba(248,113,113,0.2)"}`,
                        color:mfa?"#4ade80":"#f87171"}}>
                        {mfa?"✓ ON":"✗ OFF"}
                      </span>
                    ) : <span style={{color:"rgba(100,140,200,0.3)",fontSize:10}}>—</span>}
                  </div>

                  {/* Status */}
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:statusColor,
                      boxShadow:`0 0 5px ${statusColor}88`,flexShrink:0}}/>
                    <span style={{fontSize:10,color:statusColor,fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap"}}>{statusLabel}</span>
                  </div>

                  {/* Registered */}
                  <div style={{fontSize:10,color:"rgba(140,180,255,0.4)",fontFamily:"'DM Mono',monospace"}}>
                    {registered ? registered.toLocaleDateString("fi-FI",{day:"2-digit",month:"2-digit",year:"2-digit"}) : "—"}
                  </div>

                  {/* Last login */}
                  <div style={{fontSize:11,color:neverLoggedIn?"#f59e0b":stale?"#fb923c":"#c0d8f0",fontFamily:"'DM Mono',monospace"}}>
                    {agoStr}
                    {lastLogin && daysSince===0 && (
                      <div style={{fontSize:9,color:"rgba(160,200,255,0.4)",marginTop:1}}>
                        {lastLogin.toLocaleTimeString("fi-FI",{hour:"2-digit",minute:"2-digit"})}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── ACTIVITY TAB ── */}
        {userTab==="activity" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {/* Import activity */}
            <div style={{background:"rgba(4,8,22,0.7)",border:"1px solid rgba(100,150,255,0.07)",borderRadius:14,padding:"20px 24px",backdropFilter:"blur(12px)"}}>
              <div style={{fontSize:9,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:16}}>Data Imports</div>
              {activity.length===0 ? (
                <div style={{fontSize:11,color:"rgba(100,150,220,0.3)",fontFamily:"'DM Mono',monospace",textAlign:"center",marginTop:30}}>No imports yet</div>
              ) : activity.map((a,i)=>{
                const client = CLIENTS.find(c=>c.name===a.client);
                const color = client?.accent||"#64748b";
                const diff = (Date.now()-a.at)/1000;
                const ago = diff<60?"just now":diff<3600?Math.floor(diff/60)+"min ago":diff<86400?Math.floor(diff/3600)+"h ago":Math.floor(diff/86400)+"d ago";
                return (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,padding:"8px 10px",background:"rgba(8,14,35,0.5)",borderRadius:8}}>
                    <div style={{width:7,height:7,borderRadius:"50%",background:color,flexShrink:0,boxShadow:`0 0 6px ${color}88`}}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,color:"#d0e8ff"}}><span style={{color,fontWeight:600}}>{a.client}</span><span style={{color:"rgba(160,200,255,0.5)"}}> → {a.month}</span></div>
                      <div style={{fontSize:9,color:"rgba(120,160,220,0.4)",fontFamily:"'DM Mono',monospace",marginTop:1}}>{a.at.toLocaleString("fi-FI",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})} · {ago}</div>
                    </div>
                    <div style={{fontSize:9,color:"rgba(100,200,100,0.6)",fontFamily:"'DM Mono',monospace",background:"rgba(74,222,128,0.06)",border:"1px solid rgba(74,222,128,0.1)",borderRadius:4,padding:"2px 6px"}}>IMPORT</div>
                  </div>
                );
              })}
            </div>
            {/* Login stats summary */}
            <div style={{background:"rgba(4,8,22,0.7)",border:"1px solid rgba(100,150,255,0.07)",borderRadius:14,padding:"20px 24px",backdropFilter:"blur(12px)"}}>
              <div style={{fontSize:9,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:16}}>Login Summary</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[...users].sort((a,b)=>(b.sign_in_count||0)-(a.sign_in_count||0)).slice(0,10).map(u=>{
                  const reg = USER_REGISTRY.find(r=>r.email===u.email);
                  const color = reg?.color||"#64748b";
                  const maxSessions = Math.max(...users.map(x=>x.sign_in_count||0),1);
                  const pct = Math.round(((u.sign_in_count||0)/maxSessions)*100);
                  const lastLogin = u.last_sign_in_at ? new Date(u.last_sign_in_at) : null;
                  return (
                    <div key={u.email} style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:22,height:22,borderRadius:"50%",background:`${color}18`,border:`1px solid ${color}25`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <span style={{fontSize:8,fontWeight:700,color}}>{(reg?.name||u.email).charAt(0)}</span>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}>
                          <span style={{fontSize:11,color:"#c0d8f0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{reg?.name||u.email.split("@")[0]}</span>
                          <span style={{fontSize:10,color:"rgba(160,200,255,0.5)",fontFamily:"'DM Mono',monospace",flexShrink:0,marginLeft:8}}>{u.sign_in_count||0} sessions</span>
                        </div>
                        <div style={{height:3,background:"rgba(100,140,200,0.1)",borderRadius:2}}>
                          <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${color},${color}88)`,borderRadius:2,transition:"width 0.5s"}}/>
                        </div>
                        <div style={{fontSize:9,color:"rgba(120,160,220,0.4)",fontFamily:"'DM Mono',monospace",marginTop:2}}>
                          Last: {lastLogin?lastLogin.toLocaleDateString("fi-FI"):"Never"}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {users.length===0&&<div style={{fontSize:11,color:"rgba(100,150,220,0.3)",fontFamily:"'DM Mono',monospace",textAlign:"center",marginTop:20}}>Run SQL setup first</div>}
              </div>
            </div>
          </div>
        )}

        {/* ── ERRORS TAB ── */}
        {userTab==="errors" && (
          <div style={{background:"rgba(4,8,22,0.7)",border:"1px solid rgba(100,150,255,0.07)",borderRadius:14,padding:"20px 24px",backdropFilter:"blur(12px)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div style={{fontSize:9,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",textTransform:"uppercase"}}>Error Log</div>
              <div style={{fontSize:9,color:"rgba(100,140,200,0.4)",fontFamily:"'DM Mono',monospace"}}>last 50 events</div>
            </div>
            {users.flatMap(u=>u.errors||[]).length===0 ? (
              <div style={{textAlign:"center",padding:"40px 0"}}>
                <div style={{fontSize:28,marginBottom:8}}>✓</div>
                <div style={{fontSize:12,color:"#4ade80",fontFamily:"'DM Mono',monospace"}}>No errors recorded</div>
                <div style={{fontSize:10,color:"rgba(100,150,220,0.35)",marginTop:6}}>Errors from client dashboards will appear here once error_logs table is set up</div>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {users.flatMap(u=>(u.errors||[]).map(e=>({...e,userName:USER_REGISTRY.find(r=>r.email===u.email)?.name||u.email})))
                  .sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))
                  .map((e,i)=>(
                    <div key={i} style={{padding:"10px 14px",background:"rgba(248,113,113,0.04)",border:"1px solid rgba(248,113,113,0.1)",borderRadius:8,display:"flex",alignItems:"flex-start",gap:10}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:"#f87171",marginTop:4,flexShrink:0,boxShadow:"0 0 5px #f8717188"}}/>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                          <span style={{fontSize:11,color:"#fca5a5",fontWeight:600}}>{e.error_type||"Error"}</span>
                          <span style={{fontSize:9,color:"rgba(160,140,180,0.5)",fontFamily:"'DM Mono',monospace"}}>{e.client}</span>
                          <span style={{fontSize:9,color:"rgba(140,160,200,0.4)",fontFamily:"'DM Mono',monospace",marginLeft:"auto"}}>{new Date(e.created_at).toLocaleString("fi-FI",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</span>
                        </div>
                        <div style={{fontSize:11,color:"rgba(200,180,200,0.7)"}}>{e.error_message}</div>
                        <div style={{fontSize:9,color:"rgba(140,160,200,0.4)",fontFamily:"'DM Mono',monospace",marginTop:2}}>{e.userName} · {e.user_email}</div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Current session bar */}
        <div style={{marginTop:16,padding:"10px 16px",background:"rgba(4,8,22,0.6)",border:"1px solid rgba(74,222,128,0.12)",borderRadius:10,backdropFilter:"blur(8px)",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 8px #4ade8088"}}/>
          <span style={{fontSize:11,color:"#c0d8f0",fontFamily:"'DM Mono',monospace"}}>{userEmail}</span>
          <span style={{fontSize:9,color:"#4ade80",fontFamily:"'DM Mono',monospace",background:"rgba(74,222,128,0.07)",border:"1px solid rgba(74,222,128,0.15)",borderRadius:4,padding:"2px 7px"}}>ONLINE · GOD MODE</span>
          {lastRefresh && <span style={{marginLeft:"auto",fontSize:9,color:"rgba(100,140,200,0.35)",fontFamily:"'DM Mono',monospace"}}>Updated {lastRefresh.toLocaleTimeString("fi-FI",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span>}
        </div>
      </div>    </div>
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
