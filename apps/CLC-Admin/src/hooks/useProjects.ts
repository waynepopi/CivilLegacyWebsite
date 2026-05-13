import { useState, useEffect, useCallback } from 'react';
import { supabase, BUCKETS } from '../lib/supabaseClient';
import { uploadImageToStorage } from './useBanner';
import { resolveImageUrl } from '../lib/resolveImageUrl';
import { logAdminAction } from '../lib/auditLogger';

// ── Types ────────────────────────────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  loc: string;
  sector: string;
  scope: string;
  stands: string;
  date: string;
  status: string;
  image_url: string | null;
  created_at: string;
}

export type ProjectInput = Omit<Project, 'id' | 'created_at'>;

// ── useProjects hook ──────────────────────────────────────────────────────────
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getEmail = async () => (await supabase.auth.getSession()).data.session?.user.email || 'unknown';

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setProjects((data as Project[]).map(p => ({
        ...p,
        image_url: p.image_url ? resolveImageUrl(p.image_url, 'project-images') : null,
      })));
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  async function addProject(input: ProjectInput): Promise<void> {
    const newId = crypto.randomUUID();
    const { error } = await supabase.from('projects').insert([{ id: newId, ...input }]);
    if (error) throw error;
    await logAdminAction(await getEmail(), 'CREATE', 'projects', newId, { title: input.title });
    await fetchProjects();
  }

  async function updateProject(id: string, input: Partial<ProjectInput>): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .update(input)
      .eq('id', id);
    if (error) throw error;
    await logAdminAction(await getEmail(), 'UPDATE', 'projects', id, input);
    await fetchProjects();
  }

  async function deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) throw error;
    await logAdminAction(await getEmail(), 'DELETE', 'projects', id);
    await fetchProjects();
  }

  /** Upload project image to Supabase Storage and return the public URL */
  async function uploadProjectImage(file: File): Promise<string> {
    return uploadImageToStorage(file, BUCKETS.PROJECT_IMAGES, 'projects');
  }

  return { projects, loading, error, addProject, updateProject, deleteProject, uploadProjectImage, refresh: fetchProjects };
}
