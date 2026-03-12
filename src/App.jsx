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
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Cinzel:wght@400;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#020408;color:#e2e8f0;font-family:'DM Sans',sans-serif;}
  ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:#0a0f1a;} ::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:2px;}
  .card{background:rgba(8,14,28,0.75);border:1px solid rgba(255,255,255,0.05);border-radius:14px;transition:border-color 0.18s,transform 0.18s;}
  .card:hover{border-color:rgba(99,179,237,0.15);transform:translateY(-2px);}
  .open-btn{background:none;border:1px solid #1e2d45;border-radius:8px;color:#64748b;font-family:'DM Mono',monospace;font-size:10px;
    padding:5px 10px;cursor:pointer;transition:all 0.15s;white-space:nowrap;}
  .open-btn:hover{border-color:#3b82f6;color:#60a5fa;}
  .login-input{width:100%;background:rgba(2,4,12,0.6);border:1px solid rgba(147,197,253,0.12);border-radius:10px;
    padding:14px 18px;color:#e2e8f0;font-size:14px;outline:none;font-family:'DM Sans',sans-serif;
    transition:border-color 0.25s,box-shadow 0.25s;backdrop-filter:blur(12px);}
  .login-input:focus{border-color:rgba(147,197,253,0.35);box-shadow:0 0 24px rgba(99,179,237,0.07);}
  .login-input::placeholder{color:rgba(147,197,253,0.18);}
  .login-btn{width:100%;padding:14px;border-radius:10px;
    background:linear-gradient(135deg,rgba(29,78,216,0.85),rgba(14,165,233,0.85));
    border:1px solid rgba(147,197,253,0.25);color:#fff;font-size:11px;font-weight:600;
    cursor:pointer;font-family:'DM Mono',monospace;letter-spacing:0.18em;
    transition:all 0.25s;text-transform:uppercase;}
  .login-btn:hover:not(:disabled){box-shadow:0 0 40px rgba(14,165,233,0.2);border-color:rgba(147,197,253,0.4);}
  .login-btn:disabled{background:rgba(8,12,24,0.6);border:1px solid rgba(255,255,255,0.04);color:#1e3a5f;cursor:not-allowed;}

  /* ── Keyframes ── */
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
  @keyframes glow{0%,100%{filter:drop-shadow(0 0 12px rgba(147,197,253,0.45)) drop-shadow(0 0 30px rgba(99,179,237,0.2)) brightness(1.2)}
                  50%{filter:drop-shadow(0 0 22px rgba(200,225,255,0.7)) drop-shadow(0 0 55px rgba(99,179,237,0.35)) brightness(1.4)}}
  @keyframes orbFloat{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,15px) scale(0.97)}}
  @keyframes orbFloat2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-25px,20px) scale(1.03)}66%{transform:translate(20px,-15px) scale(0.98)}}
  @keyframes rayRotate{from{transform:translateX(-50%) rotate(0deg)}to{transform:translateX(-50%) rotate(360deg)}}
  @keyframes particleDrift{0%{opacity:0;transform:translateY(0) translateX(0)}20%{opacity:1}80%{opacity:0.6}100%{opacity:0;transform:translateY(-120px) translateX(20px)}}

  /* ── Login background ── */
  .login-scene{position:fixed;inset:0;overflow:hidden;background:#02040a;}
  .login-scene::before{
    content:'';position:absolute;inset:0;
    background:radial-gradient(ellipse 130% 65% at 50% -10%, rgba(130,180,255,0.13) 0%, rgba(60,120,220,0.07) 35%, transparent 65%),
               radial-gradient(ellipse 80% 40% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 50%),
               radial-gradient(ellipse 60% 50% at 15% 90%, rgba(99,102,241,0.06) 0%, transparent 55%),
               radial-gradient(ellipse 50% 40% at 85% 85%, rgba(6,182,212,0.05) 0%, transparent 50%);
  }
  .orb1{position:absolute;width:500px;height:500px;border-radius:50%;top:-150px;left:calc(50% - 250px);
    background:radial-gradient(circle,rgba(100,170,255,0.09) 0%,transparent 70%);
    filter:blur(40px);animation:orbFloat 14s ease-in-out infinite;}
  .orb2{position:absolute;width:350px;height:350px;border-radius:50%;top:30%;left:-80px;
    background:radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%);
    filter:blur(50px);animation:orbFloat2 18s ease-in-out infinite;}
  .orb3{position:absolute;width:300px;height:300px;border-radius:50%;bottom:10%;right:-60px;
    background:radial-gradient(circle,rgba(6,182,212,0.06) 0%,transparent 70%);
    filter:blur(45px);animation:orbFloat 22s ease-in-out infinite 3s;}
  .grid-overlay{
    position:absolute;inset:0;
    background-image:linear-gradient(rgba(147,197,253,0.03) 1px,transparent 1px),
                     linear-gradient(90deg,rgba(147,197,253,0.03) 1px,transparent 1px);
    background-size:56px 56px;
    mask-image:radial-gradient(ellipse 85% 85% at 50% 50%,black 20%,transparent 100%);
  }
  .rays{
    position:absolute;top:0;left:50%;transform:translateX(-50%);
    width:120%;height:75vh;
    background:repeating-conic-gradient(from -12deg at 50% -25%,
      rgba(160,200,255,0.03) 0deg 3deg, transparent 3deg 9deg,
      rgba(160,200,255,0.02) 9deg 11deg, transparent 11deg 20deg);
    mask-image:linear-gradient(to bottom,rgba(0,0,0,0.5) 0%,transparent 100%);
  }

  /* ── Login card ── */
  .login-card{
    animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both;
    position:relative;z-index:2;
    background:rgba(2,5,14,0.82);
    border:1px solid rgba(147,197,253,0.08);
    border-radius:22px;padding:50px 44px;width:410px;box-sizing:border-box;
    backdrop-filter:blur(28px);
    box-shadow:0 0 0 1px rgba(255,255,255,0.02) inset,
               0 60px 100px rgba(0,0,0,0.65),
               0 0 80px rgba(14,165,233,0.04);
  }
  .login-card::before{
    content:'';position:absolute;top:0;left:15%;right:15%;height:1px;
    background:linear-gradient(90deg,transparent,rgba(147,197,253,0.3),transparent);
    border-radius:1px;
  }

  /* ── Logo glow animation ── */
  .tf-logo-glow{animation:glow 3s ease-in-out infinite;}

  /* ── God title ── */
  .god-title{
    font-family:'Cinzel',serif;font-size:26px;font-weight:700;letter-spacing:0.14em;
    background:linear-gradient(180deg,#ffffff 0%,#93c5fd 55%,rgba(14,165,233,0.65) 100%);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  }

  /* ── Heaven interior (no animation) ── */
  .heaven-bg{
    position:fixed;inset:0;pointer-events:none;z-index:0;
    background:
      radial-gradient(ellipse 160% 55% at 50% -10%, rgba(180,215,255,0.07) 0%, rgba(99,150,230,0.04) 35%, transparent 58%),
      radial-gradient(ellipse 90% 35% at 50% 0%, rgba(255,255,255,0.025) 0%, transparent 45%),
      radial-gradient(ellipse 50% 30% at 20% 100%, rgba(99,102,241,0.03) 0%, transparent 55%),
      radial-gradient(ellipse 40% 25% at 80% 95%, rgba(6,182,212,0.025) 0%, transparent 50%),
      #020408;
  }
  .heaven-rays{
    position:fixed;top:0;left:50%;transform:translateX(-50%);
    width:110%;height:65vh;pointer-events:none;z-index:0;
    background:repeating-conic-gradient(from -14deg at 50% -22%,
      rgba(170,205,255,0.022) 0deg 2.5deg,transparent 2.5deg 8deg,
      rgba(170,205,255,0.014) 8deg 10.5deg,transparent 10.5deg 19deg);
    mask-image:linear-gradient(to bottom,rgba(0,0,0,0.55) 0%,transparent 100%);
  }
  .heaven-logo{width:130px;height:auto;}
`;

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Spark({data, color, actLast}) {
  if(!data||!data.length) return <div style={{height:48,display:"flex",alignItems:"center",justifyContent:"center",color:"#1e2d45",fontSize:10,fontFamily:"'DM Mono',monospace"}}>no data</div>;
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
          contentStyle={{background:"#0c1420",border:"1px solid #1e2d45",borderRadius:6,fontSize:10,fontFamily:"'DM Mono',monospace",color:"#94a3b8",padding:"4px 8px"}}
          formatter={v=>[fmt(v),"EBITDA"]} labelFormatter={l=>l}/>
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── KPI pill ──────────────────────────────────────────────────────────────────
function KPIPill({label, value, color, pct}) {
  return (
    <div style={{flex:1,minWidth:80}}>
      <div style={{fontSize:9,color:"#475569",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3}}>{label}</div>
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
          <div style={{fontSize:10,color:"#334155",fontFamily:"'DM Mono',monospace",paddingLeft:16}}>
            {lastMon ? `Last data: ${lastMon} ${yr}` : "No data yet"}
            {timeSince && <span style={{color:"#1e3a5f",marginLeft:8}}>{timeSince}</span>}
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
        <KPIPill label="Revenue"  value={totRev!=null?fmt(totRev):"—"} color="#94a3b8"/>
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
          style={{width:"100%",background:"#0c1420",border:"1px solid "+(err?"#f87171":"#1e2d45"),
            borderRadius:10,padding:"14px 16px",color:"#e2e8f0",fontSize:22,outline:"none",
            fontFamily:"'DM Mono',monospace",letterSpacing:8,textAlign:"center",boxSizing:"border-box",marginBottom:14}}/>
        {err&&<div style={{color:"#f87171",fontSize:11,textAlign:"center",marginBottom:10,fontFamily:"'DM Mono',monospace"}}>Invalid code — try again</div>}
        <button onClick={verify} disabled={code.length<6||loading}
          style={{width:"100%",padding:"13px",borderRadius:10,
            background:code.length===6&&!loading?"linear-gradient(135deg,#1d4ed8,#0ea5e9)":"#0c1420",
            border:"1px solid "+(code.length===6&&!loading?"#3b82f6":"#1e2d45"),
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
              <div style={{color:"#475569",fontSize:11,fontFamily:"'DM Mono',monospace"}}>{err?"Error":"Loading…"}</div>
            </div>
        }
        {secret&&(
          <div style={{marginBottom:20}}>
            <div style={{fontSize:10,color:"#475569",fontFamily:"'DM Mono',monospace",marginBottom:6}}>Or enter manually:</div>
            <div style={{fontSize:12,color:"#93c5fd",fontFamily:"'DM Mono',monospace",letterSpacing:2,background:"#0c1420",padding:"8px 12px",borderRadius:8,border:"1px solid #1e2d45"}}>{secret}</div>
          </div>
        )}
        <div style={{fontSize:11,color:"#64748b",marginBottom:12}}>Enter the 6-digit code to confirm</div>
        <input value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,"").slice(0,6))}
          onKeyDown={e=>e.key==="Enter"&&verify()} placeholder="000000" maxLength={6}
          style={{width:"100%",background:"#0c1420",border:"1px solid "+(err?"#f87171":"#1e2d45"),borderRadius:10,
            padding:"14px 16px",color:"#e2e8f0",fontSize:22,outline:"none",fontFamily:"'DM Mono',monospace",
            letterSpacing:8,textAlign:"center",boxSizing:"border-box",marginBottom:14}}/>
        {err&&<div style={{color:"#f87171",fontSize:11,marginBottom:10,fontFamily:"'DM Mono',monospace"}}>Invalid code — try again</div>}
        <button onClick={verify} disabled={code.length<6||loading}
          style={{width:"100%",padding:"13px",borderRadius:10,
            background:code.length===6&&!loading?"linear-gradient(135deg,#1d4ed8,#0ea5e9)":"#0c1420",
            border:"1px solid "+(code.length===6&&!loading?"#3b82f6":"#1e2d45"),
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

  return (
    <div style={{minHeight:"100vh",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:"#02040a"}}>
      {/* ── Animated background ── */}
      <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse 120% 60% at 50% -15%, rgba(180,210,255,0.18) 0%, rgba(99,179,237,0.12) 30%, transparent 65%), radial-gradient(ellipse 80% 40% at 50% -5%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(ellipse 60% 50% at 15% 90%, rgba(99,102,241,0.08) 0%, transparent 55%), radial-gradient(ellipse 40% 35% at 85% 80%, rgba(6,182,212,0.06) 0%, transparent 50%), #020408"}}/>
      {/* Grid */}
      <div style={{position:"fixed",inset:0,backgroundImage:"linear-gradient(rgba(14,165,233,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(14,165,233,0.04) 1px,transparent 1px)",backgroundSize:"60px 60px",maskImage:"radial-gradient(ellipse 90% 90% at 50% 50%,black 20%,transparent 100%)"}}/>
      {/* Orbs */}
      <div style={{position:"fixed",top:"8%",left:"50%",transform:"translateX(-50%)",width:600,height:300,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(180,220,255,0.14) 0%,rgba(14,165,233,0.06) 50%,transparent 70%)",filter:"blur(40px)",animation:"pulse 7s ease-in-out infinite"}}/>
      <div style={{position:"fixed",top:"20%",left:"10%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(99,102,241,0.07) 0%,transparent 70%)",filter:"blur(50px)",animation:"pulse 9s ease-in-out infinite 2s"}}/>
      <div style={{position:"fixed",bottom:"15%",right:"10%",width:250,height:250,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(6,182,212,0.06) 0%,transparent 70%)",filter:"blur(40px)",animation:"pulse 8s ease-in-out infinite 4s"}}/>
      {/* Scanline effect */}
      <div style={{position:"fixed",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)",pointerEvents:"none"}}/>

      {/* ── Card ── */}
      <div className="login-card">
        {/* Top border glow */}
        <div style={{position:"absolute",top:0,left:"20%",right:"20%",height:1,background:"linear-gradient(90deg,transparent,rgba(99,179,237,0.4),transparent)"}}/>

        {/* Logo area */}
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{position:"relative",marginBottom:4}}>
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
              width:320,height:80,borderRadius:"50%",
              background:"radial-gradient(ellipse,rgba(147,197,253,0.12) 0%,transparent 70%)",
              filter:"blur(18px)",pointerEvents:"none"}}/>
            <img src={TF_LOGO} alt="Targetflow" className="tf-logo-glow" style={{width:230,height:"auto",position:"relative"}}/>
          </div>
          <div className="god-title" style={{marginBottom:12}}>God Mode</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <div style={{height:1,width:40,background:"linear-gradient(90deg,transparent,rgba(99,179,237,0.25))"}}/>
            <div style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:"#1e3a5f",letterSpacing:"0.2em",textTransform:"uppercase"}}>Authorised access only</div>
            <div style={{height:1,width:40,background:"linear-gradient(90deg,rgba(99,179,237,0.25),transparent)"}}/>
          </div>
        </div>

        {/* Form */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <input className="login-input" type="email" placeholder="Email address" value={email}
            onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} autoComplete="email"/>
          <input className="login-input" type="password" placeholder="Password" value={pw}
            onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} autoComplete="current-password"/>
          {err && (
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",background:"rgba(248,113,113,0.06)",border:"1px solid rgba(248,113,113,0.15)",borderRadius:8}}>
              <div style={{width:4,height:4,borderRadius:"50%",background:"#f87171",flexShrink:0}}/>
              <div style={{fontSize:11,color:"#f87171",fontFamily:"'DM Mono',monospace"}}>{err}</div>
            </div>
          )}
          <button className="login-btn" onClick={login} disabled={loading||!email||!pw} style={{marginTop:4}}>
            {loading ? (
              <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <span style={{width:12,height:12,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"white",borderRadius:"50%",display:"inline-block",animation:"rotateOrb 0.8s linear infinite"}}/>
                Authenticating
              </span>
            ) : "Enter →"}
          </button>
        </div>

        {/* Bottom */}
        <div style={{marginTop:24,textAlign:"center",fontSize:9,color:"#0f1e30",fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em"}}>
          TARGETFLOW · INTERNAL SYSTEM · RESTRICTED
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
function SuperDashboard({userEmail, onSignOut}) {
  const [snaps,   setSnaps]   = useState({});
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const load = useCallback(async () => {
    const {data} = await supabase.from("client_snapshots").select("*");
    if(data){
      const map = {};
      data.forEach(r => { map[r.client] = r; });
      setSnaps(map);
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
    <div style={{minHeight:"100vh",background:"transparent",position:"relative",zIndex:1}}>
      {/* Heaven background — static, no animation */}
      <div className="heaven-bg"/>
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
            <div style={{fontSize:10,color:"#1e3a5f",fontFamily:"'DM Mono',monospace"}}>
              Refreshed {lastRefresh.toLocaleTimeString("fi-FI",{hour:"2-digit",minute:"2-digit"})}
            </div>
          )}
          <div style={{fontSize:11,color:"#475569",fontFamily:"'DM Mono',monospace"}}>{userEmail.split("@")[0]}</div>
          <button onClick={onSignOut}
            style={{background:"none",border:"1px solid #1e2d45",borderRadius:7,color:"#475569",
              fontFamily:"'DM Mono',monospace",fontSize:10,padding:"4px 10px",cursor:"pointer"}}>
            Sign out
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <div style={{borderBottom:"1px solid rgba(255,255,255,0.03)",background:"rgba(2,4,8,0.7)",backdropFilter:"blur(8px)",padding:"12px 32px",
        display:"flex",gap:32,alignItems:"center"}}>
        <div>
          <div style={{fontSize:9,color:"#334155",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Portfolio Revenue</div>
          <div style={{fontSize:20,fontWeight:600,color:"#e2e8f0",fontFamily:"'DM Mono',monospace"}}>{fmt(totalRevenue)}</div>
        </div>
        <div style={{width:1,height:32,background:"#0f1e30"}}/>
        <div>
          <div style={{fontSize:9,color:"#334155",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Portfolio EBITDA</div>
          <div style={{fontSize:20,fontWeight:600,color:"#2dd4bf",fontFamily:"'DM Mono',monospace"}}>{fmt(totalEBITDA)}</div>
        </div>
        <div style={{width:1,height:32,background:"#0f1e30"}}/>
        <div>
          <div style={{fontSize:9,color:"#334155",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Clients with data</div>
          <div style={{fontSize:20,fontWeight:600,color:"#94a3b8",fontFamily:"'DM Mono',monospace"}}>{clientsWithData}/{CLIENTS.length}</div>
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
      <div style={{padding:"28px 32px",position:"relative",zIndex:1}}>
        {loading ? (
          <div style={{textAlign:"center",color:"#334155",fontFamily:"'DM Mono',monospace",fontSize:12,marginTop:60}}>Loading snapshots…</div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16}}>
            {CLIENTS.map(c => (
              <ClientCard key={c.name} client={c} snap={snaps[c.name]||null}/>
            ))}
          </div>
        )}
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
          <div style={{color:"#1e3a5f",fontFamily:"'DM Mono',monospace",fontSize:11}}>Initialising…</div>
        </div>
      )}
      {stage==="login"   && <LoginScreen  onLogin={goIn}/>}
      {stage==="enroll"  && <MfaEnrollScreen onDone={goIn}/>}
      {stage==="mfa"     && <MfaScreen onVerified={goIn}/>}
      {stage==="done"    && <SuperDashboard userEmail={userEmail} onSignOut={signOut}/>}
    </>
  );
}
