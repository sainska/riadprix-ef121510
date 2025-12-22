/**
 * Historical Benchmark Comparison Module
 * Compares current data with historical periods
 */

import { supabase } from '@/integrations/supabase/client';
import { benchmarksApi } from '@/lib/api';
import type { Database } from '@/integrations/supabase/types';

type PropertyType = Database['public']['Enums']['property_type'];

interface BenchmarkData {
  median_price?: number | null;
  avg_occupancy?: number | null;
  min_price?: number | null;
  max_price?: number | null;
}

export interface HistoricalComparison {
  currentPeriod: {
    start: string;
    end: string;
    medianPrice: number;
    minPrice: number;
    maxPrice: number;
    occupancy: number;
  };
  previousPeriod: {
    start: string;
    end: string;
    medianPrice: number;
    minPrice: number;
    maxPrice: number;
    occupancy: number;
  };
  changes: {
    priceChange: number;
    priceChangePercent: number;
    occupancyChange: number;
    occupancyChangePercent: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export interface YearOverYearComparison {
  currentYear: number;
  previousYear: number;
  comparisons: Array<{
    month: number;
    monthName: string;
    currentValue: number;
    previousValue: number;
    change: number;
    changePercent: number;
  }>;
  summary: {
    avgChange: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export interface PercentileShift {
  currentPercentile: number;
  previousPercentile: number;
  shift: number;
  interpretation: string;
}

export const historicalComparisonApi = {
  /**
   * Compare current period with previous period
   */
  async comparePeriods(
    marketId: string,
    propertyType: string,
    currentStart: string,
    currentEnd: string,
    previousStart: string,
    previousEnd: string
  ): Promise<HistoricalComparison> {
    // Get current period benchmarks
    const currentBenchmarks = await benchmarksApi.getBenchmarks({
      marketId,
      propertyType: propertyType as PropertyType,
      startDate: currentStart,
      endDate: currentEnd,
    });

    // Get previous period benchmarks
    const previousBenchmarks = await benchmarksApi.getBenchmarks({
      marketId,
      propertyType: propertyType as PropertyType,
      startDate: previousStart,
      endDate: previousEnd,
    });

    const current: BenchmarkData = currentBenchmarks[0] || {};
    const previous: BenchmarkData = previousBenchmarks[0] || {};

    const currentMedian = Number(current.median_price) || 0;
    const previousMedian = Number(previous.median_price) || 0;
    const priceChange = currentMedian - previousMedian;
    const priceChangePercent = previousMedian > 0 ? (priceChange / previousMedian) * 100 : 0;

    const currentOccupancy = Number(current.avg_occupancy) || 0;
    const previousOccupancy = Number(previous.avg_occupancy) || 0;
    const occupancyChange = currentOccupancy - previousOccupancy;
    const occupancyChangePercent = previousOccupancy > 0 ? (occupancyChange / previousOccupancy) * 100 : 0;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (priceChangePercent > 5) trend = 'up';
    else if (priceChangePercent < -5) trend = 'down';

    return {
      currentPeriod: {
        start: currentStart,
        end: currentEnd,
        medianPrice: currentMedian,
        minPrice: Number(current.min_price) || 0,
        maxPrice: Number(current.max_price) || 0,
        occupancy: currentOccupancy,
      },
      previousPeriod: {
        start: previousStart,
        end: previousEnd,
        medianPrice: previousMedian,
        minPrice: Number(previous.min_price) || 0,
        maxPrice: Number(previous.max_price) || 0,
        occupancy: previousOccupancy,
      },
      changes: {
        priceChange,
        priceChangePercent: Math.round(priceChangePercent * 10) / 10,
        occupancyChange,
        occupancyChangePercent: Math.round(occupancyChangePercent * 10) / 10,
        trend,
      },
    };
  },

  /**
   * Compare year over year
   */
  async compareYearOverYear(
    marketId: string,
    propertyType: string,
    year: number
  ): Promise<YearOverYearComparison> {
    const comparisons: YearOverYearComparison['comparisons'] = [];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    for (let month = 1; month <= 12; month++) {
      const currentStart = `${year}-${String(month).padStart(2, '0')}-01`;
      const currentEnd = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;
      const previousStart = `${year - 1}-${String(month).padStart(2, '0')}-01`;
      const previousEnd = `${year - 1}-${String(month).padStart(2, '0')}-${new Date(year - 1, month, 0).getDate()}`;

      const comparison = await this.comparePeriods(
        marketId,
        propertyType,
        currentStart,
        currentEnd,
        previousStart,
        previousEnd
      );

      comparisons.push({
        month,
        monthName: monthNames[month - 1],
        currentValue: comparison.currentPeriod.medianPrice,
        previousValue: comparison.previousPeriod.medianPrice,
        change: comparison.changes.priceChange,
        changePercent: comparison.changes.priceChangePercent,
      });
    }

    const avgChange = comparisons.reduce((sum, c) => sum + c.changePercent, 0) / comparisons.length;
    const trend: 'up' | 'down' | 'stable' = avgChange > 5 ? 'up' : avgChange < -5 ? 'down' : 'stable';

    return {
      currentYear: year,
      previousYear: year - 1,
      comparisons,
      summary: {
        avgChange: Math.round(avgChange * 10) / 10,
        trend,
      },
    };
  },

  /**
   * Calculate percentile shift for a property
   */
  async calculatePercentileShift(
    propertyId: string,
    currentPrice: number,
    previousPeriod: { start: string; end: string }
  ): Promise<PercentileShift> {
    const { data: property } = await supabase
      .from('properties')
      .select('market_id, property_type')
      .eq('id', propertyId)
      .single();

    if (!property) {
      throw new Error('Property not found');
    }

    const previousBenchmarks = await benchmarksApi.getBenchmarks({
      marketId: property.market_id || undefined,
      propertyType: property.property_type,
      startDate: previousPeriod.start,
      endDate: previousPeriod.end,
    });

    const currentBenchmarks = await benchmarksApi.getBenchmarks({
      marketId: property.market_id || undefined,
      propertyType: property.property_type,
    });

    const previous = previousBenchmarks[0];
    const current = currentBenchmarks[0];

    if (!previous || !current) {
      throw new Error('Insufficient historical data');
    }

    const prevMin = Number(previous.min_price) || 0;
    const prevMax = Number(previous.max_price) || 0;
    const prevRange = prevMax - prevMin;
    const previousPercentile = prevRange > 0 ? ((currentPrice - prevMin) / prevRange) * 100 : 50;

    const currMin = Number(current.min_price) || 0;
    const currMax = Number(current.max_price) || 0;
    const currRange = currMax - currMin;
    const currentPercentile = currRange > 0 ? ((currentPrice - currMin) / currRange) * 100 : 50;

    const shift = currentPercentile - previousPercentile;

    let interpretation = '';
    if (Math.abs(shift) < 5) {
      interpretation = 'Your market position has remained stable';
    } else if (shift > 0) {
      interpretation = `You've moved ${shift.toFixed(0)} percentile points higher in the market`;
    } else {
      interpretation = `You've moved ${Math.abs(shift).toFixed(0)} percentile points lower in the market`;
    }

    return {
      currentPercentile: Math.round(currentPercentile),
      previousPercentile: Math.round(previousPercentile),
      shift: Math.round(shift),
      interpretation,
    };
  },

  /**
   * Get market growth indicator
   */
  async getMarketGrowthIndicator(
    marketId: string,
    propertyType: string
  ): Promise<{ growth: number; trend: 'growing' | 'declining' | 'stable'; period: string }> {
    const now = new Date();
    const currentYear = now.getFullYear();

    const yoy = await this.compareYearOverYear(marketId, propertyType, currentYear);

    return {
      growth: yoy.summary.avgChange,
      trend: yoy.summary.trend === 'up' ? 'growing' : yoy.summary.trend === 'down' ? 'declining' : 'stable',
      period: `${currentYear} vs ${currentYear - 1}`,
    };
  },
};
