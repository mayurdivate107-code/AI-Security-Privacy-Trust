-- ==============================================================================
-- 001_initial_schema.sql
-- Production DDL for AI-Powered Agriculture Crop Advisory Assistant (AgriAdvisor)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Helper updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    country TEXT DEFAULT 'India' NOT NULL,
    state TEXT,
    district TEXT,
    preferred_language TEXT DEFAULT 'en' NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 2. Farms Table
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    country TEXT DEFAULT 'India' NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    village TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    area NUMERIC(12,3) NOT NULL CHECK (area > 0),
    area_unit TEXT NOT NULL CHECK (
        area_unit IN ('acre', 'hectare', 'square_meter')
    ),
    soil_type TEXT,
    soil_ph NUMERIC(4,2) CHECK (soil_ph BETWEEN 0 AND 14),
    irrigation_available BOOLEAN DEFAULT FALSE NOT NULL,
    water_source TEXT,
    farming_method TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_farms_updated_at
BEFORE UPDATE ON public.farms
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 3. Crop Advisories Table
CREATE TABLE IF NOT EXISTS public.crop_advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    advisory_type TEXT NOT NULL CHECK (
        advisory_type IN (
            'crop_recommendation',
            'disease_detection',
            'fertilizer',
            'irrigation'
        )
    ),
    input_data JSONB NOT NULL,
    ai_response JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed'
        CHECK (status IN ('completed', 'failed', 'pending')),
    model_name TEXT,
    is_saved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_advisories_updated_at
BEFORE UPDATE ON public.crop_advisories
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 4. Disease Analyses Table
CREATE TABLE IF NOT EXISTS public.disease_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    crop_name TEXT,
    growth_stage TEXT,
    image_path TEXT NOT NULL,
    analysis_result JSONB NOT NULL,
    diagnosis_status TEXT NOT NULL,
    confidence NUMERIC(5,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT NOT NULL DEFAULT 'info'
        CHECK (notification_type IN ('info', 'success', 'warning', 'alert')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Knowledge Articles Table
CREATE TABLE IF NOT EXISTS public.knowledge_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (
        category IN (
            'Crop Selection',
            'Soil Health',
            'Fertilizer Management',
            'Irrigation',
            'Pest Management',
            'Crop Diseases',
            'Organic Farming',
            'Sustainable Agriculture'
        )
    ),
    excerpt TEXT,
    content TEXT NOT NULL,
    language TEXT DEFAULT 'en' NOT NULL,
    image_url TEXT,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_knowledge_updated_at
BEFORE UPDATE ON public.knowledge_articles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 7. AI Usage Logs Table
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    advisory_id UUID REFERENCES public.crop_advisories(id) ON DELETE SET NULL,
    operation TEXT NOT NULL,
    model_name TEXT,
    status TEXT NOT NULL,
    input_tokens INTEGER,
    output_tokens INTEGER,
    latency_ms INTEGER,
    error_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON public.farms(user_id);
CREATE INDEX IF NOT EXISTS idx_crop_advisories_user_id ON public.crop_advisories(user_id);
CREATE INDEX IF NOT EXISTS idx_crop_advisories_type ON public.crop_advisories(advisory_type);
CREATE INDEX IF NOT EXISTS idx_crop_advisories_created ON public.crop_advisories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crop_advisories_farm_id ON public.crop_advisories(farm_id);
CREATE INDEX IF NOT EXISTS idx_disease_analyses_user ON public.disease_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_disease_analyses_farm ON public.disease_analyses(farm_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_ai_usage_user ON public.ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_category ON public.knowledge_articles(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_published ON public.knowledge_articles(is_published);
