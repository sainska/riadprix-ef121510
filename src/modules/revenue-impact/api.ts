/**
 * Simple Revenue Impact Estimator Module
 * Estimates revenue impact of price changes and optimizations
 */

import { supabase } from '@/integrations/supabase/client';
import { benchmarksApi } from '@/lib/api';

export interface RevenueImpact {
  currentScenario: {
    price: number;
    occupancy: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
  };
  recommendedScenario: {
    price: number;
    estimatedOccupancy: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
  };
  impact: {
    monthlyChange: number;
    yearlyChange: number;
    percentageChange: number;
    additionalRevenue: number;
  };
  assumptions: {
    averageStayLength: number;
    seasonalityFactor: number;
    priceElasticity: number;
  };
}

export interface PriceChangeSimulation {
  newPrice: number;
  estimatedOccupancy: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  changeFromCurrent: number;
  percentageChange: number;
}

export const revenueImpactApi = {
  /**
   * Estimate revenue impact of price recommendation
   */
  async estimateRevenueImpact(
    propertyId: string,
    currentPrice: number,
    recommendedPrice: number
  ): Promise<RevenueImpact> {
    // Get property details
    const { data: property } = await supabase
      .from('properties')
      .select('market_id, property_type')
      .eq('id', propertyId)
      .single();

    if (!property) {
      throw new Error('Property not found');
    }

    // Get market data for assumptions
    const benchmarks = await benchmarksApi.getBenchmarks({
      marketId: property.market_id || undefined,
      propertyType: property.property_type,
    });

    const latestBenchmark = benchmarks[0];
    const avgOccupancy = Number(latestBenchmark.avg_occupancy) || 70;

    // Assumptions
    const assumptions = {
      averageStayLength: 3, // days
      seasonalityFactor: 1.0,
      priceElasticity: -0.5, // For every 10% price increase, demand drops by 5%
    };

    // Calculate current scenario
    const currentOccupancy = avgOccupancy;
    const daysInMonth = 30;
    const currentMonthlyBookings = (currentOccupancy / 100) * daysInMonth;
    const currentMonthlyRevenue = currentPrice * currentMonthlyBookings * assumptions.averageStayLength;
    const currentYearlyRevenue = currentMonthlyRevenue * 12;

    // Calculate recommended scenario
    const priceChangePercent = ((recommendedPrice - currentPrice) / currentPrice) * 100;
    const demandChangePercent = priceChangePercent * assumptions.priceElasticity;
    const estimatedOccupancy = Math.max(
      30,
      Math.min(95, currentOccupancy + demandChangePercent)
    );
    const recommendedMonthlyBookings = (estimatedOccupancy / 100) * daysInMonth;
    const recommendedMonthlyRevenue =
      recommendedPrice * recommendedMonthlyBookings * assumptions.averageStayLength;
    const recommendedYearlyRevenue = recommendedMonthlyRevenue * 12;

    // Calculate impact
    const monthlyChange = recommendedMonthlyRevenue - currentMonthlyRevenue;
    const yearlyChange = recommendedYearlyRevenue - currentYearlyRevenue;
    const percentageChange = (yearlyChange / currentYearlyRevenue) * 100;

    return {
      currentScenario: {
        price: currentPrice,
        occupancy: currentOccupancy,
        monthlyRevenue: Math.round(currentMonthlyRevenue),
        yearlyRevenue: Math.round(currentYearlyRevenue),
      },
      recommendedScenario: {
        price: recommendedPrice,
        estimatedOccupancy: Math.round(estimatedOccupancy * 10) / 10,
        monthlyRevenue: Math.round(recommendedMonthlyRevenue),
        yearlyRevenue: Math.round(recommendedYearlyRevenue),
      },
      impact: {
        monthlyChange: Math.round(monthlyChange),
        yearlyChange: Math.round(yearlyChange),
        percentageChange: Math.round(percentageChange * 10) / 10,
        additionalRevenue: Math.round(yearlyChange),
      },
      assumptions,
    };
  },

  /**
   * Simulate price change scenarios
   */
  async simulatePriceChange(
    propertyId: string,
    currentPrice: number,
    newPrices: number[]
  ): Promise<PriceChangeSimulation[]> {
    const { data: property } = await supabase
      .from('properties')
      .select('market_id, property_type')
      .eq('id', propertyId)
      .single();

    if (!property) {
      throw new Error('Property not found');
    }

    const benchmarks = await benchmarksApi.getBenchmarks({
      marketId: property.market_id || undefined,
      propertyType: property.property_type,
    });

    const latestBenchmark = benchmarks[0];
    const avgOccupancy = Number(latestBenchmark.avg_occupancy) || 70;

    const priceElasticity = -0.5;
    const averageStayLength = 3;
    const daysInMonth = 30;

    return newPrices.map((newPrice) => {
      const priceChangePercent = ((newPrice - currentPrice) / currentPrice) * 100;
      const demandChangePercent = priceChangePercent * priceElasticity;
      const estimatedOccupancy = Math.max(30, Math.min(95, avgOccupancy + demandChangePercent));
      const monthlyBookings = (estimatedOccupancy / 100) * daysInMonth;
      const monthlyRevenue = newPrice * monthlyBookings * averageStayLength;
      const yearlyRevenue = monthlyRevenue * 12;

      return {
        newPrice,
        estimatedOccupancy: Math.round(estimatedOccupancy * 10) / 10,
        monthlyRevenue: Math.round(monthlyRevenue),
        yearlyRevenue: Math.round(yearlyRevenue),
        changeFromCurrent: Math.round(yearlyRevenue - (currentPrice * (avgOccupancy / 100) * daysInMonth * averageStayLength * 12)),
        percentageChange: Math.round(
          ((yearlyRevenue - (currentPrice * (avgOccupancy / 100) * daysInMonth * averageStayLength * 12)) /
            (currentPrice * (avgOccupancy / 100) * daysInMonth * averageStayLength * 12)) *
            100 *
            10) /
            10
        ),
      };
    });
  },

  /**
   * Calculate occupancy vs price trade-off
   */
  calculateOccupancyPriceTradeoff(
    basePrice: number,
    baseOccupancy: number
  ): Array<{ price: number; occupancy: number; revenue: number }> {
    const priceElasticity = -0.5;
    const averageStayLength = 3;
    const daysInMonth = 30;

    const scenarios: Array<{ price: number; occupancy: number; revenue: number }> = [];

    // Test prices from -30% to +30%
    for (let priceChange = -30; priceChange <= 30; priceChange += 5) {
      const price = basePrice * (1 + priceChange / 100);
      const demandChange = priceChange * priceElasticity;
      const occupancy = Math.max(30, Math.min(95, baseOccupancy + demandChange));
      const monthlyBookings = (occupancy / 100) * daysInMonth;
      const revenue = price * monthlyBookings * averageStayLength * 12; // Yearly

      scenarios.push({
        price: Math.round(price),
        occupancy: Math.round(occupancy * 10) / 10,
        revenue: Math.round(revenue),
      });
    }

    return scenarios;
  },

  /**
   * Get monthly and yearly projection
   */
  async getRevenueProjection(
    propertyId: string,
    price: number,
    occupancy: number
  ): Promise<{
    monthly: number;
    yearly: number;
    perBooking: number;
  }> {
    const averageStayLength = 3;
    const daysInMonth = 30;

    const monthlyBookings = (occupancy / 100) * daysInMonth;
    const perBooking = price * averageStayLength;
    const monthly = perBooking * monthlyBookings;
    const yearly = monthly * 12;

    return {
      monthly: Math.round(monthly),
      yearly: Math.round(yearly),
      perBooking: Math.round(perBooking),
    };
  },
};

