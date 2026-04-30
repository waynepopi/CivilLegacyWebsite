CREATE POLICY "Temp Anon Uploads to site-assets" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'site-assets');
CREATE POLICY "Temp Anon Update to site-assets" ON storage.objects FOR UPDATE TO anon USING (bucket_id = 'site-assets');
