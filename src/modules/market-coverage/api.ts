/**
 * Market Coverage & Expansion Control Module
 * Manages city availability, coverage maps, and expansion requests
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export type MarketStatus = 'active' | 'coming_soon' | 'limited' | 'requested';

export interface MarketCoverage {
  marketId: string;
  marketName: string;
  marketNameFr?: string;
  status: MarketStatus;
  launchDate?: string;
  neighborhoods: {
    id: string;
    name: string;
    coveragePercentage: number;
    hasData: boolean;
  }[];
  propertyTypes: string[];
  dataQuality: 'high' | 'medium' | 'low';
}

export interface ExpansionRequest {
  id?: string;
  userId: string;
  marketName: string;
  country: string;
  reason?: string;
  priority?: 'high' | 'medium' | 'low';
  createdAt?: string;
}

export interface ExpansionRoadmap {
  upcoming: Array<{
    marketName: string;
    expectedLaunch: string;
    status: 'in_progress' | 'planned';
  }>;
  requested: ExpansionRequest[];
}

export const marketCoverageApi = {
  /**
   * Get market coverage status
   */
  async getMarketCoverage(marketId: string): Promise<MarketCoverage> {
    const { data: market } = await supabase
      .from('markets')
      .select('*')
      .eq('id', marketId)
      .single();

    if (!market) {
      throw new Error('Market not found');
    }

    // Get neighborhoods
    const { data: neighborhoods } = await supabase
      .from('neighborhoods')
      .select('*')
      .eq('market_id', marketId);

    // Check data availability
    const { data: pricingData } = await supabase
      .from('pricing_data')
      .select('neighborhood_id, property_type')
      .eq('market_id', marketId);

    const neighborhoodCoverage = (neighborhoods || []).map((neighborhood) => {
      const hasData = pricingData?.some((d) => d.neighborhood_id === neighborhood.id) || false;
      return {
        id: neighborhood.id,
        name: neighborhood.name,
        coveragePercentage: hasData ? 100 : 0,
        hasData,
      };
    });

    const propertyTypes = Array.from(
      new Set(pricingData?.map((d) => d.property_type).filter(Boolean))
    ) as string[];

    // Determine status
    const hasActiveData = pricingData && pricingData.length > 0;
    const status: MarketStatus = hasActiveData
      ? 'active'
      : market.is_active
      ? 'limited'
      : 'coming_soon';

    // Calculate data quality
    const dataQuality =
      pricingData && pricingData.length > 100 ? 'high' : pricingData && pricingData.length > 20 ? 'medium' : 'low';

    return {
      marketId: market.id,
      marketName: market.name,
      marketNameFr: market.name_fr || undefined,
      status,
      neighborhoods: neighborhoodCoverage,
      propertyTypes,
      dataQuality,
    };
  },

  /**
   * Get all markets with coverage status
   */
  async getAllMarketsCoverage(): Promise<MarketCoverage[]> {
    const { data: markets } = await supabase.from('markets').select('*').order('name');

    if (!markets) return [];

    const coveragePromises = markets.map((market) => this.getMarketCoverage(market.id));
    return Promise.all(coveragePromises);
  },

  /**
   * Request new market expansion
   */
  async requestMarketExpansion(request: Omit<ExpansionRequest, 'id' | 'createdAt'>): Promise<ExpansionRequest> {
    // In production, this would save to a requests table
    // For now, return the request
    return {
      ...request,
      id: `req_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Get expansion roadmap
   */
  async getExpansionRoadmap(): Promise<ExpansionRoadmap> {
    // Get markets with coming_soon status
    const { data: upcomingMarkets } = await supabase
      .from('markets')
      .select('name, created_at')
      .eq('is_active', false)
      .order('created_at');

    return {
      upcoming: (upcomingMarkets || []).map((market) => ({
        marketName: market.name,
        expectedLaunch: new Date(
          new Date(market.created_at).getTime() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        status: 'planned' as const,
      })),
      requested: [], // Would come from expansion_requests table
    };
  },

  /**
   * Get neighborhood coverage map
   */
  async getNeighborhoodCoverageMap(marketId: string): Promise<Map<string, number>> {
    const { data: neighborhoods } = await supabase
      .from('neighborhoods')
      .select('id')
      .eq('market_id', marketId);

    const { data: pricingData } = await supabase
      .from('pricing_data')
      .select('neighborhood_id')
      .eq('market_id', marketId);

    const coverageMap = new Map<string, number>();

    neighborhoods?.forEach((neighborhood) => {
      const hasData = pricingData?.some((d) => d.neighborhood_id === neighborhood.id);
      coverageMap.set(neighborhood.id, hasData ? 100 : 0);
    });

    return coverageMap;
  },
};

