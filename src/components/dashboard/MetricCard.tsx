import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: LucideIcon;
  variant?: "default" | "primary" | "accent";
  delay?: number;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon: Icon,
  variant = "default",
  delay = 0 
}: MetricCardProps) {
  const isPositive = change >= 0;
  
  const variantStyles = {
    default: "from-card to-card/80 border-border/50",
    primary: "from-primary/10 to-primary/5 border-primary/20",
    accent: "from-accent/10 to-accent/5 border-accent/20",
  };

  const iconStyles = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/20 text-primary",
    accent: "bg-accent/20 text-accent",
  };

  return (
    <div 
      className={`stat-card bg-gradient-to-b ${variantStyles[variant]} animate-slide-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 moroccan-pattern opacity-30" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${iconStyles[variant]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
            isPositive 
              ? "bg-emerald/10 text-emerald" 
              : "bg-coral/10 text-coral"
          }`}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isPositive ? "+" : ""}{change}%
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="metric-value text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-2">{changeLabel}</p>
      </div>
    </div>
  );
}
