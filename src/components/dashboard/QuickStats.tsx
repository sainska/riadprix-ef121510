import { Building2, Users, Percent, Banknote } from "lucide-react";
import { MetricCard } from "./MetricCard";

interface QuickStatsProps {
  city: string;
}

const cityStats: Record<string, {
  avgPrice: string;
  occupancy: string;
  properties: string;
  revenue: string;
}> = {
  marrakech: {
    avgPrice: "1,250 MAD",
    occupancy: "78%",
    properties: "2,847",
    revenue: "45,600 MAD",
  },
  fes: {
    avgPrice: "890 MAD",
    occupancy: "72%",
    properties: "1,234",
    revenue: "32,100 MAD",
  },
  casablanca: {
    avgPrice: "1,450 MAD",
    occupancy: "68%",
    properties: "1,876",
    revenue: "52,300 MAD",
  },
  tangier: {
    avgPrice: "980 MAD",
    occupancy: "75%",
    properties: "943",
    revenue: "38,200 MAD",
  },
  essaouira: {
    avgPrice: "1,100 MAD",
    occupancy: "82%",
    properties: "567",
    revenue: "41,800 MAD",
  },
};

export function QuickStats({ city }: QuickStatsProps) {
  const stats = cityStats[city] || cityStats.marrakech;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Prix Moyen / Nuit"
        value={stats.avgPrice}
        change={8.5}
        changeLabel="vs mois dernier"
        icon={Banknote}
        variant="primary"
        delay={0}
      />
      <MetricCard
        title="Taux d'Occupation"
        value={stats.occupancy}
        change={3.2}
        changeLabel="vs mois dernier"
        icon={Percent}
        delay={100}
      />
      <MetricCard
        title="Propriétés Actives"
        value={stats.properties}
        change={12.1}
        changeLabel="nouvelles ce mois"
        icon={Building2}
        delay={200}
      />
      <MetricCard
        title="RevPAR Estimé"
        value={stats.revenue}
        change={-2.4}
        changeLabel="vs mois dernier"
        icon={Users}
        variant="accent"
        delay={300}
      />
    </div>
  );
}
