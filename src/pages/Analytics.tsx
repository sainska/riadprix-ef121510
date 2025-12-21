import { useState } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CitySelector } from "@/components/dashboard/CitySelector";
import { PropertyTypeFilter } from "@/components/dashboard/PropertyTypeFilter";
import { SeasonalityChart } from "@/components/dashboard/SeasonalityChart";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, TrendingDown, DollarSign, Percent, Calendar, BarChart3 } from "lucide-react";

export default function Analytics() {
  const [selectedCity, setSelectedCity] = useState("marrakech");
  const [selectedPropertyType, setSelectedPropertyType] = useState("all");
  const { language } = useLanguage();

  const analyticsData = [
    { label: language === 'fr' ? 'Revenus Totaux' : 'Total Revenue', value: '€45,230', change: '+12.5%', positive: true, icon: DollarSign },
    { label: language === 'fr' ? 'Taux d\'Occupation' : 'Occupancy Rate', value: '78%', change: '+5.2%', positive: true, icon: Percent },
    { label: language === 'fr' ? 'Prix Moyen/Nuit' : 'Avg Price/Night', value: '€185', change: '+8.1%', positive: true, icon: TrendingUp },
    { label: language === 'fr' ? 'Réservations' : 'Bookings', value: '156', change: '-2.3%', positive: false, icon: Calendar },
  ];

  return (
    <>
      <Helmet>
        <title>Analytics - RiadPrix | Revenue Intelligence</title>
        <meta name="description" content="Deep dive into your rental property analytics with detailed performance metrics." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 pt-24 pb-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {language === 'fr' ? 'Analytiques' : 'Analytics'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'fr' ? 'Analysez vos performances en détail' : 'Analyze your performance in detail'}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <CitySelector selectedCity={selectedCity} onCityChange={setSelectedCity} />
            <PropertyTypeFilter selected={selectedPropertyType} onSelect={setSelectedPropertyType} />
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {analyticsData.map((item) => (
              <Card key={item.label} className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{item.value}</p>
                      <div className={`flex items-center gap-1 mt-2 text-sm ${item.positive ? 'text-green-500' : 'text-red-500'}`}>
                        {item.positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {item.change}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs for different analytics views */}
          <Tabs defaultValue="revenue" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="revenue">
                {language === 'fr' ? 'Revenus' : 'Revenue'}
              </TabsTrigger>
              <TabsTrigger value="occupancy">
                {language === 'fr' ? 'Occupation' : 'Occupancy'}
              </TabsTrigger>
              <TabsTrigger value="pricing">
                {language === 'fr' ? 'Tarifs' : 'Pricing'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="revenue">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    {language === 'fr' ? 'Évolution des Revenus' : 'Revenue Trends'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'fr' ? 'Vos revenus sur les 12 derniers mois' : 'Your revenue over the last 12 months'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SeasonalityChart />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="occupancy">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    {language === 'fr' ? 'Taux d\'Occupation' : 'Occupancy Rates'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'fr' ? 'Analysez votre taux d\'occupation mensuel' : 'Analyze your monthly occupancy rates'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SeasonalityChart />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    {language === 'fr' ? 'Analyse des Tarifs' : 'Pricing Analysis'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'fr' ? 'Comparez vos tarifs avec le marché' : 'Compare your rates with the market'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SeasonalityChart />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
