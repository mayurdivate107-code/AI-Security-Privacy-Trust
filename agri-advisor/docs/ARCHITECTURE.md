# AgriAdvisor Architectural Specification

## 1. System Overview
AgriAdvisor is an enterprise-grade full-stack agricultural intelligence platform designed to empower farmers, agronomists, and agricultural extension workers with real-time, context-aware agronomic decision support.

The system is architected as a clean, decoupled monorepo:
- **Client**: React (v18+) with TypeScript, Vite, Tailwind CSS, TanStack Query, and React Hook Form.
- **Server**: Node.js (v20+ LTS) running Express.js in TypeScript with Multer, Helmet, and express-rate-limit.
- **Persistence & Identity**: Supabase PostgreSQL with Row Level Security (RLS) and Supabase Auth.
- **AI Core**: Official Google Gen AI SDK (`@google/genai`) using Gemini 2.5 Flash for vision diagnostics and deterministic structured outputs.

---

## 2. Core Processing Pipeline

```
Farmer Input / Camera Specimen
            │
            ▼
[Frontend Validation (Zod + React Hook Form)]
            │
            ▼ (HTTPS REST / Bearer JWT)
[Express API Gateway (Rate Limit + Helmet)]
            │
            ▼
[JWT Verification Middleware (Supabase Auth)]
            │
            ▼
[Multer In-Memory Buffer + Magic Byte Check]
            │
            ▼
[Agricultural Context Assembly (Farm baseline + Soil + Season)]
            │
            ▼
[Gemini 2.5 Flash Inference (@google/genai)]
  (System Instruction: Dr. Agris / AgriAdvisor)
  (Response Schema: Strict JSON contract)
            │
            ▼
[Backend Response Validation (Zod Schemas)]
            │
            ▼
[PostgreSQL Persistence + Storage Upload + In-App Notification]
            │
            ▼
[Advisory Dashboard / Mobile UI Viewport]
```

---

## 3. Separation of Concerns
1. **Presentation Layer**: Thin React views communicating solely through centralized API clients (`lib/api.ts`).
2. **Context Layer**: React Contexts (`AuthContext`, `FarmContext`) managing user identity and selected farm state.
3. **Transport Layer**: Express controllers handling HTTP status codes and response schemas (`utils/response.ts`).
4. **Service Layer**: Business logic modules (`farms.service.ts`, `advisories.service.ts`) completely decoupled from HTTP transport.
5. **AI Orchestration Layer**: Dedicated prompt builders, response schemas, and failure fallback generators.
6. **Persistence Layer**: Parametric PostgreSQL queries respecting Supabase Row Level Security (RLS).
