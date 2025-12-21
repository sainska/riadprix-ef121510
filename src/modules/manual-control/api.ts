/**
 * Manual Override & Control Module
 * Allows users to override AI recommendations and set manual controls
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export interface ManualPriceOverride {
  propertyId: string;
  manualPrice: number;
  overrideReason?: string;
  validFrom: string;
  validTo?: string;
  isActive: boolean;
}

export interface PriceLock {
  propertyId: string;
  lockedPrice: number;
  lockedFrom: string;
  lockedTo: string;
  reason?: string;
}

export interface PriceConstraints {
  propertyId: string;
  minPrice?: number;
  maxPrice?: number;
  floorReason?: string;
  ceilingReason?: string;
}

export interface OverrideHistory {
  id: string;
  propertyId: string;
  previousPrice: number;
  newPrice: number;
  overriddenAt: string;
  reason?: string;
  overriddenBy: string;
}

export const manualControlApi = {
  /**
   * Set manual price override
   */
  async setPriceOverride(override: ManualPriceOverride): Promise<void> {
    // In production, this would save to a price_overrides table
    // For now, update the property directly
    const { error } = await supabase
      .from('properties')
      .update({
        current_price: override.manualPrice,
        updated_at: new Date().toISOString(),
      })
      .eq('id', override.propertyId);

    if (error) throw error;

    // Save override history
    await this.saveOverrideHistory({
      propertyId: override.propertyId,
      previousPrice: 0, // Would fetch current price first
      newPrice: override.manualPrice,
      reason: override.overrideReason,
      overriddenBy: 'user', // Would use actual user ID
    });
  },

  /**
   * Remove price override
   */
  async removePriceOverride(propertyId: string): Promise<void> {
    // In production, would mark override as inactive
    // For now, placeholder
  },

  /**
   * Get active price override for property
   */
  async getPriceOverride(propertyId: string): Promise<ManualPriceOverride | null> {
    // Would query price_overrides table
    // For now, return null
    return null;
  },

  /**
   * Set price lock (prevent automatic changes)
   */
  async setPriceLock(lock: PriceLock): Promise<void> {
    // Would save to price_locks table
    // Placeholder implementation
  },

  /**
   * Remove price lock
   */
  async removePriceLock(propertyId: string): Promise<void> {
    // Would remove from price_locks table
  },

  /**
   * Get active price lock
   */
  async getPriceLock(propertyId: string): Promise<PriceLock | null> {
    return null;
  },

  /**
   * Set price constraints (floor/ceiling)
   */
  async setPriceConstraints(constraints: PriceConstraints): Promise<void> {
    // Would save to price_constraints table
  },

  /**
   * Get price constraints
   */
  async getPriceConstraints(propertyId: string): Promise<PriceConstraints | null> {
    return null;
  },

  /**
   * Save override history
   */
  async saveOverrideHistory(history: Omit<OverrideHistory, 'id' | 'overriddenAt'>): Promise<void> {
    // Would save to override_history table
    // Placeholder
  },

  /**
   * Get override history for property
   */
  async getOverrideHistory(propertyId: string, limit: number = 20): Promise<OverrideHistory[]> {
    return [];
  },

  /**
   * Check if recommendation can be overridden
   */
  async canOverrideRecommendation(propertyId: string): Promise<{
    canOverride: boolean;
    reason?: string;
    hasActiveLock: boolean;
  }> {
    const lock = await this.getPriceLock(propertyId);

    return {
      canOverride: !lock,
      hasActiveLock: !!lock,
      reason: lock ? 'Price is locked until ' + lock.lockedTo : undefined,
    };
  },
};

