import React, { useRef, useState } from 'react';
import { useTeam, TeamMember, TeamMemberInput } from '../../hooks/useTeam';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '../../components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import {
  UserPlus, Pencil, Trash2, UploadCloud, Link2, AlertCircle, Loader2, Users
} from 'lucide-react';

// ── ImageField — upload or paste URL ─────────────────────────────────────────
function ImageField({
  value, onChange, onUpload
}: {
  value: string;
  onChange: (v: string) => void;
  onUpload: (file: File) => Promise<string>;
}) {
  const [mode, setMode] = useState<'upload' | 'url'>(value ? 'url' : 'upload');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const url = await onUpload(file);
      onChange(url);
      setMode('url');
    } catch (err: unknown) {
      setUploadError((err as Error).message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-300">Photo</label>
        <div className="flex items-center gap-1 rounded-lg bg-zinc-800 p-0.5 border border-zinc-700">
          <button type="button" onClick={() => setMode('upload')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${mode === 'upload' ? 'bg-[#0077B6] text-white' : 'text-zinc-400'}`}>
            <UploadCloud className="h-3 w-3" /> Upload
          </button>
          <button type="button" onClick={() => setMode('url')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${mode === 'url' ? 'bg-[#0077B6] text-white' : 'text-zinc-400'}`}>
            <Link2 className="h-3 w-3" /> URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="group w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-700 hover:border-[#0077B6]/60 bg-zinc-800/30 px-4 py-4 text-sm text-zinc-500 hover:text-zinc-300 transition-all disabled:opacity-50">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin text-[#0077B6]" /> : <UploadCloud className="h-4 w-4" />}
            {uploading ? 'Uploading…' : 'Click to upload a photo'}
          </button>
        </div>
      ) : (
        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            type="url"
            placeholder="https://…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-100 focus-visible:ring-[#0077B6]"
          />
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {uploadError}
        </p>
      )}

      {value && (
        <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
          <img src={value} alt="Preview" className="h-10 w-10 rounded-full object-cover border border-zinc-700" />
          <p className="text-xs text-zinc-500 truncate flex-1">{value}</p>
        </div>
      )}
    </div>
  );
}

// ── Empty form state ──────────────────────────────────────────────────────────
const emptyForm = (): TeamMemberInput => ({
  name: '',
  role: '',
  registration_id: '',
  credentials: '',
  image_url: '',
  image_position: 'center',
  display_order: 0,
});

// ── TeamTab ───────────────────────────────────────────────────────────────────
export default function TeamTab() {
  const { members, loading, error, addMember, updateMember, deleteMember, uploadPhoto } = useTeam();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<TeamMemberInput>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openAdd = () => {
    const nextOrder = members.length > 0 ? Math.max(...members.map(m => m.display_order)) + 1 : 0;
    setForm({ ...emptyForm(), display_order: nextOrder });
    setEditTarget(null);
    setSaveError('');
    setDialogOpen(true);
  };

  const openEdit = (m: TeamMember) => {
    setForm({
      name: m.name,
      role: m.role,
      registration_id: m.registration_id || '',
      credentials: m.credentials || '',
      image_url: m.image_url || '',
      image_position: m.image_position || 'center',
      display_order: m.display_order,
    });
    setEditTarget(m);
    setSaveError('');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.role.trim()) {
      setSaveError('Name and role are required.');
      return;
    }
    setSaving(true);
    setSaveError('');
    try {
      if (editTarget) {
        await updateMember(editTarget.id, form);
      } else {
        await addMember(form);
      }
      setDialogOpen(false);
    } catch (err: unknown) {
      setSaveError((err as Error).message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMember(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const field = (k: keyof TeamMemberInput) => ({
    value: form[k] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value })),
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-[#0077B6]" /> Team Members
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            Manage the team displayed on the Team page. Changes are live immediately.
          </p>
        </div>
        <Button onClick={openAdd} className="bg-[#0077B6] hover:bg-[#005f8e] text-white">
          <UserPlus className="mr-2 h-4 w-4" /> Add Member
        </Button>
      </div>

      {/* Member Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-[#0077B6] animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-400 text-sm p-4 bg-red-950/20 rounded-lg border border-red-900/30">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members.map(member => (
            <Card key={member.id} className="bg-zinc-900 border-zinc-800 text-zinc-100 hover:border-zinc-700 transition-colors">
              <CardHeader className="flex flex-row items-center gap-4 pb-3">
                <img
                  src={member.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0077B6&color=fff`}
                  alt={member.name}
                  className="h-14 w-14 rounded-full object-cover border-2 border-zinc-700 shrink-0"
                  style={{ objectPosition: member.image_position || 'center' }}
                />
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-bold leading-tight truncate">{member.name}</CardTitle>
                  <div className="text-sm text-[#0077B6] font-medium mt-0.5 truncate">{member.role}</div>
                  {member.registration_id && (
                    <div className="text-xs text-zinc-500 mt-0.5 truncate">{member.registration_id}</div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {member.credentials && (
                  <p className="text-xs text-zinc-500 mb-4 leading-relaxed line-clamp-2">{member.credentials}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(member)}
                    className="flex-1 border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white"
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteTarget(member)}
                    className="flex-1 border-red-900/40 hover:bg-red-900/20 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-zinc-100 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editTarget ? 'Edit Team Member' : 'Add Team Member'}
            </DialogTitle>
            <DialogDescription className="text-zinc-500">
              {editTarget ? 'Update the details below and save.' : 'Fill in the details for the new team member.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Full Name *</label>
                <Input {...field('name')} placeholder="Eng. Jane Smith" className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-[#0077B6]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Role / Title *</label>
                <Input {...field('role')} placeholder="Structural Engineer" className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-[#0077B6]" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Registration ID</label>
              <Input {...field('registration_id')} placeholder="ZIE 012345 | ECZ 67890" className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-[#0077B6]" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Credentials / Qualifications</label>
              <Input {...field('credentials')} placeholder="BSc (Hons), Pr. Eng, MECZ" className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-[#0077B6]" />
            </div>

            <ImageField
              value={form.image_url}
              onChange={(v) => setForm(f => ({ ...f, image_url: v }))}
              onUpload={uploadPhoto}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Image Position</label>
                <select
                  value={form.image_position}
                  onChange={(e) => setForm(f => ({ ...f, image_position: e.target.value }))}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:ring-1 focus:ring-[#0077B6] focus:outline-none"
                >
                  <option value="top">Top</option>
                  <option value="center">Center</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Display Order</label>
                <Input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
                  className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-[#0077B6]"
                />
              </div>
            </div>
          </div>

          {saveError && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/30 border border-red-900/40 rounded-lg p-3">
              <AlertCircle className="h-4 w-4 shrink-0" /> {saveError}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="text-zinc-400 hover:text-zinc-100">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-[#0077B6] hover:bg-[#005f8e] text-white">
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : 'Save Member'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team Member?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This will permanently remove <span className="font-semibold text-zinc-200">{deleteTarget?.name}</span> from the team page. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-700 hover:bg-red-600 text-white"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}