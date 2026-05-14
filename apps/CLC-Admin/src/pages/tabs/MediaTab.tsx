import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loader2, Image as ImageIcon, Trash2, UploadCloud, Copy, FileText, CheckCircle2, Folder } from 'lucide-react';
import { logAdminAction } from '../../lib/auditLogger';

const BUCKETS = [
  { id: 'site-assets', name: 'Site Assets' },
  { id: 'project-images', name: 'Project Images' }
];

interface MediaFile {
  name: string;
  folder: string; // '' for root, 'scroll' / 'team' / etc.
  fullPath: string; // folder/name or just name
  metadata?: { size: number } | null;
}

export default function MediaTab() {
  const [activeBucket, setActiveBucket] = useState('site-assets');
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function fetchFiles(bucket: string) {
    setLoading(true);
    try {
      const allFiles: MediaFile[] = [];

      // 1. List root
      const { data: rootItems, error: rootErr } = await supabase.storage.from(bucket).list('', {
        sortBy: { column: 'created_at', order: 'desc' }
      });
      if (rootErr) throw rootErr;

      const rootFiles = (rootItems || []).filter(
        f => f.name !== '.emptyFolderPlaceholder' && f.metadata // files have metadata, folders don't
      );
      const folders = (rootItems || []).filter(
        f => f.name !== '.emptyFolderPlaceholder' && !f.metadata // folders lack metadata
      );

      rootFiles.forEach(f =>
        allFiles.push({ name: f.name, folder: '', fullPath: f.name, metadata: f.metadata })
      );

      // 2. List each subfolder
      await Promise.all(
        folders.map(async folder => {
          const { data: folderItems, error: folderErr } = await supabase.storage
            .from(bucket)
            .list(folder.name, { sortBy: { column: 'created_at', order: 'desc' } });

          if (folderErr) {
            console.error(`Error listing folder ${folder.name}:`, folderErr);
            return;
          }

          (folderItems || [])
            .filter(f => f.name !== '.emptyFolderPlaceholder')
            .forEach(f =>
              allFiles.push({
                name: f.name,
                folder: folder.name,
                fullPath: `${folder.name}/${f.name}`,
                metadata: f.metadata,
              })
            );
        })
      );

      setFiles(allFiles);
    } catch (err) {
      console.error('Failed to fetch files:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFiles(activeBucket);
  }, [activeBucket]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error } = await supabase.storage.from(activeBucket).upload(fileName, file);
      if (error) throw error;

      if (email) {
        await logAdminAction(email, 'UPLOAD', 'media', fileName, { bucket: activeBucket });
      }

      await fetchFiles(activeBucket);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      if (event.target) event.target.value = '';
    }
  };

  const handleDelete = async (fullPath: string) => {
    if (!window.confirm(`Are you sure you want to delete ${fullPath}? This may break images on the live site if they are still referenced.`)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email;

      const { error } = await supabase.storage.from(activeBucket).remove([fullPath]);
      if (error) throw error;

      if (email) {
        await logAdminAction(email, 'DELETE', 'media', fullPath, { bucket: activeBucket });
      }

      setFiles(prev => prev.filter(f => f.fullPath !== fullPath));
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const copyUrl = (fullPath: string) => {
    const { data } = supabase.storage.from(activeBucket).getPublicUrl(fullPath);
    navigator.clipboard.writeText(data.publicUrl);
    setCopiedId(fullPath);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isImage = (name: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="text-[#0077B6]" /> Media Library
          </h2>
          <p className="text-zinc-500 text-sm mt-1">Manage images and assets across Supabase buckets.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={activeBucket} 
            onChange={e => setActiveBucket(e.target.value)}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:ring-1 focus:ring-[#0077B6] focus:outline-none"
          >
            {BUCKETS.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          
          <div className="relative">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
              onChange={handleFileUpload}
              disabled={uploading}
              accept="image/*"
            />
            <Button disabled={uploading} className="bg-[#0077B6] hover:bg-[#005f8e] text-white">
              {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UploadCloud className="h-4 w-4 mr-2" />}
              Upload File
            </Button>
          </div>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader className="border-b border-zinc-800 pb-4">
          <CardTitle className="text-lg font-bold">Bucket: {activeBucket}</CardTitle>
          <CardDescription className="text-zinc-400">
            {files.length} file{files.length !== 1 && 's'} in this bucket.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 text-[#0077B6] animate-spin" /></div>
          ) : files.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No files found in this bucket.</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {files.map(f => {
                const url = supabase.storage.from(activeBucket).getPublicUrl(f.fullPath).data.publicUrl;
                return (
                  <div key={f.fullPath} className="group relative rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden flex flex-col">
                    <div className="aspect-square bg-zinc-900 flex items-center justify-center p-2 relative overflow-hidden">
                      {isImage(f.name) ? (
                        <img src={url} alt={f.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <FileText className="h-12 w-12 text-zinc-700" />
                      )}
                      
                      {/* Hover Overlay Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          onClick={() => copyUrl(f.fullPath)}
                          className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white"
                          title="Copy Public URL"
                        >
                          {copiedId === f.fullPath ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button 
                          size="icon" 
                          variant="destructive" 
                          onClick={() => handleDelete(f.fullPath)}
                          className="h-8 w-8 bg-red-500/80 hover:bg-red-500 text-white"
                          title="Delete File"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-2 border-t border-zinc-800">
                      {f.folder && (
                        <p className="text-[10px] text-[#0077B6] font-medium flex items-center gap-1 mb-0.5">
                          <Folder className="h-2.5 w-2.5" />{f.folder}
                        </p>
                      )}
                      <p className="text-xs text-zinc-300 truncate font-medium" title={f.fullPath}>{f.name}</p>
                      <p className="text-[10px] text-zinc-500">{((f.metadata?.size || 0) / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
