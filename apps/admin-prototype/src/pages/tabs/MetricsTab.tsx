import React from 'react';
import { useMetrics } from '../../hooks/useMetrics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { ShoppingCart, FolderOpen, Settings2, Users, Loader2 } from 'lucide-react';

export default function MetricsTab() {
  const { counts, logs, loading } = useMetrics();

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 text-[#0077B6] animate-spin" /></div>;
  }

  const metricsData = [
    { title: 'Total Orders', value: counts.orders, icon: ShoppingCart },
    { title: 'Storefront Services', value: counts.services, icon: Settings2 },
    { title: 'Projects', value: counts.projects, icon: FolderOpen },
    { title: 'Team Members', value: counts.team, icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricsData.map((metric, idx) => (
          <Card key={idx} className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-[#0077B6]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 mt-6">
        <CardHeader>
          <CardTitle>Recent Admin Activity</CardTitle>
          <CardDescription className="text-zinc-400">Real-time audit log of changes made to the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {logs.length === 0 ? (
              <p className="text-sm text-zinc-500 py-4 text-center">No recent activity recorded.</p>
            ) : (
              <table className="w-full text-sm text-left text-zinc-300">
                <thead className="text-xs text-zinc-400 uppercase bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-3 rounded-tl-lg">Date</th>
                    <th className="px-6 py-3">Admin</th>
                    <th className="px-6 py-3">Action</th>
                    <th className="px-6 py-3">Entity Type</th>
                    <th className="px-6 py-3 rounded-tr-lg">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">{new Date(log.created_at).toLocaleString()}</td>
                      <td className="px-6 py-4 font-medium text-[#0077B6]">{log.admin_email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4">{log.entity_type}</td>
                      <td className="px-6 py-4 text-zinc-500 text-xs">
                        {log.details ? JSON.stringify(log.details) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}