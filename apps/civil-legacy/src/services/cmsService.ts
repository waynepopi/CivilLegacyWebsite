import { supabase } from '../lib/supabaseClient';

export interface ScrollingImage {
  id: string;
  image_url: string;
  order_index: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  registration_id: string;
  credentials: string;
  image_url: string;
  display_order: number;
  image_position?: string;
}

export const getScrollingImages = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('scrolling_images')
    .select('image_url')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching scrolling images:', error);
    return [];
  }

  return data.map(item => 
    item.image_url.startsWith('/') 
      ? `https://uacbchejzzvaadjaafwt.supabase.co/storage/v1/object/public/site-assets${item.image_url}` 
      : item.image_url
  );
};

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching team members:', error);
    return [];
  }

  return data.map(member => ({
    ...member,
    image_url: member.image_url?.startsWith('/') 
      ? `https://uacbchejzzvaadjaafwt.supabase.co/storage/v1/object/public/site-assets${member.image_url}` 
      : member.image_url
  })) as TeamMember[];
};
