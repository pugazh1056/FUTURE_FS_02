import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getDashboardStats } from "@/lib/leads.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Sparkles, PhoneCall, CheckCircle2 } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  PieChart,
  Pie,
} from "recharts";

const statsQuery = queryOptions({
  queryKey: ["dashboard-stats"],
  queryFn: () => getDashboardStats(),
});

export const Route = createFileRoute("/_authenticated/dashboard")({
  loader: ({ context }) => context.queryClient.ensureQueryData(statsQuery),
  component: Dashboard,
});

function Dashboard() {
  const { data } = useSuspenseQuery(statsQuery);
  const cards = [
    { label: "Total Leads", value: data.total, icon: Users, accent: "text-foreground" },
    { label: "New", value: data.new, icon: Sparkles, accent: "text-blue-600" },
    { label: "Contacted", value: data.contacted, icon: PhoneCall, accent: "text-amber-600" },
    { label: "Converted", value: data.converted, icon: CheckCircle2, accent: "text-emerald-600" },
  ];
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your pipeline.</p>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {c.label}
              </CardTitle>
              <c.icon className={`size-4 ${c.accent}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold tracking-tight">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Leads by status</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((d) => (
                    <Cell key={d.key} fill={`var(--color-${d.key})`} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
                <Pie data={chartData} dataKey="value" nameKey="label" innerRadius={50} outerRadius={90} strokeWidth={2}>
                  {chartData.map((d) => (
                    <Cell key={d.key} fill={`var(--color-${d.key})`} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  function _unused() {}
}

const chartConfig = {
  value: { label: "Leads" },
  new: { label: "New", color: "hsl(217 91% 60%)" },
  contacted: { label: "Contacted", color: "hsl(38 92% 50%)" },
  converted: { label: "Converted", color: "hsl(142 71% 45%)" },
} satisfies ChartConfig;

