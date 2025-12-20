import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface PriceBenchmarkProps {
  propertyType: string;
  minPrice: number;
  medianPrice: number;
  maxPrice: number;
  yourPrice?: number;
  trend: "up" | "down" | "stable";
  delay?: number;
}

export function PriceBenchmark({ 
  propertyType, 
  minPrice, 
  medianPrice, 
  maxPrice, 
  yourPrice,
  trend,
  delay = 0 
}: PriceBenchmarkProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(price) + ' MAD';
  };

  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus;
  const trendConfig = {
    up: { color: "text-success", bg: "bg-success/10", label: "En hausse" },
    down: { color: "text-danger", bg: "bg-danger/10", label: "En baisse" },
    stable: { color: "text-muted-foreground", bg: "bg-muted", label: "Stable" },
  };
  const { color, bg, label } = trendConfig[trend];

  // Calculate position of user's price on the range
  const pricePosition = yourPrice 
    ? ((yourPrice - minPrice) / (maxPrice - minPrice)) * 100 
    : null;

  return (
    <div 
      className="stat-card animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-lg font-semibold text-foreground">{propertyType}</h3>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${bg} ${color}`}>
          <TrendIcon className="h-3.5 w-3.5" />
          {label}
        </div>
      </div>

      {/* Price Range Visualization */}
      <div className="relative mb-8 mt-6">
        <div className="h-2.5 rounded-full bg-gradient-to-r from-success/30 via-warning/30 to-danger/30 relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-success via-warning to-danger opacity-60" />
        </div>
        
        {/* User's Price Marker */}
        {pricePosition !== null && (
          <div 
            className="absolute -top-1.5 w-6 h-6 rounded-full bg-primary border-[3px] border-card shadow-lg transform -translate-x-1/2 transition-all ring-4 ring-primary/20"
            style={{ left: `${Math.min(Math.max(pricePosition, 5), 95)}%` }}
          >
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded-lg font-semibold shadow-lg shadow-primary/20">
                Votre prix
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Price Labels */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 rounded-xl bg-success/5 border border-success/20">
          <p className="text-xs font-medium text-muted-foreground mb-1">Minimum</p>
          <p className="text-lg font-bold text-success">{formatPrice(minPrice)}</p>
          <p className="text-xs text-muted-foreground">/nuit</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-xs font-medium text-muted-foreground mb-1">Médiane</p>
          <p className="text-lg font-bold text-primary">{formatPrice(medianPrice)}</p>
          <p className="text-xs text-muted-foreground">/nuit</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-danger/5 border border-danger/20">
          <p className="text-xs font-medium text-muted-foreground mb-1">Maximum</p>
          <p className="text-lg font-bold text-danger">{formatPrice(maxPrice)}</p>
          <p className="text-xs text-muted-foreground">/nuit</p>
        </div>
      </div>
    </div>
  );
}
