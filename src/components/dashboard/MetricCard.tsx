import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: LucideIcon;
  iconColor?: string;
  delay?: number;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon: Icon,
  iconColor = "text-primary",
  delay = 0 
}: MetricCardProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;
  
  const TrendIcon = isPositive ? TrendingUp : isNeutral ? Minus : TrendingDown;
  const trendClass = isPositive 
    ? "bg-success/10 text-success" 
    : isNeutral 
    ? "bg-muted text-muted-foreground" 
    : "bg-danger/10 text-danger";

  return (
    <div 
      className="stat-card animate-slide-up group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-primary/10 ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${trendClass}`}>
          <TrendIcon className="h-3.5 w-3.5" />
          {isPositive ? "+" : ""}{change}%
        </div>
      </div>
      
      <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
      <p className="metric-value text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-2">{changeLabel}</p>
    </div>
  );
}
