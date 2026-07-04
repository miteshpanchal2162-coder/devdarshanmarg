"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState, Loader } from "@/components/ui/enterprise";
import { cn } from "@/lib/utils";

type ChartDatum = Record<string, string | number | null | undefined>;

type ChartCardProps = {
  title: string;
  description?: string;
  data?: ChartDatum[];
  xKey?: string;
  yKey?: string;
  nameKey?: string;
  dataKey?: string;
  loading?: boolean;
  error?: React.ReactNode;
  emptyText?: string;
  className?: string;
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
};

const chartColors = [
  "var(--primary)",
  "var(--secondary)",
  "var(--accent)",
  "var(--success)",
  "var(--info)",
  "var(--warning)",
];

function ChartActions({
  onExport,
  onRefresh,
}: {
  onExport?: () => void;
  onRefresh?: () => void;
}) {
  if (!onExport && !onRefresh) return null;

  return (
    <div className="flex items-center gap-2">
      {onRefresh ? (
        <Button aria-label="Refresh chart" onClick={onRefresh} size="sm" type="button" variant="outline">
          <RefreshCw />
          Refresh
        </Button>
      ) : null}
      {onExport ? (
        <Button aria-label="Export chart" onClick={onExport} size="sm" type="button" variant="outline">
          <Download />
          Export
        </Button>
      ) : null}
    </div>
  );
}

export function ChartContainer({
  title,
  description,
  children,
  className,
  error,
  loading,
  empty,
  height = 280,
  onExport,
  onRefresh,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  error?: React.ReactNode;
  loading?: boolean;
  empty?: boolean;
  height?: number;
  onExport?: () => void;
  onRefresh?: () => void;
}) {
  return (
    <Card aria-busy={loading || undefined} className={cn("glass-panel shadow-soft", className)}>
      <CardHeader className="gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        <ChartActions onExport={onExport} onRefresh={onRefresh} />
      </CardHeader>
      <CardContent>
        <div
          aria-label={title}
          className="relative flex min-h-64 items-center justify-center rounded-xl border border-border/70 bg-muted/10 text-sm text-muted-foreground"
          role="img"
          style={{ height }}
        >
          {loading ? <Loader label="Loading chart..." /> : null}
          {!loading && error ? (
            typeof error === "string" ? (
              <ErrorState description={error} title="Unable to load chart" />
            ) : (
              error
            )
          ) : null}
          {!loading && !error && empty ? (
            <EmptyState description="There is no chart data to display." title="No chart data" />
          ) : null}
          {!loading && !error && !empty ? children : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function ChartShell(props: React.ComponentProps<typeof ChartContainer>) {
  return <ChartContainer {...props} />;
}

function chartState(props: ChartCardProps) {
  return {
    empty: !props.data?.length,
    xKey: props.xKey ?? "name",
    yKey: props.yKey ?? props.dataKey ?? "value",
    nameKey: props.nameKey ?? "name",
    dataKey: props.dataKey ?? props.yKey ?? "value",
  };
}

export function LineChartCard(props: ChartCardProps) {
  const { empty, xKey, yKey } = chartState(props);

  return (
    <ChartContainer {...props} empty={empty}>
      <ResponsiveContainer height="100%" width="100%">
        <LineChart data={props.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey={xKey} stroke="currentColor" />
          <YAxis stroke="currentColor" />
          {props.showTooltip !== false ? <Tooltip /> : null}
          {props.showLegend ? <Legend /> : null}
          <Line dataKey={yKey} dot={false} stroke="var(--primary)" strokeWidth={2} type="monotone" />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export function BarChartCard(props: ChartCardProps) {
  const { empty, xKey, yKey } = chartState(props);

  return (
    <ChartContainer {...props} empty={empty}>
      <ResponsiveContainer height="100%" width="100%">
        <BarChart data={props.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey={xKey} stroke="currentColor" />
          <YAxis stroke="currentColor" />
          {props.showTooltip !== false ? <Tooltip /> : null}
          {props.showLegend ? <Legend /> : null}
          <Bar dataKey={yKey} fill="var(--primary)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export function AreaChartCard(props: ChartCardProps) {
  const { empty, xKey, yKey } = chartState(props);

  return (
    <ChartContainer {...props} empty={empty}>
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart data={props.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey={xKey} stroke="currentColor" />
          <YAxis stroke="currentColor" />
          {props.showTooltip !== false ? <Tooltip /> : null}
          {props.showLegend ? <Legend /> : null}
          <Area dataKey={yKey} fill="var(--primary)" fillOpacity={0.18} stroke="var(--primary)" strokeWidth={2} type="monotone" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export function PieChartCard(props: ChartCardProps) {
  const { dataKey, empty, nameKey } = chartState(props);

  return (
    <ChartContainer {...props} empty={empty}>
      <ResponsiveContainer height="100%" width="100%">
        <PieChart>
          {props.showTooltip !== false ? <Tooltip /> : null}
          {props.showLegend ? <Legend /> : null}
          <Pie data={props.data} dataKey={dataKey} nameKey={nameKey} outerRadius="78%">
            {props.data?.map((_, index) => (
              <Cell fill={chartColors[index % chartColors.length]} key={index} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export function KPIGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {children}
    </div>
  );
}

export function KPIItem({
  label,
  value,
  description,
  icon,
  loading,
  trend,
}: {
  label: string;
  value?: string | number;
  description?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  trend?: React.ReactNode;
}) {
  return (
    <Card loading={loading} variant="elevated">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
        {icon ? <div className="text-primary [&_svg]:size-4">{icon}</div> : null}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight">{loading ? "—" : value}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          {trend ? <span className="text-caption text-success">{trend}</span> : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function ChartLegend({
  items,
}: {
  items: Array<{ label: string; colorClass: string }>;
}) {
  return (
    <div className="flex flex-wrap gap-3 text-caption text-muted-foreground">
      {items.map((item) => (
        <span className="inline-flex items-center gap-1.5" key={item.label}>
          <span className={cn("h-2.5 w-2.5 rounded-full", item.colorClass)} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
