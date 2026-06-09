# 🧠 BizBrain — AI Business Intelligence Agent

> **Submitted for:** Vibe Coding Hackathon 2026 — Malayali Track  
> **Team:** Malayali

---


## 🚀 What is BizBrain?

BizBrain is an AI-powered business intelligence agent that acts as a **strategic brain-for-hire** for entrepreneurs, small business owners, and startups. It digests everything about your business — products, competition, market, finances — and generates **psychology-backed, profit-driving strategies** grounded in behavioral economics, market structure analysis, and proven business playbooks.

Not generic advice. **Your business. Your moves.**

---

## 🎯 The Problem It Solves

Most small business owners in India make strategic decisions based on gut feeling. They lack access to the kind of strategic intelligence that large corporations get from expensive consultants. BizBrain democratizes that — putting a McKinsey-level strategic brain in the hands of every entrepreneur for free.

---

## 🧠 The Six Knowledge Pillars

BizBrain's reasoning engine is built on six intellectual foundations:

| Pillar | What It Does |
|--------|-------------|
| 🧠 Human Psychology & Buyer Behaviour | Loss aversion, anchoring, scarcity triggers, IKEA effect, decision fatigue |
| 📊 Market Structure Analysis | Porter's Five Forces, Blue Ocean theory, niche identification, demand elasticity |
| 💰 Money Flow Intelligence | Revenue stream structures, high-margin vs high-volume tradeoffs, cash flow timing |
| 🏷️ Price Pattern Recognition | Penetration vs premium, psychological price thresholds, competitor pricing positioning |
| ⚔️ Competitive Battlefield Analysis | Weakness mapping, positioning gaps, counter-move playbooks |
| 🚀 Winning Business Strategies | Growth hacking, retention loops, upsell architecture, referral flywheel design |

---

## ⚡ Feature Modules

### 1. 🧠 Strategy Chat
Conversational AI powered by LLaMA 3.3 70B via Groq. Ask anything about your business — pricing, competitors, growth tactics, profit levers — and get sharp, specific, streaming responses in real time.

### 2. 🎯 BizBrain Score
An 8-dimension strategic health score (0–100) covering Market Position, Financial Health, Competitive Strength, Customer Retention, Marketing Efficiency, Product Strength, Pricing Strategy, and Growth Momentum — with quick wins ranked by impact.

### 3. 🗺️ 30-60-90 Day Roadmap
A phased, task-by-task action plan tailored to your exact business. Every task includes category, priority, success metric, and why it matters.

### 4. 📋 SWOT Live Board
AI-generated SWOT analysis with specific 30-day actions tied to every quadrant, an overall health score, and a top priority callout.

### 5. ⚔️ Competitor Profiler
Enter competitor names and get threat scores, weakness maps, pricing model analysis, target segment breakdown, exploit opportunities, and counter-move playbooks for each.

### 6. 🔬 Profit Simulator
Describe any what-if scenario — price drop, new hire, discount campaign, new service launch — and get a 4-month P&L projection, risk assessment, upside factors, and a Go/Caution/Avoid verdict.

---

## 🏗️ Architecture & Flow
Entrepreneur Input (Business Profile)
↓
BizBrain Core — Intelligence Engine
├── Human Psychology & Buyer Behaviour
├── Market & Money Flow Structure
├── Price Patterns & Signals
├── Competitor Intel & Gap Scan
├── Win Strategies & Playbooks
└── Profit Modelling & Revenue Paths
↓
Output Layer — Actionable Intelligence Reports
├── Pricing Strategy Advice
├── Marketing Campaigns & Reach
├── Competitive Move & Counter
└── Profit Growth Levers
↓
Entrepreneur Dashboard — Live Decision Hub
├── SWOT Board
├── Profit Simulator
├── 30-60-90 Roadmap
└── Trend Alerts
---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router, React Markdown |
| Backend | Node.js, Express.js |
| AI Model | LLaMA 3.3 70B via Groq API |
| Deployment | Vercel (Frontend) + Render (Backend) |
| Styling | Pure inline CSS with dark theme design system |

---

## 📁 Project Structure
bizbrain/
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # All UI — HomePage, AppPage, 6 panels
│   │   └── main.jsx       # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── backend/
├── src/
│   ├── index.js       # Express server, all API routes
│   └── brain.json     # Six knowledge pillars knowledge base
└── package.json
---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/brain` | Returns full knowledge pillar data |
| POST | `/api/analyse/stream` | Streaming strategy chat (SSE) |
| POST | `/api/swot` | Generate SWOT analysis |
| POST | `/api/competitors` | Competitor threat analysis |
| POST | `/api/simulate` | Profit scenario simulation |
| POST | `/api/score` | 8-dimension BizBrain Score |
| POST | `/api/roadmap` | 30-60-90 day roadmap |

---

## 🚀 Running Locally

**Backend**
```bash
cd bizbrain/backend
npm install
# create .env file with GROQ_API_KEY=your_key
node src/index.js
```

**Frontend**
```bash
cd bizbrain/frontend
npm install
# create .env file with VITE_API_URL=http://localhost:5000
npm run dev
```

---

## 🌍 Live Demo

- **Frontend:** (add after Vercel deployment)
- **Backend:** (add after Render deployment)
---

## 💡 Business Use Cases

- 🛒 **Retail Store Owner** — Which products to push, when to discount, how to counter competitor promotions
- 🍽️ **Restaurant / F&B** — Menu pricing psychology, seasonal demand planning, loyalty loop design
- 💻 **SaaS Founder** — Subscription tier architecture, churn prevention, upsell sequencing
- 🏪 **E-commerce Brand** — SKU-level margin analysis, ad budget allocation, referral flywheel
- 🔧 **Service Business** — Premium pricing positioning, client retention frameworks
- 🌱 **Early-Stage Startup** — Product-market fit scoring, go-to-market strategy, 90-day survival roadmap

---

## 🏆 Why BizBrain Wins

1. **Not generic** — Every output is specific to the business data entered
2. **Psychology-first** — Strategies are grounded in behavioral science, not platitudes  
3. **Six reasoning pillars** — Cross-domain intelligence baked into every response
4. **Full-stack AI** — Streaming chat + structured JSON outputs for 5 intelligence modules
5. **India-first** — ₹ pricing, Indian market context, local competitor awareness built in

---

*Built with 🧠 for entrepreneurs who think differently.*
