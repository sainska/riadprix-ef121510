/**
 * Subscription & Billing API Module
 * Handles subscription management, usage tracking, and billing operations
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type SubscriptionTier = Database['public']['Enums']['subscription_tier'];

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  isActive: boolean;
  startsAt: string;
  endsAt?: string;
  trialEndsAt?: string;
  status: 'trial' | 'active' | 'paused' | 'canceled' | 'past_due';
}

export interface UsageLimits {
  properties: number;
  markets: number;
  exportsPerMonth: number;
  apiCallsPerMonth: number;
}

export interface CurrentUsage {
  properties: number;
  markets: number;
  exportsThisMonth: number;
  apiCallsThisMonth: number;
}

export interface Invoice {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed';
  createdAt: string;
  paidAt?: string;
}

export const billingApi = {
  /**
   * Get user's current subscription
   */
  async getSubscription(userId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Get subscription status with calculated trial/active status
   */
  async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    const subscription = await this.getSubscription(userId);
    
    if (!subscription) {
      return {
        tier: 'starter',
        isActive: false,
        startsAt: new Date().toISOString(),
        status: 'trial',
      };
    }

    const now = new Date();
    const startsAt = new Date(subscription.starts_at);
    const endsAt = subscription.ends_at ? new Date(subscription.ends_at) : null;

    let status: SubscriptionStatus['status'] = 'active';
    if (!subscription.is_active) status = 'paused';
    else if (endsAt && endsAt < now) status = 'past_due';
    else if (startsAt > now) status = 'trial';

    return {
      tier: subscription.tier,
      isActive: subscription.is_active ?? false,
      startsAt: subscription.starts_at,
      endsAt: subscription.ends_at ?? undefined,
      status,
    };
  },

  /**
   * Get usage limits based on subscription tier
   */
  getUsageLimits(tier: SubscriptionTier): UsageLimits {
    const limits: Record<SubscriptionTier, UsageLimits> = {
      starter: {
        properties: 1,
        markets: 3,
        exportsPerMonth: 5,
        apiCallsPerMonth: 1000,
      },
      pro: {
        properties: 10,
        markets: 10,
        exportsPerMonth: 50,
        apiCallsPerMonth: 10000,
      },
      enterprise: {
        properties: -1,
        markets: -1,
        exportsPerMonth: -1,
        apiCallsPerMonth: -1,
      },
    };

    return limits[tier];
  },

  /**
   * Get current usage for user
   */
  async getCurrentUsage(userId: string): Promise<CurrentUsage> {
    const { count: propertiesCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { data: properties } = await supabase
      .from('properties')
      .select('market_id')
      .eq('user_id', userId);

    const marketsCount = new Set(properties?.map(p => p.market_id)).size;

    return {
      properties: propertiesCount || 0,
      markets: marketsCount,
      exportsThisMonth: 0,
      apiCallsThisMonth: 0,
    };
  },

  /**
   * Check if user can perform action based on usage limits
   */
  async checkUsageLimit(
    userId: string,
    action: 'add_property' | 'view_market' | 'export_report' | 'api_call'
  ): Promise<{ allowed: boolean; reason?: string }> {
    const subscription = await this.getSubscription(userId);
    const tier = subscription?.tier || 'starter';
    const limits = this.getUsageLimits(tier);
    const usage = await this.getCurrentUsage(userId);

    switch (action) {
      case 'add_property':
        if (limits.properties === -1) return { allowed: true };
        if (usage.properties >= limits.properties) {
          return {
            allowed: false,
            reason: `Your ${tier} plan allows ${limits.properties} property(ies). Please upgrade to add more.`,
          };
        }
        return { allowed: true };

      case 'view_market':
        if (limits.markets === -1) return { allowed: true };
        if (usage.markets >= limits.markets) {
          return {
            allowed: false,
            reason: `Your ${tier} plan allows access to ${limits.markets} market(s). Please upgrade for more.`,
          };
        }
        return { allowed: true };

      case 'export_report':
        if (limits.exportsPerMonth === -1) return { allowed: true };
        if (usage.exportsThisMonth >= limits.exportsPerMonth) {
          return {
            allowed: false,
            reason: `Your ${tier} plan allows ${limits.exportsPerMonth} exports per month.`,
          };
        }
        return { allowed: true };

      case 'api_call':
        if (limits.apiCallsPerMonth === -1) return { allowed: true };
        if (usage.apiCallsThisMonth >= limits.apiCallsPerMonth) {
          return {
            allowed: false,
            reason: `Your ${tier} plan allows ${limits.apiCallsPerMonth} API calls per month.`,
          };
        }
        return { allowed: true };

      default:
        return { allowed: true };
    }
  },

  /**
   * Upgrade subscription
   */
  async upgradeSubscription(userId: string, newTier: SubscriptionTier) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ tier: newTier })
      .eq('user_id', userId)
      .eq('is_active', true)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string): Promise<void> {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        is_active: false,
        ends_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) throw error;
  },

  /**
   * Get invoices for user (mock implementation)
   */
  async getInvoices(userId: string): Promise<Invoice[]> {
    return [];
  },
};
