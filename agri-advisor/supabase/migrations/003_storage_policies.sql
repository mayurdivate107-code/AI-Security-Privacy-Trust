-- ==============================================================================
-- 003_storage_policies.sql
-- Supabase Storage Configuration for Private Crop Disease Imagery
-- ==============================================================================

-- Create private bucket 'crop-images' if not already created
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'crop-images',
    'crop-images',
    false,
    8388608, -- 8MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 8388608,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Storage RLS Policies
-- Enforce path pattern: {user_id}/{filename}

DROP POLICY IF EXISTS "Authenticated users can upload own crop images" ON storage.objects;
CREATE POLICY "Authenticated users can upload own crop images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'crop-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Authenticated users can view own crop images" ON storage.objects;
CREATE POLICY "Authenticated users can view own crop images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'crop-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Authenticated users can delete own crop images" ON storage.objects;
CREATE POLICY "Authenticated users can delete own crop images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'crop-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);
