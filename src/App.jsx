import React from "react";
import { useState, useEffect, useCallback } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { createClient } from "@supabase/supabase-js";


// ── Targetflow logo (base64) ─────────────────────────────────────────────────
const TF_LOGO = "data:image/jpeg;base64,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riEXlfaKh29suWNcnpVqdfkhZP3KVIw4sK6mOCIScUKY64wQcsu9T3CtBBADCF5mcNRujDtXVal22WrGsaQHt8LRRVxA+yB3rwHD7v0M0Ys0RMaoagStKLJEG0Sjqxg6wyl1mnh9ce3SoQhxatscfSVNfYsS4k9CWmAgruO6fY1KCLFaz3UL9aPY3WZ9pT0VaIGaLBU356rBNRpKV/oRIpgQgor99AUt0yoKLGCUBvvrUW71hgVRQttTYBuYV/weda7A661Cdy9lbok0s5Z+nlQ/i40bvs9wVcWN2dExoEW8NKtUn6Vd4tPGFHW73+EwwE1tRQVa915Abfdz4JGMwuIByuOviotWEEhvDF1Zehq0TSv0RcIIke6MkJypI0IVnp/ScrWxGAanBe9Kl4DhoyWmxPK0QKc0aV2gVnisr5hW4LeXthu6jI8cpy6n/am6Sx5ZX7eamPFzHd91k1GdlDZ4mjY5CRwaFbL41KbZglmFw9WWmaCPkCayWy6x9FR4VK4Jc5de9FoyKsJFqWA5Zro6oWEotkjj4yAeORuJigGTEAOJx8ocKwL+lmM55Wp8hEW4N7lehv8AGTUliGInRf7JimAbm9FwohAACNwgtaYJaWXnLr+cP//aAAwDAQACAAMAAAAQ+++++++++++++++++++++++++++++++++++++++++++++++++++++973+++++9+++9sA938kviH3x++iBhKA5htV5s+++++98+t++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//EAB8RAQACAgICAwAAAAAAAAAAAAEAESExIGEQQVBgkf/aAAgBAwEBPxD5VQ3O6DfIR1wSyoQ7gpKQLAMTWIKCorW8sxgStHcvzruJWmK/ZVVRttiYmVRKEVyBuUlIXbyt6gpXhL+j/wD/xAAfEQEAAgICAwEBAAAAAAAAAAABABEhMSBBEFFhUGD/2gAIAQIBAT8Q/VUNs+sG8nIR1wSypgW2AKn2gkCxFWREfcXsyzBpK0PuWXXnVcSgSOY9ygKI0KMDh6gAvUWQGWUlTqJt5X0EqV4Qf4f/xAAlEAEBAAIDAAEEAgMBAAAAAAABEQAhMUFRYSAwcYEQkUBwwfD/2gAIAQEAAT8Q/wBxrx3kR/RXEXQBK/sQYWiFN9AhtR6AeR/4VAuYzz1uxomx4Xq/YPsCjnAqw3oF+gcfnjOdYWhTcTSP2Nz+3q41EJu5bUowwVbpGnb+NnuB9IFO2jCa9jrZhoHAIAUaIQbHFivc/wBgJ+wPSp54IcVIM/45+5bo9GxEGlUPHOQO9bveANqugFdGA7mwIIJLgjUu5nPdiyWz4B3SiLK+iiLoycgPgCMc/YRM4AqrwGAPChu269yS+DE3U5tpYfBYfAZvcsszsnAUqAduDom6JWmKCBQoFBuK9aHRGIJcRpFsXHLRrOUCDQgiABMI2WW22B6SFQwlgDw9U+waSvym9YURQEeEuCgr0usMQGcAqG9ygwlCtK7a+sHbIFAQwjeGlqHiSAQK0NnlgHFZgiFdFAqWxDuwOMqcXBdjfRgOVsVabNqiXoxQxbaGIu3YB2CluPp5rAjXbRtpAJkOScSUHvVHbyf5fZI8M2BIpAIU6ZSAtu0JhZqylYy448oWSzAa11P5N+4RUwidirD0WgO6J/smL19MXCCpeD8kQdckdcNhX09LgNgXMrgKpFlOUhQxztC0bQPAQh15YEjE0SoEHPdNXcDKgdWKIi7jj9fvCwrctPF3CDkl8IsfvI6LheErefJiUbAadUFSqxKtQV6SGktCPGk86WuFHtCOuxTQLRddChAww7cyCyF7vJMCW9dUYhEwiinGrG/g/uYAdGPruOv7zwxC+vlmHsKpwmDFJdvan9r8Ly5loC6Q8DaepDaYa5VBpkdBeuB1rUhSQcG98CP2/oKG4uJM+Sj8Dl+1jgPawX0K9cO4YdEKmCd8i1xGLv2pkCgpVkFrC4CgP99YICQR1RI6LK4iBD7I9aVA7/jVESVGJrwbyCN540QNS4iIONU4Dm7HONWkfCjFjNVWpzCamo6RjljBz7sBkcgBVBTS8M1xdt0pKU3BSzd31DSdcn/AYfAwtth8sj5cR3xRPVRU856Rhy0llS3fuo3KD3OQJNkoeSrCcArcZtwRtLItbSxjh0mKJNRsNoK2rOlYAMMYZDUq7Buc/QNvxk7RAUemXSk+dhVj8fVyVwkO6ec/EalchyG0GEvRvvd9JVUllEPaCCb4JzD/AATbGKsBeM24LiWo1KRJcAAuFQ6nl+DoDQAED/eH/9k=";

// ── Supabase (shared project) ─────────────────────────────────────────────────
const SUPA_URL    = "https://jzqgndcrukggcwthxyrv.supabase.co";
const SUPA_ANON   = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6cWduZGNydWtnZ2N3dGh4eXJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTA3NDIsImV4cCI6MjA4ODUyNjc0Mn0.6nSM1D1P36Did6pT27IBvO-tSQ2ihSrxhlZLlaEhvEc";
const SUPA_SVC    = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6cWduZGNydWtnZ2N3dGh4eXJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk1MDc0MiwiZXhwIjoyMDg4NTI2NzQyfQ.9MN8k-RkBYskeAYDpBQAKWVEoT_L81-uy4ivV_b0L5w";
const supabase    = createClient(SUPA_URL, SUPA_ANON);   // auth + reads
const supabaseSvc = createClient(SUPA_URL, SUPA_SVC);    // writes — bypasses RLS

// Cuuma + Strand project
const SUPA_URL2    = "https://wzooguqwbuxepwkffwpp.supabase.co";
const SUPA_ANON2   = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6b29ndXF3YnV4ZXB3a2Zmd3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4Njg4NDUsImV4cCI6MjA4ODQ0NDg0NX0.yBeF4aM1vXtQ8YJhAhS93tX4mPEFbZ0tOHzUJpIufGc";
const SUPA_SVC2    = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6b29ndXF3YnV4ZXB3a2Zmd3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjg2ODg0NSwiZXhwIjoyMDg4NDQ0ODQ1fQ.BiW0Z34CG_cNsPNzyZtvuUn5ulCs149c-DYXncmu0MU";
const supabase2    = createClient(SUPA_URL2, SUPA_ANON2);
const supabaseSvc2 = createClient(SUPA_URL2, SUPA_SVC2);

const CUUMA_CLIENTS = ["Strand Group", "Cuuma"];
const getDb    = (clientName) => CUUMA_CLIENTS.includes(clientName) ? supabase2    : supabase;
const getDbSvc = (clientName) => CUUMA_CLIENTS.includes(clientName) ? supabaseSvc2 : supabaseSvc;

// ── Access control ────────────────────────────────────────────────────────────
const ALLOWED = ["niklas.isaksson@targetflow.fi","virpi.lamsa@targetflow.fi"];

// ── Client registry ───────────────────────────────────────────────────────────
const CLIENTS = [
  { name:"Targetflow",       accent:"#93c5fd", url:"https://superusers.targetflow.fi"          },
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
  @keyframes rise{
    0%  {opacity:0;transform:translateY(0)}
    5%  {opacity:var(--op,0.55)}
    90% {opacity:calc(var(--op,0.55)*0.25)}
    100%{opacity:0;transform:translateY(-100vh)}
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
  /* dot grid removed */
  .lx-bg::before{ content:''; }

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
  .login-input::placeholder{color:rgba(255,255,255,0.35);}

  /* Enter God Mode button */
  .god-btn{
    position:relative;overflow:hidden;
    width:100%;padding:15px 20px;
    border-radius:7px;cursor:pointer;
    font-family:'DM Mono',monospace;font-size:11px;font-weight:500;
    letter-spacing:0.18em;text-transform:uppercase;
    color:#ffffff;
    background:rgba(255,255,255,0.09);
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
  const PARTICLES = Array.from({length:18},(_,i)=>({
    left:  `${(i * 5.5 + 2) % 96}%`,
    size:  `${1 + (i%4)*0.6}px`,
    dur:   `${7 + (i%6)*2.2}s`,
    delay: `${((i * 1.7) % (7 + (i%6)*2.2)).toFixed(2)}s`,
    op:    0.25 + (i%5)*0.12,
  }));



  return (
    <div style={{minHeight:"100vh",position:"relative",background:"#05060f",overflow:"hidden"}}>

      {/* ── Background ── */}
      <div className="lx-bg"/>
      <div className="lx-glow"/>

      {/* ── Rising particles (bottom of screen, full width) ── */}
      {PARTICLES.map((p,i)=>(
        <div key={i} style={{
          position:"fixed",bottom:"-10px",left:p.left,
          width:p.size,height:p.size,borderRadius:"50%",
          background:"rgba(200,225,255,0.85)",
          boxShadow:"0 0 5px rgba(200,225,255,0.5)",
          "--op":p.op,
          animation:`rise ${p.dur} ease-in infinite`,
          animationDelay:`-${p.delay}`,
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
            filter:"drop-shadow(0 0 12px rgba(255,255,255,0.3)) brightness(1.1)",
          }}/>
      </div>

      {/* ── Right panel ── */}
      <div className="lx-panel">

        {/* Tag */}
        <div style={{
          fontFamily:"'DM Mono',monospace",fontSize:8,
          letterSpacing:"0.3em",color:"rgba(240,248,255,0.75)",
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
          color:"rgba(200,225,255,0.5)",letterSpacing:"0.15em",
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
  {name:"Niklas Isaksson",   email:"niklas.isaksson@targetflow.fi", role:"God Mode",     color:"#93c5fd", client:"Targetflow"},
  {name:"Virpi Lämsa",       email:"virpi.lamsa@targetflow.fi",      role:"God Mode",     color:"#93c5fd", client:"Targetflow"},
  {name:"Matias Soini",      email:"matias.soini@stremet.fi",        role:"Stremet",      color:"#818cf8"},
  {name:"Carl Axel Schauman",email:"acke@niittysiemen.fi",           role:"Niittysiemen", color:"#4ade80"},
  {name:"Kristina Luhtala",  email:"kristina@niittysiemen.fi",       role:"Niittysiemen", color:"#4ade80"},
  {name:"Teemu Sipilä",      email:"teemu.sipila@cuuma.com",         role:"Cuuma",        color:"#60a5fa"},
  {name:"Christine Leisti",  email:"christine@drop.fi",              role:"Drop Design Pool", color:"#38bdf8"},
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
// ── AuditTrail ────────────────────────────────────────────────────────────────
function AuditTrail() {
  const [log,     setLog]     = React.useState([]);
  const [abuse,   setAbuse]   = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(()=>{
    Promise.all([
      supabase.from("ai_transactions").select("*")
        .in("type",["purchase","adjustment"]).eq("package","manual")
        .order("created_at",{ascending:false}).limit(100),
      supabase.from("stripe_abuse_log").select("*")
        .order("created_at",{ascending:false}).limit(50),
    ]).then(([{data:tx},{data:ab}])=>{
      setLog(tx||[]); setAbuse(ab||[]); setLoading(false);
    });
  },[]);

  const fmt = (iso) => new Date(iso).toLocaleString("fi-FI",{
    day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"
  });

  if(loading) return <div style={{fontSize:10,color:"rgba(100,140,200,0.4)",fontFamily:"'DM Mono',monospace",padding:"12px 0"}}>Loading…</div>;

  return (
    <div>
      {/* Manual grants */}
      <div style={{fontSize:9,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",
        letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>Manual credit changes</div>
      {log.length===0
        ? <div style={{fontSize:10,color:"rgba(100,140,200,0.4)",fontFamily:"'DM Mono',monospace",padding:"8px 0",marginBottom:16}}>No entries yet.</div>
        : <div style={{border:"1px solid rgba(100,150,255,0.08)",borderRadius:9,overflow:"hidden",marginBottom:20}}>
            <div style={{display:"grid",gridTemplateColumns:"1.5fr 1.5fr 1fr 70px 130px",
              padding:"7px 14px",borderBottom:"1px solid rgba(100,150,255,0.08)",
              fontSize:9,color:"rgba(100,140,200,0.4)",fontFamily:"'DM Mono',monospace",
              letterSpacing:"0.08em",textTransform:"uppercase"}}>
              <span>User</span><span>Client</span><span>Granted by</span><span>Cr</span><span style={{textAlign:"right"}}>When</span>
            </div>
            {log.map((tx,i)=>(
              <div key={tx.id||i} style={{display:"grid",gridTemplateColumns:"1.5fr 1.5fr 1fr 70px 130px",
                padding:"8px 14px",borderBottom:i<log.length-1?"1px solid rgba(100,150,255,0.05)":"none",
                fontSize:11,alignItems:"center",background:i%2===0?"transparent":"rgba(10,20,50,0.3)"}}>
                <span style={{color:"#c0d8f0",fontSize:10,overflow:"hidden",textOverflow:"ellipsis"}}>{tx.user_email||"—"}</span>
                <span style={{color:"rgba(160,200,255,0.6)",fontSize:10}}>{tx.client}</span>
                <span style={{color:"rgba(160,200,255,0.4)",fontFamily:"'DM Mono',monospace",fontSize:10}}>{tx.granted_by||"—"}</span>
                <span style={{color:tx.credits>0?"#4ade80":"#f87171",fontFamily:"'DM Mono',monospace",fontWeight:700}}>
                  {tx.credits>0?"+":""}{tx.credits}
                </span>
                <span style={{color:"rgba(100,140,200,0.5)",fontFamily:"'DM Mono',monospace",fontSize:10,textAlign:"right"}}>{fmt(tx.created_at)}</span>
              </div>
            ))}
          </div>
      }

      {/* Abuse log */}
      {abuse.length>0&&(
        <>
          <div style={{fontSize:9,color:"rgba(248,113,113,0.7)",fontFamily:"'DM Mono',monospace",
            letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>⚠ Stripe abuse attempts</div>
          <div style={{border:"1px solid rgba(248,113,113,0.15)",borderRadius:9,overflow:"hidden"}}>
            {abuse.map((a,i)=>(
              <div key={a.id||i} style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr",
                padding:"8px 14px",borderBottom:i<abuse.length-1?"1px solid rgba(248,113,113,0.08)":"none",
                fontSize:11,background:"rgba(248,113,113,0.03)"}}>
                <span style={{color:"#fca5a5",fontSize:10}}>{a.user_email||"—"}</span>
                <span style={{color:"rgba(200,160,160,0.6)",fontSize:10}}>{a.client}</span>
                <span style={{color:"rgba(200,160,160,0.5)",fontSize:10}}>{a.package}</span>
                <span style={{color:"rgba(200,160,160,0.4)",fontFamily:"'DM Mono',monospace",fontSize:10,textAlign:"right"}}>{fmt(a.created_at)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SuperDashboard({userEmail, onSignOut}) {
  const [snaps,      setSnaps]      = useState({});
  const [loading,    setLoading]    = useState(true);
  const [lastRefresh,setLastRefresh]= useState(null);
  const [activity,   setActivity]   = useState([]);
  const [users,      setUsers]      = useState([]);
  const [userTab,    setUserTab]    = useState("overview");
  const [aiUsage,    setAiUsage]    = useState([]);
  const [credits,    setCredits]    = useState([]);
  const [creditAmt,  setCreditAmt]  = useState({});
  const [confirming, setConfirming] = useState(null); // client name being confirmed
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
    const [credRes1, credRes2] = await Promise.all([
      supabase.from("ai_credits").select("client,user_email,balance,updated_at").order("user_email"),
      supabase2.from("ai_credits").select("client,user_email,balance,updated_at").order("user_email"),
    ]);
    const allCredits = [...(credRes1.data||[]), ...(credRes2.data||[])];
    if(allCredits.length) setCredits(allCredits);
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
          ["credits","💳 Credits"],
          ["audit","Audit Trail"],
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

      {dash==="credits" && (
        <div style={{background:"rgba(6,10,24,0.7)",border:"1px solid rgba(100,150,255,0.07)",
          borderRadius:12,padding:"20px 24px",backdropFilter:"blur(12px)"}}>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <div style={{fontSize:9,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",
              letterSpacing:"0.15em",textTransform:"uppercase"}}>Credits Manager</div>
            <div style={{fontSize:9,color:"rgba(100,140,200,0.4)",fontFamily:"'DM Mono',monospace"}}>1 credit = 1 question = €0.05</div>
          </div>

          {/* User credit cards */}
          <div style={{marginBottom:16}}>
            {/* Group by client */}
            {CLIENTS.map(c => {
              const clientUsers = USER_REGISTRY.filter(u =>
                u.client === c.name ||
                u.role === c.name.replace(" Oy","").replace(" Group","") ||
                (c.name === "Targetflow" && u.role === "God Mode")
              );
              const userEmails = clientUsers.map(u => u.email);
              const clientCredits = credits.filter(cr => userEmails.includes(cr.user_email) || cr.client === c.name);

              if(clientCredits.length === 0 && clientUsers.length === 0) return null;

              return (
                <div key={c.name} style={{marginBottom:16}}>
                  <div style={{fontSize:9,color:"rgba(140,180,255,0.4)",fontFamily:"'DM Mono',monospace",
                    letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8,
                    paddingBottom:6,borderBottom:"1px solid rgba(100,150,255,0.06)"}}>
                    {c.name}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:10}}>
                    {(clientUsers.length > 0 ? clientUsers : [{email: c.name, name: c.name}]).map(u => {
                      const cr  = credits.find(x => x.user_email === u.email || (!u.email.includes("@") && x.client === u.email));
                      const bal = cr?.balance ?? 0;
                      const amt = creditAmt[u.email] ?? 100;
                      const isConf = confirming === u.email;
                      return (
                        <div key={u.email} style={{background:"rgba(10,18,40,0.8)",
                          border:"1px solid "+(isConf?"rgba(99,102,241,0.5)":"rgba(100,150,255,0.08)"),
                          borderRadius:10,padding:"12px 14px"}}>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                            <div>
                              <div style={{fontSize:12,fontWeight:600,color:"#e2e8f0"}}>{u.name||u.email}</div>
                              <div style={{fontSize:9,color:"rgba(140,180,255,0.4)",fontFamily:"'DM Mono',monospace"}}>{u.email}</div>
                            </div>
                            <div style={{fontSize:13,fontFamily:"'DM Mono',monospace",fontWeight:700,
                              color:bal>20?"#4ade80":bal>0?"#fbbf24":"#f87171"}}>{bal} cr</div>
                          </div>

                          {!isConf && (
                            <div style={{display:"flex",gap:6,alignItems:"center"}}>
                              <input type="number" min="-9999" max="9999" value={amt}
                                onChange={e => setCreditAmt(prev => ({...prev,[u.email]:parseInt(e.target.value)||0}))}
                                style={{width:72,background:"#070d1e",border:"1px solid #1e2d45",borderRadius:7,
                                  padding:"5px 8px",color:"#e2e8f0",fontSize:11,outline:"none",
                                  fontFamily:"'DM Mono',monospace",textAlign:"center"}}/>
                              <span style={{fontSize:10,color:"rgba(140,180,255,0.4)",fontFamily:"'DM Mono',monospace"}}>cr</span>
                              <button onClick={() => setConfirming(u.email)}
                                style={{marginLeft:"auto",padding:"5px 12px",background:amt>=0?"rgba(99,102,241,0.15)":"rgba(248,113,113,0.1)",
                                  border:"1px solid "+(amt>=0?"rgba(99,102,241,0.35)":"rgba(248,113,113,0.3)"),
                                  borderRadius:7,color:amt>=0?"#a5b4fc":"#fca5a5",
                                  fontSize:11,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontWeight:600}}>
                                {amt >= 0 ? "+ Add" : "− Remove"}
                              </button>
                            </div>
                          )}

                          {isConf && (
                            <div>
                              <div style={{fontSize:11,color:"#c0d8f0",marginBottom:8,
                                padding:"7px 10px",background:amt>=0?"rgba(99,102,241,0.08)":"rgba(248,113,113,0.08)",
                                border:"1px solid "+(amt>=0?"rgba(99,102,241,0.2)":"rgba(248,113,113,0.2)"),borderRadius:7}}>
                                {amt >= 0 ? "Add" : "Remove"} <span style={{color:amt>=0?"#a5b4fc":"#fca5a5",fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{Math.abs(amt)} cr</span> {amt>=0?"to":"from"} <span style={{color:"#e2e8f0",fontWeight:600}}>{u.name||u.email}</span>
                                <div style={{fontSize:10,color:"rgba(140,180,255,0.5)",marginTop:3,fontFamily:"'DM Mono',monospace"}}>
                                  {bal} cr → {Math.max(0, bal + amt)} cr
                                </div>
                              </div>
                              <div style={{display:"flex",gap:6}}>
                                <button onClick={async () => {
                                    const db = getDbSvc(c.name);
                                    const newBal = Math.max(0, bal + amt);
                                    const {error: credErr} = await db.from("ai_credits").upsert(
                                      {user_email: u.email, client: c.name, balance: newBal, updated_at: new Date().toISOString()},
                                      {onConflict: "user_email"}
                                    );
                                    if(credErr) { alert("Error: " + credErr.message); return; }
                                    await db.from("ai_transactions").insert({
                                      client: c.name, user_email: u.email,
                                      credits: amt, type: amt>=0?"purchase":"adjustment",
                                      package: "manual", granted_by: userEmail
                                    });
                                    setCredits(prev => [...prev.filter(x=>x.user_email!==u.email),
                                      {user_email:u.email, client:c.name, balance:newBal, updated_at:new Date().toISOString()}]);
                                    setConfirming(null);
                                  }}
                                  style={{flex:1,padding:"6px 0",background:"rgba(74,222,128,0.12)",
                                    border:"1px solid rgba(74,222,128,0.35)",borderRadius:7,color:"#4ade80",
                                    fontSize:12,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontWeight:700}}>
                                  ✓ Confirm
                                </button>
                                <button onClick={() => setConfirming(null)}
                                  style={{flex:1,padding:"6px 0",background:"rgba(100,116,139,0.1)",
                                    border:"1px solid rgba(100,116,139,0.2)",borderRadius:7,color:"#64748b",
                                    fontSize:12,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                          {cr?.updated_at && !isConf && (
                            <div style={{fontSize:9,color:"rgba(100,140,200,0.3)",fontFamily:"'DM Mono',monospace",marginTop:6}}>
                              Updated {new Date(cr.updated_at).toLocaleDateString("fi-FI")}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{fontSize:9,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",
            letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:12}}>
            Audit Trail — Manual Credit Grants
          </div>
          <AuditTrail />

        </div>
      )}

      {dash==="audit" && (
        <div style={{background:"rgba(6,10,24,0.7)",border:"1px solid rgba(100,150,255,0.07)",
          borderRadius:12,padding:"20px 24px",backdropFilter:"blur(12px)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{fontSize:9,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",
              letterSpacing:"0.15em",textTransform:"uppercase"}}>Audit Trail — Manual Credit Grants</div>
            <div style={{fontSize:9,color:"rgba(100,140,200,0.4)",fontFamily:"'DM Mono',monospace"}}>last 100 events</div>
          </div>
          <AuditTrail />
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
}const TF_LOGO = "data:image/png;base64,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";
port React from "react";
import { useState, useEffect, useCallback } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { createClient } from "@supabase/supabase-js";


// ── Targetflow logo (base64) ─────────────────────────────────────────────────
const TF_LOGO = "data:image/jpeg;base64,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riEXlfaKh29suWNcnpVqdfkhZP3KVIw4sK6mOCIScUKY64wQcsu9T3CtBBADCF5mcNRujDtXVal22WrGsaQHt8LRRVxA+yB3rwHD7v0M0Ys0RMaoagStKLJEG0Sjqxg6wyl1mnh9ce3SoQhxatscfSVNfYsS4k9CWmAgruO6fY1KCLFaz3UL9aPY3WZ9pT0VaIGaLBU356rBNRpKV/oRIpgQgor99AUt0yoKLGCUBvvrUW71hgVRQttTYBuYV/weda7A661Cdy9lbok0s5Z+nlQ/i40bvs9wVcWN2dExoEW8NKtUn6Vd4tPGFHW73+EwwE1tRQVa915Abfdz4JGMwuIByuOviotWEEhvDF1Zehq0TSv0RcIIke6MkJypI0IVnp/ScrWxGAanBe9Kl4DhoyWmxPK0QKc0aV2gVnisr5hW4LeXthu6jI8cpy6n/am6Sx5ZX7eamPFzHd91k1GdlDZ4mjY5CRwaFbL41KbZglmFw9WWmaCPkCayWy6x9FR4VK4Jc5de9FoyKsJFqWA5Zro6oWEotkjj4yAeORuJigGTEAOJx8ocKwL+lmM55Wp8hEW4N7lehv8AGTUliGInRf7JimAbm9FwohAACNwgtaYJaWXnLr+cP//aAAwDAQACAAMAAAAQ+++++++++++++++++++++++++++++++++++++++++++++++++++++973+++++9+++9sA938kviH3x++iBhKA5htV5s+++++98+t++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//EAB8RAQACAgICAwAAAAAAAAAAAAEAESExIGEQQVBgkf/aAAgBAwEBPxD5VQ3O6DfIR1wSyoQ7gpKQLAMTWIKCorW8sxgStHcvzruJWmK/ZVVRttiYmVRKEVyBuUlIXbyt6gpXhL+j/wD/xAAfEQEAAgICAwEBAAAAAAAAAAABABEhMSBBEFFhUGD/2gAIAQIBAT8Q/VUNs+sG8nIR1wSypgW2AKn2gkCxFWREfcXsyzBpK0PuWXXnVcSgSOY9ygKI0KMDh6gAvUWQGWUlTqJt5X0EqV4Qf4f/xAAlEAEBAAIDAAEEAgMBAAAAAAABEQAhMUFRYSAwcYEQkUBwwfD/2gAIAQEAAT8Q/wBxrx3kR/RXEXQBK/sQYWiFN9AhtR6AeR/4VAuYzz1uxomx4Xq/YPsCjnAqw3oF+gcfnjOdYWhTcTSP2Nz+3q41EJu5bUowwVbpGnb+NnuB9IFO2jCa9jrZhoHAIAUaIQbHFivc/wBgJ+wPSp54IcVIM/45+5bo9GxEGlUPHOQO9bveANqugFdGA7mwIIJLgjUu5nPdiyWz4B3SiLK+iiLoycgPgCMc/YRM4AqrwGAPChu269yS+DE3U5tpYfBYfAZvcsszsnAUqAduDom6JWmKCBQoFBuK9aHRGIJcRpFsXHLRrOUCDQgiABMI2WW22B6SFQwlgDw9U+waSvym9YURQEeEuCgr0usMQGcAqG9ygwlCtK7a+sHbIFAQwjeGlqHiSAQK0NnlgHFZgiFdFAqWxDuwOMqcXBdjfRgOVsVabNqiXoxQxbaGIu3YB2CluPp5rAjXbRtpAJkOScSUHvVHbyf5fZI8M2BIpAIU6ZSAtu0JhZqylYy448oWSzAa11P5N+4RUwidirD0WgO6J/smL19MXCCpeD8kQdckdcNhX09LgNgXMrgKpFlOUhQxztC0bQPAQh15YEjE0SoEHPdNXcDKgdWKIi7jj9fvCwrctPF3CDkl8IsfvI6LheErefJiUbAadUFSqxKtQV6SGktCPGk86WuFHtCOuxTQLRddChAww7cyCyF7vJMCW9dUYhEwiinGrG/g/uYAdGPruOv7zwxC+vlmHsKpwmDFJdvan9r8Ly5loC6Q8DaepDaYa5VBpkdBeuB1rUhSQcG98CP2/oKG4uJM+Sj8Dl+1jgPawX0K9cO4YdEKmCd8i1xGLv2pkCgpVkFrC4CgP99YICQR1RI6LK4iBD7I9aVA7/jVESVGJrwbyCN540QNS4iIONU4Dm7HONWkfCjFjNVWpzCamo6RjljBz7sBkcgBVBTS8M1xdt0pKU3BSzd31DSdcn/AYfAwtth8sj5cR3xRPVRU856Rhy0llS3fuo3KD3OQJNkoeSrCcArcZtwRtLItbSxjh0mKJNRsNoK2rOlYAMMYZDUq7Buc/QNvxk7RAUemXSk+dhVj8fVyVwkO6ec/EalchyG0GEvRvvd9JVUllEPaCCb4JzD/AATbGKsBeM24LiWo1KRJcAAuFQ6nl+DoDQAED/eH/9k=";

// ── Supabase (shared project) ─────────────────────────────────────────────────
const SUPA_URL    = "https://jzqgndcrukggcwthxyrv.supabase.co";
const SUPA_ANON   = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6cWduZGNydWtnZ2N3dGh4eXJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTA3NDIsImV4cCI6MjA4ODUyNjc0Mn0.6nSM1D1P36Did6pT27IBvO-tSQ2ihSrxhlZLlaEhvEc";
const SUPA_SVC    = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6cWduZGNydWtnZ2N3dGh4eXJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjk1MDc0MiwiZXhwIjoyMDg4NTI2NzQyfQ.9MN8k-RkBYskeAYDpBQAKWVEoT_L81-uy4ivV_b0L5w";
const supabase    = createClient(SUPA_URL, SUPA_ANON);   // auth + reads
const supabaseSvc = createClient(SUPA_URL, SUPA_SVC);    // writes — bypasses RLS

// Cuuma + Strand project
const SUPA_URL2    = "https://wzooguqwbuxepwkffwpp.supabase.co";
const SUPA_ANON2   = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6b29ndXF3YnV4ZXB3a2Zmd3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4Njg4NDUsImV4cCI6MjA4ODQ0NDg0NX0.yBeF4aM1vXtQ8YJhAhS93tX4mPEFbZ0tOHzUJpIufGc";
const SUPA_SVC2    = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6b29ndXF3YnV4ZXB3a2Zmd3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjg2ODg0NSwiZXhwIjoyMDg4NDQ0ODQ1fQ.BiW0Z34CG_cNsPNzyZtvuUn5ulCs149c-DYXncmu0MU";
const supabase2    = createClient(SUPA_URL2, SUPA_ANON2);
const supabaseSvc2 = createClient(SUPA_URL2, SUPA_SVC2);

const CUUMA_CLIENTS = ["Strand Group", "Cuuma"];
const getDb    = (clientName) => CUUMA_CLIENTS.includes(clientName) ? supabase2    : supabase;
const getDbSvc = (clientName) => CUUMA_CLIENTS.includes(clientName) ? supabaseSvc2 : supabaseSvc;

// ── Access control ────────────────────────────────────────────────────────────
const ALLOWED = ["niklas.isaksson@targetflow.fi","virpi.lamsa@targetflow.fi"];

// ── Client registry ───────────────────────────────────────────────────────────
const CLIENTS = [
  { name:"Targetflow",       accent:"#93c5fd", url:"https://superusers.targetflow.fi"          },
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
  @keyframes rise{
    0%  {opacity:0;transform:translateY(0)}
    5%  {opacity:var(--op,0.55)}
    90% {opacity:calc(var(--op,0.55)*0.25)}
    100%{opacity:0;transform:translateY(-100vh)}
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
  /* dot grid removed */
  .lx-bg::before{ content:''; }

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
  .login-input::placeholder{color:rgba(255,255,255,0.35);}

  /* Enter God Mode button */
  .god-btn{
    position:relative;overflow:hidden;
    width:100%;padding:15px 20px;
    border-radius:7px;cursor:pointer;
    font-family:'DM Mono',monospace;font-size:11px;font-weight:500;
    letter-spacing:0.18em;text-transform:uppercase;
    color:#ffffff;
    background:rgba(255,255,255,0.09);
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
  const PARTICLES = Array.from({length:18},(_,i)=>({
    left:  `${(i * 5.5 + 2) % 96}%`,
    size:  `${1 + (i%4)*0.6}px`,
    dur:   `${7 + (i%6)*2.2}s`,
    delay: `${((i * 1.7) % (7 + (i%6)*2.2)).toFixed(2)}s`,
    op:    0.25 + (i%5)*0.12,
  }));



  return (
    <div style={{minHeight:"100vh",position:"relative",background:"#05060f",overflow:"hidden"}}>

      {/* ── Background ── */}
      <div className="lx-bg"/>
      <div className="lx-glow"/>

      {/* ── Rising particles (bottom of screen, full width) ── */}
      {PARTICLES.map((p,i)=>(
        <div key={i} style={{
          position:"fixed",bottom:"-10px",left:p.left,
          width:p.size,height:p.size,borderRadius:"50%",
          background:"rgba(200,225,255,0.85)",
          boxShadow:"0 0 5px rgba(200,225,255,0.5)",
          "--op":p.op,
          animation:`rise ${p.dur} ease-in infinite`,
          animationDelay:`-${p.delay}`,
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
            filter:"drop-shadow(0 0 12px rgba(255,255,255,0.3)) brightness(1.1)",
          }}/>
      </div>

      {/* ── Right panel ── */}
      <div className="lx-panel">

        {/* Tag */}
        <div style={{
          fontFamily:"'DM Mono',monospace",fontSize:8,
          letterSpacing:"0.3em",color:"rgba(240,248,255,0.75)",
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
          color:"rgba(200,225,255,0.5)",letterSpacing:"0.15em",
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
  {name:"Niklas Isaksson",   email:"niklas.isaksson@targetflow.fi", role:"God Mode",     color:"#93c5fd", client:"Targetflow"},
  {name:"Virpi Lämsa",       email:"virpi.lamsa@targetflow.fi",      role:"God Mode",     color:"#93c5fd", client:"Targetflow"},
  {name:"Matias Soini",      email:"matias.soini@stremet.fi",        role:"Stremet",      color:"#818cf8"},
  {name:"Carl Axel Schauman",email:"acke@niittysiemen.fi",           role:"Niittysiemen", color:"#4ade80"},
  {name:"Kristina Luhtala",  email:"kristina@niittysiemen.fi",       role:"Niittysiemen", color:"#4ade80"},
  {name:"Teemu Sipilä",      email:"teemu.sipila@cuuma.com",         role:"Cuuma",        color:"#60a5fa"},
  {name:"Christine Leisti",  email:"christine@drop.fi",              role:"Drop Design Pool", color:"#38bdf8"},
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
// ── AuditTrail ────────────────────────────────────────────────────────────────
function AuditTrail() {
  const [log,     setLog]     = React.useState([]);
  const [abuse,   setAbuse]   = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(()=>{
    Promise.all([
      supabase.from("ai_transactions").select("*")
        .in("type",["purchase","adjustment"]).eq("package","manual")
        .order("created_at",{ascending:false}).limit(100),
      supabase.from("stripe_abuse_log").select("*")
        .order("created_at",{ascending:false}).limit(50),
    ]).then(([{data:tx},{data:ab}])=>{
      setLog(tx||[]); setAbuse(ab||[]); setLoading(false);
    });
  },[]);

  const fmt = (iso) => new Date(iso).toLocaleString("fi-FI",{
    day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"
  });

  if(loading) return <div style={{fontSize:10,color:"rgba(100,140,200,0.4)",fontFamily:"'DM Mono',monospace",padding:"12px 0"}}>Loading…</div>;

  return (
    <div>
      {/* Manual grants */}
      <div style={{fontSize:9,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",
        letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>Manual credit changes</div>
      {log.length===0
        ? <div style={{fontSize:10,color:"rgba(100,140,200,0.4)",fontFamily:"'DM Mono',monospace",padding:"8px 0",marginBottom:16}}>No entries yet.</div>
        : <div style={{border:"1px solid rgba(100,150,255,0.08)",borderRadius:9,overflow:"hidden",marginBottom:20}}>
            <div style={{display:"grid",gridTemplateColumns:"1.5fr 1.5fr 1fr 70px 130px",
              padding:"7px 14px",borderBottom:"1px solid rgba(100,150,255,0.08)",
              fontSize:9,color:"rgba(100,140,200,0.4)",fontFamily:"'DM Mono',monospace",
              letterSpacing:"0.08em",textTransform:"uppercase"}}>
              <span>User</span><span>Client</span><span>Granted by</span><span>Cr</span><span style={{textAlign:"right"}}>When</span>
            </div>
            {log.map((tx,i)=>(
              <div key={tx.id||i} style={{display:"grid",gridTemplateColumns:"1.5fr 1.5fr 1fr 70px 130px",
                padding:"8px 14px",borderBottom:i<log.length-1?"1px solid rgba(100,150,255,0.05)":"none",
                fontSize:11,alignItems:"center",background:i%2===0?"transparent":"rgba(10,20,50,0.3)"}}>
                <span style={{color:"#c0d8f0",fontSize:10,overflow:"hidden",textOverflow:"ellipsis"}}>{tx.user_email||"—"}</span>
                <span style={{color:"rgba(160,200,255,0.6)",fontSize:10}}>{tx.client}</span>
                <span style={{color:"rgba(160,200,255,0.4)",fontFamily:"'DM Mono',monospace",fontSize:10}}>{tx.granted_by||"—"}</span>
                <span style={{color:tx.credits>0?"#4ade80":"#f87171",fontFamily:"'DM Mono',monospace",fontWeight:700}}>
                  {tx.credits>0?"+":""}{tx.credits}
                </span>
                <span style={{color:"rgba(100,140,200,0.5)",fontFamily:"'DM Mono',monospace",fontSize:10,textAlign:"right"}}>{fmt(tx.created_at)}</span>
              </div>
            ))}
          </div>
      }

      {/* Abuse log */}
      {abuse.length>0&&(
        <>
          <div style={{fontSize:9,color:"rgba(248,113,113,0.7)",fontFamily:"'DM Mono',monospace",
            letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>⚠ Stripe abuse attempts</div>
          <div style={{border:"1px solid rgba(248,113,113,0.15)",borderRadius:9,overflow:"hidden"}}>
            {abuse.map((a,i)=>(
              <div key={a.id||i} style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr",
                padding:"8px 14px",borderBottom:i<abuse.length-1?"1px solid rgba(248,113,113,0.08)":"none",
                fontSize:11,background:"rgba(248,113,113,0.03)"}}>
                <span style={{color:"#fca5a5",fontSize:10}}>{a.user_email||"—"}</span>
                <span style={{color:"rgba(200,160,160,0.6)",fontSize:10}}>{a.client}</span>
                <span style={{color:"rgba(200,160,160,0.5)",fontSize:10}}>{a.package}</span>
                <span style={{color:"rgba(200,160,160,0.4)",fontFamily:"'DM Mono',monospace",fontSize:10,textAlign:"right"}}>{fmt(a.created_at)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SuperDashboard({userEmail, onSignOut}) {
  const [snaps,      setSnaps]      = useState({});
  const [loading,    setLoading]    = useState(true);
  const [lastRefresh,setLastRefresh]= useState(null);
  const [activity,   setActivity]   = useState([]);
  const [users,      setUsers]      = useState([]);
  const [userTab,    setUserTab]    = useState("overview");
  const [aiUsage,    setAiUsage]    = useState([]);
  const [credits,    setCredits]    = useState([]);
  const [creditAmt,  setCreditAmt]  = useState({});
  const [confirming, setConfirming] = useState(null); // client name being confirmed
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
    const [credRes1, credRes2] = await Promise.all([
      supabase.from("ai_credits").select("client,user_email,balance,updated_at").order("user_email"),
      supabase2.from("ai_credits").select("client,user_email,balance,updated_at").order("user_email"),
    ]);
    const allCredits = [...(credRes1.data||[]), ...(credRes2.data||[])];
    if(allCredits.length) setCredits(allCredits);
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
          ["credits","💳 Credits"],
          ["audit","Audit Trail"],
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

      {dash==="credits" && (
        <div style={{background:"rgba(6,10,24,0.7)",border:"1px solid rgba(100,150,255,0.07)",
          borderRadius:12,padding:"20px 24px",backdropFilter:"blur(12px)"}}>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <div style={{fontSize:9,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",
              letterSpacing:"0.15em",textTransform:"uppercase"}}>Credits Manager</div>
            <div style={{fontSize:9,color:"rgba(100,140,200,0.4)",fontFamily:"'DM Mono',monospace"}}>1 credit = 1 question = €0.05</div>
          </div>

          {/* User credit cards */}
          <div style={{marginBottom:16}}>
            {/* Group by client */}
            {CLIENTS.map(c => {
              const clientUsers = USER_REGISTRY.filter(u =>
                u.client === c.name ||
                u.role === c.name.replace(" Oy","").replace(" Group","") ||
                (c.name === "Targetflow" && u.role === "God Mode")
              );
              const userEmails = clientUsers.map(u => u.email);
              const clientCredits = credits.filter(cr => userEmails.includes(cr.user_email) || cr.client === c.name);

              if(clientCredits.length === 0 && clientUsers.length === 0) return null;

              return (
                <div key={c.name} style={{marginBottom:16}}>
                  <div style={{fontSize:9,color:"rgba(140,180,255,0.4)",fontFamily:"'DM Mono',monospace",
                    letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8,
                    paddingBottom:6,borderBottom:"1px solid rgba(100,150,255,0.06)"}}>
                    {c.name}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:10}}>
                    {(clientUsers.length > 0 ? clientUsers : [{email: c.name, name: c.name}]).map(u => {
                      const cr  = credits.find(x => x.user_email === u.email || (!u.email.includes("@") && x.client === u.email));
                      const bal = cr?.balance ?? 0;
                      const amt = creditAmt[u.email] ?? 100;
                      const isConf = confirming === u.email;
                      return (
                        <div key={u.email} style={{background:"rgba(10,18,40,0.8)",
                          border:"1px solid "+(isConf?"rgba(99,102,241,0.5)":"rgba(100,150,255,0.08)"),
                          borderRadius:10,padding:"12px 14px"}}>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                            <div>
                              <div style={{fontSize:12,fontWeight:600,color:"#e2e8f0"}}>{u.name||u.email}</div>
                              <div style={{fontSize:9,color:"rgba(140,180,255,0.4)",fontFamily:"'DM Mono',monospace"}}>{u.email}</div>
                            </div>
                            <div style={{fontSize:13,fontFamily:"'DM Mono',monospace",fontWeight:700,
                              color:bal>20?"#4ade80":bal>0?"#fbbf24":"#f87171"}}>{bal} cr</div>
                          </div>

                          {!isConf && (
                            <div style={{display:"flex",gap:6,alignItems:"center"}}>
                              <input type="number" min="-9999" max="9999" value={amt}
                                onChange={e => setCreditAmt(prev => ({...prev,[u.email]:parseInt(e.target.value)||0}))}
                                style={{width:72,background:"#070d1e",border:"1px solid #1e2d45",borderRadius:7,
                                  padding:"5px 8px",color:"#e2e8f0",fontSize:11,outline:"none",
                                  fontFamily:"'DM Mono',monospace",textAlign:"center"}}/>
                              <span style={{fontSize:10,color:"rgba(140,180,255,0.4)",fontFamily:"'DM Mono',monospace"}}>cr</span>
                              <button onClick={() => setConfirming(u.email)}
                                style={{marginLeft:"auto",padding:"5px 12px",background:amt>=0?"rgba(99,102,241,0.15)":"rgba(248,113,113,0.1)",
                                  border:"1px solid "+(amt>=0?"rgba(99,102,241,0.35)":"rgba(248,113,113,0.3)"),
                                  borderRadius:7,color:amt>=0?"#a5b4fc":"#fca5a5",
                                  fontSize:11,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontWeight:600}}>
                                {amt >= 0 ? "+ Add" : "− Remove"}
                              </button>
                            </div>
                          )}

                          {isConf && (
                            <div>
                              <div style={{fontSize:11,color:"#c0d8f0",marginBottom:8,
                                padding:"7px 10px",background:amt>=0?"rgba(99,102,241,0.08)":"rgba(248,113,113,0.08)",
                                border:"1px solid "+(amt>=0?"rgba(99,102,241,0.2)":"rgba(248,113,113,0.2)"),borderRadius:7}}>
                                {amt >= 0 ? "Add" : "Remove"} <span style={{color:amt>=0?"#a5b4fc":"#fca5a5",fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{Math.abs(amt)} cr</span> {amt>=0?"to":"from"} <span style={{color:"#e2e8f0",fontWeight:600}}>{u.name||u.email}</span>
                                <div style={{fontSize:10,color:"rgba(140,180,255,0.5)",marginTop:3,fontFamily:"'DM Mono',monospace"}}>
                                  {bal} cr → {Math.max(0, bal + amt)} cr
                                </div>
                              </div>
                              <div style={{display:"flex",gap:6}}>
                                <button onClick={async () => {
                                    const db = getDbSvc(c.name);
                                    const newBal = Math.max(0, bal + amt);
                                    const {error: credErr} = await db.from("ai_credits").upsert(
                                      {user_email: u.email, client: c.name, balance: newBal, updated_at: new Date().toISOString()},
                                      {onConflict: "user_email"}
                                    );
                                    if(credErr) { alert("Error: " + credErr.message); return; }
                                    await db.from("ai_transactions").insert({
                                      client: c.name, user_email: u.email,
                                      credits: amt, type: amt>=0?"purchase":"adjustment",
                                      package: "manual", granted_by: userEmail
                                    });
                                    setCredits(prev => [...prev.filter(x=>x.user_email!==u.email),
                                      {user_email:u.email, client:c.name, balance:newBal, updated_at:new Date().toISOString()}]);
                                    setConfirming(null);
                                  }}
                                  style={{flex:1,padding:"6px 0",background:"rgba(74,222,128,0.12)",
                                    border:"1px solid rgba(74,222,128,0.35)",borderRadius:7,color:"#4ade80",
                                    fontSize:12,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontWeight:700}}>
                                  ✓ Confirm
                                </button>
                                <button onClick={() => setConfirming(null)}
                                  style={{flex:1,padding:"6px 0",background:"rgba(100,116,139,0.1)",
                                    border:"1px solid rgba(100,116,139,0.2)",borderRadius:7,color:"#64748b",
                                    fontSize:12,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                          {cr?.updated_at && !isConf && (
                            <div style={{fontSize:9,color:"rgba(100,140,200,0.3)",fontFamily:"'DM Mono',monospace",marginTop:6}}>
                              Updated {new Date(cr.updated_at).toLocaleDateString("fi-FI")}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{fontSize:9,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",
            letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:12}}>
            Audit Trail — Manual Credit Grants
          </div>
          <AuditTrail />

        </div>
      )}

      {dash==="audit" && (
        <div style={{background:"rgba(6,10,24,0.7)",border:"1px solid rgba(100,150,255,0.07)",
          borderRadius:12,padding:"20px 24px",backdropFilter:"blur(12px)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{fontSize:9,color:"rgba(140,180,255,0.5)",fontFamily:"'DM Mono',monospace",
              letterSpacing:"0.15em",textTransform:"uppercase"}}>Audit Trail — Manual Credit Grants</div>
            <div style={{fontSize:9,color:"rgba(100,140,200,0.4)",fontFamily:"'DM Mono',monospace"}}>last 100 events</div>
          </div>
          <AuditTrail />
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
