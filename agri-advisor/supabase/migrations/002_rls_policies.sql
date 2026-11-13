-- ==============================================================================
-- 002_rls_policies.sql
-- Production Row Level Security (RLS) & Auth Triggers
-- ==============================================================================

-- Enable RLS on all domain tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Table Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Trigger: Automatically populate public.profiles upon auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, country, state, district, preferred_language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Agricultural Producer'),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'country', 'India'),
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'district',
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Farms Table Policies
DROP POLICY IF EXISTS "Users can view own farms" ON public.farms;
CREATE POLICY "Users can view own farms"
ON public.farms
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own farms" ON public.farms;
CREATE POLICY "Users can insert own farms"
ON public.farms
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own farms" ON public.farms;
CREATE POLICY "Users can update own farms"
ON public.farms
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own farms" ON public.farms;
CREATE POLICY "Users can delete own farms"
ON public.farms
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 3. Crop Advisories Table Policies
DROP POLICY IF EXISTS "Users can view own advisories" ON public.crop_advisories;
CREATE POLICY "Users can view own advisories"
ON public.crop_advisories
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own advisories" ON public.crop_advisories;
CREATE POLICY "Users can insert own advisories"
ON public.crop_advisories
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own advisories" ON public.crop_advisories;
CREATE POLICY "Users can update own advisories"
ON public.crop_advisories
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own advisories" ON public.crop_advisories;
CREATE POLICY "Users can delete own advisories"
ON public.crop_advisories
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 4. Disease Analyses Table Policies
DROP POLICY IF EXISTS "Users can view own disease analyses" ON public.disease_analyses;
CREATE POLICY "Users can view own disease analyses"
ON public.disease_analyses
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own disease analyses" ON public.disease_analyses;
CREATE POLICY "Users can insert own disease analyses"
ON public.disease_analyses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own disease analyses" ON public.disease_analyses;
CREATE POLICY "Users can delete own disease analyses"
ON public.disease_analyses
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 5. Notifications Table Policies
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
CREATE POLICY "Users can delete own notifications"
ON public.notifications
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 6. AI Usage Logs Policies (Service role or user's own read)
DROP POLICY IF EXISTS "Users view own AI usage" ON public.ai_usage_logs;
CREATE POLICY "Users view own AI usage"
ON public.ai_usage_logs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 7. Knowledge Articles Policies (Public read for published, service/admin write)
DROP POLICY IF EXISTS "Public can view published knowledge articles" ON public.knowledge_articles;
CREATE POLICY "Public can view published knowledge articles"
ON public.knowledge_articles
FOR SELECT
USING (is_published = true);
