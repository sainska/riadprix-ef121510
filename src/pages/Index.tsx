import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { CitySelector } from "@/components/dashboard/CitySelector";
import { PropertyTypeFilter } from "@/components/dashboard/PropertyTypeFilter";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { PriceBenchmark } from "@/components/dashboard/PriceBenchmark";
import { SeasonalityChart } from "@/components/dashboard/SeasonalityChart";
import { MarketInsights } from "@/components/dashboard/MarketInsights";
import { ExportPanel } from "@/components/dashboard/ExportPanel";
import { Helmet } from "react-helmet";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <HeroSection />
        
        {/* Dashboard Preview Section */}
        <main className="py-16 lg:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Votre Tableau de Bord
                <span className="text-primary"> Intelligence Marché</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Analysez les tendances du marché, comparez vos prix et optimisez vos revenus locatifs en temps réel.
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
              <PropertyTypeFilter 
                selected={selectedPropertyType}
                onSelect={setSelectedPropertyType}
              />
              <CitySelector 
                selectedCity={selectedCity} 
                onCityChange={setSelectedCity} 
              />
            </div>

            {/* Quick Stats */}
            <section className="mb-10">
              <QuickStats city={selectedCity} />
            </section>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
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
            <section className="mb-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Benchmarking des Prix
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Comparaison avec le marché local en MAD
                  </p>
                </div>
                <Button variant="outline" className="gap-2">
                  Voir tout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-teal/5">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Prêt à optimiser vos revenus?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Rejoignez plus de 70,000 propriétaires qui utilisent RiadPrix pour maximiser leurs revenus locatifs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" variant="hero" className="gap-2">
                Démarrer Maintenant
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="xl" variant="outline">
                Demander une Démo
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Essai gratuit 14 jours
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Sans carte bancaire
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12 bg-card">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-orange-light flex items-center justify-center shadow-md shadow-primary/20">
                  <span className="text-lg font-bold text-primary-foreground">R</span>
                </div>
                <div>
                  <span className="font-display font-bold text-foreground">RiadPrix</span>
                  <p className="text-xs text-muted-foreground">Revenue Intelligence</p>
                </div>
              </div>
              <div className="flex items-center gap-8 text-sm">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">Conditions</a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">Confidentialité</a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">Support</a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">Contact</a>
              </div>
              <p className="text-sm text-muted-foreground">
                © 2024 RiadPrix. Tous droits réservés.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
