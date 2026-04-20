# AI Exposure Platform

An interactive web app that visualizes how occupations are exposed to AI disruption. Features a filterable heatmap dashboard, detailed occupation profiles with D3 charts, an economic research page, and an AI debate arena where four personas argue about a chosen occupation's future.

**Stack:** React + TypeScript + Vite + Tailwind CSS + D3.js + Claude API

---

## Setup

**Prerequisites:** Node.js 18+, a [Vercel CLI](https://vercel.com/docs/cli) install (`npm i -g vercel`), and an Anthropic API key.

```bash
git clone https://github.com/jackmichaud/ai-exposure-platform.git
cd ai-exposure-platform
npm install
```

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

```
ANTHROPIC_API_KEY=sk-ant-...      # used by the debate arena and data generation script
ONET_API_KEY=your_onet_key     # free at services.onetcenter.org/developer/
```

## Running locally

The debate arena streams responses through a local Vercel edge function, so two processes are needed:

```bash
# Terminal 1 — Vercel dev server (Claude API proxy on :3000)
vercel dev

# Terminal 2 — Vite dev server (app on :5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

If you only want to explore the dashboard and occupation profiles (no debates), `npm run dev` alone is sufficient.

---

## Pages

| Route | Description |
|---|---|
| `/` | Heatmap dashboard with industry/wage/education/timeline filters |
| `/occupation/:id` | Occupation profile — charts, task breakdown, skill impact, wage projection |
| `/research` | Economic research foundations — academic models, equations, key findings |
| `/debate` | AI debate arena — four personas debate an occupation's AI exposure across three rounds |

## Project structure

```
src/
├── agents/        # Debate orchestrator, personas, prompt builder
├── api/           # Claude streaming client, static data access layer
├── components/    # Charts (D3), filters, layout, persona panels
├── context/       # FilterContext, DebateContext (useReducer)
├── data/          # Static JSON (19 occupations, 5 industries, research findings)
├── pages/         # Dashboard, OccupationProfile, ResearchPage, DebateArena
└── types/         # TypeScript type definitions
api/
└── debate.ts      # Vercel edge function — Claude API proxy
```

## Data

Occupation and industry data live in `src/data/` as static JSON. To add or modify occupations, see `docs/guides/adding-an-industry.md`. The scoring methodology is documented in `docs/data/scoring-methodology.md`.
