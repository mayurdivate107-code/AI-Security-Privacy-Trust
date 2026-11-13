# AgriAdvisor Database Architecture

## 1. Relational Entity Relationship Diagram

```
auth.users (Supabase Managed Identity)
    │
    ├── (1:1) ── public.profiles (Farmer metadata)
    │
    ├── (1:N) ── public.farms (Agricultural holdings)
    │                 │
    │                 ├── (1:N) ── public.crop_advisories (Generated plans)
    │                 │
    │                 └── (1:N) ── public.disease_analyses (Pathology reports)
    │
    ├── (1:N) ── public.notifications (In-app alerts)
    │
    └── (1:N) ── public.ai_usage_logs (Token telemetry)

public.knowledge_articles (Independent curated repository)
```

---

## 2. Table Catalog

### `public.profiles`
Stores farmer profile attributes linked 1:1 with `auth.users(id)`.
- `id` (UUID, PK) -> References `auth.users(id)` ON DELETE CASCADE
- `full_name` (TEXT)
- `email` (TEXT)
- `phone` (TEXT)
- `country` (TEXT, Default 'India')
- `state` (TEXT)
- `district` (TEXT)
- `preferred_language` (TEXT, Default 'en')
- `created_at`, `updated_at` (TIMESTAMPTZ)

### `public.farms`
Stores multi-plot farm holdings.
- `id` (UUID, PK, Default `gen_random_uuid()`)
- `user_id` (UUID, FK) -> References `public.profiles(id)` ON DELETE CASCADE
- `farm_name` (TEXT)
- `area` (NUMERIC(12,3), CHECK area > 0)
- `area_unit` (TEXT, CHECK 'acre', 'hectare', 'square_meter')
- `soil_type` (TEXT)
- `soil_ph` (NUMERIC(4,2), CHECK 0 <= soil_ph <= 14)
- `irrigation_available` (BOOLEAN)
- `water_source` (TEXT)
- `farming_method` (TEXT)

### `public.crop_advisories`
Stores all AI consultation requests and responses.
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `farm_id` (UUID, FK, ON DELETE SET NULL)
- `advisory_type` (TEXT, CHECK 'crop_recommendation', 'disease_detection', 'fertilizer', 'irrigation')
- `input_data` (JSONB)
- `ai_response` (JSONB)
- `status` (TEXT, CHECK 'completed', 'failed', 'pending')
- `model_name` (TEXT)
- `is_saved` (BOOLEAN, Default FALSE)

### `public.disease_analyses`
Stores foliar computer vision evaluations.
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `farm_id` (UUID, FK)
- `crop_name` (TEXT)
- `growth_stage` (TEXT)
- `image_path` (TEXT)
- `analysis_result` (JSONB)
- `diagnosis_status` (TEXT)
- `confidence` (NUMERIC(5,2))

---

## 3. Migration Execution Guide
Execute SQL files sequentially in Supabase SQL Editor:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/migrations/003_storage_policies.sql`
4. `supabase/seed.sql`
