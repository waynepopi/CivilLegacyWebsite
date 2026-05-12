/**
 * Resolve a stored image URL to a fully-qualified public URL.
 *
 * The DB may contain:
 *   - Absolute URLs (https://...) → returned as-is
 *   - Relative paths (/scroll/...) → prefixed with the Supabase Storage base URL
 */
const SUPABASE_STORAGE_BASE = 'https://uacbchejzzvaadjaafwt.supabase.co/storage/v1/object/public/site-assets';
const PROJECT_STORAGE_BASE = 'https://uacbchejzzvaadjaafwt.supabase.co/storage/v1/object/public/project-images';

export function resolveImageUrl(url: string | null | undefined, bucket: 'site-assets' | 'project-images' = 'site-assets'): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // Relative path — prepend the right storage bucket base
  const base = bucket === 'project-images' ? PROJECT_STORAGE_BASE : SUPABASE_STORAGE_BASE;
  return `${base}${url.startsWith('/') ? url : `/${url}`}`;
}
