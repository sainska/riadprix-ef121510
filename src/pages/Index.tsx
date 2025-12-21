import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
import { useLanguage } from "@/contexts/LanguageContext";

const benchmarkData = [
  { type: "Riad Traditionnel", min: 650, median: 1200, max: 3500, your: 1100, trend: "up" as const },
  { type: "Appartement Médina", min: 350, median: 650, max: 1200, your: 580, trend: "stable" as const },
  { type: "Villa avec Piscine", min: 1500, median: 2800, max: 8000, your: 2400, trend: "up" as const },
  { type: "Maison d'Hôtes", min: 450, median: 850, max: 1800, your: 920, trend: "down" as const },
];

const Index = () => {
  const { t } = useLanguage();
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
        
        {/* Features Section */}
        <section id="features" className="py-20 bg-background scroll-mt-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('index.features.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('index.features.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { icon: '📊', title: t('index.features.benchmarking'), desc: t('index.features.benchmarkingDesc') },
                { icon: '📈', title: t('index.features.trends'), desc: t('index.features.trendsDesc') },
                { icon: '💡', title: t('index.features.recommendations'), desc: t('index.features.recommendationsDesc') },
              ].map((feature, idx) => (
                <div key={idx} className="text-center p-6 rounded-xl border border-border/50 bg-card">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-secondary/30 scroll-mt-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('index.howitworks.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('index.howitworks.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { step: '1', title: t('index.howitworks.step1'), desc: t('index.howitworks.step1Desc') },
                { step: '2', title: t('index.howitworks.step2'), desc: t('index.howitworks.step2Desc') },
                { step: '3', title: t('index.howitworks.step3'), desc: t('index.howitworks.step3Desc') },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">{item.step}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Dashboard Preview Section */}
        <main className="py-16 lg:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('index.dashboard.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('index.dashboard.subtitle')}
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
              {t('index.cta.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              {t('index.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" variant="hero" className="gap-2">
                {t('index.cta.startNow')}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="xl" variant="outline">
                {t('index.cta.requestDemo')}
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                {t('index.cta.freeTrial')}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                {t('index.cta.noCard')}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Index;
