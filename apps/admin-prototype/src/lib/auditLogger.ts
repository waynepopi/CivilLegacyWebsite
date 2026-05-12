import { supabase } from './supabaseClient';

export async function logAdminAction(
  email: string,
  action: string,
  entityType: string,
  entityId?: string,
  details?: any
) {
  try {
    if (!email) return;

    await supabase.from('audit_logs').insert([{
      admin_email: email,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
    }]);
  } catch (err) {
    console.error('Failed to log admin action:', err);
    // Non-blocking error, we don't want to break the main action if logging fails
  }
}
