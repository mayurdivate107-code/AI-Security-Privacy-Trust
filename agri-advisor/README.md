# 🌾 AgriAdvisor — AI-Powered Agriculture Crop Advisory Assistant

AgriAdvisor is a full-stack, enterprise-grade agricultural intelligence platform built to bridge the gap between agricultural research and everyday farming operations. Powered by Google Gemini 2.5 Flash, Supabase PostgreSQL, and React, it equips farmers with real-time crop suitability scoring, multimodal leaf disease scanning, and precision NPK fertigation schedules.

---

## 🚀 Key Capabilities

- **Crop Recommendation Engine**: Multi-factor feasibility analysis evaluating soil type, pH, NPK levels, rainfall, temperature, and growing seasons.
- **Multimodal Disease Scanner**: Computer vision analysis of symptomatic foliage identifying pathogens, severity, organic biocontrols, and chemical treatments with safety waiting periods.
- **Precision Nutrient Calculator**: Converts soil test parameters into exact commercial fertilizer bag quantities (Urea, DAP, MOP) and organic manure tonnage.
- **Water Management Radar**: Formulation of watering depths, tensiometer thresholds, and overwatering/drought risk mitigation.
- **Farm Holdings Registry**: Management of multiple land holdings, soil baselines, and irrigation setups.
- **Advisory Archives & Notifications**: Bookmarkable consultations and automated in-app alerts.
- **Agricultural Knowledge Center**: Curated scientific best-practice field manuals.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, TanStack Query, React Hook Form, Zod, Lucide React, Recharts |
| **Backend** | Node.js (v20+ LTS), Express.js, TypeScript, Multer, Helmet, CORS, express-rate-limit, Pino |
| **Database & Auth** | Supabase PostgreSQL, Supabase Auth, Supabase Storage, Row Level Security (RLS) |
| **AI Integration** | Official Google Gen AI SDK (`@google/genai`), Gemini 2.5 Flash |

---

## 📂 Project Structure

```text
agri-advisor/
├── client/                     # Vite + React 18 + Tailwind CSS frontend
│   ├── src/
│   │   ├── components/         # Modular layout, forms, charts, and advisory cards
│   │   ├── contexts/           # AuthContext & FarmContext providers
│   │   ├── pages/              # 14 complete application pages
│   │   └── schemas/            # Zod validation schemas
├── server/                     # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── ai/                 # Gemini SDK services, prompts, and JSON schemas
│   │   ├── config/             # Zod environment, Supabase, and Gemini configuration
│   │   ├── middleware/         # Auth, upload, rateLimit, validation, and error middlewares
│   │   └── modules/            # Auth, farms, advisories, disease, notifications, knowledge
├── supabase/                   # Production PostgreSQL DDL, RLS policies, and seed data
│   ├── migrations/
│   └── seed.sql
├── docs/                       # Architecture, Database, API, Security, and Deployment guides
├── package.json
└── README.md
```

---

## ⚙️ Quick Start Guide

### 1. Database Setup
Execute the SQL migration files in order in your Supabase SQL Editor:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/migrations/003_storage_policies.sql`
4. `supabase/seed.sql`

### 2. Configure Environment
Copy `.env.example` to `.env` in both `server/` and `client/` and populate your Supabase and Gemini credentials.

### 3. Start Development Servers

**Server**:
```bash
cd server
npm install
npm run dev
```

**Client**:
```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:5173` to access the AgriAdvisor Platform.
