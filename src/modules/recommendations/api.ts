/**
 * Pricing Recommendation Engine API Module
 * Provides intelligent pricing recommendations based on market data
 */

import { supabase } from '@/integrations/supabase/client';
import { benchmarksApi } from '@/lib/api';
import type { Database } from '@/integrations/supabase/types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type PropertyType = Database['public']['Enums']['property_type'];

export type RecommendationRow = Tables<'recommendations'>;
export type PropertyRow = Tables<'properties'>;

export interface PricingRecommendation {
  recommendedPrice: number;
  currentPrice?: number;
  confidence: number; // 0-1 scale
  reasoning: string;
  factors: {
    marketMedian: number;
    seasonalityAdjustment: number;
    competitivePosition: number;
    demandForecast: number;
  };
  suggestions: {
    basePrice: number;
    weekendPrice?: number;
    weekdayPrice?: number;
    highSeasonPrice?: number;
    lowSeasonPrice?: number;
  };
  alerts: Array<{
    type: 'undercut' | 'overprice' | 'opportunity';
    message: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

export interface RecommendationOptions {
  propertyId: string;
  dateRange?: {
    start: string;
    end: string;
  };
  considerSeasonality?: boolean;
  considerCompetitors?: boolean;
  riskTolerance?: 'conservative' | 'balanced' | 'aggressive';
}

export const recommendationsApi = {
  /**
   * Get pricing recommendation for a property
   */
  async getRecommendation(
    options: RecommendationOptions
  ): Promise<PricingRecommendation> {
    // Get property details
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', options.propertyId)
      .single();

    if (propertyError || !property) {
      throw new Error('Property not found');
    }

    // Get market benchmarks
    const benchmarks = await benchmarksApi.getBenchmarks({
      marketId: property.market_id || undefined,
      propertyType: property.property_type,
    });

    if (benchmarks.length === 0) {
      throw new Error('Insufficient market data for recommendations');
    }

    // Calculate base recommendation
    const latestBenchmark = benchmarks[0];
    const marketMedian = Number(latestBenchmark.median_price) || 0;

    // Calculate seasonality adjustment (simplified - would use actual seasonality data)
    const seasonalityAdjustment = this.calculateSeasonalityAdjustment(
      options.dateRange?.start,
      property.market_id || ''
    );

    // Calculate competitive positioning
    const currentPrice = property.current_price
      ? Number(property.current_price)
      : marketMedian;
    const competitivePosition = this.calculateCompetitivePosition(
      currentPrice,
      marketMedian
    );

    // Demand forecast (simplified)
    const demandForecast = this.calculateDemandForecast(
      property.market_id || '',
      options.dateRange?.start
    );

    // Calculate recommended price based on risk tolerance
    const riskMultiplier = {
      conservative: 0.95,
      balanced: 1.0,
      aggressive: 1.05,
    }[options.riskTolerance || 'balanced'];

    const recommendedPrice = Math.round(
      marketMedian * seasonalityAdjustment * riskMultiplier
    );

    // Calculate confidence based on data quality
    const confidence = this.calculateConfidence(benchmarks, marketMedian);

    // Generate reasoning
    const reasoning = this.generateReasoning({
      recommendedPrice,
      marketMedian,
      seasonalityAdjustment,
      competitivePosition,
      currentPrice,
    });

    // Calculate price suggestions
    const suggestions = {
      basePrice: recommendedPrice,
      weekendPrice: Math.round(recommendedPrice * 1.15),
      weekdayPrice: Math.round(recommendedPrice * 0.9),
      highSeasonPrice: Math.round(recommendedPrice * 1.2),
      lowSeasonPrice: Math.round(recommendedPrice * 0.85),
    };

    // Generate alerts
    const alerts = this.generateAlerts(
      currentPrice,
      recommendedPrice,
      marketMedian
    );

    return {
      recommendedPrice,
      currentPrice,
      confidence,
      reasoning,
      factors: {
        marketMedian,
        seasonalityAdjustment,
        competitivePosition,
        demandForecast,
      },
      suggestions,
      alerts,
    };
  },

  /**
   * Calculate seasonality adjustment factor
   */
  calculateSeasonalityAdjustment(date: string | undefined, marketId: string): number {
    if (!date) return 1.0;

    const month = new Date(date).getMonth();
    // Simplified seasonality: higher prices in peak months (Mar-May, Sep-Nov)
    const peakMonths = [2, 3, 4, 8, 9, 10]; // 0-indexed
    return peakMonths.includes(month) ? 1.15 : 0.95;
  },

  /**
   * Calculate competitive positioning score
   */
  calculateCompetitivePosition(currentPrice: number, marketMedian: number): number {
    const ratio = currentPrice / marketMedian;
    // Returns normalized score: -1 (very underpriced) to 1 (very overpriced)
    if (ratio < 0.8) return -0.5; // Underpriced
    if (ratio > 1.2) return 0.5; // Overpriced
    return 0; // Competitive
  },

  /**
   * Calculate demand forecast (simplified)
   */
  calculateDemandForecast(marketId: string, date: string | undefined): number {
    // Placeholder - would use historical occupancy and booking data
    return 0.75; // 75% forecasted demand
  },

  /**
   * Calculate confidence score
   */
  calculateConfidence(benchmarks: any[], marketMedian: number): number {
    if (benchmarks.length === 0) return 0.3;
    if (marketMedian === 0) return 0.3;

    // Higher confidence with more data points
    const dataPoints = benchmarks.length;
    const baseConfidence = Math.min(dataPoints / 10, 0.8); // Max 0.8 from data volume

    // Add bonus for recent data
    const hasRecentData = benchmarks.some((b) => {
      const periodEnd = new Date(b.period_end);
      const daysAgo = (Date.now() - periodEnd.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo < 30;
    });

    return Math.min(baseConfidence + (hasRecentData ? 0.15 : 0), 0.95);
  },

  /**
   * Generate human-readable reasoning
   */
  generateReasoning(params: {
    recommendedPrice: number;
    marketMedian: number;
    seasonalityAdjustment: number;
    competitivePosition: number;
    currentPrice?: number;
  }): string {
    const { recommendedPrice, marketMedian, seasonalityAdjustment, currentPrice } = params;
    
    let reasoning = `Based on market analysis, we recommend ${recommendedPrice} MAD. `;
    reasoning += `The median price in your market is ${marketMedian} MAD. `;

    if (currentPrice) {
      const diff = recommendedPrice - currentPrice;
      const percentDiff = ((diff / currentPrice) * 100).toFixed(1);
      
      if (Math.abs(diff) < marketMedian * 0.05) {
        reasoning += `Your current price (${currentPrice} MAD) is well-aligned with market conditions. `;
      } else if (diff > 0) {
        reasoning += `Consider increasing by ${Math.abs(percentDiff)}% to optimize revenue. `;
      } else {
        reasoning += `Your price may be ${Math.abs(percentDiff)}% above optimal. `;
      }
    }

    if (seasonalityAdjustment > 1.05) {
      reasoning += 'Current period shows strong seasonal demand. ';
    } else if (seasonalityAdjustment < 0.95) {
      reasoning += 'Seasonal demand is lower in this period. ';
    }

    reasoning += 'Adjust based on your property features and booking goals.';

    return reasoning;
  },

  /**
   * Generate pricing alerts
   */
  generateAlerts(
    currentPrice: number | undefined,
    recommendedPrice: number,
    marketMedian: number
  ): PricingRecommendation['alerts'] {
    const alerts: PricingRecommendation['alerts'] = [];

    if (!currentPrice) {
      alerts.push({
        type: 'opportunity',
        message: 'Set your initial price to start tracking performance',
        severity: 'medium',
      });
      return alerts;
    }

    const priceDiff = currentPrice - recommendedPrice;
    const percentDiff = Math.abs((priceDiff / recommendedPrice) * 100);

    if (priceDiff < -marketMedian * 0.15) {
      alerts.push({
        type: 'undercut',
        message: `Your price is ${percentDiff.toFixed(1)}% below recommended. You may be leaving revenue on the table.`,
        severity: 'high',
      });
    } else if (priceDiff > marketMedian * 0.15) {
      alerts.push({
        type: 'overprice',
        message: `Your price is ${percentDiff.toFixed(1)}% above recommended. This may reduce occupancy.`,
        severity: 'high',
      });
    } else if (percentDiff > 5 && priceDiff > 0) {
      alerts.push({
        type: 'opportunity',
        message: `Small price optimization opportunity: consider reducing by ~${percentDiff.toFixed(1)}%`,
        severity: 'low',
      });
    }

    if (currentPrice < marketMedian * 0.9) {
      alerts.push({
        type: 'opportunity',
        message: 'Your price is below market median. Consider testing higher prices during peak periods.',
        severity: 'medium',
      });
    }

    return alerts;
  },

  /**
   * Save recommendation to database
   */
  async saveRecommendation(
    propertyId: string,
    recommendation: PricingRecommendation,
    validFrom: string,
    validTo: string
  ): Promise<RecommendationRow> {
    const { data, error } = await supabase
      .from('recommendations')
      .insert({
        property_id: propertyId,
        recommended_price: recommendation.recommendedPrice,
        confidence_score: recommendation.confidence,
        reasoning: recommendation.reasoning,
        valid_from: validFrom,
        valid_to: validTo,
        is_applied: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data as RecommendationRow;
  },

  /**
   * Get saved recommendations for a property
   */
  async getSavedRecommendations(
    propertyId: string
  ): Promise<RecommendationRow[]> {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as RecommendationRow[];
  },

  /**
   * Apply a recommendation (mark as applied)
   */
  async applyRecommendation(recommendationId: string): Promise<void> {
    const { error } = await supabase
      .from('recommendations')
      .update({ is_applied: true })
      .eq('id', recommendationId);

    if (error) throw error;
  },
};

