import React from 'react';
import { useMetrics, DateFilter } from '../../hooks/useMetrics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  ShoppingCart, FolderOpen, Settings2, Users, Loader2, 
  DollarSign, TrendingUp, Calendar, FileText, Download,
  ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { PDFDownloadLink } from '@react-pdf/renderer';
import MonthlyReportPDF from '../../components/PDF/MonthlyReportPDF';

export default function MetricsTab() {
  const { 
    counts, logs, salesMetrics, loading, 
    dateFilter, setDateFilter, refresh 
  } = useMetrics();

  if (loading && !salesMetrics) {
    return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 text-[#0077B6] animate-spin" /></div>;
  }

  const formatCurrency = (val: number) => `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const mainMetrics = [
    { 
      title: 'Total Revenue', 
      value: formatCurrency(salesMetrics?.totalRevenue || 0), 
      sub: `${salesMetrics?.paidOrders} paid orders`,
      icon: DollarSign,
      color: 'text-emerald-500'
    },
    { 
      title: 'Avg Order Value', 
      value: formatCurrency(salesMetrics?.avgOrderValue || 0), 
      sub: 'Per successful checkout',
      icon: TrendingUp,
      color: 'text-blue-500'
    },
    { 
      title: 'Storefront Orders', 
      value: salesMetrics?.orderCount || 0, 
      sub: 'Total transactions',
      icon: ShoppingCart,
      color: 'text-[#0077B6]'
    },
    { 
      title: 'Success Rate', 
      value: salesMetrics?.orderCount ? `${Math.round((salesMetrics.paidOrders / salesMetrics.orderCount) * 100)}%` : '0%', 
      sub: 'Paid vs Total',
      icon: Activity,
      color: 'text-amber-500'
    },
  ];

  const filterOptions: { label: string, value: DateFilter }[] = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'Last Month', value: 'lastMonth' },
    { label: 'All Time', value: 'allTime' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Sales & Analytics</h2>
          <p className="text-zinc-500 text-sm">Real-time performance metrics from the storefront.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDateFilter(opt.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                dateFilter === opt.value 
                  ? 'bg-[#0077B6] text-white shadow-lg' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mainMetrics.map((metric, idx) => (
          <Card key={idx} className="bg-zinc-900 border-zinc-800 text-zinc-100 overflow-hidden relative">
            <div className={`absolute top-0 left-0 w-1 h-full ${metric.color.replace('text-', 'bg-')}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mt-1">{metric.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Revenue Chart */}
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription className="text-zinc-400">Monthly earnings comparison.</CardDescription>
            </div>
            <PDFDownloadLink 
              document={<MonthlyReportPDF data={salesMetrics} period={dateFilter.toUpperCase()} />} 
              fileName={`CLC_Report_${new Date().toISOString().slice(0, 10)}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline" size="sm" className="border-zinc-700 hover:bg-zinc-800 text-zinc-300" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                  Generate PDF
                </Button>
              )}
            </PDFDownloadLink>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesMetrics?.revenueByMonth || []}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0077B6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0077B6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#71717a" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#71717a" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#0077B6' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#0077B6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Services */}
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
            <CardDescription className="text-zinc-400">Best sellers by revenue.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesMetrics?.topServices.length === 0 ? (
                <p className="text-sm text-zinc-500 py-4 text-center">No sales recorded for this period.</p>
              ) : (
                salesMetrics?.topServices.map((svc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 border border-zinc-800">
                    <div className="min-w-0 flex-1 mr-2">
                      <p className="text-sm font-semibold truncate">{svc.name}</p>
                      <p className="text-[10px] text-zinc-500 uppercase">{svc.count} Sales</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#0077B6]">{formatCurrency(svc.revenue)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        {/* Recent Orders */}
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {salesMetrics?.recentOrders.length === 0 ? (
                <p className="text-sm text-zinc-500 py-4 text-center">No recent orders.</p>
              ) : (
                salesMetrics?.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        order.payments?.[0]?.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {order.customer_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{order.customer_name}</p>
                        <p className="text-[10px] text-zinc-500 uppercase">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatCurrency(order.total_amount)}</p>
                      <p className={`text-[9px] font-bold uppercase ${
                        order.payments?.[0]?.status === 'PAID' ? 'text-emerald-500' : 'text-amber-500'
                      }`}>{order.payments?.[0]?.status || 'PENDING'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}