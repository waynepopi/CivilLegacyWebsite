import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Loader2, Activity, ShieldAlert, FileText, Database } from 'lucide-react';

interface AuditLog {
  id: string;
  admin_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: any;
  created_at: string;
}

export default function SystemLogTab() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;
        setLogs(data || []);
      } catch (err) {
        console.error('Failed to fetch system logs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 text-[#0077B6] animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="text-[#0077B6]" /> System Audit Logs
        </h2>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader>
          <CardTitle>Security & Activity Tracking</CardTitle>
          <CardDescription className="text-zinc-400">
            A comprehensive record of all administrative actions, data modifications, and security events (showing last 100 entries).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                <Database className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p>No system activity recorded yet.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left text-zinc-300">
                <thead className="text-xs text-zinc-400 uppercase bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-3 rounded-tl-lg">Timestamp</th>
                    <th className="px-6 py-3">Administrator</th>
                    <th className="px-6 py-3">Action</th>
                    <th className="px-6 py-3">Module / Entity</th>
                    <th className="px-6 py-3 rounded-tr-lg">Changes & Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {logs.map((log) => {
                    let actionColor = 'bg-zinc-800 text-zinc-300';
                    if (log.action === 'CREATE' || log.action === 'INSERT') actionColor = 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
                    if (log.action === 'UPDATE' || log.action === 'EDIT') actionColor = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
                    if (log.action === 'DELETE' || log.action === 'REMOVE') actionColor = 'bg-red-500/10 text-red-400 border border-red-500/20';

                    return (
                      <tr key={log.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-400">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 font-medium text-white">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-[#0077B6]/20 flex items-center justify-center text-[10px] font-bold text-[#0077B6]">
                              {log.admin_email.charAt(0).toUpperCase()}
                            </div>
                            {log.admin_email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${actionColor}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-zinc-300 capitalize">
                          {log.entity_type.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-zinc-500 max-w-md truncate">
                          {log.details ? JSON.stringify(log.details) : <span className="text-zinc-600 italic">No additional details</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
