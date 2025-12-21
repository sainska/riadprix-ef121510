import { useState } from "react";
import { Helmet } from "react-helmet";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, TrendingUp, TrendingDown, Building2, Users, Star } from "lucide-react";

const marketsData = [
  {
    id: 'marrakech',
    name: 'Marrakech',
    nameFr: 'Marrakech',
    country: 'Morocco',
    avgPrice: 145,
    occupancy: 82,
    listings: 3420,
    trend: 12.5,
    rating: 4.8,
    popular: true,
  },
  {
    id: 'casablanca',
    name: 'Casablanca',
    nameFr: 'Casablanca',
    country: 'Morocco',
    avgPrice: 95,
    occupancy: 68,
    listings: 1850,
    trend: 8.2,
    rating: 4.5,
    popular: true,
  },
  {
    id: 'fes',
    name: 'Fes',
    nameFr: 'Fès',
    country: 'Morocco',
    avgPrice: 85,
    occupancy: 72,
    listings: 980,
    trend: 15.3,
    rating: 4.7,
    popular: false,
  },
  {
    id: 'tangier',
    name: 'Tangier',
    nameFr: 'Tanger',
    country: 'Morocco',
    avgPrice: 78,
    occupancy: 65,
    listings: 720,
    trend: -2.1,
    rating: 4.4,
    popular: false,
  },
  {
    id: 'essaouira',
    name: 'Essaouira',
    nameFr: 'Essaouira',
    country: 'Morocco',
    avgPrice: 92,
    occupancy: 75,
    listings: 540,
    trend: 18.7,
    rating: 4.9,
    popular: true,
  },
  {
    id: 'agadir',
    name: 'Agadir',
    nameFr: 'Agadir',
    country: 'Morocco',
    avgPrice: 68,
    occupancy: 70,
    listings: 890,
    trend: 5.4,
    rating: 4.3,
    popular: false,
  },
];

export default function Markets() {
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const { language } = useLanguage();

  return (
    <>
      <Helmet>
        <title>Markets - RiadPrix | Revenue Intelligence</title>
        <meta name="description" content="Explore vacation rental markets across Morocco with detailed pricing and occupancy data." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 pt-24 pb-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {language === 'fr' ? 'Marchés' : 'Markets'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'fr' ? 'Explorez les marchés de location touristique au Maroc' : 'Explore vacation rental markets across Morocco'}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Marchés Actifs' : 'Active Markets'}</p>
                    <p className="text-2xl font-bold text-foreground">6</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Total Annonces' : 'Total Listings'}</p>
                    <p className="text-2xl font-bold text-foreground">8,400+</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Occupation Moyenne' : 'Avg Occupancy'}</p>
                    <p className="text-2xl font-bold text-foreground">72%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Markets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketsData.map((market) => (
              <Card 
                key={market.id} 
                className={`border-border/50 cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 ${
                  selectedMarket === market.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedMarket(market.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {language === 'fr' ? market.nameFr : market.name}
                        {market.popular && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {language === 'fr' ? 'Populaire' : 'Popular'}
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {market.country}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {market.rating}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{language === 'fr' ? 'Prix Moyen/Nuit' : 'Avg Price/Night'}</p>
                      <p className="text-lg font-semibold text-foreground">€{market.avgPrice}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{language === 'fr' ? 'Occupation' : 'Occupancy'}</p>
                      <p className="text-lg font-semibold text-foreground">{market.occupancy}%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      {market.listings.toLocaleString()} {language === 'fr' ? 'annonces' : 'listings'}
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${market.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {market.trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {market.trend >= 0 ? '+' : ''}{market.trend}%
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-2">
                    {language === 'fr' ? 'Voir les détails' : 'View Details'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
