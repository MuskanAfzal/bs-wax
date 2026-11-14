-- Run after schema.sql in Supabase SQL Editor. Photos are private in storage.
-- The website serves only images attached to a published transformation.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('hive-portfolio', 'hive-portfolio', false, 3000000,
 ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE SET public=false, file_size_limit=3000000,
 allowed_mime_types=ARRAY['image/jpeg','image/png','image/webp'];
