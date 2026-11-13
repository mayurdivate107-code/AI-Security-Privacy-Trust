# AgriAdvisor Production Deployment Manual

## 1. Prerequisites
- Node.js (v20+ LTS)
- A Supabase Project ([supabase.com](https://supabase.com))
- A Google Gemini API Key ([aistudio.google.com](https://aistudio.google.com))

---

## 2. Supabase Configuration

1. In your Supabase Project dashboard, navigate to the **SQL Editor**.
2. Run the migrations in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_storage_policies.sql`
   - `supabase/seed.sql`
3. Verify that the `crop-images` bucket exists under **Storage** and is configured as **Private**.

---

## 3. Environment Variables Setup

### Backend (`server/.env`):
```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash

CROP_IMAGE_BUCKET=crop-images
MAX_IMAGE_SIZE_MB=8
```

### Frontend (`client/.env`):
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 4. Build & Run

### Backend:
```bash
cd server
npm install
npm run build
npm start
```

### Frontend:
```bash
cd client
npm install
npm run build
npm run preview
```
