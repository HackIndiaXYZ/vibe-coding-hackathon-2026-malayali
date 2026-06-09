const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const Groq = require('groq-sdk')
const brain = require('./brain.json')

dotenv.config()

const app = express()
app.use(cors({
  origin: ['http://localhost:5173', 'https://biz-brain-nine.vercel.app']
}))
app.use(express.json())

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

function buildSystemPrompt() {
  const pillars = brain.pillars.map(p => {
    return `### ${p.title}: ${p.description}`
  }).join('\n')
  return `You are BizBrain — an elite AI business intelligence agent. You think like a combination of a seasoned McKinsey strategist, a behavioural economist, and a battle-tested entrepreneur.

Your reasoning is grounded in these six knowledge pillars:
${pillars}

RULES:
- Always give specific, actionable advice — never generic platitudes
- Reference relevant psychological principles and frameworks by name when applicable
- Structure your responses with clear sections using markdown
- When suggesting pricing, use ₹ (Indian Rupee) unless the user specifies otherwise
- Always end with a "Top 3 Immediate Actions" section ranked by impact
- Be direct, sharp, and confident — entrepreneurs need clarity, not hedging
- Tailor every response to the specific business data the user provides`
}

function profileContext(p) {
  if (!p) return ''
  return `
BUSINESS CONTEXT:
- Business Name: ${p.name || 'Not provided'}
- Industry: ${p.industry || 'Not provided'}
- Monthly Revenue: ${p.revenue || 'Not provided'}
- Location: ${p.location || 'Not provided'}
- Business Age: ${p.age || 'Not provided'}
- Target Customer: ${p.targetCustomer || 'Not provided'}
- Main Products/Services: ${p.products || 'Not provided'}
- Biggest Challenge: ${p.challenge || 'Not provided'}
- Monthly Marketing Budget: ${p.marketingBudget || 'Not provided'}
- Top Competitors: ${p.competitors || 'Not provided'}
- Current Goals: ${p.goals || 'Not provided'}
`
}

async function groqJSON(systemPrompt, userPrompt) {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.6,
    max_tokens: 2000,
  })
const raw = completion.choices[0].message.content
const match = raw.match(/\{[\s\S]*\}/)
if (!match) throw new Error('No JSON found in response')
return JSON.parse(match[0])
}

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'BizBrain backend running', model: 'llama-3.3-70b-versatile' })
})

app.get('/api/brain', (req, res) => res.json(brain))

// ─── Chat stream ──────────────────────────────────────────────────────────────
app.post('/api/analyse/stream', async (req, res) => {
  const { businessProfile, question, conversationHistory = [] } = req.body
  if (!question) return res.status(400).json({ error: 'Question is required' })

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const ctx = profileContext(businessProfile)
  const messages = [
    ...conversationHistory,
    { role: 'user', content: ctx ? `${ctx}\n\nMY QUESTION: ${question}` : question }
  ]

  try {
    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: buildSystemPrompt() }, ...messages],
      temperature: 0.7,
      max_tokens: 1500,
      stream: true
    })
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || ''
      if (delta) res.write(`data: ${JSON.stringify({ delta })}\n\n`)
    }
    res.write('data: [DONE]\n\n')
    res.end()
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    res.end()
  }
})

// ─── SWOT ─────────────────────────────────────────────────────────────────────
app.post('/api/swot', async (req, res) => {
  const { businessProfile } = req.body
  const ctx = profileContext(businessProfile)
  const system = `You are BizBrain. You generate deeply researched, hyper-specific SWOT analyses.
Always respond with ONLY valid raw JSON — no markdown, no backticks, no explanation.`
  const prompt = `${ctx}
Generate a SWOT analysis. Return ONLY this JSON structure:
{
  "strengths":     [{ "point": "...", "action": "...", "impact": "High|Medium|Low" }],
  "weaknesses":    [{ "point": "...", "action": "...", "impact": "High|Medium|Low" }],
  "opportunities": [{ "point": "...", "action": "...", "impact": "High|Medium|Low" }],
  "threats":       [{ "point": "...", "action": "...", "impact": "High|Medium|Low" }],
  "topPriority": "...",
  "healthScore": 72
}
Rules: 4 items per quadrant, specific to this business, each action doable within 30 days.`
  try { res.json(await groqJSON(system, prompt)) }
  catch (err) { res.status(500).json({ error: 'SWOT failed', detail: err.message }) }
})

// ─── Competitors ──────────────────────────────────────────────────────────────
app.post('/api/competitors', async (req, res) => {
  const { businessProfile, competitors } = req.body
  const ctx = profileContext(businessProfile)
  const system = `You are BizBrain. You analyse competitors with precision.
Always respond with ONLY valid raw JSON — no markdown, no backticks, no explanation.`
  const prompt = `${ctx}
Competitors to analyse: ${competitors}
Return ONLY this JSON:
{
  "competitors": [{
    "name": "...", "threatLevel": "High|Medium|Low", "threatScore": 75,
    "positioning": "...", "estimatedStrength": "...", "keyWeakness": "...",
    "pricingModel": "...", "targetSegment": "...",
    "exploitOpportunity": "...", "counterMove": "...",
    "tags": ["tag1","tag2","tag3"]
  }],
  "battlefieldSummary": "...",
  "recommendedStrategy": "Blue Ocean|Differentiation|Cost Leadership|Niche Domination",
  "winningMove": "..."
}`
  try { res.json(await groqJSON(system, prompt)) }
  catch (err) { res.status(500).json({ error: 'Competitor analysis failed', detail: err.message }) }
})

// ─── Profit Simulator ─────────────────────────────────────────────────────────
app.post('/api/simulate', async (req, res) => {
  const { businessProfile, scenario } = req.body
  const ctx = profileContext(businessProfile)
  const system = `You are BizBrain. You run profit simulations with precision.
Always respond with ONLY valid raw JSON — no markdown, no backticks, no explanation.`
  const prompt = `${ctx}
Scenario: "${scenario}"
Return ONLY this JSON:
{
  "scenarioTitle": "...", "assumption": "...",
  "projections": [
    { "month": "Month 1", "revenue": 200000, "costs": 150000, "profit": 50000, "note": "..." },
    { "month": "Month 2", "revenue": 220000, "costs": 152000, "profit": 68000, "note": "..." },
    { "month": "Month 3", "revenue": 245000, "costs": 155000, "profit": 90000, "note": "..." },
    { "month": "Month 6", "revenue": 300000, "costs": 160000, "profit": 140000, "note": "..." }
  ],
  "breakEvenPoint": "...", "riskLevel": "High|Medium|Low",
  "risks": ["...","...","..."],
  "upsideFactors": ["...","...","..."],
  "verdict": "Go for it|Proceed with caution|Avoid this move",
  "verdictReason": "...",
  "keyActions": ["...","...","..."]
}
All numbers in Indian Rupees, realistic for the business context.`
  try { res.json(await groqJSON(system, prompt)) }
  catch (err) { res.status(500).json({ error: 'Simulation failed', detail: err.message }) }
})

// ─── BizBrain Score ───────────────────────────────────────────────────────────
app.post('/api/score', async (req, res) => {
  const { businessProfile } = req.body
  const ctx = profileContext(businessProfile)
  const system = `You are BizBrain. You evaluate business health across multiple strategic dimensions.
Always respond with ONLY valid raw JSON — no markdown, no backticks, no explanation.`
  const prompt = `${ctx}
Evaluate this business and return ONLY this JSON:
{
  "overallScore": 74,
  "grade": "B+",
  "gradeSummary": "One punchy sentence summarising the business's current strategic position",
  "dimensions": [
    { "name": "Market Position",      "score": 70, "icon": "📊", "insight": "specific 1-sentence insight", "urgency": "High|Medium|Low" },
    { "name": "Financial Health",     "score": 65, "icon": "💰", "insight": "specific 1-sentence insight", "urgency": "High|Medium|Low" },
    { "name": "Competitive Strength", "score": 55, "icon": "⚔️", "insight": "specific 1-sentence insight", "urgency": "High|Medium|Low" },
    { "name": "Customer Retention",   "score": 80, "icon": "❤️", "insight": "specific 1-sentence insight", "urgency": "High|Medium|Low" },
    { "name": "Marketing Efficiency", "score": 60, "icon": "📣", "insight": "specific 1-sentence insight", "urgency": "High|Medium|Low" },
    { "name": "Product Strength",     "score": 75, "icon": "📦", "insight": "specific 1-sentence insight", "urgency": "High|Medium|Low" },
    { "name": "Pricing Strategy",     "score": 68, "icon": "🏷️", "insight": "specific 1-sentence insight", "urgency": "High|Medium|Low" },
    { "name": "Growth Momentum",      "score": 72, "icon": "🚀", "insight": "specific 1-sentence insight", "urgency": "High|Medium|Low" }
  ],
  "biggestStrength": "The single most powerful thing working in this business's favour",
  "biggestRisk":     "The single most dangerous gap or threat right now",
  "quickWins": [
    { "action": "specific action", "impact": "what it achieves", "timeframe": "This week|This month", "effort": "Low|Medium|High" },
    { "action": "specific action", "impact": "what it achieves", "timeframe": "This week|This month", "effort": "Low|Medium|High" },
    { "action": "specific action", "impact": "what it achieves", "timeframe": "This week|This month", "effort": "Low|Medium|High" }
  ]
}
Rules: scores 0-100, be honest not flattering, make every insight specific to this exact business.`
  try { res.json(await groqJSON(system, prompt)) }
  catch (err) { res.status(500).json({ error: 'Score generation failed', detail: err.message }) }
})

// ─── Roadmap ──────────────────────────────────────────────────────────────────
app.post('/api/roadmap', async (req, res) => {
  const { businessProfile } = req.body
  const ctx = profileContext(businessProfile)
  const system = `You are BizBrain. You create precise, actionable 30-60-90 day business roadmaps.
Always respond with ONLY valid raw JSON — no markdown, no backticks, no explanation.`
  const prompt = `${ctx}
Create a 30-60-90 day strategic roadmap. Return ONLY this JSON:
{
  "headline": "One bold sentence summarising the 90-day mission",
  "phases": [
    {
      "phase": "30 Days",
      "theme": "Foundation & Quick Wins",
      "goal": "What success looks like at day 30",
      "tasks": [
        { "task": "specific task", "category": "Marketing|Operations|Finance|Product|Sales|People", "priority": "Critical|High|Medium", "metric": "how to measure success", "whyItMatters": "1 sentence on impact" },
        { "task": "...", "category": "...", "priority": "...", "metric": "...", "whyItMatters": "..." },
        { "task": "...", "category": "...", "priority": "...", "metric": "...", "whyItMatters": "..." },
        { "task": "...", "category": "...", "priority": "...", "metric": "...", "whyItMatters": "..." },
        { "task": "...", "category": "...", "priority": "...", "metric": "...", "whyItMatters": "..." }
      ],
      "keyMetric": "The one number that proves this phase succeeded",
      "mindset": "One sentence on the mental focus needed for this phase"
    },
    {
      "phase": "60 Days",
      "theme": "Build & Systematise",
      "goal": "What success looks like at day 60",
      "tasks": [
        { "task": "...", "category": "...", "priority": "...", "metric": "...", "whyItMatters": "..." },
        { "task": "...", "category": "...", "priority": "...", "metric": "...", "whyItMatters": "..." },
        { "task": "...", "category": "...", "priority": "...", "metric": "...", "whyItMatters": "..." },
        { "task": "...", "category": "...", "priority": "...", "metric": "...", "whyItMatters": "..." },
        { "task": "...", "category": "...", "priority": "...", "metric": "...", "whyItMatters": "..." }
      ],
      "keyMetric": "...",
      "mindset": "..."
    },
    {
      "phase": "90 Days",
      "theme": "Scale & Dominate",
      "goal": "What success looks like at day 90",
      "tasks": [
        { "task": "...", "category": "...", "priority": "...", "metric": "...", "whyItMatters": "..." },
        { "task": "...", "category": "...", "priority": "...", "metric": "...", "whyItMatters": "..." },
        { "task": "...", "category": "...", "priority": "...", "metric": "...", "whyItMatters": "..." },
        { "task": "...", "category": "...", "priority": "...", "metric": "...", "whyItMatters": "..." },
        { "task": "...", "category": "...", "priority": "...", "metric": "...", "whyItMatters": "..." }
      ],
      "keyMetric": "...",
      "mindset": "..."
    }
  ],
  "northStar": "The single most important outcome to achieve by day 90",
  "criticalDependency": "The one thing that must go right for any of this to work"
}
Rules: every task must be specific and actionable for this exact business, not generic advice.`
  try { res.json(await groqJSON(system, prompt)) }
  catch (err) { res.status(500).json({ error: 'Roadmap generation failed', detail: err.message }) }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`BizBrain backend on port ${PORT}`))