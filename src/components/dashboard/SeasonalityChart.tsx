import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const seasonalData = [
  { month: 'Jan', prix: 850, occupation: 65 },
  { month: 'Fév', prix: 780, occupation: 58 },
  { month: 'Mar', prix: 920, occupation: 72 },
  { month: 'Avr', prix: 1100, occupation: 85 },
  { month: 'Mai', prix: 1050, occupation: 78 },
  { month: 'Juin', prix: 950, occupation: 70 },
  { month: 'Juil', prix: 880, occupation: 62 },
  { month: 'Août', prix: 920, occupation: 68 },
  { month: 'Sep', prix: 980, occupation: 75 },
  { month: 'Oct', prix: 1150, occupation: 88 },
  { month: 'Nov', prix: 1080, occupation: 82 },
  { month: 'Déc', prix: 1250, occupation: 92 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border-2 border-border rounded-xl p-4 shadow-xl">
        <p className="font-display font-semibold text-foreground mb-3">{label}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Prix moyen:</span>
            <span className="font-semibold text-foreground">{payload[0]?.value} MAD</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal" />
            <span className="text-sm text-muted-foreground">Occupation:</span>
            <span className="font-semibold text-foreground">{payload[1]?.value}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function SeasonalityChart() {
  return (
    <div className="stat-card h-[420px] animate-slide-up" style={{ animationDelay: '400ms' }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">Tendances Saisonnières</h3>
          <p className="text-sm text-muted-foreground mt-1">Prix moyens et taux d'occupation par mois</p>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="font-medium text-muted-foreground">Prix (MAD)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal" />
            <span className="font-medium text-muted-foreground">Occupation (%)</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={seasonalData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(24 95% 53%)" stopOpacity={0.25}/>
              <stop offset="95%" stopColor="hsl(24 95% 53%)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(173 80% 40%)" stopOpacity={0.25}/>
              <stop offset="95%" stopColor="hsl(173 80% 40%)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="hsl(220 10% 46%)" 
            fontSize={12}
            fontWeight={500}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            yAxisId="prix"
            stroke="hsl(220 10% 46%)" 
            fontSize={12}
            fontWeight={500}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <YAxis 
            yAxisId="occupation"
            orientation="right"
            stroke="hsl(220 10% 46%)" 
            fontSize={12}
            fontWeight={500}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            yAxisId="prix"
            type="monotone"
            dataKey="prix"
            stroke="hsl(24 95% 53%)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#priceGradient)"
          />
          <Area
            yAxisId="occupation"
            type="monotone"
            dataKey="occupation"
            stroke="hsl(173 80% 40%)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#occupancyGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
