import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CitySelector } from "@/components/dashboard/CitySelector";
import { PropertyTypeFilter } from "@/components/dashboard/PropertyTypeFilter";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { SeasonalityChart } from "@/components/dashboard/SeasonalityChart";
import { MarketInsights } from "@/components/dashboard/MarketInsights";
import { PriceBenchmark } from "@/components/dashboard/PriceBenchmark";
import { ExportPanel } from "@/components/dashboard/ExportPanel";
import { useLanguage } from "@/contexts/LanguageContext";
import { benchmarksApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { handleError } from "@/lib/monitoring";
import type { Database } from "@/integrations/supabase/types";

type PropertyType = Database['public']['Enums']['property_type'];

export default function Dashboard() {
  const [selectedCity, setSelectedCity] = useState("marrakech");
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>("all");
  const { t } = useLanguage();

  // Fetch benchmarks from API
  const { data: benchmarkData, isLoading: benchmarksLoading } = useQuery({
    queryKey: ['benchmarks', selectedCity, selectedPropertyType],
    queryFn: async () => {
      try {
        const benchmarks = await benchmarksApi.getBenchmarks({
          city: selectedCity,
          propertyType: selectedPropertyType !== "all" ? selectedPropertyType as PropertyType : undefined,
        });
        
        // Transform to component format
        return benchmarks.map(b => ({
          propertyType: b.property_type,
          minPrice: b.min_price || 0,
          medianPrice: b.median_price || 0,
          maxPrice: b.max_price || 0,
          trend: "stable" as const, // Could calculate from historical data
        }));
      } catch (error) {
        handleError(error);
        return [];
      }
    },
    enabled: true,
  });

  return (
    <>
      <Helmet>
        <title>Dashboard - RiadPrix | Revenue Intelligence</title>
        <meta name="description" content="Monitor your rental property performance with real-time analytics and insights." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="container mx-auto px-4 pt-24 pb-12 flex-1">
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
            {benchmarksLoading ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                {t('common.loading')}
              </div>
            ) : benchmarkData && benchmarkData.length > 0 ? (
              benchmarkData.map((data, idx) => (
                <PriceBenchmark key={data.propertyType} {...data} delay={idx * 100} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                {t('common.noData') || 'No benchmark data available'}
              </div>
            )}
          </div>

          <ExportPanel city={selectedCity} propertyType={selectedPropertyType} />
        </main>
        <Footer />
      </div>
    </>
  );
}
