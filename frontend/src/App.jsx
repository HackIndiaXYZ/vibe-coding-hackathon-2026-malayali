import React, { useState, useRef, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

// ─── THEME ────────────────────────────────────────────────────────────────────
const C = {
  bg:'#0a0a0f', surface:'rgba(255,255,255,0.03)', border:'rgba(255,255,255,0.08)',
  green:'#52b788', greenDark:'#2d6a4f', greenGlow:'rgba(82,183,136,0.2)',
  text:'#f0f0f0', muted:'#888', dim:'#555',
  red:'#e07070', yellow:'#e0c070', blue:'#7098e0', purple:'#a78bfa',
}
const S = {
  nav:{ position:'fixed',top:0,left:0,right:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 48px',background:'rgba(10,10,15,0.9)',backdropFilter:'blur(12px)',borderBottom:`1px solid ${C.border}` },
  logo:{ fontSize:'1.4rem',fontWeight:800,background:`linear-gradient(135deg,${C.greenDark},${C.green})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',cursor:'pointer' },
  btnPrimary:{ padding:'12px 28px',borderRadius:'8px',border:'none',background:`linear-gradient(135deg,${C.greenDark},${C.green})`,color:'#fff',fontWeight:700,fontSize:'0.95rem',cursor:'pointer',boxShadow:`0 4px 20px ${C.greenGlow}` },
  btnSecondary:{ padding:'12px 28px',borderRadius:'8px',border:`1px solid rgba(82,183,136,0.4)`,background:'transparent',color:C.green,fontWeight:600,fontSize:'0.95rem',cursor:'pointer' },
  btnGhost:{ padding:'8px 16px',borderRadius:'6px',border:`1px solid ${C.border}`,background:'transparent',color:C.muted,fontSize:'0.85rem',cursor:'pointer' },
  badge:{ display:'inline-block',padding:'6px 16px',background:'rgba(45,106,79,0.2)',border:'1px solid rgba(82,183,136,0.4)',borderRadius:'20px',fontSize:'0.8rem',color:C.green,marginBottom:'28px',letterSpacing:'0.05em' },
  heroSection:{ minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'120px 24px 80px',background:`radial-gradient(ellipse at 50% 0%,rgba(45,106,79,0.15) 0%,transparent 70%)` },
  h1:{ fontSize:'clamp(2.4rem,6vw,4.2rem)',fontWeight:900,lineHeight:1.1,marginBottom:'24px',maxWidth:'820px' },
  h1Accent:{ background:`linear-gradient(135deg,${C.green},${C.greenDark})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' },
  heroPara:{ fontSize:'1.15rem',color:C.muted,maxWidth:'600px',lineHeight:1.7,marginBottom:'40px' },
  btnRow:{ display:'flex',gap:'16px',flexWrap:'wrap',justifyContent:'center' },
  section:{ padding:'100px 48px',maxWidth:'1200px',margin:'0 auto' },
  sectionLabel:{ fontSize:'0.8rem',letterSpacing:'0.12em',color:C.green,textTransform:'uppercase',marginBottom:'12px' },
  sectionTitle:{ fontSize:'clamp(1.8rem,4vw,2.8rem)',fontWeight:800,marginBottom:'16px' },
  sectionSub:{ color:C.muted,fontSize:'1.05rem',maxWidth:'560px',lineHeight:1.7 },
  grid3:{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'24px',marginTop:'56px' },
  card:{ background:C.surface,border:`1px solid ${C.border}`,borderRadius:'16px',padding:'32px',transition:'border-color 0.3s,transform 0.2s' },
  pillarsGrid:{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:'20px',marginTop:'56px' },
  pillarCard:{ background:'linear-gradient(135deg,rgba(45,106,79,0.08),rgba(82,183,136,0.04))',border:'1px solid rgba(82,183,136,0.2)',borderRadius:'14px',padding:'28px' },
  stepsWrap:{ marginTop:'56px',display:'flex',flexDirection:'column' },
  step:{ display:'flex',gap:'32px',alignItems:'flex-start',padding:'36px 0',borderBottom:`1px solid ${C.border}` },
  stepNum:{ minWidth:'52px',height:'52px',borderRadius:'50%',background:`linear-gradient(135deg,${C.greenDark},${C.green})`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:'1.1rem' },
  useCaseGrid:{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'20px',marginTop:'56px' },
  useCaseCard:{ background:'rgba(255,255,255,0.02)',border:`1px solid ${C.border}`,borderRadius:'14px',padding:'28px' },
  ctaSection:{ padding:'120px 48px',textAlign:'center',background:`linear-gradient(180deg,transparent,rgba(45,106,79,0.08))` },
  footer:{ padding:'40px 48px',borderTop:`1px solid ${C.border}`,display:'flex',justifyContent:'space-between',alignItems:'center',color:C.dim,fontSize:'0.85rem' },
}

// ─── HOME DATA ────────────────────────────────────────────────────────────────
const pillars=[
  {title:'🧠 Human Psychology & Buyer Behaviour',text:'Loss aversion, anchoring, scarcity triggers, IKEA effect, endowment effect, decision fatigue — every nudge mapped to action.'},
  {title:'📊 Market Structure Analysis',text:"Porter's Five Forces, Blue Ocean theory, niche identification, demand elasticity modeling, and supply chain leverage points."},
  {title:'💰 Money Flow Intelligence',text:'Where capital moves in your market, how top businesses structure revenue, high-margin vs high-volume tradeoffs, and cash-flow timing.'},
  {title:'🏷️ Price Pattern Recognition',text:'Penetration vs premium strategy, psychological price thresholds, competitor pricing positioning, and discount timing.'},
  {title:'⚔️ Competitive Battlefield Analysis',text:'Blue/red ocean detection, competitor weakness mapping, positioning gaps, counter-move playbooks.'},
  {title:'🚀 Winning Business Strategies',text:'Growth hacking, retention loops, upsell architecture, referral flywheel design, and profitability levers.'},
]
const features=[
  {icon:'🏗️',title:'Business Profile Builder',text:'Onboard your business in one smart wizard — revenue, goals, personas, and budget.'},
  {icon:'📦',title:'Product Intelligence',text:'Analyse each SKU: margins, USP strength, seasonal patterns, and underperformers.'},
  {icon:'🕵️',title:'Competitor Profiler',text:'Enter competitors and get threat scores, weakness maps, and exploitation opportunities.'},
  {icon:'📡',title:'Market Trend Scanner',text:'Real-time monitoring of industry shifts, consumer preferences, and macro signals.'},
  {icon:'🔬',title:'Profit Simulation Engine',text:'"What if I drop price 10%?" — run financial scenarios with P&L projections.'},
  {icon:'🎯',title:'Strategic Action Generator',text:'Top-5 moves for this month, 30-60-90 day roadmaps, and campaign blueprints.'},
  {icon:'💬',title:'Psychology Sales Playbook',text:'Persuasion frameworks, upsell scripts, loyalty program design using behavioral patterns.'},
  {icon:'📋',title:'SWOT Live Board',text:'Continuously updated SWOT that ties specific actions to each quadrant.'},
]
const useCases=[
  {icon:'🛒',title:'Retail Store Owner',text:"Identify which products to push, when to discount, and how to counter a nearby competitor's promotions."},
  {icon:'🍽️',title:'Restaurant / F&B',text:'Menu pricing psychology, seasonal demand planning, loyalty loop design, and local competitor tracking.'},
  {icon:'💻',title:'SaaS Founder',text:'Subscription tier architecture, churn prevention strategies, upsell sequencing, and investor pitch generation.'},
  {icon:'🏪',title:'E-commerce Brand',text:'SKU-level margin analysis, ad budget allocation, referral flywheel setup, and cart abandonment tactics.'},
  {icon:'🔧',title:'Service Business',text:'Premium pricing positioning, client retention frameworks, and expansion to adjacent service lines.'},
  {icon:'🌱',title:'Early-Stage Startup',text:'Product-market fit scoring, niche identification, go-to-market strategy, and 90-day survival roadmap.'},
]
const steps=[
  {title:'Feed BizBrain your business data',text:'Enter your products, competitors, budget, goals, and market. The more you give it, the sharper its thinking.'},
  {title:'The Intelligence Engine processes everything',text:'BizBrain cross-references your data against six knowledge pillars — psychology, market structure, money flow, pricing, competition, and strategy.'},
  {title:'Receive your Actionable Intelligence Report',text:'Get ranked strategic moves, pricing adjustments, campaign blueprints, and profit simulations — specific to your business.'},
  {title:'Execute, monitor, and iterate',text:'Feed new data back in — competitor moves, new products, market shifts — and BizBrain evolves with you.'},
]

// ─── HOMEPAGE ─────────────────────────────────────────────────────────────────
function HomePage() {
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState(null)
  const scroll = id => document.getElementById(id)?.scrollIntoView({behavior:'smooth'})
  return (
    <div style={{background:C.bg,color:C.text,minHeight:'100vh'}}>
      <nav style={S.nav}>
        <div style={S.logo}>🧠 BizBrain</div>
        <ul style={{display:'flex',gap:'32px',listStyle:'none'}}>
          {[['Features','features'],['How It Works','how-it-works'],['Use Cases','use-cases']].map(([l,id])=>(
            <li key={l} style={{color:C.muted,cursor:'pointer',fontSize:'0.95rem'}} onClick={()=>scroll(id)}>{l}</li>
          ))}
        </ul>
        <button style={S.btnPrimary} onClick={()=>navigate('/app')}>Launch App →</button>
      </nav>
      <section style={S.heroSection}>
        <div style={S.badge}>AI-Powered Business Intelligence · Powered by LLaMA 3.3</div>
        <h1 style={S.h1}>Your Business Deserves a<br/><span style={S.h1Accent}>Strategic Brain</span></h1>
        <p style={S.heroPara}>BizBrain digests your business — products, competitors, market, finances — and outputs psychology-backed, profit-driving strategies. Not generic advice. Your business. Your moves.</p>
        <div style={S.btnRow}>
          <button style={S.btnPrimary} onClick={()=>navigate('/app')}>Let's Try BizBrain →</button>
          <button style={S.btnSecondary} onClick={()=>scroll('how-it-works')}>See How It Works</button>
        </div>
      </section>
      <div style={{background:'rgba(45,106,79,0.04)',padding:'80px 0'}}>
        <div style={S.section}>
          <div style={S.sectionLabel}>The Brain</div>
          <h2 style={S.sectionTitle}>Six Knowledge Pillars</h2>
          <p style={S.sectionSub}>Six deep intellectual frameworks baked into BizBrain's core reasoning.</p>
          <div style={S.pillarsGrid}>
            {pillars.map((p,i)=>(
              <div key={i} style={S.pillarCard}>
                <div style={{fontWeight:700,fontSize:'1rem',color:C.green,marginBottom:'10px'}}>{p.title}</div>
                <div style={{color:'#999',fontSize:'0.88rem',lineHeight:1.6}}>{p.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div id="features"><div style={S.section}>
        <div style={S.sectionLabel}>Feature Modules</div>
        <h2 style={S.sectionTitle}>Everything Your Strategy Needs</h2>
        <p style={S.sectionSub}>Eight intelligence modules covering every angle of your business battlefield.</p>
        <div style={S.grid3}>
          {features.map((f,i)=>(
            <div key={i} style={{...S.card,borderColor:hoveredCard===i?'rgba(82,183,136,0.4)':C.border,transform:hoveredCard===i?'translateY(-4px)':'none'}}
              onMouseEnter={()=>setHoveredCard(i)} onMouseLeave={()=>setHoveredCard(null)}>
              <div style={{fontSize:'2rem',marginBottom:'16px'}}>{f.icon}</div>
              <div style={{fontWeight:700,fontSize:'1.1rem',marginBottom:'10px'}}>{f.title}</div>
              <div style={{color:C.muted,fontSize:'0.92rem',lineHeight:1.65}}>{f.text}</div>
            </div>
          ))}
        </div>
      </div></div>
      <div id="how-it-works" style={{background:'rgba(45,106,79,0.04)',padding:'80px 0'}}>
        <div style={S.section}>
          <div style={S.sectionLabel}>Process</div>
          <h2 style={S.sectionTitle}>How It Works</h2>
          <p style={S.sectionSub}>Four steps from raw business data to executed strategy.</p>
          <div style={S.stepsWrap}>
            {steps.map((s,i)=>(
              <div key={i} style={S.step}>
                <div style={S.stepNum}>{i+1}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:'1.1rem',marginBottom:'8px'}}>{s.title}</div>
                  <div style={{color:C.muted,lineHeight:1.7}}>{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div id="use-cases"><div style={S.section}>
        <div style={S.sectionLabel}>Use Cases</div>
        <h2 style={S.sectionTitle}>Built for Every Business Type</h2>
        <p style={S.sectionSub}>Whether solo founder or multi-location, BizBrain adapts to your context.</p>
        <div style={S.useCaseGrid}>
          {useCases.map((u,i)=>(
            <div key={i} style={S.useCaseCard}>
              <div style={{fontSize:'1.8rem',marginBottom:'12px'}}>{u.icon}</div>
              <div style={{fontWeight:700,marginBottom:'8px'}}>{u.title}</div>
              <div style={{color:C.muted,fontSize:'0.9rem',lineHeight:1.6}}>{u.text}</div>
            </div>
          ))}
        </div>
      </div></div>
      <div style={S.ctaSection}>
        <div style={S.badge}>Ready to outthink your competition?</div>
        <h2 style={{...S.sectionTitle,marginBottom:'20px'}}>Give Your Business a <span style={S.h1Accent}>Competitive Brain</span></h2>
        <p style={{color:C.muted,marginBottom:'40px',fontSize:'1.05rem'}}>Stop guessing. Start strategising with intelligence that understands your market.</p>
        <button style={{...S.btnPrimary,padding:'16px 48px',fontSize:'1.1rem'}} onClick={()=>navigate('/app')}>Launch BizBrain Free →</button>
      </div>
      <footer style={S.footer}>
        <div style={S.logo}>🧠 BizBrain</div>
        <div>AI Business Intelligence · Powered by LLaMA 3.3 via Groq</div>
        <div>Built for entrepreneurs who think differently.</div>
      </footer>
    </div>
  )
}

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────
const PROFILE_FIELDS=[
  {key:'name',label:'Business Name',placeholder:'e.g. Aromas Café'},
  {key:'industry',label:'Industry / Category',placeholder:'e.g. Food & Beverage, SaaS…'},
  {key:'location',label:'Location',placeholder:'e.g. Kozhikode, Kerala'},
  {key:'age',label:'Business Age',placeholder:'e.g. 2 years'},
  {key:'revenue',label:'Monthly Revenue (₹)',placeholder:'e.g. ₹3,00,000'},
  {key:'products',label:'Main Products / Services',placeholder:'e.g. Filter coffee, pastries, events'},
  {key:'targetCustomer',label:'Target Customer',placeholder:'e.g. Young professionals, 22-35'},
  {key:'competitors',label:'Top Competitors',placeholder:'e.g. Starbucks, local café nearby'},
  {key:'marketingBudget',label:'Monthly Marketing Budget',placeholder:'e.g. ₹15,000'},
  {key:'challenge',label:'Biggest Challenge',placeholder:'e.g. Low footfall on weekdays'},
  {key:'goals',label:'Current Goals',placeholder:'e.g. Increase revenue 30% in 3 months'},
]
const QUICK_QUESTIONS=[
  'What are my top 3 moves to increase revenue this month?',
  'Analyse my pricing strategy and suggest improvements',
  'How should I position against my competitors?',
  'Design a customer retention program for my business',
  'What psychological triggers should I use in my marketing?',
  'Give me a 30-60-90 day growth roadmap',
  'How do I increase my average order value?',
  'Identify the biggest profit leaks in my business model',
]

function Spinner({text='BizBrain is thinking...'}) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:'8px',color:C.muted,fontSize:'0.9rem',padding:'20px 0'}}>
      {[0,1,2].map(i=><div key={i} style={{width:'8px',height:'8px',borderRadius:'50%',background:C.green,opacity:0.6,animation:`bounce 1.2s ${i*0.2}s infinite`}}/>)}
      <span style={{marginLeft:'8px'}}>{text}</span>
    </div>
  )
}

function ImpactBadge({impact}) {
  const colors={High:C.red,Medium:C.yellow,Low:C.green}
  return <span style={{fontSize:'0.72rem',padding:'2px 8px',borderRadius:'20px',background:`${colors[impact]}22`,color:colors[impact],fontWeight:700,border:`1px solid ${colors[impact]}44`}}>{impact}</span>
}

function ScoreRing({score,size=80,stroke=7,color}) {
  const r=((size-stroke*2)/2), circ=2*Math.PI*r, pct=circ-(score/100)*circ
  return (
    <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color||C.green} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={pct} strokeLinecap="round"
        style={{transition:'stroke-dashoffset 1s ease'}}/>
    </svg>
  )
}

function formatINR(n){return n?'₹'+Number(n).toLocaleString('en-IN'):'₹0'}

// ─── SWOT PANEL ───────────────────────────────────────────────────────────────
function SWOTPanel({profile}){
  const [data,setData]=useState(null)
  const [loading,setLoading]=useState(false)
  const generate=async()=>{
    setLoading(true);setData(null)
    try{const r=await fetch('https://bizbrain-backend-8s6d.onrender.com/api/swot',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({businessProfile:profile})});setData(await r.json())}
    catch(e){alert('SWOT failed: '+e.message)}finally{setLoading(false)}
  }
  const quadrants=data?[
    {key:'strengths',label:'Strengths',color:'#52b788',bg:'rgba(82,183,136,0.06)',icon:'💪'},
    {key:'weaknesses',label:'Weaknesses',color:'#e07070',bg:'rgba(224,112,112,0.06)',icon:'⚠️'},
    {key:'opportunities',label:'Opportunities',color:'#7098e0',bg:'rgba(112,152,224,0.06)',icon:'🚀'},
    {key:'threats',label:'Threats',color:'#e0c070',bg:'rgba(224,192,112,0.06)',icon:'🛡️'},
  ]:[]
  return (
    <div style={{padding:'32px 40px',overflowY:'auto',height:'100%'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'32px'}}>
        <div>
          <div style={{fontSize:'0.8rem',color:C.green,letterSpacing:'0.1em',marginBottom:'6px'}}>INTELLIGENCE MODULE</div>
          <h2 style={{fontSize:'1.8rem',fontWeight:800,marginBottom:'8px'}}>SWOT Live Board</h2>
          <p style={{color:C.muted,fontSize:'0.9rem'}}>AI-generated SWOT with specific actions tied to every insight</p>
        </div>
        <button style={S.btnPrimary} onClick={generate} disabled={loading}>{loading?'Analysing...':data?'↺ Regenerate':'⚡ Generate SWOT'}</button>
      </div>
      {loading&&<Spinner/>}
      {data&&(
        <>
          <div style={{background:'linear-gradient(135deg,rgba(45,106,79,0.15),rgba(82,183,136,0.05))',border:'1px solid rgba(82,183,136,0.25)',borderRadius:'16px',padding:'28px',marginBottom:'28px',display:'flex',alignItems:'center',gap:'32px'}}>
            <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center',width:'80px',height:'80px'}}>
              <ScoreRing score={data.healthScore} size={80}/>
              <div style={{position:'absolute',textAlign:'center'}}>
                <div style={{fontSize:'1.3rem',fontWeight:900,color:C.green,lineHeight:1}}>{data.healthScore}</div>
              </div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:'0.75rem',color:C.green,marginBottom:'6px',letterSpacing:'0.08em'}}>TOP PRIORITY RIGHT NOW</div>
              <div style={{fontSize:'1.05rem',fontWeight:600,lineHeight:1.5}}>{data.topPriority}</div>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
            {quadrants.map(q=>(
              <div key={q.key} style={{background:q.bg,border:`1px solid ${q.color}33`,borderRadius:'14px',padding:'24px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px'}}>
                  <span style={{fontSize:'1.2rem'}}>{q.icon}</span>
                  <span style={{fontWeight:700,color:q.color,fontSize:'1rem'}}>{q.label}</span>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                  {(data[q.key]||[]).map((item,i)=>(
                    <div key={i} style={{background:'rgba(0,0,0,0.2)',borderRadius:'10px',padding:'12px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'6px'}}>
                        <div style={{fontWeight:600,fontSize:'0.88rem',flex:1,paddingRight:'8px'}}>{item.point}</div>
                        <ImpactBadge impact={item.impact}/>
                      </div>
                      <div style={{fontSize:'0.8rem',color:C.muted,lineHeight:1.5}}><span style={{color:q.color,fontWeight:600}}>→ </span>{item.action}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {!data&&!loading&&(
        <div style={{textAlign:'center',padding:'80px 0',color:C.muted}}>
          <div style={{fontSize:'3rem',marginBottom:'16px'}}>📋</div>
          <div style={{fontSize:'1.1rem',marginBottom:'8px'}}>No SWOT analysis yet</div>
          <div style={{fontSize:'0.9rem'}}>Click Generate SWOT to get your live strategic analysis</div>
        </div>
      )}
    </div>
  )
}

// ─── COMPETITOR PANEL ─────────────────────────────────────────────────────────
function CompetitorPanel({profile}){
  const [input,setInput]=useState(profile.competitors||'')
  const [data,setData]=useState(null)
  const [loading,setLoading]=useState(false)
  const analyse=async()=>{
    if(!input.trim())return
    setLoading(true);setData(null)
    try{const r=await fetch(`${import.meta.env.VITE_API_URL}/api/competitors`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({businessProfile:profile,competitors:input})});setData(await r.json())}
    catch(e){alert('Failed: '+e.message)}finally{setLoading(false)}
  }
  const tc=t=>t==='High'?C.red:t==='Medium'?C.yellow:C.green
  return (
    <div style={{padding:'32px 40px',overflowY:'auto',height:'100%'}}>
      <div style={{marginBottom:'32px'}}>
        <div style={{fontSize:'0.8rem',color:C.green,letterSpacing:'0.1em',marginBottom:'6px'}}>INTELLIGENCE MODULE</div>
        <h2 style={{fontSize:'1.8rem',fontWeight:800,marginBottom:'8px'}}>Competitor Profiler</h2>
        <p style={{color:C.muted,fontSize:'0.9rem'}}>Threat scores, weakness maps, and counter-move playbooks for each competitor</p>
      </div>
      <div style={{display:'flex',gap:'12px',marginBottom:'32px'}}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter competitor names, e.g. Starbucks, Café Coffee Day, local chai shop..."
          style={{flex:1,padding:'12px 16px',borderRadius:'8px',border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:'0.95rem',outline:'none'}}
          onFocus={e=>e.target.style.borderColor=C.green} onBlur={e=>e.target.style.borderColor=C.border}
          onKeyDown={e=>e.key==='Enter'&&analyse()}/>
        <button style={S.btnPrimary} onClick={analyse} disabled={loading}>{loading?'Analysing...':'🔍 Analyse'}</button>
      </div>
      {loading&&<Spinner/>}
      {data&&(
        <>
          <div style={{background:'rgba(112,152,224,0.06)',border:'1px solid rgba(112,152,224,0.2)',borderRadius:'14px',padding:'24px',marginBottom:'28px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
              <div style={{fontWeight:700,color:C.blue}}>⚔️ Battlefield Summary</div>
              <span style={{fontSize:'0.8rem',padding:'4px 12px',borderRadius:'20px',background:'rgba(112,152,224,0.15)',color:C.blue,fontWeight:600}}>Strategy: {data.recommendedStrategy}</span>
            </div>
            <p style={{color:'#ccc',lineHeight:1.7,fontSize:'0.92rem',marginBottom:'12px'}}>{data.battlefieldSummary}</p>
            <div style={{background:'rgba(82,183,136,0.08)',border:'1px solid rgba(82,183,136,0.2)',borderRadius:'8px',padding:'12px'}}>
              <span style={{color:C.green,fontWeight:600,fontSize:'0.85rem'}}>🎯 Winning Move: </span>
              <span style={{color:'#ddd',fontSize:'0.9rem'}}>{data.winningMove}</span>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
            {(data.competitors||[]).map((c,i)=>(
              <div key={i} style={{background:C.surface,border:`1px solid ${tc(c.threatLevel)}33`,borderRadius:'14px',padding:'24px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'16px'}}>
                  <div>
                    <div style={{fontWeight:800,fontSize:'1.1rem',marginBottom:'4px'}}>{c.name}</div>
                    <div style={{color:C.muted,fontSize:'0.85rem'}}>{c.positioning}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'1.8rem',fontWeight:900,color:tc(c.threatLevel),lineHeight:1}}>{c.threatScore}</div>
                    <div style={{fontSize:'0.72rem',color:tc(c.threatLevel),fontWeight:600}}>THREAT</div>
                  </div>
                </div>
                <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'16px'}}>
                  {(c.tags||[]).map((t,j)=><span key={j} style={{fontSize:'0.75rem',padding:'3px 10px',borderRadius:'20px',background:'rgba(255,255,255,0.06)',color:C.muted,border:`1px solid ${C.border}`}}>{t}</span>)}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'14px'}}>
                  {[['💪 Their Strength',c.estimatedStrength,'#52b788'],['🎯 Key Weakness',c.keyWeakness,C.red],['👥 Target Segment',c.targetSegment,C.blue],['💰 Pricing Model',c.pricingModel,C.yellow]].map(([label,value,color])=>(
                    <div key={label} style={{background:'rgba(0,0,0,0.2)',borderRadius:'8px',padding:'12px'}}>
                      <div style={{fontSize:'0.75rem',color,marginBottom:'4px',fontWeight:600}}>{label}</div>
                      <div style={{fontSize:'0.88rem',color:'#ddd'}}>{value}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                  <div style={{background:'rgba(82,183,136,0.06)',border:'1px solid rgba(82,183,136,0.15)',borderRadius:'8px',padding:'12px'}}>
                    <div style={{fontSize:'0.75rem',color:C.green,marginBottom:'4px',fontWeight:600}}>⚡ EXPLOIT OPPORTUNITY</div>
                    <div style={{fontSize:'0.88rem',color:'#ddd',lineHeight:1.5}}>{c.exploitOpportunity}</div>
                  </div>
                  <div style={{background:'rgba(224,112,112,0.06)',border:'1px solid rgba(224,112,112,0.15)',borderRadius:'8px',padding:'12px'}}>
                    <div style={{fontSize:'0.75rem',color:C.red,marginBottom:'4px',fontWeight:600}}>🛡️ COUNTER MOVE</div>
                    <div style={{fontSize:'0.88rem',color:'#ddd',lineHeight:1.5}}>{c.counterMove}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {!data&&!loading&&(
        <div style={{textAlign:'center',padding:'80px 0',color:C.muted}}>
          <div style={{fontSize:'3rem',marginBottom:'16px'}}>🕵️</div>
          <div style={{fontSize:'1.1rem',marginBottom:'8px'}}>No competitor analysis yet</div>
          <div style={{fontSize:'0.9rem'}}>Enter competitor names above and hit Analyse</div>
        </div>
      )}
    </div>
  )
}

// ─── PROFIT SIM PANEL ─────────────────────────────────────────────────────────
function ProfitSimPanel({profile}){
  const [scenario,setScenario]=useState('')
  const [data,setData]=useState(null)
  const [loading,setLoading]=useState(false)
  const PRESETS=[
    'If I increase prices by 15%, what happens to revenue and profit?',
    'If I launch a loyalty program, what retention improvement do I need to break even?',
    'If I add a delivery service, how does it affect monthly profit?',
    'If I hire one more staff member, when does it pay off?',
    'If I run a 20% discount campaign for one month, what is the impact?',
  ]
  const simulate=async()=>{
    if(!scenario.trim())return
    setLoading(true);setData(null)
    try{const r=await fetch(`${import.meta.env.VITE_API_URL}/api/simulate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({businessProfile:profile,scenario})});setData(await r.json())}
    catch(e){alert('Simulation failed: '+e.message)}finally{setLoading(false)}
  }
  const vc=v=>v==='Go for it'?C.green:v==='Avoid this move'?C.red:C.yellow
  const maxP=data?Math.max(...data.projections.map(p=>p.profit)):1
  return (
    <div style={{padding:'32px 40px',overflowY:'auto',height:'100%'}}>
      <div style={{marginBottom:'32px'}}>
        <div style={{fontSize:'0.8rem',color:C.green,letterSpacing:'0.1em',marginBottom:'6px'}}>INTELLIGENCE MODULE</div>
        <h2 style={{fontSize:'1.8rem',fontWeight:800,marginBottom:'8px'}}>Profit Simulator</h2>
        <p style={{color:C.muted,fontSize:'0.9rem'}}>Run what-if scenarios and see projected P&L before making the move</p>
      </div>
      <div style={{marginBottom:'16px'}}>
        <textarea value={scenario} onChange={e=>setScenario(e.target.value)} placeholder="Describe your scenario... e.g. If I drop my price by 10% and increase marketing spend by ₹20,000..." rows={3}
          style={{width:'100%',padding:'14px 16px',borderRadius:'10px',border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:'0.95rem',resize:'none',outline:'none',lineHeight:1.5,fontFamily:'inherit',boxSizing:'border-box'}}
          onFocus={e=>e.target.style.borderColor=C.green} onBlur={e=>e.target.style.borderColor=C.border}/>
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:'10px'}}>
          <button style={{...S.btnPrimary,opacity:loading||!scenario.trim()?0.5:1}} onClick={simulate} disabled={loading||!scenario.trim()}>{loading?'Simulating...':'🔬 Run Simulation'}</button>
        </div>
      </div>
      <div style={{marginBottom:'32px'}}>
        <div style={{fontSize:'0.78rem',color:C.dim,marginBottom:'10px',letterSpacing:'0.06em'}}>QUICK SCENARIOS</div>
        <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
          {PRESETS.map((p,i)=>(
            <button key={i} onClick={()=>setScenario(p)} style={{background:'transparent',border:`1px solid ${C.border}`,borderRadius:'8px',padding:'10px 14px',color:C.muted,fontSize:'0.83rem',cursor:'pointer',textAlign:'left'}}
              onMouseEnter={e=>{e.target.style.borderColor=C.green;e.target.style.color=C.text}}
              onMouseLeave={e=>{e.target.style.borderColor=C.border;e.target.style.color=C.muted}}>{p}</button>
          ))}
        </div>
      </div>
      {loading&&<Spinner/>}
      {data&&(
        <>
          <div style={{background:`${vc(data.verdict)}11`,border:`1px solid ${vc(data.verdict)}33`,borderRadius:'14px',padding:'24px',marginBottom:'24px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'12px'}}>
              <div style={{fontSize:'1.5rem'}}>{data.verdict==='Go for it'?'✅':data.verdict==='Avoid this move'?'❌':'⚠️'}</div>
              <div>
                <div style={{fontWeight:800,fontSize:'1.2rem',color:vc(data.verdict)}}>{data.verdict}</div>
                <div style={{color:C.muted,fontSize:'0.85rem'}}>Risk Level: <span style={{color:vc(data.verdict),fontWeight:600}}>{data.riskLevel}</span></div>
              </div>
            </div>
            <p style={{color:'#ccc',fontSize:'0.92rem',lineHeight:1.6,marginBottom:'8px'}}>{data.verdictReason}</p>
            <div style={{fontSize:'0.85rem',color:C.muted}}><span style={{color:C.green}}>Break-even: </span>{data.breakEvenPoint}</div>
          </div>
          <div style={{marginBottom:'20px'}}>
            <h3 style={{fontWeight:700,fontSize:'1.05rem',marginBottom:'6px'}}>{data.scenarioTitle}</h3>
            <p style={{color:C.muted,fontSize:'0.88rem'}}>{data.assumption}</p>
          </div>
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:'14px',padding:'24px',marginBottom:'24px'}}>
            <div style={{fontSize:'0.8rem',color:C.muted,marginBottom:'20px',letterSpacing:'0.08em'}}>PROFIT PROJECTION</div>
            <div style={{display:'flex',gap:'16px',alignItems:'flex-end',height:'140px',marginBottom:'10px'}}>
              {data.projections.map((p,i)=>{
                const h=Math.max(20,(p.profit/maxP)*120)
                return(
                  <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'6px'}}>
                    <div style={{fontSize:'0.72rem',color:C.green,fontWeight:600}}>{formatINR(p.profit)}</div>
                    <div style={{width:'100%',height:`${h}px`,background:`linear-gradient(180deg,${C.green},${C.greenDark})`,borderRadius:'6px 6px 0 0'}} title={p.note}/>
                  </div>
                )
              })}
            </div>
            <div style={{display:'flex',gap:'16px'}}>
              {data.projections.map((p,i)=><div key={i} style={{flex:1,textAlign:'center',fontSize:'0.72rem',color:C.muted}}>{p.month}</div>)}
            </div>
          </div>
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:'14px',overflow:'hidden',marginBottom:'24px'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:'rgba(255,255,255,0.03)'}}>
                  {['Period','Revenue','Costs','Profit','Note'].map(h=>(
                    <th key={h} style={{padding:'12px 16px',textAlign:'left',fontSize:'0.78rem',color:C.green,fontWeight:600,letterSpacing:'0.06em',borderBottom:`1px solid ${C.border}`}}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.projections.map((p,i)=>(
                  <tr key={i} style={{borderBottom:`1px solid ${C.border}`}}>
                    <td style={{padding:'12px 16px',fontSize:'0.88rem',fontWeight:600}}>{p.month}</td>
                    <td style={{padding:'12px 16px',fontSize:'0.88rem',color:C.blue}}>{formatINR(p.revenue)}</td>
                    <td style={{padding:'12px 16px',fontSize:'0.88rem',color:C.red}}>{formatINR(p.costs)}</td>
                    <td style={{padding:'12px 16px',fontSize:'0.88rem',color:C.green,fontWeight:700}}>{formatINR(p.profit)}</td>
                    <td style={{padding:'12px 16px',fontSize:'0.82rem',color:C.muted}}>{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'16px'}}>
            {[['⚠️ RISKS',data.risks,C.red,'rgba(224,112,112,0.06)','rgba(224,112,112,0.2)'],['📈 UPSIDE FACTORS',data.upsideFactors,C.green,'rgba(82,183,136,0.06)','rgba(82,183,136,0.2)'],['🎯 KEY ACTIONS',data.keyActions,C.blue,'rgba(112,152,224,0.06)','rgba(112,152,224,0.2)']].map(([label,items,color,bg,border])=>(
              <div key={label} style={{background:bg,border:`1px solid ${border}`,borderRadius:'12px',padding:'20px'}}>
                <div style={{fontSize:'0.78rem',color,fontWeight:600,marginBottom:'12px'}}>{label}</div>
                {(items||[]).map((r,i)=><div key={i} style={{fontSize:'0.85rem',color:'#ccc',marginBottom:'6px',lineHeight:1.4}}>• {r}</div>)}
              </div>
            ))}
          </div>
        </>
      )}
      {!data&&!loading&&(
        <div style={{textAlign:'center',padding:'60px 0',color:C.muted}}>
          <div style={{fontSize:'3rem',marginBottom:'16px'}}>🔬</div>
          <div style={{fontSize:'1.1rem',marginBottom:'8px'}}>No simulation yet</div>
          <div style={{fontSize:'0.9rem'}}>Describe a scenario above or pick a quick preset</div>
        </div>
      )}
    </div>
  )
}

// ─── BIZBRAIN SCORE PANEL ─────────────────────────────────────────────────────
function ScorePanel({profile}){
  const [data,setData]=useState(null)
  const [loading,setLoading]=useState(false)

  const generate=async()=>{
    setLoading(true);setData(null)
    try{const r=await fetch(`${import.meta.env.VITE_API_URL}/api/score`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({businessProfile:profile})});setData(await r.json())}
    catch(e){alert('Score generation failed: '+e.message)}finally{setLoading(false)}
  }

  const scoreColor=s=>s>=75?C.green:s>=50?C.yellow:C.red
  const gradeColor=g=>g.startsWith('A')?C.green:g.startsWith('B')?C.yellow:C.red
  const effortColor=e=>e==='Low'?C.green:e==='Medium'?C.yellow:C.red

  return(
    <div style={{padding:'32px 40px',overflowY:'auto',height:'100%'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'32px'}}>
        <div>
          <div style={{fontSize:'0.8rem',color:C.green,letterSpacing:'0.1em',marginBottom:'6px'}}>INTELLIGENCE MODULE</div>
          <h2 style={{fontSize:'1.8rem',fontWeight:800,marginBottom:'8px'}}>BizBrain Score</h2>
          <p style={{color:C.muted,fontSize:'0.9rem'}}>8-dimension strategic health score with quick wins ranked by impact</p>
        </div>
        <button style={S.btnPrimary} onClick={generate} disabled={loading}>{loading?'Scoring...':data?'↺ Rescore':'⚡ Generate Score'}</button>
      </div>

      {loading&&<Spinner text="Evaluating your business across 8 dimensions..."/>}

      {data&&(
        <>
          {/* Hero score */}
          <div style={{background:'linear-gradient(135deg,rgba(45,106,79,0.15),rgba(10,10,15,0))',border:'1px solid rgba(82,183,136,0.25)',borderRadius:'20px',padding:'36px',marginBottom:'28px',display:'flex',alignItems:'center',gap:'40px'}}>
            <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center',width:'140px',height:'140px',flexShrink:0}}>
              <ScoreRing score={data.overallScore} size={140} stroke={10} color={scoreColor(data.overallScore)}/>
              <div style={{position:'absolute',textAlign:'center'}}>
                <div style={{fontSize:'2.6rem',fontWeight:900,color:scoreColor(data.overallScore),lineHeight:1}}>{data.overallScore}</div>
                <div style={{fontSize:'0.75rem',color:C.muted,marginTop:'2px'}}>/ 100</div>
              </div>
            </div>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'12px'}}>
                <span style={{fontSize:'2.2rem',fontWeight:900,color:gradeColor(data.grade)}}>{data.grade}</span>
                <div style={{height:'32px',width:'1px',background:C.border}}/>
                <span style={{color:'#ccc',fontSize:'1.05rem',lineHeight:1.5,fontStyle:'italic'}}>"{data.gradeSummary}"</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginTop:'16px'}}>
                <div style={{background:'rgba(82,183,136,0.08)',border:'1px solid rgba(82,183,136,0.2)',borderRadius:'10px',padding:'14px'}}>
                  <div style={{fontSize:'0.72rem',color:C.green,fontWeight:600,marginBottom:'6px'}}>💪 BIGGEST STRENGTH</div>
                  <div style={{fontSize:'0.85rem',color:'#ddd',lineHeight:1.5}}>{data.biggestStrength}</div>
                </div>
                <div style={{background:'rgba(224,112,112,0.08)',border:'1px solid rgba(224,112,112,0.2)',borderRadius:'10px',padding:'14px'}}>
                  <div style={{fontSize:'0.72rem',color:C.red,fontWeight:600,marginBottom:'6px'}}>🚨 BIGGEST RISK</div>
                  <div style={{fontSize:'0.85rem',color:'#ddd',lineHeight:1.5}}>{data.biggestRisk}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 8 dimensions */}
          <div style={{marginBottom:'28px'}}>
            <div style={{fontSize:'0.8rem',color:C.muted,letterSpacing:'0.1em',marginBottom:'16px'}}>DIMENSION BREAKDOWN</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
              {(data.dimensions||[]).map((d,i)=>(
                <div key={i} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:'12px',padding:'18px',display:'flex',gap:'16px',alignItems:'center'}}>
                  <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <ScoreRing score={d.score} size={56} stroke={5} color={scoreColor(d.score)}/>
                    <div style={{position:'absolute',fontSize:'0.85rem',fontWeight:800,color:scoreColor(d.score)}}>{d.score}</div>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px'}}>
                      <div style={{fontWeight:700,fontSize:'0.9rem'}}>{d.icon} {d.name}</div>
                      <ImpactBadge impact={d.urgency}/>
                    </div>
                    <div style={{fontSize:'0.8rem',color:C.muted,lineHeight:1.4}}>{d.insight}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick wins */}
          <div>
            <div style={{fontSize:'0.8rem',color:C.muted,letterSpacing:'0.1em',marginBottom:'16px'}}>⚡ QUICK WINS — RANKED BY IMPACT</div>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {(data.quickWins||[]).map((w,i)=>(
                <div key={i} style={{background:'linear-gradient(135deg,rgba(45,106,79,0.08),rgba(82,183,136,0.03))',border:'1px solid rgba(82,183,136,0.2)',borderRadius:'12px',padding:'20px',display:'flex',gap:'20px',alignItems:'flex-start'}}>
                  <div style={{minWidth:'28px',height:'28px',borderRadius:'50%',background:`linear-gradient(135deg,${C.greenDark},${C.green})`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:'0.85rem',flexShrink:0}}>{i+1}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:'0.95rem',marginBottom:'6px'}}>{w.action}</div>
                    <div style={{fontSize:'0.85rem',color:'#aaa',marginBottom:'10px',lineHeight:1.5}}>{w.impact}</div>
                    <div style={{display:'flex',gap:'8px'}}>
                      <span style={{fontSize:'0.75rem',padding:'3px 10px',borderRadius:'20px',background:'rgba(112,152,224,0.15)',color:C.blue,fontWeight:600}}>⏱ {w.timeframe}</span>
                      <span style={{fontSize:'0.75rem',padding:'3px 10px',borderRadius:'20px',background:`${effortColor(w.effort)}15`,color:effortColor(w.effort),fontWeight:600}}>Effort: {w.effort}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!data&&!loading&&(
        <div style={{textAlign:'center',padding:'80px 0',color:C.muted}}>
          <div style={{fontSize:'3rem',marginBottom:'16px'}}>🎯</div>
          <div style={{fontSize:'1.1rem',marginBottom:'8px'}}>No score generated yet</div>
          <div style={{fontSize:'0.9rem'}}>Click Generate Score for your full 8-dimension business health report</div>
        </div>
      )}
    </div>
  )
}

// ─── ROADMAP PANEL ────────────────────────────────────────────────────────────
function RoadmapPanel({profile}){
  const [data,setData]=useState(null)
  const [loading,setLoading]=useState(false)
  const [activePhase,setActivePhase]=useState(0)

  const generate=async()=>{
    setLoading(true);setData(null)
    try{const r=await fetch(`${import.meta.env.VITE_API_URL}/api/roadmap`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({businessProfile:profile})});setData(await r.json())}
    catch(e){alert('Roadmap generation failed: '+e.message)}finally{setLoading(false)}
  }

  const catColor=c=>({Marketing:C.blue,Operations:C.yellow,Finance:C.green,Product:C.purple,Sales:C.red,People:'#f97316'})[c]||C.muted
  const priColor=p=>p==='Critical'?C.red:p==='High'?C.yellow:C.green
  const phaseColors=['#52b788','#7098e0','#a78bfa']

  return(
    <div style={{padding:'32px 40px',overflowY:'auto',height:'100%'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'32px'}}>
        <div>
          <div style={{fontSize:'0.8rem',color:C.green,letterSpacing:'0.1em',marginBottom:'6px'}}>INTELLIGENCE MODULE</div>
          <h2 style={{fontSize:'1.8rem',fontWeight:800,marginBottom:'8px'}}>30-60-90 Day Roadmap</h2>
          <p style={{color:C.muted,fontSize:'0.9rem'}}>A precise, phased action plan tailored to your business goals</p>
        </div>
        <button style={S.btnPrimary} onClick={generate} disabled={loading}>{loading?'Building...':data?'↺ Regenerate':'🗺️ Build Roadmap'}</button>
      </div>

      {loading&&<Spinner text="Architecting your 90-day battle plan..."/>}

      {data&&(
        <>
          {/* Headline + north star */}
          <div style={{background:'linear-gradient(135deg,rgba(45,106,79,0.15),rgba(10,10,15,0))',border:'1px solid rgba(82,183,136,0.25)',borderRadius:'16px',padding:'28px',marginBottom:'28px'}}>
            <div style={{fontSize:'1.3rem',fontWeight:800,marginBottom:'16px',lineHeight:1.4}}>{data.headline}</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
              <div style={{background:'rgba(82,183,136,0.08)',border:'1px solid rgba(82,183,136,0.2)',borderRadius:'10px',padding:'14px'}}>
                <div style={{fontSize:'0.72rem',color:C.green,fontWeight:600,marginBottom:'6px'}}>🌟 NORTH STAR (Day 90)</div>
                <div style={{fontSize:'0.9rem',color:'#ddd',lineHeight:1.5}}>{data.northStar}</div>
              </div>
              <div style={{background:'rgba(224,112,112,0.08)',border:'1px solid rgba(224,112,112,0.2)',borderRadius:'10px',padding:'14px'}}>
                <div style={{fontSize:'0.72rem',color:C.red,fontWeight:600,marginBottom:'6px'}}>🔑 CRITICAL DEPENDENCY</div>
                <div style={{fontSize:'0.9rem',color:'#ddd',lineHeight:1.5}}>{data.criticalDependency}</div>
              </div>
            </div>
          </div>

          {/* Phase tabs */}
          <div style={{display:'flex',gap:'8px',marginBottom:'24px'}}>
            {(data.phases||[]).map((p,i)=>(
              <button key={i} onClick={()=>setActivePhase(i)} style={{flex:1,padding:'14px 20px',borderRadius:'10px',border:`2px solid ${activePhase===i?phaseColors[i]:'transparent'}`,background:activePhase===i?`${phaseColors[i]}18`:'rgba(255,255,255,0.03)',cursor:'pointer',transition:'all 0.2s'}}>
                <div style={{fontWeight:800,fontSize:'1rem',color:activePhase===i?phaseColors[i]:C.muted,marginBottom:'4px'}}>{p.phase}</div>
                <div style={{fontSize:'0.78rem',color:activePhase===i?phaseColors[i]+'bb':C.dim}}>{p.theme}</div>
              </button>
            ))}
          </div>

          {/* Active phase */}
          {data.phases&&data.phases[activePhase]&&(()=>{
            const phase=data.phases[activePhase]
            const pc=phaseColors[activePhase]
            return(
              <div>
                <div style={{background:`${pc}10`,border:`1px solid ${pc}30`,borderRadius:'14px',padding:'22px',marginBottom:'24px',display:'flex',gap:'24px',alignItems:'center'}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'0.75rem',color:pc,fontWeight:600,marginBottom:'6px',letterSpacing:'0.08em'}}>PHASE GOAL</div>
                    <div style={{fontSize:'1rem',color:'#ddd',lineHeight:1.5,marginBottom:'12px'}}>{phase.goal}</div>
                    <div style={{fontSize:'0.75rem',color:pc,fontWeight:600,marginBottom:'4px',letterSpacing:'0.08em'}}>KEY METRIC</div>
                    <div style={{fontSize:'0.9rem',color:C.green,fontWeight:600}}>{phase.keyMetric}</div>
                  </div>
                  <div style={{background:`${pc}15`,border:`1px solid ${pc}30`,borderRadius:'10px',padding:'16px',maxWidth:'240px'}}>
                    <div style={{fontSize:'0.72rem',color:pc,fontWeight:600,marginBottom:'6px'}}>🧠 MINDSET</div>
                    <div style={{fontSize:'0.85rem',color:'#ccc',lineHeight:1.5,fontStyle:'italic'}}>"{phase.mindset}"</div>
                  </div>
                </div>

                <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                  {(phase.tasks||[]).map((t,i)=>(
                    <div key={i} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:'12px',padding:'18px',display:'flex',gap:'16px',alignItems:'flex-start'}}>
                      <div style={{minWidth:'28px',height:'28px',borderRadius:'8px',background:`${priColor(t.priority)}22`,border:`1px solid ${priColor(t.priority)}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.75rem',fontWeight:900,color:priColor(t.priority),flexShrink:0}}>{i+1}</div>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px',gap:'12px'}}>
                          <div style={{fontWeight:700,fontSize:'0.95rem',lineHeight:1.4}}>{t.task}</div>
                          <div style={{display:'flex',gap:'6px',flexShrink:0}}>
                            <span style={{fontSize:'0.72rem',padding:'3px 8px',borderRadius:'20px',background:`${catColor(t.category)}18`,color:catColor(t.category),fontWeight:600,border:`1px solid ${catColor(t.category)}33`,whiteSpace:'nowrap'}}>{t.category}</span>
                            <span style={{fontSize:'0.72rem',padding:'3px 8px',borderRadius:'20px',background:`${priColor(t.priority)}15`,color:priColor(t.priority),fontWeight:600,border:`1px solid ${priColor(t.priority)}33`,whiteSpace:'nowrap'}}>{t.priority}</span>
                          </div>
                        </div>
                        <div style={{fontSize:'0.82rem',color:C.muted,marginBottom:'8px',lineHeight:1.5}}>{t.whyItMatters}</div>
                        <div style={{fontSize:'0.8rem',color:pc,fontWeight:600}}>📏 Metric: <span style={{color:'#bbb',fontWeight:400}}>{t.metric}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </>
      )}

      {!data&&!loading&&(
        <div style={{textAlign:'center',padding:'80px 0',color:C.muted}}>
          <div style={{fontSize:'3rem',marginBottom:'16px'}}>🗺️</div>
          <div style={{fontSize:'1.1rem',marginBottom:'8px'}}>No roadmap generated yet</div>
          <div style={{fontSize:'0.9rem'}}>Click Build Roadmap for your personalised 30-60-90 day battle plan</div>
        </div>
      )}
    </div>
  )
}

// ─── CHAT PANEL ───────────────────────────────────────────────────────────────
function ChatPanel({profile}){
  const [messages,setMessages]=useState([{role:'assistant',content:`# Welcome, ${profile.name}! 🧠\n\nI've loaded your business profile. I'm ready to be your strategic brain.\n\n**What I know about you:**\n- **Industry:** ${profile.industry}\n- **Location:** ${profile.location||'Not specified'}\n- **Monthly Revenue:** ${profile.revenue||'Not specified'}\n- **Biggest Challenge:** ${profile.challenge||'Not specified'}\n\nAsk me anything — pricing strategy, competitor moves, growth tactics, profit levers.`}])
  const [input,setInput]=useState('')
  const [loading,setLoading]=useState(false)
  const [streamText,setStreamText]=useState('')
  const chatEndRef=useRef(null)
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:'smooth'})},[messages,streamText])

  const sendMessage=async(q)=>{
    const question=q||input.trim()
    if(!question||loading)return
    const newMessages=[...messages,{role:'user',content:question}]
    setMessages(newMessages);setInput('');setLoading(true);setStreamText('')
    const conversationHistory=newMessages.slice(-8,-1).map(m=>({role:m.role,content:m.content}))
    try{
      const res=await fetch(`${import.meta.env.VITE_API_URL}/api/analyse/stream`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({businessProfile:profile,question,conversationHistory})})
      const reader=res.body.getReader();const decoder=new TextDecoder();let full=''
      while(true){
        const{done,value}=await reader.read();if(done)break
        const lines=decoder.decode(value).split('\n').filter(l=>l.startsWith('data: '))
        for(const line of lines){const d=line.replace('data: ','');if(d==='[DONE]')break;try{const p=JSON.parse(d);if(p.delta){full+=p.delta;setStreamText(full)}}catch{}}
      }
      setMessages(prev=>[...prev,{role:'assistant',content:full}]);setStreamText('')
    }catch(e){setMessages(prev=>[...prev,{role:'assistant',content:`⚠️ Error: ${e.message}`}])}
    finally{setLoading(false)}
  }

  return(
    <div style={{display:'flex',height:'100%',overflow:'hidden'}}>
      <div style={{width:'240px',borderRight:`1px solid ${C.border}`,padding:'20px 12px',overflowY:'auto',display:'flex',flexDirection:'column',gap:'6px',flexShrink:0}}>
        <div style={{fontSize:'0.72rem',color:C.dim,letterSpacing:'0.1em',marginBottom:'8px',paddingLeft:'6px'}}>QUICK STRATEGIES</div>
        {QUICK_QUESTIONS.map((q,i)=>(
          <button key={i} onClick={()=>sendMessage(q)} style={{background:'transparent',border:`1px solid ${C.border}`,borderRadius:'8px',padding:'9px 11px',color:C.muted,fontSize:'0.8rem',cursor:'pointer',textAlign:'left',lineHeight:1.4}}
            onMouseEnter={e=>{e.target.style.borderColor=C.green;e.target.style.color=C.text}}
            onMouseLeave={e=>{e.target.style.borderColor=C.border;e.target.style.color=C.muted}}>{q}</button>
        ))}
        <div style={{marginTop:'auto',padding:'14px 6px',borderTop:`1px solid ${C.border}`}}>
          <div style={{fontSize:'0.75rem',color:C.dim,lineHeight:1.5}}>Powered by<br/><span style={{color:C.green,fontWeight:600}}>LLaMA 3.3 70B</span> via Groq</div>
        </div>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{flex:1,overflowY:'auto',padding:'28px 32px'}}>
          {messages.map((m,i)=>(
            <div key={i} style={{display:'flex',gap:'14px',marginBottom:'28px',flexDirection:m.role==='user'?'row-reverse':'row'}}>
              <div style={{minWidth:'34px',height:'34px',borderRadius:'50%',background:m.role==='user'?'rgba(255,255,255,0.1)':`linear-gradient(135deg,${C.greenDark},${C.green})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.95rem'}}>{m.role==='user'?'👤':'🧠'}</div>
              <div style={{maxWidth:'72%',background:m.role==='user'?'rgba(255,255,255,0.06)':'rgba(45,106,79,0.08)',border:`1px solid ${m.role==='user'?C.border:'rgba(82,183,136,0.2)'}`,borderRadius:m.role==='user'?'16px 4px 16px 16px':'4px 16px 16px 16px',padding:'14px 18px',fontSize:'0.92rem',lineHeight:1.7}}>
                {m.role==='assistant'?<div className="md-content"><ReactMarkdown>{m.content}</ReactMarkdown></div>:m.content}
              </div>
            </div>
          ))}
          {streamText&&(
            <div style={{display:'flex',gap:'14px',marginBottom:'28px'}}>
              <div style={{minWidth:'34px',height:'34px',borderRadius:'50%',background:`linear-gradient(135deg,${C.greenDark},${C.green})`,display:'flex',alignItems:'center',justifyContent:'center'}}>🧠</div>
              <div style={{maxWidth:'72%',background:'rgba(45,106,79,0.08)',border:'1px solid rgba(82,183,136,0.2)',borderRadius:'4px 16px 16px 16px',padding:'14px 18px',fontSize:'0.92rem',lineHeight:1.7}}>
                <div className="md-content"><ReactMarkdown>{streamText}</ReactMarkdown></div>
                <span style={{display:'inline-block',width:'8px',height:'16px',background:C.green,marginLeft:'2px',animation:'blink 1s infinite'}}/>
              </div>
            </div>
          )}
          {loading&&!streamText&&(
            <div style={{display:'flex',gap:'14px',marginBottom:'28px'}}>
              <div style={{minWidth:'34px',height:'34px',borderRadius:'50%',background:`linear-gradient(135deg,${C.greenDark},${C.green})`,display:'flex',alignItems:'center',justifyContent:'center'}}>🧠</div>
              <div style={{background:'rgba(45,106,79,0.08)',border:'1px solid rgba(82,183,136,0.2)',borderRadius:'4px 16px 16px 16px',padding:'14px 20px',display:'flex',gap:'6px',alignItems:'center'}}>
                {[0,1,2].map(i=><div key={i} style={{width:'8px',height:'8px',borderRadius:'50%',background:C.green,opacity:0.6,animation:`bounce 1.2s ${i*0.2}s infinite`}}/>)}
              </div>
            </div>
          )}
          <div ref={chatEndRef}/>
        </div>
        <div style={{padding:'16px 32px 24px',borderTop:`1px solid ${C.border}`,background:'rgba(10,10,15,0.8)',backdropFilter:'blur(8px)'}}>
          <div style={{display:'flex',gap:'10px',alignItems:'flex-end'}}>
            <textarea value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage()}}}
              placeholder="Ask BizBrain anything about your business strategy..." rows={2}
              style={{flex:1,padding:'12px 16px',borderRadius:'10px',border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:'0.92rem',resize:'none',outline:'none',lineHeight:1.5,fontFamily:'inherit'}}
              onFocus={e=>e.target.style.borderColor=C.green} onBlur={e=>e.target.style.borderColor=C.border}/>
            <button onClick={()=>sendMessage()} disabled={loading||!input.trim()} style={{...S.btnPrimary,padding:'12px 20px',opacity:loading||!input.trim()?0.5:1,cursor:loading||!input.trim()?'not-allowed':'pointer'}}>→</button>
          </div>
          <div style={{fontSize:'0.72rem',color:C.dim,marginTop:'6px'}}>Enter to send · Shift+Enter for new line</div>
        </div>
      </div>
    </div>
  )
}

// ─── APP PAGE ─────────────────────────────────────────────────────────────────
const APP_TABS=[
  {id:'chat',       label:'🧠 Strategy Chat'},
  {id:'score',      label:'🎯 BizBrain Score'},
  {id:'roadmap',    label:'🗺️ Roadmap'},
  {id:'swot',       label:'📋 SWOT Board'},
  {id:'competitors',label:'⚔️ Competitors'},
  {id:'simulator',  label:'🔬 Profit Sim'},
]

function AppPage(){
  const navigate=useNavigate()
  const [view,setView]=useState('profile')
  const [profile,setProfile]=useState({})
  const [activeTab,setActiveTab]=useState('chat')
  const updateProfile=(k,v)=>setProfile(p=>({...p,[k]:v}))
  const handleProfileSubmit=()=>{
    if(!profile.name||!profile.industry){alert('Please fill in at least Business Name and Industry.');return}
    setView('app')
  }

  if(view==='profile') return(
    <div style={{background:C.bg,minHeight:'100vh',color:C.text}}>
      <nav style={S.nav}>
        <div style={S.logo} onClick={()=>navigate('/')}>🧠 BizBrain</div>
        <div style={{color:C.muted,fontSize:'0.9rem'}}>Setup — Business Intelligence Profile</div>
        <div style={{width:120}}/>
      </nav>
      <div style={{maxWidth:'720px',margin:'0 auto',padding:'120px 24px 80px'}}>
        <div style={{textAlign:'center',marginBottom:'48px'}}>
          <div style={S.badge}>Setup your Intelligence Profile</div>
          <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:'12px'}}>Tell BizBrain About Your Business</h1>
          <p style={{color:C.muted,lineHeight:1.7}}>The more context you provide, the sharper the strategy output.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'18px'}}>
          {PROFILE_FIELDS.map(f=>(
            <div key={f.key} style={{gridColumn:['products','challenge','goals'].includes(f.key)?'span 2':'span 1'}}>
              <label style={{display:'block',fontSize:'0.78rem',color:C.green,marginBottom:'6px',fontWeight:600,letterSpacing:'0.04em'}}>{f.label.toUpperCase()}</label>
              <input type="text" placeholder={f.placeholder} value={profile[f.key]||''} onChange={e=>updateProfile(f.key,e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&handleProfileSubmit()}
                style={{width:'100%',padding:'11px 14px',borderRadius:'8px',border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:'0.92rem',outline:'none',boxSizing:'border-box'}}
                onFocus={e=>e.target.style.borderColor=C.green} onBlur={e=>e.target.style.borderColor=C.border}/>
            </div>
          ))}
        </div>
        <div style={{marginTop:'36px',display:'flex',gap:'14px'}}>
          <button style={{...S.btnPrimary,flex:1,padding:'15px'}} onClick={handleProfileSubmit}>Activate BizBrain →</button>
          <button style={{...S.btnSecondary,padding:'15px 22px'}} onClick={()=>setProfile({name:'Aromas Café',industry:'Food & Beverage',location:'Kozhikode, Kerala',revenue:'₹2,50,000',products:'Filter coffee, pastries, sandwiches, events',targetCustomer:'Young professionals and students, 18-35',competitors:'Starbucks, Café Coffee Day, local chai shops',marketingBudget:'₹12,000',challenge:'Low footfall on weekdays, high competition',goals:'Increase revenue 40% in next 3 months'})}>Load Demo</button>
        </div>
      </div>
    </div>
  )

  return(
    <div style={{background:C.bg,height:'100vh',display:'flex',flexDirection:'column',color:C.text}}>
      <nav style={{...S.nav,position:'relative',padding:'10px 24px'}}>
        <div style={S.logo} onClick={()=>navigate('/')}>🧠 BizBrain</div>
        <div style={{display:'flex',gap:'2px'}}>
          {APP_TABS.map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{padding:'8px 14px',borderRadius:'8px',border:'none',background:activeTab===t.id?`linear-gradient(135deg,${C.greenDark},${C.green})`:'transparent',color:activeTab===t.id?'#fff':C.muted,fontWeight:activeTab===t.id?700:400,fontSize:'0.82rem',cursor:'pointer',transition:'all 0.2s',whiteSpace:'nowrap'}}>{t.label}</button>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
            <div style={{width:'7px',height:'7px',borderRadius:'50%',background:C.green,boxShadow:`0 0 8px ${C.green}`}}/>
            <span style={{fontSize:'0.82rem',color:C.muted}}>{profile.name}</span>
          </div>
          <button style={S.btnGhost} onClick={()=>setView('profile')}>Edit Profile</button>
        </div>
      </nav>
      <div style={{flex:1,overflow:'hidden'}}>
        {activeTab==='chat'        &&<ChatPanel        profile={profile} key="chat"/>}
        {activeTab==='score'       &&<ScorePanel       profile={profile} key="score"/>}
        {activeTab==='roadmap'     &&<RoadmapPanel     profile={profile} key="roadmap"/>}
        {activeTab==='swot'        &&<SWOTPanel        profile={profile} key="swot"/>}
        {activeTab==='competitors' &&<CompetitorPanel  profile={profile} key="comp"/>}
        {activeTab==='simulator'   &&<ProfitSimPanel   profile={profile} key="sim"/>}
      </div>
      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .md-content h1,.md-content h2,.md-content h3{color:#52b788;margin:16px 0 8px}
        .md-content p{margin-bottom:10px}
        .md-content ul,.md-content ol{padding-left:20px;margin-bottom:10px}
        .md-content li{margin-bottom:4px}
        .md-content strong{color:#f0f0f0}
        .md-content code{background:rgba(82,183,136,0.15);padding:2px 6px;border-radius:4px;font-size:0.88em;color:#52b788}
        .md-content pre{background:rgba(0,0,0,0.4);padding:16px;border-radius:8px;overflow-x:auto;margin:12px 0}
        .md-content blockquote{border-left:3px solid #2d6a4f;padding-left:16px;color:#888;margin:12px 0}
      `}</style>
    </div>
  )
}

export default function App(){
  return(
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/app" element={<AppPage/>}/>
    </Routes>
  )
}