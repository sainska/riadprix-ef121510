/**
 * Competitor Intelligence API Module
 * Tracks and analyzes competitor properties and pricing
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export type CompetitorRow = Tables<'competitors'>;
export type CompetitorListingRow = Tables<'competitor_listings'>;
export type CompetitorPriceHistoryRow = Tables<'competitor_price_history'>;

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

export const competitorsApi = {
  /**
   * Find similar listings to a property
   */
  async findSimilarListings(
    propertyId: string,
    limit: number = 10
  ): Promise<SimilarListing[]> {
    // Get property details
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (propertyError || !property) {
      throw new Error('Property not found');
    }

    // Query competitor listings with similar characteristics
    // This is a simplified implementation - real version would use ML/clustering
    const { data: competitors, error } = await supabase
      .from('competitor_listings')
      .select('*')
      .eq('market_id', property.market_id)
      .eq('property_type', property.property_type)
      .limit(limit * 2); // Get more to filter by similarity

    if (error || !competitors || competitors.length === 0) {
      return [];
    }

    // Calculate similarity scores (simplified)
    const similarListings: SimilarListing[] = competitors
      .map((competitor) => {
        let score = 0;
        let factors = 0;

        // Bedroom similarity
        if (competitor.bedrooms && property.bedrooms) {
          const bedroomDiff = Math.abs(
            (competitor.bedrooms || 0) - (property.bedrooms || 0)
          );
          score += (1 - Math.min(bedroomDiff / 2, 1)) * 0.3;
          factors += 0.3;
        }

        // Bathroom similarity
        if (competitor.bathrooms && property.bathrooms) {
          const bathroomDiff = Math.abs(
            (competitor.bathrooms || 0) - (property.bathrooms || 0)
          );
          score += (1 - Math.min(bathroomDiff / 2, 1)) * 0.2;
          factors += 0.2;
        }

        // Price similarity (within 30% range)
        if (competitor.current_price && property.current_price) {
          const priceRatio =
            Number(competitor.current_price) / Number(property.current_price);
          if (priceRatio >= 0.7 && priceRatio <= 1.3) {
            score += 0.5;
            factors += 0.5;
          }
        }

        // Normalize score
        const similarityScore = factors > 0 ? score / factors : 0;

        return {
          listingId: competitor.id,
          name: competitor.name || 'Unknown',
          price: Number(competitor.current_price) || 0,
          similarityScore,
          bedrooms: competitor.bedrooms || 0,
          bathrooms: competitor.bathrooms || 0,
          location: competitor.location || '',
          url: competitor.external_url || undefined,
        };
      })
      .filter((listing) => listing.similarityScore > 0.5)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);

    return similarListings;
  },

  /**
   * Track price movements for competitors
   */
  async getPriceMovements(
    competitorIds: string[],
    days: number = 30
  ): Promise<CompetitorPriceMovement[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('competitor_price_history')
      .select('*')
      .in('competitor_id', competitorIds)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (error) throw error;

    // Group by competitor and calculate changes
    const movements: CompetitorPriceMovement[] = [];
    const grouped = new Map<string, any[]>();

    data?.forEach((entry) => {
      if (!grouped.has(entry.competitor_id)) {
        grouped.set(entry.competitor_id, []);
      }
      grouped.get(entry.competitor_id)?.push(entry);
    });

    grouped.forEach((entries, competitorId) => {
      entries.forEach((entry, index) => {
        const previousEntry = entries[index + 1];
        const changePercent = previousEntry
          ? ((Number(entry.price) - Number(previousEntry.price)) /
              Number(previousEntry.price)) *
            100
          : undefined;

        movements.push({
          competitorId,
          date: entry.date,
          price: Number(entry.price),
          previousPrice: previousEntry ? Number(previousEntry.price) : undefined,
          changePercent,
        });
      });
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
    const { data: competitors, error } = await supabase
      .from('competitor_listings')
      .select('current_price')
      .eq('market_id', marketId)
      .eq('property_type', propertyType)
      .not('current_price', 'is', null);

    if (error || !competitors || competitors.length === 0) {
      return [];
    }

    const prices = competitors
      .map((c) => Number(c.current_price))
      .filter((p) => p > 0)
      .sort((a, b) => a - b);

    if (prices.length === 0) return [];

    const min = prices[0];
    const max = prices[prices.length - 1];
    const range = max - min;
    const bucketSize = range / 10; // 10 buckets

    const buckets: Map<string, number[]> = new Map();

    prices.forEach((price) => {
      const bucketIndex = Math.floor((price - min) / bucketSize);
      const bucketStart = min + bucketIndex * bucketSize;
      const bucketEnd = bucketStart + bucketSize;
      const key = `${Math.round(bucketStart)}-${Math.round(bucketEnd)}`;

      if (!buckets.has(key)) {
        buckets.set(key, []);
      }
      buckets.get(key)?.push(price);
    });

    const heatmapData: CompetitorHeatmapData[] = Array.from(buckets.entries())
      .map(([priceRange, priceList]) => ({
        priceRange,
        count: priceList.length,
        avgPrice: priceList.reduce((a, b) => a + b, 0) / priceList.length,
      }))
      .sort((a, b) => a.avgPrice - b.avgPrice);

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

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const { data: newCompetitors, error } = await supabase
      .from('competitor_listings')
      .select('id, name, current_price, detected_at')
      .eq('market_id', property.market_id)
      .eq('property_type', property.property_type)
      .gte('detected_at', cutoffDate.toISOString())
      .order('detected_at', { ascending: false });

    if (error || !newCompetitors) return [];

    return newCompetitors.map((comp) => ({
      competitorId: comp.id,
      name: comp.name || 'Unknown',
      price: Number(comp.current_price) || 0,
      detectedAt: comp.detected_at || new Date().toISOString(),
    }));
  },

  /**
   * Track competitor price change
   */
  async trackPriceChange(
    competitorId: string,
    price: number,
    date: string = new Date().toISOString().split('T')[0]
  ): Promise<void> {
    const { error } = await supabase.from('competitor_price_history').insert({
      competitor_id: competitorId,
      price,
      date,
    });

    if (error) throw error;
  },
};

