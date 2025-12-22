/**
 * API Service Layer for RiadPrix
 * Centralized API calls to Supabase backend
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type PropertyType = Database['public']['Enums']['property_type'];

// Market & Benchmark APIs
export const marketsApi = {
  async getMarkets(name?: string) {
    let query = supabase.from('markets').select('*');
    if (name) {
      query = query.ilike('name', `%${name}%`);
    }
    const { data, error } = await query.order('name');
    if (error) throw error;
    return data;
  },

  async getMarketById(id: string) {
    const { data, error } = await supabase.from('markets').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
};

export const benchmarksApi = {
  async getBenchmarks(filters: {
    marketId?: string;
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
    return data;
  },

  async getBenchmarkById(id: string) {
    const { data, error } = await supabase.from('benchmarks').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
};

// Properties APIs
export const propertiesApi = {
  async getUserProperties(userId: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getPropertyById(id: string) {
    const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createProperty(property: {
    name: string;
    property_type: PropertyType;
    market_id?: string;
    neighborhood_id?: string;
    bedrooms?: number;
    bathrooms?: number;
    max_guests?: number;
    current_price?: number;
    user_id: string;
  }) {
    const { data, error } = await supabase.from('properties').insert(property).select().single();
    if (error) throw error;
    return data;
  },

  async updateProperty(id: string, updates: Partial<{
    name: string;
    property_type: PropertyType;
    market_id: string | null;
    neighborhood_id: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    max_guests: number | null;
    current_price: number | null;
    is_active: boolean | null;
    airbnb_url: string | null;
    booking_url: string | null;
  }>) {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteProperty(id: string) {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) throw error;
  },
};

// Pricing Data APIs
export const pricingApi = {
  async getPricingData(filters: {
    marketId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    let query = supabase.from('pricing_data').select('*');
    if (filters.marketId) query = query.eq('market_id', filters.marketId);
    if (filters.startDate) query = query.gte('date', filters.startDate);
    if (filters.endDate) query = query.lte('date', filters.endDate);
    
    const { data, error } = await query.order('date', { ascending: true });
    if (error) throw error;
    return data;
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
    return { url: '#', message: 'Report generation in progress' };
  },
};

// Recommendations API
export { recommendationsApi } from '@/modules/recommendations/api';
