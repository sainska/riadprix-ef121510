import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const seasonalData = [
  { month: 'Jan', price: 850, occupancy: 65 },
  { month: 'Fév', price: 780, occupancy: 58 },
  { month: 'Mar', price: 920, occupancy: 72 },
  { month: 'Avr', price: 1100, occupancy: 85 },
  { month: 'Mai', price: 1050, occupancy: 78 },
  { month: 'Juin', price: 950, occupancy: 70 },
  { month: 'Juil', price: 880, occupancy: 62 },
  { month: 'Août', price: 920, occupancy: 68 },
  { month: 'Sep', price: 980, occupancy: 75 },
  { month: 'Oct', price: 1150, occupancy: 88 },
  { month: 'Nov', price: 1080, occupancy: 82 },
  { month: 'Déc', price: 1250, occupancy: 92 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="text-primary">Prix moyen:</span>{' '}
            <span className="font-medium">{payload[0]?.value} MAD</span>
          </p>
          <p className="text-sm">
            <span className="text-emerald">Occupation:</span>{' '}
            <span className="font-medium">{payload[1]?.value}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function SeasonalityChart() {
  return (
    <div className="stat-card h-[400px] animate-slide-up" style={{ animationDelay: '400ms' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">Tendances Saisonnières</h3>
          <p className="text-sm text-muted-foreground">Prix moyens et occupation par mois</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Prix (MAD)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald" />
            <span className="text-muted-foreground">Occupation (%)</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={seasonalData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(38 85% 55%)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(38 85% 55%)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(160 70% 45%)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(160 70% 45%)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 15% 20%)" vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="hsl(220 10% 55%)" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            yAxisId="price"
            stroke="hsl(220 10% 55%)" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <YAxis 
            yAxisId="occupancy"
            orientation="right"
            stroke="hsl(220 10% 55%)" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            yAxisId="price"
            type="monotone"
            dataKey="price"
            stroke="hsl(38 85% 55%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#priceGradient)"
          />
          <Area
            yAxisId="occupancy"
            type="monotone"
            dataKey="occupancy"
            stroke="hsl(160 70% 45%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#occupancyGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
