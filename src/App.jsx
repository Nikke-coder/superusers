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
            <img src={TF_LOGO} alt="Targetflow" className="tf-logo-glow" style={{width:220,height:"auto",position:"relative"}}/>
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
  const [snaps,      setSnaps]      = useState({});
  const [loading,    setLoading]    = useState(true);
  const [lastRefresh,setLastRefresh]= useState(null);
  const [activity,   setActivity]   = useState([]);

  const load = useCallback(async () => {
    const [snapRes, authRes] = await Promise.all([
      supabase.from("client_snapshots").select("*"),
      supabase.auth.admin ? Promise.resolve(null) : Promise.resolve(null),
    ]);
    if(snapRes.data){
      const map = {};
      snapRes.data.forEach(r => { map[r.client] = r; });
      setSnaps(map);
      // Build activity feed from snapshot updated_at
      const acts = snapRes.data
        .filter(r=>r.updated_at && r.last_month)
        .sort((a,b)=>new Date(b.updated_at)-new Date(a.updated_at))
        .slice(0,8)
        .map(r=>({
          client: r.client,
          month: r.last_month,
          at: new Date(r.updated_at),
          type: "import"
        }));
      setActivity(acts);
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
      <div style={{padding:"28px 32px 0 32px",position:"relative",zIndex:1}}>
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

      {/* ── Bottom panel: Users + Activity ── */}
      <div style={{padding:"24px 32px 40px",position:"relative",zIndex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:8}}>

        {/* Active users */}
        <div style={{background:"rgba(4,8,20,0.7)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:14,padding:"20px 24px",backdropFilter:"blur(12px)"}}>
          <div style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:"#334155",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:16}}>Portal Users</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[
              {name:"Niklas Isaksson",  email:"niklas.isaksson@targetflow.fi", role:"God Mode", color:"#93c5fd"},
              {name:"Virpi Lämsa",      email:"virpi.lamsa@targetflow.fi",      role:"God Mode", color:"#93c5fd"},
              {name:"Matias Soini",     email:"matias.soini@stremet.fi",        role:"Stremet",  color:"#818cf8"},
              {name:"Carl Axel Schauman",email:"acke@niittysiemen.fi",          role:"Niittysiemen",color:"#4ade80"},
              {name:"Kristina Luhtala", email:"kristina@niittysiemen.fi",       role:"Niittysiemen",color:"#4ade80"},
              {name:"Teemu Sipilä",     email:"teemu.sipila@cuuma.com",         role:"Cuuma",    color:"#60a5fa"},
              {name:"Christine Leisti", email:"christine@drop.fi",              role:"Drop Design",color:"#38bdf8"},
              {name:"Kirsi Junnilainen",email:"kirsi.junnilainen@manutec.fi",   role:"Manutec",  color:"#38bdf8"},
              {name:"Meria Rahkola",    email:"merkku@1306.fi",                 role:"Strand",   color:"#60a5fa"},
              {name:"Lukas Paulikas",   email:"lukas.paulikas@accrease.com",    role:"Accrease", color:"#86efac"},
              {name:"Richard Nilsen",   email:"richard.nilsen@tepcomp.fi",      role:"Tepcomp",  color:"#2dd4bf"},
              {name:"Masi Lehtisalo",   email:"masi.lehtisalo@tepcomp.fi",      role:"Tepcomp",  color:"#2dd4bf"},
            ].map(u=>(
              <div key={u.email} style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:`rgba(${u.color==='#93c5fd'?'147,197,253':u.color==='#818cf8'?'129,140,248':u.color==='#4ade80'?'74,222,128':u.color==='#60a5fa'?'96,165,250':u.color==='#38bdf8'?'56,189,248':u.color==='#86efac'?'134,239,172':'45,212,191'},0.12)`,
                  border:`1px solid ${u.color}22`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <div style={{fontSize:10,fontWeight:600,color:u.color}}>{u.name.charAt(0)}</div>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,color:"#94a3b8",fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{u.name}</div>
                  <div style={{fontSize:9,color:"#334155",fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{u.email}</div>
                </div>
                <div style={{fontSize:9,color:u.color,fontFamily:"'DM Mono',monospace",opacity:0.7,flexShrink:0,
                  background:`${u.color}11`,border:`1px solid ${u.color}22`,borderRadius:4,padding:"2px 6px"}}>{u.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div style={{background:"rgba(4,8,20,0.7)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:14,padding:"20px 24px",backdropFilter:"blur(12px)"}}>
          <div style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:"#334155",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:16}}>Recent Activity</div>
          {activity.length===0 ? (
            <div style={{fontSize:11,color:"#1e3a5f",fontFamily:"'DM Mono',monospace",textAlign:"center",marginTop:30}}>No activity yet</div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {activity.map((a,i)=>{
                const client = CLIENTS.find(c=>c.name===a.client);
                const color = client?.color||"#64748b";
                const ago = (()=>{
                  const diff = (Date.now()-a.at)/1000;
                  if(diff<60) return "just now";
                  if(diff<3600) return `${Math.floor(diff/60)}min ago`;
                  if(diff<86400) return `${Math.floor(diff/3600)}h ago`;
                  return `${Math.floor(diff/86400)}d ago`;
                })();
                return (
                  <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:color,marginTop:4,flexShrink:0,boxShadow:`0 0 6px ${color}88`}}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,color:"#94a3b8"}}>
                        <span style={{color}}>{a.client}</span>
                        {" — data imported through "}
                        <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"#64748b"}}>{a.month}</span>
                      </div>
                      <div style={{fontSize:10,color:"#334155",fontFamily:"'DM Mono',monospace",marginTop:2}}>{ago}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Divider */}
          <div style={{margin:"20px 0",height:1,background:"rgba(255,255,255,0.04)"}}/>

          {/* Signed-in user */}
          <div style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:"#334155",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:12}}>Current Session</div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 8px #4ade8088",flexShrink:0}}/>
            <div style={{fontSize:12,color:"#94a3b8",fontFamily:"'DM Mono',monospace"}}>{userEmail}</div>
            <div style={{marginLeft:"auto",fontSize:9,color:"#4ade80",fontFamily:"'DM Mono',monospace",
              background:"rgba(74,222,128,0.06)",border:"1px solid rgba(74,222,128,0.15)",borderRadius:4,padding:"2px 7px"}}>ONLINE</div>
          </div>
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
