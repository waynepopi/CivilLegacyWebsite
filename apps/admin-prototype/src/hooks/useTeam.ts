import { useState, useEffect, useCallback } from 'react';
import { supabase, BUCKETS } from '../lib/supabaseClient';
import { uploadImageToStorage } from './useBanner';
import { resolveImageUrl } from '../lib/resolveImageUrl';

// ── Types ────────────────────────────────────────────────────────────────────
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  registration_id: string;
  credentials: string;
  image_url: string;
  image_position: string;
  display_order: number;
  created_at: string;
}

export type TeamMemberInput = Omit<TeamMember, 'id' | 'created_at'>;

// ── useTeam hook ──────────────────────────────────────────────────────────────
export function useTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setMembers((data as TeamMember[]).map(m => ({
        ...m,
        image_url: resolveImageUrl(m.image_url, 'site-assets'),
      })));
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  async function addMember(input: TeamMemberInput): Promise<void> {
    const { error } = await supabase.from('team_members').insert(input);
    if (error) throw error;
    await fetchMembers();
  }

  async function updateMember(id: string, input: Partial<TeamMemberInput>): Promise<void> {
    const { error } = await supabase
      .from('team_members')
      .update(input)
      .eq('id', id);
    if (error) throw error;
    await fetchMembers();
  }

  async function deleteMember(id: string): Promise<void> {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);
    if (error) throw error;
    await fetchMembers();
  }

  /** Upload a photo to Supabase Storage and return the public URL */
  async function uploadPhoto(file: File): Promise<string> {
    return uploadImageToStorage(file, BUCKETS.SITE_ASSETS, 'team');
  }

  return { members, loading, error, addMember, updateMember, deleteMember, uploadPhoto, refresh: fetchMembers };
}
