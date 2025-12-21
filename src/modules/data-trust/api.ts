/**
 * Data Trust, Transparency & Attribution Module
 * Provides data source attribution, freshness indicators, and confidence scores
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export interface DataSourceAttribution {
  source: 'airdna' | 'airbtics' | 'booking' | 'manual' | 'aggregated';
  displayName: string;
  logo?: string;
  licenseInfo?: string;
  lastUpdated: string;
  coverage: {
    cities: string[];
    propertyTypes: string[];
  };
}

export interface DataFreshness {
  marketId?: string;
  propertyType?: string;
  lastUpdated: string;
  ageInDays: number;
  freshnessStatus: 'fresh' | 'recent' | 'stale' | 'outdated';
  nextUpdateScheduled?: string;
}

export interface DataConfidenceScore {
  score: number; // 0-100
  level: 'high' | 'medium' | 'low';
  factors: {
    sampleSize: number;
    dataRecency: number;
    coverage: number;
    consistency: number;
  };
  reasoning: string;
}

export interface CoverageDisclaimer {
  marketId: string;
  marketName: string;
  coverage: {
    neighborhoods: number;
    totalNeighborhoods: number;
    coveragePercentage: number;
  };
  limitations: string[];
  lastVerified: string;
}

export const dataTrustApi = {
  /**
   * Get data source attribution for a market or property type
   */
  async getAttribution(
    filters: { marketId?: string; propertyType?: string }
  ): Promise<DataSourceAttribution[]> {
    // In production, this would query actual data sources
    // For now, return mock structure
    return [
      {
        source: 'airdna',
        displayName: 'AirDNA',
        licenseInfo: 'Licensed market data provider',
        lastUpdated: new Date().toISOString(),
        coverage: {
          cities: ['Marrakech', 'Fes', 'Casablanca'],
          propertyTypes: ['riad', 'apartment', 'villa'],
        },
      },
    ];
  },

  /**
   * Get data freshness for specific data
   */
  async getDataFreshness(
    filters: { marketId?: string; propertyType?: string }
  ): Promise<DataFreshness> {
    // Query the most recent data update
    const { data } = await supabase
      .from('api_ingestion_logs')
      .select('completed_at')
      .eq('status', 'success')
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();

    if (!data?.completed_at) {
      return {
        lastUpdated: new Date(0).toISOString(),
        ageInDays: 999,
        freshnessStatus: 'outdated',
      };
    }

    const lastUpdated = new Date(data.completed_at);
    const now = new Date();
    const ageInDays = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));

    let freshnessStatus: DataFreshness['freshnessStatus'] = 'fresh';
    if (ageInDays > 30) freshnessStatus = 'outdated';
    else if (ageInDays > 14) freshnessStatus = 'stale';
    else if (ageInDays > 7) freshnessStatus = 'recent';

    return {
      marketId: filters.marketId,
      propertyType: filters.propertyType,
      lastUpdated: data.completed_at,
      ageInDays,
      freshnessStatus,
      nextUpdateScheduled: new Date(
        lastUpdated.getTime() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };
  },

  /**
   * Calculate data confidence score
   */
  async getConfidenceScore(
    filters: { marketId: string; propertyType?: string }
  ): Promise<DataConfidenceScore> {
    // Get benchmark data to calculate confidence
    const { data: benchmarks } = await supabase
      .from('benchmarks')
      .select('*')
      .eq('market_id', filters.marketId)
      .limit(100);

    if (!benchmarks || benchmarks.length === 0) {
      return {
        score: 0,
        level: 'low',
        factors: {
          sampleSize: 0,
          dataRecency: 0,
          coverage: 0,
          consistency: 0,
        },
        reasoning: 'Insufficient data available',
      };
    }

    const sampleSize = benchmarks.reduce((sum, b) => sum + (b.total_listings || 0), 0);
    const avgSampleSize = sampleSize / benchmarks.length;

    // Calculate recency (how recent is the data)
    const now = new Date();
    const avgAge = benchmarks.reduce((sum, b) => {
      const age = (now.getTime() - new Date(b.period_end).getTime()) / (1000 * 60 * 60 * 24);
      return sum + age;
    }, 0) / benchmarks.length;
    const recencyScore = Math.max(0, 100 - avgAge * 2); // Lose 2 points per day

    // Coverage score (based on how many periods we have)
    const coverageScore = Math.min(100, (benchmarks.length / 12) * 100); // 12 months = 100%

    // Consistency score (how consistent are the data points)
    const prices = benchmarks.map((b) => Number(b.median_price)).filter((p) => p > 0);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const variance =
      prices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / prices.length;
    const consistencyScore = Math.max(0, 100 - (variance / avgPrice) * 100);

    // Sample size score
    const sampleSizeScore = Math.min(100, (avgSampleSize / 100) * 100); // 100+ listings = 100%

    const totalScore = (recencyScore * 0.3 + coverageScore * 0.25 + consistencyScore * 0.25 + sampleSizeScore * 0.2);

    let level: 'high' | 'medium' | 'low' = 'low';
    if (totalScore >= 75) level = 'high';
    else if (totalScore >= 50) level = 'medium';

    return {
      score: Math.round(totalScore),
      level,
      factors: {
        sampleSize: Math.round(avgSampleSize),
        dataRecency: Math.round(recencyScore),
        coverage: Math.round(coverageScore),
        consistency: Math.round(consistencyScore),
      },
      reasoning: this.generateConfidenceReasoning(totalScore, level, {
        sampleSize: avgSampleSize,
        avgAge,
        benchmarks: benchmarks.length,
      }),
    };
  },

  /**
   * Generate human-readable confidence reasoning
   */
  generateConfidenceReasoning(
    score: number,
    level: string,
    metrics: { sampleSize: number; avgAge: number; benchmarks: number }
  ): string {
    if (level === 'high') {
      return `High confidence based on ${metrics.benchmarks} data points from ${Math.round(metrics.sampleSize)} properties, updated ${Math.round(metrics.avgAge)} days ago.`;
    } else if (level === 'medium') {
      return `Moderate confidence. Data includes ${metrics.benchmarks} periods with ${Math.round(metrics.sampleSize)} average listings per period.`;
    } else {
      return `Low confidence due to limited data (${metrics.benchmarks} periods, ${Math.round(metrics.sampleSize)} avg listings). More data needed for reliable insights.`;
    }
  },

  /**
   * Get coverage disclaimer for a market
   */
  async getCoverageDisclaimer(marketId: string): Promise<CoverageDisclaimer> {
    const { data: market } = await supabase
      .from('markets')
      .select('name, name_fr')
      .eq('id', marketId)
      .single();

    const { data: neighborhoods } = await supabase
      .from('neighborhoods')
      .select('id')
      .eq('market_id', marketId);

    // Get neighborhoods with data
    const { data: pricingData } = await supabase
      .from('pricing_data')
      .select('neighborhood_id')
      .eq('market_id', marketId)
      .not('neighborhood_id', 'is', null);

    const totalNeighborhoods = neighborhoods?.length || 0;
    const coveredNeighborhoods = new Set(pricingData?.map((d) => d.neighborhood_id)).size;

    return {
      marketId,
      marketName: market?.name || 'Unknown',
      coverage: {
        neighborhoods: coveredNeighborhoods,
        totalNeighborhoods,
        coveragePercentage: totalNeighborhoods > 0 ? (coveredNeighborhoods / totalNeighborhoods) * 100 : 0,
      },
      limitations: [
        'Data may not cover all neighborhoods',
        'Some property types may have limited samples',
        'Historical data availability varies by market',
      ],
      lastVerified: new Date().toISOString(),
    };
  },

  /**
   * Detect missing data gaps
   */
  async detectMissingData(
    filters: { marketId?: string; propertyType?: string; dateRange?: { start: string; end: string } }
  ): Promise<Array<{ date: string; missing: boolean; reason?: string }>> {
    // This would analyze data continuity
    // For now, return placeholder
    return [];
  },
};

