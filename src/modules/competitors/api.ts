/**
 * Competitor Intelligence API Module
 * Tracks and analyzes competitor properties and pricing
 * Uses mock data until competitor tables are created
 */

import { supabase } from '@/integrations/supabase/client';

export interface SimilarListing {
  listingId: string;
  name: string;
  price: number;
  similarityScore: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  url?: string;
}

export interface CompetitorPriceMovement {
  competitorId: string;
  date: string;
  price: number;
  previousPrice?: number;
  changePercent?: number;
}

export interface CompetitorHeatmapData {
  priceRange: string;
  count: number;
  avgPrice: number;
}

// Mock competitor data
const mockCompetitors: SimilarListing[] = [
  { listingId: '1', name: 'Riad Al Karama', price: 1800, similarityScore: 0.92, bedrooms: 4, bathrooms: 3, location: 'Marrakech Medina' },
  { listingId: '2', name: 'Dar Essaouira', price: 1650, similarityScore: 0.88, bedrooms: 3, bathrooms: 2, location: 'Marrakech Gueliz' },
  { listingId: '3', name: 'Villa Palmeraie', price: 3200, similarityScore: 0.75, bedrooms: 5, bathrooms: 4, location: 'Marrakech Palmeraie' },
  { listingId: '4', name: 'Riad Bleu', price: 1450, similarityScore: 0.85, bedrooms: 3, bathrooms: 2, location: 'Fès Medina' },
  { listingId: '5', name: 'Ocean Breeze Apt', price: 950, similarityScore: 0.78, bedrooms: 2, bathrooms: 1, location: 'Essaouira Port' },
];

export const competitorsApi = {
  /**
   * Find similar listings to a property
   */
  async findSimilarListings(
    propertyId: string,
    limit: number = 10
  ): Promise<SimilarListing[]> {
    const { data: property } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (!property) {
      throw new Error('Property not found');
    }

    // Return mock data filtered by similarity
    return mockCompetitors
      .filter(c => c.similarityScore > 0.5)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);
  },

  /**
   * Track price movements for competitors
   */
  async getPriceMovements(
    competitorIds: string[],
    days: number = 30
  ): Promise<CompetitorPriceMovement[]> {
    // Generate mock price movement data
    const movements: CompetitorPriceMovement[] = [];
    const today = new Date();

    competitorIds.forEach(competitorId => {
      for (let i = 0; i < Math.min(days, 10); i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const basePrice = 1500 + Math.random() * 1000;
        const previousPrice = i > 0 ? basePrice * (0.95 + Math.random() * 0.1) : undefined;

        movements.push({
          competitorId,
          date: date.toISOString().split('T')[0],
          price: Math.round(basePrice),
          previousPrice: previousPrice ? Math.round(previousPrice) : undefined,
          changePercent: previousPrice ? ((basePrice - previousPrice) / previousPrice) * 100 : undefined,
        });
      }
    });

    return movements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  /**
   * Get competitor pricing heatmap data
   */
  async getPricingHeatmap(
    marketId: string,
    propertyType: string
  ): Promise<CompetitorHeatmapData[]> {
    // Generate mock heatmap data
    const heatmapData: CompetitorHeatmapData[] = [
      { priceRange: '500-1000', count: 15, avgPrice: 750 },
      { priceRange: '1000-1500', count: 25, avgPrice: 1250 },
      { priceRange: '1500-2000', count: 30, avgPrice: 1750 },
      { priceRange: '2000-2500', count: 18, avgPrice: 2250 },
      { priceRange: '2500-3000', count: 10, avgPrice: 2750 },
      { priceRange: '3000-3500', count: 5, avgPrice: 3250 },
    ];

    return heatmapData;
  },

  /**
   * Get new competitor alerts
   */
  async getNewCompetitorAlerts(
    propertyId: string,
    days: number = 7
  ): Promise<Array<{ competitorId: string; name: string; price: number; detectedAt: string }>> {
    const { data: property } = await supabase
      .from('properties')
      .select('market_id, property_type')
      .eq('id', propertyId)
      .single();

    if (!property) return [];

    // Return mock new competitors
    return [
      { competitorId: 'new1', name: 'New Riad Luxury', price: 2100, detectedAt: new Date().toISOString() },
      { competitorId: 'new2', name: 'Boutique Hotel Medina', price: 1850, detectedAt: new Date(Date.now() - 86400000).toISOString() },
    ];
  },

  /**
   * Track competitor price change (mock implementation)
   */
  async trackPriceChange(
    competitorId: string,
    price: number,
    date: string = new Date().toISOString().split('T')[0]
  ): Promise<void> {
    // Mock implementation - would insert into competitor_price_history table
    console.log(`Tracked price ${price} for competitor ${competitorId} on ${date}`);
  },
};
