import { supabase } from '../lib/supabaseClient';

export interface Project {
  id: string;
  title: string;
  loc: string;
  sector: string;
  scope: string;
  stands: string;
  date: string;
  status: string;
  created_at: string;
}

export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: true }); // We'll order by created_at to keep the insertion order

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data as Project[];
};
