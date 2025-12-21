import { useState } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/Header";
import { CitySelector } from "@/components/dashboard/CitySelector";
import { PropertyTypeFilter } from "@/components/dashboard/PropertyTypeFilter";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { SeasonalityChart } from "@/components/dashboard/SeasonalityChart";
import { MarketInsights } from "@/components/dashboard/MarketInsights";
import { PriceBenchmark } from "@/components/dashboard/PriceBenchmark";
import { ExportPanel } from "@/components/dashboard/ExportPanel";
import { useLanguage } from "@/contexts/LanguageContext";

const benchmarkData = [
  { propertyType: "Riad", minPrice: 800, medianPrice: 1400, maxPrice: 2500, trend: "up" as const },
  { propertyType: "Apartment", minPrice: 400, medianPrice: 700, maxPrice: 1200, trend: "up" as const },
  { propertyType: "Villa", minPrice: 1500, medianPrice: 2800, maxPrice: 5000, trend: "stable" as const },
];

export default function Dashboard() {
  const [selectedCity, setSelectedCity] = useState("marrakech");
  const [selectedPropertyType, setSelectedPropertyType] = useState("all");
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>Dashboard - RiadPrix | Revenue Intelligence</title>
        <meta name="description" content="Monitor your rental property performance with real-time analytics and insights." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <CitySelector selectedCity={selectedCity} onCityChange={setSelectedCity} />
            <PropertyTypeFilter selected={selectedPropertyType} onSelect={setSelectedPropertyType} />
          </div>

          <div className="mb-8">
            <QuickStats city={selectedCity} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SeasonalityChart />
            <MarketInsights />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {benchmarkData.map((data, idx) => (
              <PriceBenchmark key={data.propertyType} {...data} delay={idx * 100} />
            ))}
          </div>

          <ExportPanel />
        </main>
      </div>
    </>
  );
}
