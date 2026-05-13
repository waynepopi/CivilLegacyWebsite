import React, { useRef, useState } from 'react';
import { useProjects, Project, ProjectInput } from '../../hooks/useProjects';
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
  FolderPlus, Pencil, Trash2, UploadCloud, Link2, AlertCircle, Loader2, FolderOpen
} from 'lucide-react';

// ── Sector / Status badge colors ──────────────────────────────────────────────
const SECTOR_COLORS: Record<string, string> = {
  Residential: 'bg-blue-900/30 text-blue-400 border-blue-800/50',
  Industrial:  'bg-orange-900/30 text-orange-400 border-orange-800/50',
  Commercial:  'bg-purple-900/30 text-purple-400 border-purple-800/50',
  Infrastructure: 'bg-cyan-900/30 text-cyan-400 border-cyan-800/50',
  Institutional: 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50',
};
const STATUS_COLORS: Record<string, string> = {
  Completed: 'bg-green-900/30 text-green-400 border-green-800/50',
  Underway:  'bg-yellow-900/30 text-yellow-400 border-yellow-800/50',
  Approved:  'bg-sky-900/30 text-sky-400 border-sky-800/50',
};
const badge = (map: Record<string, string>, key: string) =>
  `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${map[key] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'}`;

// ── ImageField component ──────────────────────────────────────────────────────
function ImageField({
  value, onChange, onUpload
}: {
  value: string;
  onChange: (v: string) => void;
  onUpload: (f: File) => Promise<string>;
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
        <label className="text-sm font-medium text-zinc-300">Project Image <span className="text-zinc-600">(optional)</span></label>
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
            className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-700 hover:border-[#0077B6]/50 bg-zinc-800/30 px-4 py-4 text-sm text-zinc-500 hover:text-zinc-300 transition-all disabled:opacity-50">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin text-[#0077B6]" /> : <UploadCloud className="h-4 w-4" />}
            {uploading ? 'Uploading…' : 'Click to upload an image'}
          </button>
        </div>
      ) : (
        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input type="url" placeholder="https://…" value={value} onChange={(e) => onChange(e.target.value)}
            className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-100 focus-visible:ring-[#0077B6]" />
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {uploadError}
        </p>
      )}

      {value && (
        <div className="rounded-lg overflow-hidden border border-zinc-700/50 h-32 bg-zinc-800">
          <img src={value} alt="Preview" className="h-full w-full object-cover" />
        </div>
      )}
    </div>
  );
}

// ── Empty form ────────────────────────────────────────────────────────────────
const emptyForm = (): ProjectInput => ({
  title: '',
  loc: '',
  sector: 'Residential',
  scope: '',
  stands: '',
  date: '',
  status: 'Underway',
  image_url: null,
});

const SECTORS = ['Residential', 'Industrial', 'Commercial', 'Infrastructure', 'Institutional'];
const STATUSES = ['Underway', 'Completed', 'Approved'];

// ── ProjectsTab ───────────────────────────────────────────────────────────────
export default function ProjectsTab() {
  const { projects, loading, error, addProject, updateProject, deleteProject, uploadProjectImage } = useProjects();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectInput>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState('');

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.loc.toLowerCase().includes(search.toLowerCase()) ||
    p.sector.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm(emptyForm());
    setEditTarget(null);
    setSaveError('');
    setDialogOpen(true);
  };

  const openEdit = (p: Project) => {
    setForm({
      title: p.title,
      loc: p.loc,
      sector: p.sector,
      scope: p.scope,
      stands: p.stands,
      date: p.date,
      status: p.status,
      image_url: p.image_url,
    });
    setEditTarget(p);
    setSaveError('');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.loc.trim() || !form.scope.trim()) {
      setSaveError('Title, location, and scope are required.');
      return;
    }
    setSaving(true);
    setSaveError('');
    try {
      if (editTarget) {
        await updateProject(editTarget.id, form);
      } else {
        await addProject(form);
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
      await deleteProject(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const field = (k: keyof ProjectInput) => ({
    value: (form[k] as string) ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value })),
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-[#0077B6]" /> Projects
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            Manage projects displayed on the Projects page. {projects.length} project{projects.length !== 1 ? 's' : ''} total.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#0077B6]"
          />
          <Button onClick={openAdd} className="bg-[#0077B6] hover:bg-[#005f8e] text-white whitespace-nowrap">
            <FolderPlus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </div>
      </div>

      {/* Project list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-[#0077B6] animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-400 text-sm p-4 bg-red-950/20 rounded-lg border border-red-900/30">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-600">
          <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>{search ? 'No projects match your search.' : 'No projects yet. Add one above.'}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map(project => (
            <Card key={project.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors overflow-hidden">
              {project.image_url && (
                <div className="h-36 overflow-hidden bg-zinc-800">
                  <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-bold text-zinc-100 leading-tight">{project.title}</CardTitle>
                  <span className={badge(STATUS_COLORS, project.status)}>{project.status}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={badge(SECTOR_COLORS, project.sector)}>{project.sector}</span>
                  <span className="text-xs text-zinc-500">{project.loc}</span>
                  {project.date && <span className="text-xs text-zinc-600">· {project.date}</span>}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-zinc-500 mb-1 line-clamp-2">{project.scope}</p>
                {project.stands && (
                  <p className="text-xs text-zinc-600">{project.stands}</p>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(project)}
                    className="flex-1 border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white"
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteTarget(project)}
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
        <DialogContent className="bg-zinc-900 border-zinc-700 text-zinc-100 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editTarget ? 'Edit Project' : 'Add Project'}
            </DialogTitle>
            <DialogDescription className="text-zinc-500">
              {editTarget ? 'Update project details.' : 'Fill in the project details. Required fields are marked with *.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Title *</label>
              <Input {...field('title')} placeholder="e.g. Suncoast Project" className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-[#0077B6]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Location *</label>
                <Input {...field('loc')} placeholder="e.g. Masvingo" className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-[#0077B6]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Stands / Scale</label>
                <Input {...field('stands')} placeholder="e.g. 3200 Stands" className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-[#0077B6]" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Scope *</label>
              <Input {...field('scope')} placeholder="e.g. Road Design, Water Reticulation, Sewer Reticulation" className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-[#0077B6]" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Sector</label>
                <select
                  value={form.sector}
                  onChange={(e) => setForm(f => ({ ...f, sector: e.target.value }))}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:ring-1 focus:ring-[#0077B6] focus:outline-none"
                >
                  {SECTORS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:ring-1 focus:ring-[#0077B6] focus:outline-none"
                >
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Date</label>
                <Input {...field('date')} placeholder="e.g. Oct 2022" className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-[#0077B6]" />
              </div>
            </div>

            <ImageField
              value={form.image_url ?? ''}
              onChange={(v) => setForm(f => ({ ...f, image_url: v || null }))}
              onUpload={uploadProjectImage}
            />
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
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : 'Save Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This will permanently remove <span className="font-semibold text-zinc-200">{deleteTarget?.title}</span> from the projects page. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-700 hover:bg-red-600 text-white">
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
