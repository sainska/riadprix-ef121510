import { Building2, Users, Percent, Banknote, TrendingUp, Calendar } from "lucide-react";
import { MetricCard } from "./MetricCard";

interface QuickStatsProps {
  city: string;
}

const cityStats: Record<string, {
  avgPrice: string;
  occupancy: string;
  properties: string;
  revpar: string;
}> = {
  marrakech: {
    avgPrice: "1 250 MAD",
    occupancy: "78%",
    properties: "2 847",
    revpar: "975 MAD",
  },
  fes: {
    avgPrice: "890 MAD",
    occupancy: "72%",
    properties: "1 234",
    revpar: "641 MAD",
  },
  casablanca: {
    avgPrice: "1 450 MAD",
    occupancy: "68%",
    properties: "1 876",
    revpar: "986 MAD",
  },
  tangier: {
    avgPrice: "980 MAD",
    occupancy: "75%",
    properties: "943",
    revpar: "735 MAD",
  },
  essaouira: {
    avgPrice: "1 100 MAD",
    occupancy: "82%",
    properties: "567",
    revpar: "902 MAD",
  },
};

export function QuickStats({ city }: QuickStatsProps) {
  const stats = cityStats[city] || cityStats.marrakech;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <MetricCard
        title="Prix Moyen / Nuit"
        value={stats.avgPrice}
        change={8.5}
        changeLabel="vs mois dernier"
        icon={Banknote}
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
        change={12}
        changeLabel="nouvelles ce mois"
        icon={Building2}
        delay={200}
      />
      <MetricCard
        title="RevPAR Moyen"
        value={stats.revpar}
        change={-2.4}
        changeLabel="vs mois dernier"
        icon={TrendingUp}
        delay={300}
      />
    </div>
  );
}
