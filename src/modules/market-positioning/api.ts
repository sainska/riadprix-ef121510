/**
 * Market Positioning & Strategy Labels Module
 * Provides positioning labels and visual indicators for pricing strategy
 */

import { supabase } from '@/integrations/supabase/client';
import { benchmarksApi } from '@/lib/api';

export type MarketPosition = 'budget' | 'mid_range' | 'premium' | 'luxury';

export interface MarketPositioning {
  currentPrice: number;
  marketPosition: MarketPosition;
  positionScore: number; // 0-100, where 50 = median
  percentile: number; // 0-100
  recommendation: 'undercut' | 'competitive' | 'premium' | 'overpriced';
  reasoning: string;
}

export interface PriceCurveData {
  price: number;
  count: number;
  percentile: number;
  label: MarketPosition;
}

export const marketPositioningApi = {
  /**
   * Get market positioning for a property
   */
  async getMarketPositioning(
    propertyId: string,
    currentPrice: number
  ): Promise<MarketPositioning> {
    // Get property details
    const { data: property } = await supabase
      .from('properties')
      .select('market_id, property_type')
      .eq('id', propertyId)
      .single();

    if (!property) {
      throw new Error('Property not found');
    }

    // Get market benchmarks
    const benchmarks = await benchmarksApi.getBenchmarks({
      marketId: property.market_id || undefined,
      propertyType: property.property_type,
    });

    if (benchmarks.length === 0) {
      throw new Error('Insufficient market data');
    }

    const latestBenchmark = benchmarks[0];
    const minPrice = Number(latestBenchmark.min_price) || 0;
    const medianPrice = Number(latestBenchmark.median_price) || 0;
    const maxPrice = Number(latestBenchmark.max_price) || 0;

    // Calculate percentile
    const priceRange = maxPrice - minPrice;
    const percentile =
      priceRange > 0 ? ((currentPrice - minPrice) / priceRange) * 100 : 50;

    // Determine market position
    let marketPosition: MarketPosition = 'mid_range';
    if (percentile < 25) marketPosition = 'budget';
    else if (percentile < 75) marketPosition = 'mid_range';
    else if (percentile < 90) marketPosition = 'premium';
    else marketPosition = 'luxury';

    // Calculate position score (0-100, where 50 = median)
    const positionScore = percentile;

    // Determine recommendation
    let recommendation: MarketPositioning['recommendation'] = 'competitive';
    const priceRatio = currentPrice / medianPrice;

    if (priceRatio < 0.8) recommendation = 'undercut';
    else if (priceRatio <= 1.2) recommendation = 'competitive';
    else if (priceRatio <= 1.5) recommendation = 'premium';
    else recommendation = 'overpriced';

    // Generate reasoning
    const reasoning = this.generateReasoning(
      currentPrice,
      medianPrice,
      percentile,
      marketPosition,
      recommendation
    );

    return {
      currentPrice,
      marketPosition,
      positionScore: Math.round(positionScore),
      percentile: Math.round(percentile),
      recommendation,
      reasoning,
    };
  },

  /**
   * Generate positioning reasoning
   */
  generateReasoning(
    currentPrice: number,
    medianPrice: number,
    percentile: number,
    position: MarketPosition,
    recommendation: MarketPositioning['recommendation']
  ): string {
    const priceDiff = currentPrice - medianPrice;
    const percentDiff = Math.abs((priceDiff / medianPrice) * 100).toFixed(1);

    let reasoning = `Your price (${currentPrice} MAD) positions you in the ${position} segment, `;
    reasoning += `at the ${percentile.toFixed(0)}th percentile of the market. `;

    if (recommendation === 'undercut') {
      reasoning += `You are ${percentDiff}% below the median. Consider testing higher prices to maximize revenue.`;
    } else if (recommendation === 'competitive') {
      reasoning += `Your pricing aligns well with market conditions (${percentDiff}% from median).`;
    } else if (recommendation === 'premium') {
      reasoning += `You're pricing at a premium (${percentDiff}% above median). Ensure your property justifies this with superior amenities or location.`;
    } else {
      reasoning += `Your price is significantly above market (${percentDiff}% above median). This may limit occupancy. Consider adjusting to a more competitive range.`;
    }

    return reasoning;
  },

  /**
   * Get price curve data for visualization
   */
  async getPriceCurveData(marketId: string, propertyType: string): Promise<PriceCurveData[]> {
    // Get pricing data
    const { data: pricingData } = await supabase
      .from('pricing_data')
      .select('min_price, median_price, max_price')
      .eq('market_id', marketId)
      .eq('property_type', propertyType)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (!pricingData) {
      return [];
    }

    const min = Number(pricingData.min_price) || 0;
    const median = Number(pricingData.median_price) || 0;
    const max = Number(pricingData.max_price) || 0;

    // Create price buckets for visualization
    const buckets: PriceCurveData[] = [
      {
        price: min,
        count: 25,
        percentile: 0,
        label: 'budget',
      },
      {
        price: min + (median - min) / 2,
        count: 25,
        percentile: 25,
        label: 'budget',
      },
      {
        price: median,
        count: 50,
        percentile: 50,
        label: 'mid_range',
      },
      {
        price: median + (max - median) / 2,
        count: 25,
        percentile: 75,
        label: 'premium',
      },
      {
        price: max,
        count: 25,
        percentile: 100,
        label: 'luxury',
      },
    ];

    return buckets;
  },

  /**
   * Get positioning label with description
   */
  getPositioningLabel(position: MarketPosition, language: 'en' | 'fr' = 'en'): {
    label: string;
    description: string;
    color: string;
  } {
    const labels = {
      budget: {
        en: { label: 'Budget', description: 'Lower price range, high volume potential' },
        fr: { label: 'Budget', description: 'Gamme de prix bas, potentiel de volume élevé' },
        color: 'text-green-600 dark:text-green-400',
      },
      mid_range: {
        en: { label: 'Mid-Range', description: 'Balanced pricing, competitive positioning' },
        fr: { label: 'Milieu de gamme', description: 'Prix équilibré, positionnement concurrentiel' },
        color: 'text-blue-600 dark:text-blue-400',
      },
      premium: {
        en: { label: 'Premium', description: 'Higher price, quality-focused positioning' },
        fr: { label: 'Premium', description: 'Prix plus élevé, positionnement axé sur la qualité' },
        color: 'text-orange-600 dark:text-orange-400',
      },
      luxury: {
        en: { label: 'Luxury', description: 'Top tier pricing, exclusive positioning' },
        fr: { label: 'Luxe', description: 'Prix de haut niveau, positionnement exclusif' },
        color: 'text-purple-600 dark:text-purple-400',
      },
    };

    const pos = labels[position][language];
    return {
      label: pos.label,
      description: pos.description,
      color: labels[position].color,
    };
  },
};

