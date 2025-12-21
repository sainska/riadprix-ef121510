/**
 * API Service Layer for RiadPrix
 * Centralized API calls to Supabase backend
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type PropertyType = Database['public']['Enums']['property_type'];
type MarketRow = Tables<'markets'>;
type BenchmarkRow = Tables<'benchmarks'>;
type PropertyRow = Tables<'properties'>;
type PricingDataRow = Tables<'pricing_data'>;

// Market & Benchmark APIs
export const marketsApi = {
  async getMarkets(city?: string) {
    let query = supabase.from('markets').select('*');
    if (city) {
      query = query.eq('city', city);
    }
    const { data, error } = await query.order('city');
    if (error) throw error;
    return data as MarketRow[];
  },

  async getMarketById(id: string) {
    const { data, error } = await supabase.from('markets').select('*').eq('id', id).single();
    if (error) throw error;
    return data as MarketRow;
  },
};

export const benchmarksApi = {
  async getBenchmarks(filters: {
    marketId?: string;
    city?: string;
    propertyType?: PropertyType;
    startDate?: string;
    endDate?: string;
  }) {
    let query = supabase.from('benchmarks').select('*');
    if (filters.marketId) query = query.eq('market_id', filters.marketId);
    if (filters.propertyType) query = query.eq('property_type', filters.propertyType);
    if (filters.startDate) query = query.gte('period_start', filters.startDate);
    if (filters.endDate) query = query.lte('period_end', filters.endDate);
    
    const { data, error } = await query.order('period_start', { ascending: false });
    if (error) throw error;
    return data as BenchmarkRow[];
  },

  async getBenchmarkById(id: string) {
    const { data, error } = await supabase.from('benchmarks').select('*').eq('id', id).single();
    if (error) throw error;
    return data as BenchmarkRow;
  },
};

// Properties APIs
export const propertiesApi = {
  async getUserProperties(userId: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as PropertyRow[];
  },

  async getPropertyById(id: string) {
    const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
    if (error) throw error;
    return data as PropertyRow;
  },

  async createProperty(property: {
    name: string;
    property_type: PropertyType;
    city: string;
    neighborhood?: string;
    bedrooms?: number;
    bathrooms?: number;
    max_guests?: number;
    owner_id: string;
  }) {
    const { data, error } = await supabase.from('properties').insert(property).select().single();
    if (error) throw error;
    return data as PropertyRow;
  },

  async updateProperty(id: string, updates: Partial<PropertyRow>) {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as PropertyRow;
  },

  async deleteProperty(id: string) {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) throw error;
  },
};

// Pricing Data APIs
export const pricingApi = {
  async getPricingData(filters: {
    propertyId?: string;
    marketId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    let query = supabase.from('pricing_data').select('*');
    if (filters.propertyId) query = query.eq('property_id', filters.propertyId);
    if (filters.marketId) query = query.eq('market_id', filters.marketId);
    if (filters.startDate) query = query.gte('date', filters.startDate);
    if (filters.endDate) query = query.lte('date', filters.endDate);
    
    const { data, error } = await query.order('date', { ascending: true });
    if (error) throw error;
    return data as PricingDataRow[];
  },
};

// Reports API
export const reportsApi = {
  async generateReport(filters: {
    format: 'csv' | 'pdf';
    marketId?: string;
    propertyType?: PropertyType;
    startDate?: string;
    endDate?: string;
  }) {
    // This would typically call a backend function or generate client-side
    // For now, return a placeholder
    return { url: '#', message: 'Report generation in progress' };
  },
};

// Recommendations API - Now using full module
export { recommendationsApi } from '@/modules/recommendations/api';

