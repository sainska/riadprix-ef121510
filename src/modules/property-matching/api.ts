/**
 * Property Matching & Similarity Engine Module
 * Matches properties based on characteristics and calculates similarity scores
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type PropertyType = Database['public']['Enums']['property_type'];

export interface PropertyMatch {
  propertyId: string;
  similarityScore: number; // 0-100
  matchFactors: {
    propertyType: number;
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
    location: number;
    priceRange: number;
  };
  property: {
    name: string;
    type: PropertyType;
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
    currentPrice: number;
    location: string;
  };
}

export interface MatchingFilters {
  propertyType?: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  minGuests?: number;
  maxGuests?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  marketId?: string;
  neighborhoodId?: string;
}

export const propertyMatchingApi = {
  /**
   * Find similar properties to a given property
   */
  async findSimilarProperties(
    propertyId: string,
    limit: number = 20,
    minSimilarity: number = 50
  ): Promise<PropertyMatch[]> {
    // Get the target property
    const { data: targetProperty, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (error || !targetProperty) {
      throw new Error('Property not found');
    }

    // Get candidate properties (same market, similar type)
    let query = supabase
      .from('properties')
      .select('*')
      .eq('market_id', targetProperty.market_id)
      .eq('property_type', targetProperty.property_type)
      .neq('id', propertyId)
      .limit(limit * 3); // Get more to filter by similarity

    const { data: candidates } = await query;

    if (!candidates || candidates.length === 0) {
      return [];
    }

    // Calculate similarity for each candidate
    const matches: PropertyMatch[] = candidates
      .map((candidate) => {
        const similarity = this.calculateSimilarity(targetProperty, candidate);
        return {
          propertyId: candidate.id,
          similarityScore: similarity.total,
          matchFactors: similarity.factors,
          property: {
            name: candidate.name,
            type: candidate.property_type,
            bedrooms: candidate.bedrooms || 0,
            bathrooms: candidate.bathrooms || 0,
            maxGuests: candidate.max_guests || 0,
            currentPrice: Number(candidate.current_price) || 0,
            location: candidate.neighborhood_id || '',
          },
        };
      })
      .filter((match) => match.similarityScore >= minSimilarity)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);

    return matches;
  },

  /**
   * Calculate similarity between two properties
   */
  calculateSimilarity(property1: any, property2: any) {
    const factors = {
      propertyType: property1.property_type === property2.property_type ? 100 : 0,
      bedrooms: this.calculateNumericSimilarity(
        property1.bedrooms || 0,
        property2.bedrooms || 0,
        2
      ),
      bathrooms: this.calculateNumericSimilarity(
        property1.bathrooms || 0,
        property2.bathrooms || 0,
        2
      ),
      maxGuests: this.calculateNumericSimilarity(
        property1.max_guests || 0,
        property2.max_guests || 0,
        4
      ),
      location: property1.neighborhood_id === property2.neighborhood_id ? 100 : 50,
      priceRange: this.calculatePriceSimilarity(
        Number(property1.current_price) || 0,
        Number(property2.current_price) || 0
      ),
    };

    // Weighted average
    const total =
      factors.propertyType * 0.2 +
      factors.bedrooms * 0.2 +
      factors.bathrooms * 0.15 +
      factors.maxGuests * 0.1 +
      factors.location * 0.15 +
      factors.priceRange * 0.2;

    return {
      total: Math.round(total),
      factors,
    };
  },

  /**
   * Calculate numeric similarity (bedrooms, bathrooms, etc.)
   */
  calculateNumericSimilarity(value1: number, value2: number, tolerance: number): number {
    if (value1 === value2) return 100;
    const diff = Math.abs(value1 - value2);
    if (diff === 0) return 100;
    if (diff <= tolerance) {
      return Math.max(0, 100 - (diff / tolerance) * 30); // Lose up to 30 points
    }
    return Math.max(0, 70 - (diff - tolerance) * 10); // Lose 10 points per unit beyond tolerance
  },

  /**
   * Calculate price similarity
   */
  calculatePriceSimilarity(price1: number, price2: number): number {
    if (price1 === 0 || price2 === 0) return 50; // Unknown prices get neutral score

    const ratio = Math.min(price1, price2) / Math.max(price1, price2);
    // Prices within 20% get high score
    if (ratio >= 0.8) return 100;
    // Prices within 40% get medium score
    if (ratio >= 0.6) return 75;
    // Prices within 60% get low-medium score
    if (ratio >= 0.4) return 50;
    // Very different prices get low score
    return 25;
  },

  /**
   * Find properties matching filters
   */
  async findPropertiesByFilters(filters: MatchingFilters, limit: number = 50): Promise<any[]> {
    let query = supabase.from('properties').select('*');

    if (filters.marketId) query = query.eq('market_id', filters.marketId);
    if (filters.neighborhoodId) query = query.eq('neighborhood_id', filters.neighborhoodId);
    if (filters.propertyType) query = query.eq('property_type', filters.propertyType);
    if (filters.bedrooms) query = query.eq('bedrooms', filters.bedrooms);
    if (filters.bathrooms) query = query.eq('bathrooms', filters.bathrooms);
    if (filters.minGuests) query = query.gte('max_guests', filters.minGuests);
    if (filters.maxGuests) query = query.lte('max_guests', filters.maxGuests);

    if (filters.priceRange) {
      query = query
        .gte('current_price', filters.priceRange.min)
        .lte('current_price', filters.priceRange.max);
    }

    const { data, error } = await query.limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Get match quality explanation
   */
  getMatchQualityExplanation(score: number): string {
    if (score >= 80) return 'Excellent match - very similar properties';
    if (score >= 65) return 'Good match - comparable properties';
    if (score >= 50) return 'Fair match - some differences exist';
    return 'Weak match - significant differences';
  },
};

