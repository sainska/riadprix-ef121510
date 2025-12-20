import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { CitySelector } from "@/components/dashboard/CitySelector";
import { PropertyTypeFilter } from "@/components/dashboard/PropertyTypeFilter";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { PriceBenchmark } from "@/components/dashboard/PriceBenchmark";
import { SeasonalityChart } from "@/components/dashboard/SeasonalityChart";
import { MarketInsights } from "@/components/dashboard/MarketInsights";
import { ExportPanel } from "@/components/dashboard/ExportPanel";
import { Helmet } from "react-helmet";

const benchmarkData = [
  { type: "Riad Traditionnel", min: 650, median: 1200, max: 3500, your: 1100, trend: "up" as const },
  { type: "Appartement Médina", min: 350, median: 650, max: 1200, your: 580, trend: "stable" as const },
  { type: "Villa avec Piscine", min: 1500, median: 2800, max: 8000, your: 2400, trend: "up" as const },
  { type: "Maison d'Hôtes", min: 450, median: 850, max: 1800, your: 920, trend: "down" as const },
];

const Index = () => {
  const [selectedCity, setSelectedCity] = useState("marrakech");
  const [selectedPropertyType, setSelectedPropertyType] = useState("all");

  return (
    <>
      <Helmet>
        <title>RiadPrix - Intelligence Tarifaire pour Locations Touristiques au Maroc</title>
        <meta name="description" content="Optimisez vos revenus locatifs avec RiadPrix. Benchmarking des prix, analyse de marché et recommandations tarifaires pour riads et locations au Maroc." />
      </Helmet>

      <div className="min-h-screen bg-background moroccan-pattern">
        <Header />
        
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            {/* Hero Section */}
            <div className="mb-8 animate-fade-in">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
                <div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                    Tableau de Bord
                    <span className="text-primary"> Intelligence Marché</span>
                  </h1>
                  <p className="text-muted-foreground max-w-xl">
                    Analysez les tendances du marché, comparez vos prix et optimisez vos revenus locatifs en temps réel.
                  </p>
                </div>
                <CitySelector 
                  selectedCity={selectedCity} 
                  onCityChange={setSelectedCity} 
                />
              </div>

              {/* Property Type Filter */}
              <PropertyTypeFilter 
                selected={selectedPropertyType}
                onSelect={setSelectedPropertyType}
              />
            </div>

            {/* Quick Stats */}
            <section className="mb-8">
              <QuickStats city={selectedCity} />
            </section>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Seasonality Chart - 2 columns */}
              <div className="lg:col-span-2">
                <SeasonalityChart />
              </div>
              
              {/* Market Insights */}
              <div>
                <MarketInsights />
              </div>
            </div>

            {/* Price Benchmarks */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Benchmarking des Prix
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Comparaison avec le marché local
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benchmarkData.map((data, index) => (
                  <PriceBenchmark
                    key={data.type}
                    propertyType={data.type}
                    minPrice={data.min}
                    medianPrice={data.median}
                    maxPrice={data.max}
                    yourPrice={data.your}
                    trend={data.trend}
                    delay={index * 100}
                  />
                ))}
              </div>
            </section>

            {/* Export Panel */}
            <section className="max-w-md">
              <ExportPanel />
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-gold-light flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">R</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  © 2024 RiadPrix. Tous droits réservés.
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">Conditions</a>
                <a href="#" className="hover:text-primary transition-colors">Confidentialité</a>
                <a href="#" className="hover:text-primary transition-colors">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
