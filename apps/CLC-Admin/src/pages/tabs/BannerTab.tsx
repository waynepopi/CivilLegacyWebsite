import React, { useRef, useState } from 'react';
import { useBanner } from '../../hooks/useBanner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  ImagePlus, Trash2, ChevronUp, ChevronDown, Link2, UploadCloud,
  AlertCircle, Loader2, Images, GripVertical
} from 'lucide-react';

export default function BannerTab() {
  const { images, loading, error, addImage, uploadImage, deleteImage, reorderImage } = useBanner();
  const [urlInput, setUrlInput] = useState('');
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    setActionError('');
    try {
      await uploadImage(file);
    } catch (err: unknown) {
      setActionError((err as Error).message || 'Upload failed');
    } finally {
      setSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = async () => {
    if (!urlInput.trim()) return;
    setSaving(true);
    setActionError('');
    try {
      await addImage(urlInput.trim());
      setUrlInput('');
    } catch (err: unknown) {
      setActionError((err as Error).message || 'Failed to add image');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteImage(id);
    } catch (err: unknown) {
      setActionError((err as Error).message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleReorder = async (id: string, dir: 'up' | 'down') => {
    try {
      await reorderImage(id, dir);
    } catch (err: unknown) {
      setActionError((err as Error).message || 'Reorder failed');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Images className="h-6 w-6 text-[#0077B6]" /> Banner Images
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            Manage the scrolling homepage carousel. Changes go live immediately.
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-zinc-800 p-1 border border-zinc-700">
          <button
            onClick={() => setMode('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              mode === 'upload' ? 'bg-[#0077B6] text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <UploadCloud className="h-3.5 w-3.5" /> Upload
          </button>
          <button
            onClick={() => setMode('url')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              mode === 'url' ? 'bg-[#0077B6] text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Link2 className="h-3.5 w-3.5" /> Paste URL
          </button>
        </div>
      </div>

      {/* Add Image Panel */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-zinc-100 text-base font-semibold">Add New Banner Image</CardTitle>
          <CardDescription className="text-zinc-500">
            {mode === 'upload'
              ? 'Upload an image file (JPG, PNG, WebP). It will be stored in Supabase and added to the carousel.'
              : 'Paste a full public URL to an image (https://…).'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === 'upload' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
                className="group w-full flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-700 hover:border-[#0077B6]/60 bg-zinc-800/30 hover:bg-[#0077B6]/5 px-6 py-10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="h-10 w-10 text-[#0077B6] animate-spin" />
                ) : (
                  <UploadCloud className="h-10 w-10 text-zinc-600 group-hover:text-[#0077B6] transition-colors" />
                )}
                <div className="text-center">
                  <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                    {saving ? 'Uploading…' : 'Click to select an image'}
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">JPG, PNG, WebP — recommended 1920×1080</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
                  className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#0077B6]"
                />
              </div>
              <Button
                onClick={handleAddUrl}
                disabled={saving || !urlInput.trim()}
                className="bg-[#0077B6] hover:bg-[#005f8e] text-white px-4"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              </Button>
            </div>
          )}

          {actionError && (
            <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" /> {actionError}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image List */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-zinc-100 text-base font-semibold">
            Current Carousel ({images.length} image{images.length !== 1 ? 's' : ''})
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Use the arrows to reorder. The carousel displays images top-to-bottom in order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-[#0077B6] animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-400 text-sm py-4">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 text-zinc-600">
              <Images className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No banner images yet. Add one above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="group flex items-center gap-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 p-3 hover:border-zinc-600 transition-colors"
                >
                  {/* Drag handle indicator */}
                  <GripVertical className="h-4 w-4 text-zinc-600 shrink-0" />

                  {/* Preview */}
                  <div className="h-16 w-28 rounded-lg overflow-hidden bg-zinc-900 shrink-0">
                    <img
                      src={img.image_url}
                      alt={`Banner ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* URL */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-500 mb-1">Image {idx + 1}</p>
                    <p className="text-sm text-zinc-300 truncate font-mono">{img.image_url}</p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700"
                      onClick={() => handleReorder(img.id, 'up')}
                      disabled={idx === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700"
                      onClick={() => handleReorder(img.id, 'down')}
                      disabled={idx === images.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500/60 hover:text-red-400 hover:bg-red-900/20"
                      onClick={() => handleDelete(img.id)}
                      disabled={deletingId === img.id}
                    >
                      {deletingId === img.id
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
