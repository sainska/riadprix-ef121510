import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, FileSpreadsheet, Download, Calendar, Building, CheckCircle, Loader2 } from 'lucide-react';
import { exportToCSV, exportToPDF, ExportData, ReportConfig } from '@/lib/export';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type ReportType = 'market' | 'property' | 'recommendations' | 'analytics';

interface MarketData {
  id: string;
  name: string;
  name_fr: string | null;
  country: string;
}

interface BenchmarkData {
  id: string;
  market_id: string;
  property_type: string;
  median_price: number | null;
  avg_occupancy: number | null;
  period_start: string;
  period_end: string;
  min_price: number | null;
  max_price: number | null;
  total_listings: number | null;
}

interface PropertyData {
  id: string;
  name: string;
  property_type: string;
  bedrooms: number | null;
  current_price: number | null;
  is_active: boolean | null;
  market_id: string | null;
}

interface RecommendationData {
  id: string;
  property_id: string;
  recommended_price: number;
  confidence_score: number | null;
  reasoning: string | null;
  valid_from: string;
  valid_to: string;
  is_applied: boolean | null;
}

export default function ReportExport() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState<ReportType>('market');
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastExportId, setLastExportId] = useState<string | null>(null);
  
  // Real data states
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [benchmarks, setBenchmarks] = useState<BenchmarkData[]>([]);
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationData[]>([]);

  const reportTypes = {
    market: {
      title: language === 'fr' ? 'Données du Marché' : 'Market Data',
      description: language === 'fr' 
        ? 'Prix moyens, taux d\'occupation et tendances par marché'
        : 'Average prices, occupancy rates and trends by market',
    },
    property: {
      title: language === 'fr' ? 'Rapport de Propriétés' : 'Property Report',
      description: language === 'fr'
        ? 'Inventaire complet de vos propriétés avec statistiques'
        : 'Complete inventory of your properties with statistics',
    },
    recommendations: {
      title: language === 'fr' ? 'Recommandations de Prix' : 'Price Recommendations',
      description: language === 'fr'
        ? 'Suggestions de prix optimisés avec analyse'
        : 'Optimized price suggestions with analysis',
    },
    analytics: {
      title: language === 'fr' ? 'Analyse de Performance' : 'Performance Analytics',
      description: language === 'fr'
        ? 'Métriques de performance et comparaisons'
        : 'Performance metrics and comparisons',
    },
  };

  // Fetch real data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch markets
        const { data: marketsData, error: marketsError } = await supabase
          .from('markets')
          .select('id, name, name_fr, country')
          .eq('is_active', true)
          .order('name');
        
        if (marketsError) throw marketsError;
        setMarkets(marketsData || []);

        // Fetch benchmarks
        const { data: benchmarksData, error: benchmarksError } = await supabase
          .from('benchmarks')
          .select('*')
          .order('period_start', { ascending: false })
          .limit(50);
        
        if (benchmarksError) throw benchmarksError;
        setBenchmarks(benchmarksData || []);

        // Fetch user properties if logged in
        if (user) {
          const { data: propertiesData, error: propertiesError } = await supabase
            .from('properties')
            .select('id, name, property_type, bedrooms, current_price, is_active, market_id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          if (propertiesError) throw propertiesError;
          setProperties(propertiesData || []);

          // Fetch recommendations for user's properties
          if (propertiesData && propertiesData.length > 0) {
            const propertyIds = propertiesData.map(p => p.id);
            const { data: recsData, error: recsError } = await supabase
              .from('recommendations')
              .select('*')
              .in('property_id', propertyIds)
              .order('created_at', { ascending: false });
            
            if (recsError) throw recsError;
            setRecommendations(recsData || []);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(language === 'fr' ? 'Erreur lors du chargement des données' : 'Error loading data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, language]);

  // Get market name by ID
  const getMarketName = (marketId: string | null): string => {
    if (!marketId) return language === 'fr' ? 'Non spécifié' : 'Not specified';
    const market = markets.find(m => m.id === marketId);
    if (!market) return language === 'fr' ? 'Inconnu' : 'Unknown';
    return language === 'fr' && market.name_fr ? market.name_fr : market.name;
  };

  // Format property type
  const formatPropertyType = (type: string): string => {
    const types: Record<string, { en: string; fr: string }> = {
      riad: { en: 'Riad', fr: 'Riad' },
      apartment: { en: 'Apartment', fr: 'Appartement' },
      villa: { en: 'Villa', fr: 'Villa' },
      hotel: { en: 'Hotel', fr: 'Hôtel' },
      guesthouse: { en: 'Guesthouse', fr: 'Maison d\'hôtes' },
      other: { en: 'Other', fr: 'Autre' },
    };
    return types[type]?.[language] || type;
  };

  // Generate report data based on report type using REAL data
  const generateReportData = (type: ReportType): ExportData => {
    switch (type) {
      case 'market': {
        const headers = language === 'fr' 
          ? ['Marché', 'Type de Propriété', 'Prix Médian (MAD)', 'Taux d\'Occupation (%)', 'Prix Min (MAD)', 'Prix Max (MAD)', 'Nombre de Listings', 'Période']
          : ['Market', 'Property Type', 'Median Price (MAD)', 'Occupancy Rate (%)', 'Min Price (MAD)', 'Max Price (MAD)', 'Total Listings', 'Period'];
        
        if (benchmarks.length === 0) {
          return { headers, rows: [] };
        }

        const rows = benchmarks.map(b => [
          getMarketName(b.market_id),
          formatPropertyType(b.property_type),
          b.median_price ? `${Number(b.median_price).toLocaleString()}` : '-',
          b.avg_occupancy ? `${Number(b.avg_occupancy).toFixed(1)}%` : '-',
          b.min_price ? `${Number(b.min_price).toLocaleString()}` : '-',
          b.max_price ? `${Number(b.max_price).toLocaleString()}` : '-',
          b.total_listings || 0,
          `${b.period_start} → ${b.period_end}`,
        ]);

        return { headers, rows };
      }
      
      case 'property': {
        const headers = language === 'fr'
          ? ['Nom', 'Type', 'Emplacement', 'Chambres', 'Prix Actuel (MAD)', 'Statut']
          : ['Name', 'Type', 'Location', 'Bedrooms', 'Current Price (MAD)', 'Status'];
        
        if (properties.length === 0) {
          return { headers, rows: [] };
        }

        const rows = properties.map(p => [
          p.name,
          formatPropertyType(p.property_type),
          getMarketName(p.market_id),
          p.bedrooms || '-',
          p.current_price ? `${Number(p.current_price).toLocaleString()}` : '-',
          p.is_active 
            ? (language === 'fr' ? 'Actif' : 'Active') 
            : (language === 'fr' ? 'Inactif' : 'Inactive'),
        ]);

        return { headers, rows };
      }
      
      case 'recommendations': {
        const headers = language === 'fr'
          ? ['Propriété', 'Prix Recommandé (MAD)', 'Confiance (%)', 'Raison', 'Valide Du', 'Valide Jusqu\'au', 'Appliqué']
          : ['Property', 'Recommended Price (MAD)', 'Confidence (%)', 'Reason', 'Valid From', 'Valid Until', 'Applied'];
        
        if (recommendations.length === 0) {
          return { headers, rows: [] };
        }

        const rows = recommendations.map(r => {
          const property = properties.find(p => p.id === r.property_id);
          return [
            property?.name || (language === 'fr' ? 'Inconnu' : 'Unknown'),
            `${Number(r.recommended_price).toLocaleString()}`,
            r.confidence_score ? `${(Number(r.confidence_score) * 100).toFixed(0)}%` : '-',
            r.reasoning || '-',
            r.valid_from,
            r.valid_to,
            r.is_applied 
              ? (language === 'fr' ? 'Oui' : 'Yes') 
              : (language === 'fr' ? 'Non' : 'No'),
          ];
        });

        return { headers, rows };
      }
      
      case 'analytics': {
        const headers = language === 'fr'
          ? ['Métrique', 'Valeur', 'Détails']
          : ['Metric', 'Value', 'Details'];
        
        // Calculate analytics from real data
        const totalProperties = properties.length;
        const activeProperties = properties.filter(p => p.is_active).length;
        const avgPrice = properties.length > 0 
          ? properties.reduce((sum, p) => sum + (Number(p.current_price) || 0), 0) / properties.filter(p => p.current_price).length
          : 0;
        const totalRecommendations = recommendations.length;
        const appliedRecommendations = recommendations.filter(r => r.is_applied).length;
        const avgConfidence = recommendations.length > 0
          ? recommendations.reduce((sum, r) => sum + (Number(r.confidence_score) || 0), 0) / recommendations.length * 100
          : 0;
        
        // Get occupancy from benchmarks
        const avgOccupancy = benchmarks.length > 0
          ? benchmarks.reduce((sum, b) => sum + (Number(b.avg_occupancy) || 0), 0) / benchmarks.filter(b => b.avg_occupancy).length
          : 0;

        const rows = [
          [
            language === 'fr' ? 'Total Propriétés' : 'Total Properties',
            totalProperties.toString(),
            `${activeProperties} ${language === 'fr' ? 'actives' : 'active'}, ${totalProperties - activeProperties} ${language === 'fr' ? 'inactives' : 'inactive'}`,
          ],
          [
            language === 'fr' ? 'Prix Moyen' : 'Average Price',
            avgPrice > 0 ? `${avgPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} MAD` : '-',
            language === 'fr' ? 'Prix moyen de vos propriétés' : 'Average price of your properties',
          ],
          [
            language === 'fr' ? 'Taux d\'Occupation Moyen' : 'Average Occupancy Rate',
            avgOccupancy > 0 ? `${avgOccupancy.toFixed(1)}%` : '-',
            language === 'fr' ? 'Basé sur les données du marché' : 'Based on market data',
          ],
          [
            language === 'fr' ? 'Recommandations Totales' : 'Total Recommendations',
            totalRecommendations.toString(),
            `${appliedRecommendations} ${language === 'fr' ? 'appliquées' : 'applied'}`,
          ],
          [
            language === 'fr' ? 'Confiance Moyenne des Recommandations' : 'Avg Recommendation Confidence',
            avgConfidence > 0 ? `${avgConfidence.toFixed(0)}%` : '-',
            language === 'fr' ? 'Score de confiance moyen' : 'Average confidence score',
          ],
          [
            language === 'fr' ? 'Marchés Couverts' : 'Markets Covered',
            markets.length.toString(),
            markets.slice(0, 3).map(m => language === 'fr' && m.name_fr ? m.name_fr : m.name).join(', ') + (markets.length > 3 ? '...' : ''),
          ],
        ];

        return { headers, rows };
      }
      
      default:
        return { headers: [], rows: [] };
    }
  };

  const getReportConfig = (): ReportConfig => {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    return {
      title: reportTypes[selectedReport].title,
      subtitle: reportTypes[selectedReport].description,
      generatedBy: user?.email || 'RiadPrix User',
      dateRange: {
        start: lastMonth.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0],
      },
      filters: {
        [language === 'fr' ? 'Type de Rapport' : 'Report Type']: reportTypes[selectedReport].title,
        [language === 'fr' ? 'Langue' : 'Language']: language === 'fr' ? 'Français' : 'English',
        [language === 'fr' ? 'Source' : 'Source']: language === 'fr' ? 'Données en direct' : 'Live database',
      },
      language,
    };
  };

  const handleCSVExport = async () => {
    setIsExporting(true);
    try {
      const data = generateReportData(selectedReport);
      
      if (data.rows.length === 0) {
        toast.warning(
          language === 'fr' ? 'Aucune donnée à exporter' : 'No data to export',
          { description: language === 'fr' ? 'Veuillez d\'abord ajouter des données' : 'Please add some data first' }
        );
        return;
      }

      const config = getReportConfig();
      const filename = `riadprix-${selectedReport}-report-${new Date().toISOString().split('T')[0]}.csv`;
      
      const reportId = exportToCSV(data, filename, config);
      setLastExportId(reportId);
      
      toast.success(
        language === 'fr' ? 'Rapport CSV généré avec succès!' : 'CSV report generated successfully!',
        { description: `ID: ${reportId}` }
      );
    } catch (error) {
      toast.error(language === 'fr' ? 'Erreur lors de l\'export' : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePDFExport = async () => {
    setIsExporting(true);
    try {
      const data = generateReportData(selectedReport);
      
      if (data.rows.length === 0) {
        toast.warning(
          language === 'fr' ? 'Aucune donnée à exporter' : 'No data to export',
          { description: language === 'fr' ? 'Veuillez d\'abord ajouter des données' : 'Please add some data first' }
        );
        return;
      }

      const config = getReportConfig();
      
      const reportId = await exportToPDF({
        title: reportTypes[selectedReport].title,
        content: data,
        config,
      });
      setLastExportId(reportId);
      
      toast.success(
        language === 'fr' ? 'Rapport PDF généré avec succès!' : 'PDF report generated successfully!',
        { description: `ID: ${reportId}` }
      );
    } catch (error) {
      toast.error(language === 'fr' ? 'Erreur lors de l\'export' : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const currentData = generateReportData(selectedReport);

  return (
    <>
      <Helmet>
        <title>{language === 'fr' ? 'Exporter les Rapports' : 'Export Reports'} - RiadPrix</title>
        <meta name="description" content="Export your market, property, or analytics reports as professional CSV or PDF documents." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12 max-w-5xl flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {language === 'fr' ? 'Exporter les Rapports' : 'Export Reports'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'fr' 
                ? 'Générez des rapports professionnels avec données en temps réel'
                : 'Generate professional reports with real-time data'}
            </p>
          </div>

          {/* Report Type Selection */}
          <Card className="mb-6 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                {language === 'fr' ? 'Type de Rapport' : 'Report Type'}
              </CardTitle>
              <CardDescription>
                {language === 'fr' 
                  ? 'Sélectionnez le type de données à exporter'
                  : 'Select the type of data to export'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(Object.entries(reportTypes) as [ReportType, typeof reportTypes.market][]).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedReport(key)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedReport === key
                        ? 'border-primary bg-primary/5'
                        : 'border-border/50 hover:border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-sm">{value.title}</span>
                      {selectedReport === key && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{value.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-green-600" />
                  {language === 'fr' ? 'Export CSV' : 'CSV Export'}
                </CardTitle>
                <CardDescription>
                  {language === 'fr' 
                    ? 'Fichier tableur avec métadonnées et pied de page'
                    : 'Spreadsheet file with metadata and footer'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {language === 'fr' ? 'Données en temps réel' : 'Real-time data'}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {language === 'fr' ? 'ID unique de rapport' : 'Unique report ID'}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {language === 'fr' ? 'Compatible Excel/Google Sheets' : 'Excel/Google Sheets compatible'}
                  </li>
                </ul>
                <Button 
                  className="w-full gap-2" 
                  variant="default"
                  onClick={handleCSVExport}
                  disabled={isExporting || isLoading}
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {isExporting 
                    ? (language === 'fr' ? 'Génération...' : 'Generating...') 
                    : (language === 'fr' ? 'Télécharger CSV' : 'Download CSV')}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-600" />
                  {language === 'fr' ? 'Export PDF' : 'PDF Export'}
                </CardTitle>
                <CardDescription>
                  {language === 'fr' 
                    ? 'Document professionnel avec en-tête et branding'
                    : 'Professional document with letterhead and branding'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-600" />
                    {language === 'fr' ? 'En-tête avec logo RiadPrix' : 'RiadPrix logo letterhead'}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-600" />
                    {language === 'fr' ? 'Tableau de données formaté' : 'Formatted data table'}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-red-600" />
                    {language === 'fr' ? 'Section disclaimer légal' : 'Legal disclaimer section'}
                  </li>
                </ul>
                <Button 
                  className="w-full gap-2" 
                  variant="default"
                  onClick={handlePDFExport}
                  disabled={isExporting || isLoading}
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {isExporting 
                    ? (language === 'fr' ? 'Génération...' : 'Generating...') 
                    : (language === 'fr' ? 'Générer PDF' : 'Generate PDF')}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Last Export Info */}
          {lastExportId && (
            <Card className="mt-6 border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">
                      {language === 'fr' ? 'Dernier rapport généré' : 'Last report generated'}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 font-mono">
                      ID: {lastExportId}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Report Preview */}
          <Card className="mt-6 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {language === 'fr' ? 'Aperçu des Données' : 'Data Preview'}
                {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              </CardTitle>
              <CardDescription>
                {reportTypes[selectedReport].description}
                {!isLoading && (
                  <span className="ml-2 text-primary font-medium">
                    ({currentData.rows.length} {language === 'fr' ? 'enregistrements' : 'records'})
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : currentData.rows.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Building className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="font-medium">
                    {language === 'fr' ? 'Aucune donnée disponible' : 'No data available'}
                  </p>
                  <p className="text-sm mt-1">
                    {selectedReport === 'property' || selectedReport === 'recommendations' 
                      ? (language === 'fr' ? 'Ajoutez des propriétés pour voir les données' : 'Add properties to see data')
                      : (language === 'fr' ? 'Les données du marché seront bientôt disponibles' : 'Market data will be available soon')}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {currentData.headers.map((header, i) => (
                          <th key={i} className="text-left py-3 px-2 font-semibold text-muted-foreground">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.rows.slice(0, 5).map((row, i) => (
                        <tr key={i} className="border-b border-border/50">
                          {row.map((cell, j) => (
                            <td key={j} className="py-3 px-2">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {currentData.rows.length > 5 && (
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      {language === 'fr' 
                        ? `+ ${currentData.rows.length - 5} enregistrements supplémentaires...`
                        : `+ ${currentData.rows.length - 5} more records...`}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
}
