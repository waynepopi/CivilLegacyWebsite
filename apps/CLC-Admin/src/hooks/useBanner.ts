import { useState, useEffect, useCallback } from 'react';
import { supabase, BUCKETS } from '../lib/supabaseClient';
import { resolveImageUrl } from '../lib/resolveImageUrl';
import { logAdminAction } from '../lib/auditLogger';

// ── Types ────────────────────────────────────────────────────────────────────
export interface ScrollingImage {
  id: string;
  image_url: string;
  order_index: number;
  created_at: string;
}

// ── Upload Helper ─────────────────────────────────────────────────────────────
export async function uploadImageToStorage(
  file: File,
  bucket: string,
  folder = ''
): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${folder ? folder + '/' : ''}${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

// ── useBanner hook ────────────────────────────────────────────────────────────
export function useBanner() {
  const [images, setImages] = useState<ScrollingImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getEmail = async () => (await supabase.auth.getSession()).data.session?.user.email || 'unknown';

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('scrolling_images')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setImages((data as ScrollingImage[]).map(img => ({
        ...img,
        image_url: resolveImageUrl(img.image_url, 'site-assets'),
      })));
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  /** Add a new image by URL (already resolved to a public URL) */
  async function addImage(imageUrl: string): Promise<void> {
    const nextIndex = images.length > 0
      ? Math.max(...images.map(i => i.order_index)) + 1
      : 0;

    const newId = crypto.randomUUID();
    const { error } = await supabase
      .from('scrolling_images')
      .insert([{ id: newId, image_url: imageUrl, order_index: nextIndex }]);

    if (error) throw error;
    await logAdminAction(await getEmail(), 'CREATE', 'scrolling_images', newId, { url: imageUrl });
    await fetchImages();
  }

  /** Upload a file to Supabase Storage, then insert the public URL */
  async function uploadImage(file: File): Promise<void> {
    const publicUrl = await uploadImageToStorage(file, BUCKETS.SITE_ASSETS, 'scroll');
    await addImage(publicUrl);
  }

  /** Delete an image by its DB id */
  async function deleteImage(id: string): Promise<void> {
    const { error } = await supabase
      .from('scrolling_images')
      .delete()
      .eq('id', id);
    if (error) throw error;
    await logAdminAction(await getEmail(), 'DELETE', 'scrolling_images', id);
    await fetchImages();
  }

  /** Move an image up (-1) or down (+1) in order */
  async function reorderImage(id: string, direction: 'up' | 'down'): Promise<void> {
    const sorted = [...images].sort((a, b) => a.order_index - b.order_index);
    const idx = sorted.findIndex(i => i.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const a = sorted[idx];
    const b = sorted[swapIdx];

    await Promise.all([
      supabase.from('scrolling_images').update({ order_index: b.order_index }).eq('id', a.id),
      supabase.from('scrolling_images').update({ order_index: a.order_index }).eq('id', b.id),
    ]);
    await logAdminAction(await getEmail(), 'UPDATE', 'scrolling_images', id, { action: 'reorder', direction });
    await fetchImages();
  }

  return { images, loading, error, addImage, uploadImage, deleteImage, reorderImage, refresh: fetchImages };
}
