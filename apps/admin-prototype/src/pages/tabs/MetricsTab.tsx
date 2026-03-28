import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

export default function MetricsTab() {
  const dummyTransactions = [
    { id: '1', date: '2023-10-01', user: 'DeV', action: 'Created Service: Premium', amount: 'N/A', status: 'Success' },
    { id: '2', date: '2023-10-02', user: 'Leader', action: 'Edited Team Member', amount: 'N/A', status: 'Success' },
    { id: '3', date: '2023-10-05', user: 'Member', action: 'Failed Login Attempt', amount: 'N/A', status: 'Failed' },
    { id: '4', date: '2023-10-06', user: 'DeV', action: 'Deleted Branch', amount: 'N/A', status: 'Success' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Dashboard Metrics</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Total Revenue', value: '$45,231.89', change: '+20.1% from last month', icon: DollarSign },
          { title: 'Subscriptions', value: '+2350', change: '+180.1% from last month', icon: Users },
          { title: 'Sales', value: '+12,234', change: '+19% from last month', icon: Activity },
          { title: 'Active Now', value: '+573', change: '+201 since last hour', icon: TrendingUp },
        ].map((metric, idx) => (
          <Card key={idx} className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-zinc-500 mt-1">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 mt-6">
        <CardHeader>
          <CardTitle>Recent Activity History</CardTitle>
          <CardDescription className="text-zinc-400">Dummy data showing recent admin actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-zinc-300">
              <thead className="text-xs text-zinc-400 uppercase bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Date</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 rounded-tr-lg">Amount</th>
                </tr>
              </thead>
              <tbody>
                {dummyTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">{tx.date}</td>
                    <td className="px-6 py-4 font-medium text-blue-400">{tx.user}</td>
                    <td className="px-6 py-4">{tx.action}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.status === 'Success' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{tx.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}