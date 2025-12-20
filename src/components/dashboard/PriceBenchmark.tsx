import { ArrowDown, ArrowUp, Minus } from "lucide-react";

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
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus;
  const trendColor = trend === "up" ? "text-emerald" : trend === "down" ? "text-coral" : "text-muted-foreground";

  // Calculate position of user's price on the range
  const pricePosition = yourPrice 
    ? ((yourPrice - minPrice) / (maxPrice - minPrice)) * 100 
    : null;

  return (
    <div 
      className="stat-card animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-foreground">{propertyType}</h3>
        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon className="h-4 w-4" />
          <span className="text-sm font-medium">
            {trend === "up" ? "En hausse" : trend === "down" ? "En baisse" : "Stable"}
          </span>
        </div>
      </div>

      {/* Price Range Visualization */}
      <div className="relative mb-6">
        <div className="h-3 rounded-full bg-gradient-to-r from-emerald/20 via-primary/20 to-coral/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald via-primary to-coral opacity-40" />
        </div>
        
        {/* User's Price Marker */}
        {pricePosition !== null && (
          <div 
            className="absolute -top-1 w-5 h-5 rounded-full bg-primary border-2 border-background shadow-lg transform -translate-x-1/2 transition-all"
            style={{ left: `${Math.min(Math.max(pricePosition, 5), 95)}%` }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-md font-medium">
                Votre prix
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Price Labels */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Minimum</p>
          <p className="text-lg font-semibold text-emerald">{formatPrice(minPrice)}</p>
          <p className="text-xs text-muted-foreground">/nuit</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Médiane</p>
          <p className="text-lg font-semibold text-primary">{formatPrice(medianPrice)}</p>
          <p className="text-xs text-muted-foreground">/nuit</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Maximum</p>
          <p className="text-lg font-semibold text-coral">{formatPrice(maxPrice)}</p>
          <p className="text-xs text-muted-foreground">/nuit</p>
        </div>
      </div>
    </div>
  );
}
