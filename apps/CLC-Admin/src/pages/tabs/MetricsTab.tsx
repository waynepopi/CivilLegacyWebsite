import React from 'react';
import { useMetrics, DateFilter, RevenuePoint } from '../../hooks/useMetrics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  ShoppingCart, Loader2,
  DollarSign, TrendingUp, Download, Activity, TrendingDown,
  Calendar, CheckCircle, Package
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, TooltipProps, Brush
} from 'recharts';
import { PDFDownloadLink } from '@react-pdf/renderer';
import MonthlyReportPDF from '../../components/PDF/MonthlyReportPDF';

// ── Shared chart theme ────────────────────────────────────────────────────────
const CHART_THEME = {
  stroke: '#0077B6',
  strokeWidth: 2,
  dot: { r: 3, fill: '#0077B6', stroke: '#18181b', strokeWidth: 2 },
  activeDot: { r: 5, fill: '#0077B6', stroke: '#fff', strokeWidth: 2 },
  gradientId: 'revenueGradient',
  grid: '#27272a',
  axis: '#52525b',
  axisText: '#71717a',
};

// ── Custom Tooltip ────────────────────────────────────────────────────────────
function RevenueTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as RevenuePoint;

  if (d.isFuture) return null;

  const fmt = (v: number | null) =>
    (v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4 min-w-[220px] pointer-events-none">
      <div className="flex items-center gap-2 mb-3 border-b border-zinc-800 pb-2">
        <Calendar className="h-4 w-4 text-zinc-500" />
        <p className="text-xs font-bold text-zinc-100 uppercase tracking-widest">{d.label}</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#0077B6]" />
            <span className="text-xs text-zinc-400">Revenue</span>
          </div>
          <span className="text-sm font-bold text-white">${fmt(d.revenue)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-zinc-500" />
            <span className="text-xs text-zinc-400">Orders</span>
          </div>
          <span className="text-sm font-bold text-zinc-300">{d.orders || 0}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-zinc-400">Successful</span>
          </div>
          <span className="text-sm font-bold text-emerald-400">{d.successfulCheckouts || 0}</span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-zinc-800 mt-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-xs text-zinc-400">Avg Value</span>
          </div>
          <span className="text-sm font-bold text-amber-400">${fmt(d.averageOrderValue)}</span>
        </div>
      </div>
    </div>
  );
}

// ── The chart ───────────────────────────────────────────────────────────────
function RevenueChart({ data, showBrush }: { data: RevenuePoint[]; showBrush: boolean }) {
  if (data.length === 0) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-zinc-600">
        <TrendingDown className="h-10 w-10 mb-3 opacity-20" />
        <p className="text-sm">No revenue data for this period.</p>
      </div>
    );
  }

  // Filter out future points for the actual line drawing if desired,
  // or use connectNulls={false}. The user wants future buckets "hidden".
  // Recharts Area handles nulls by not drawing them.

  return (
    <div className="h-[350px] w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={CHART_THEME.gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={CHART_THEME.stroke} stopOpacity={0.25} />
              <stop offset="95%" stopColor={CHART_THEME.stroke} stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} vertical={false} />
          <XAxis
            dataKey="label"
            stroke={CHART_THEME.axis}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tick={{ fill: CHART_THEME.axisText }}
            minTickGap={30}
          />
          <YAxis
            stroke={CHART_THEME.axis}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tick={{ fill: CHART_THEME.axisText }}
            tickFormatter={v => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
            width={60}
          />
          <Tooltip
            content={<RevenueTooltip />}
            cursor={{ stroke: CHART_THEME.stroke, strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={CHART_THEME.stroke}
            strokeWidth={CHART_THEME.strokeWidth}
            fillOpacity={1}
            fill={`url(#${CHART_THEME.gradientId})`}
            dot={CHART_THEME.dot}
            activeDot={CHART_THEME.activeDot}
            connectNulls={false}
            isAnimationActive={true}
          />
          {showBrush && (
            <Brush
              dataKey="label"
              height={30}
              stroke={CHART_THEME.stroke}
              fill="#18181b"
              travellerWidth={10}
              gap={1}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MetricsTab() {
  const { salesMetrics, loading, dateFilter, setDateFilter } = useMetrics();

  if (loading && !salesMetrics) {
    return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 text-[#0077B6] animate-spin" /></div>;
  }

  const fmt = (v: number) =>
    `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const chartData = salesMetrics?.chartData || [];
  const showBrush = dateFilter === 'allTime' && chartData.length > 12;

  const granularityLabel =
    dateFilter === 'today'   ? 'Hourly Breakdown (24h)'     :
    dateFilter === 'week'    ? 'Daily Breakdown (7 days)'   :
    dateFilter === 'month'   ? 'Daily Breakdown (This Month)' :
    dateFilter === 'lastMonth'? 'Daily Breakdown (Last Month)' :
    'Timeline Overview (All Time)';

  const kpis = [
    { title: 'Total Revenue',    value: fmt(salesMetrics?.totalRevenue || 0), sub: `${salesMetrics?.paidOrders ?? 0} paid orders`, icon: DollarSign, color: 'text-emerald-500' },
    { title: 'Avg Order Value',  value: fmt(salesMetrics?.avgOrderValue || 0), sub: 'Per successful checkout',                    icon: TrendingUp, color: 'text-blue-500'   },
    { title: 'Storefront Orders',value: String(salesMetrics?.orderCount ?? 0), sub: 'Total transactions',                          icon: ShoppingCart, color: 'text-[#0077B6]' },
    {
      title: 'Success Rate',
      value: salesMetrics?.orderCount ? `${Math.round((salesMetrics.paidOrders / salesMetrics.orderCount) * 100)}%` : '0%',
      sub: 'Paid vs Total', icon: Activity, color: 'text-amber-500',
    },
  ];

  const filterOptions: { label: string; value: DateFilter }[] = [
    { label: 'Today',      value: 'today'     },
    { label: 'This Week',  value: 'week'      },
    { label: 'This Month', value: 'month'     },
    { label: 'Last Month', value: 'lastMonth' },
    { label: 'All Time',   value: 'allTime'   },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="h-6 w-6 text-[#0077B6]" />
            Store Analytics
          </h2>
          <p className="text-zinc-500 text-sm">Comprehensive performance metrics and sales breakdown.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800 flex-wrap shadow-inner">
          {filterOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setDateFilter(opt.value)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                dateFilter === opt.value
                  ? 'bg-[#0077B6] text-white shadow-lg'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k, i) => (
          <Card key={i} className="bg-zinc-900 border-zinc-800 text-zinc-100 overflow-hidden relative group hover:border-[#0077B6]/30 transition-colors">
            <div className={`absolute top-0 left-0 w-1 h-full ${k.color.replace('text-', 'bg-')} opacity-50 group-hover:opacity-100 transition-opacity`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{k.title}</CardTitle>
              <k.icon className={`h-4 w-4 ${k.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{k.value}</div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-1.5 flex items-center gap-1">
                {k.sub}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">

        {/* Revenue chart */}
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 md:col-span-2 overflow-hidden shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800/50 pb-4">
            <div>
              <CardTitle className="text-lg">Revenue Breakdown</CardTitle>
              <CardDescription className="text-zinc-500 text-xs mt-1">
                {granularityLabel} — Continuous timeline context
              </CardDescription>
            </div>
            <PDFDownloadLink
              document={<MonthlyReportPDF data={salesMetrics} period={dateFilter.toUpperCase()} />}
              fileName={`CLC_Report_${new Date().toISOString().slice(0, 10)}.pdf`}
            >
              {({ loading: pdfLoading }) => (
                <Button variant="outline" size="sm" className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300 transition-colors" disabled={pdfLoading}>
                  {pdfLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                  Export PDF
                </Button>
              )}
            </PDFDownloadLink>
          </CardHeader>
          <CardContent className="p-6">
            <RevenueChart data={chartData} showBrush={showBrush} />
          </CardContent>
        </Card>

        {/* Top services */}
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 shadow-xl flex flex-col">
          <CardHeader className="border-b border-zinc-800/50 pb-4">
            <CardTitle className="text-lg">Top Services</CardTitle>
            <CardDescription className="text-zinc-400">Performing assets by total revenue.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex-1">
            <div className="space-y-3">
              {!salesMetrics?.topServices.length ? (
                <div className="flex flex-col items-center justify-center py-12 opacity-30">
                  <Package className="h-10 w-10 mb-2" />
                  <p className="text-sm">No sales data</p>
                </div>
              ) : (
                salesMetrics.topServices.map((svc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/40 border border-zinc-800/50 hover:border-[#0077B6]/30 hover:bg-zinc-800/60 transition-all group">
                    <div className="min-w-0 flex-1 mr-2">
                      <p className="text-sm font-bold truncate text-zinc-100 group-hover:text-white">{svc.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{svc.count} Sales</p>
                      </div>
                    </div>
                    <p className="text-sm font-black text-[#0077B6] shrink-0 tracking-tight">{fmt(svc.revenue)}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent transactions */}
      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 shadow-2xl">
        <CardHeader className="pb-4 border-b border-zinc-800/50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-zinc-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-800/50">
            {!salesMetrics?.recentOrders.length ? (
              <p className="text-sm text-zinc-600 py-12 text-center italic">No recent transaction history.</p>
            ) : (
              salesMetrics.recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-800/20 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-xs font-black shadow-inner transition-transform group-hover:scale-110 ${
                      order.payments?.[0]?.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {order.customer_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-100">{order.customer_name}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                        {new Date(order.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black tracking-tight text-white">{fmt(order.total_amount)}</p>
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${order.payments?.[0]?.status === 'PAID' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                      <p className={`text-[9px] font-black uppercase tracking-tighter ${
                        order.payments?.[0]?.status === 'PAID' ? 'text-emerald-500' : 'text-amber-500'
                      }`}>{order.payments?.[0]?.status || 'PENDING'}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}