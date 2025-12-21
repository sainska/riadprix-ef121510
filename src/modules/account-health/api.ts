/**
 * Account Health & Usage Module
 * Tracks usage, feature access, and provides usage warnings
 */

import { billingApi } from '../billing/api';
import type { CurrentUsage } from '../billing/api';

export interface AccountHealth {
  status: 'healthy' | 'warning' | 'critical';
  subscriptionStatus: string;
  usage: CurrentUsage;
  limits: {
    properties: number;
    markets: number;
    exportsPerMonth: number;
    apiCallsPerMonth: number;
  };
  warnings: Array<{
    type: 'usage_limit' | 'feature_access' | 'subscription';
    message: string;
    severity: 'low' | 'medium' | 'high';
    actionRequired: boolean;
  }>;
}

export interface FeatureAccess {
  feature: string;
  accessible: boolean;
  reason?: string;
  upgradeRequired?: string;
}

export const accountHealthApi = {
  /**
   * Get account health status
   */
  async getAccountHealth(userId: string): Promise<AccountHealth> {
    const subscription = await billingApi.getSubscription(userId);
    const usage = await billingApi.getCurrentUsage(userId);
    const limits = subscription
      ? billingApi.getUsageLimits(subscription.tier)
      : billingApi.getUsageLimits('starter');

    const warnings: AccountHealth['warnings'] = [];

    // Check usage limits
    if (limits.properties > 0 && usage.properties >= limits.properties * 0.9) {
      warnings.push({
        type: 'usage_limit',
        message: `You're using ${usage.properties} of ${limits.properties} properties (${Math.round((usage.properties / limits.properties) * 100)}%)`,
        severity: usage.properties >= limits.properties ? 'high' : 'medium',
        actionRequired: usage.properties >= limits.properties,
      });
    }

    if (limits.markets > 0 && usage.markets >= limits.markets * 0.9) {
      warnings.push({
        type: 'usage_limit',
        message: `You're accessing ${usage.markets} of ${limits.markets} markets`,
        severity: usage.markets >= limits.markets ? 'high' : 'medium',
        actionRequired: usage.markets >= limits.markets,
      });
    }

    if (limits.exportsPerMonth > 0 && usage.exportsThisMonth >= limits.exportsPerMonth * 0.9) {
      warnings.push({
        type: 'usage_limit',
        message: `You've used ${usage.exportsThisMonth} of ${limits.exportsPerMonth} exports this month`,
        severity: usage.exportsThisMonth >= limits.exportsPerMonth ? 'high' : 'medium',
        actionRequired: usage.exportsThisMonth >= limits.exportsPerMonth,
      });
    }

    // Determine overall status
    let status: AccountHealth['status'] = 'healthy';
    if (warnings.some((w) => w.severity === 'high' && w.actionRequired)) {
      status = 'critical';
    } else if (warnings.some((w) => w.severity === 'high' || w.severity === 'medium')) {
      status = 'warning';
    }

    return {
      status,
      subscriptionStatus: subscription?.tier || 'starter',
      usage,
      limits,
      warnings,
    };
  },

  /**
   * Check feature access
   */
  async checkFeatureAccess(userId: string, feature: string): Promise<FeatureAccess> {
    const subscription = await billingApi.getSubscription(userId);
    const tier = subscription?.tier || 'starter';

    const featureAccess: Record<string, Record<string, boolean>> = {
      'advanced-analytics': {
        starter: false,
        pro: true,
        enterprise: true,
      },
      'scheduled-reports': {
        starter: false,
        pro: true,
        enterprise: true,
      },
      'api-access': {
        starter: false,
        pro: false,
        enterprise: true,
      },
      'white-label': {
        starter: false,
        pro: false,
        enterprise: true,
      },
      'custom-integrations': {
        starter: false,
        pro: false,
        enterprise: true,
      },
    };

    const accessible = featureAccess[feature]?.[tier] || false;

    return {
      feature,
      accessible,
      reason: accessible
        ? undefined
        : `This feature is available on ${this.getUpgradeTier(feature)} plans and above`,
      upgradeRequired: accessible ? undefined : this.getUpgradeTier(feature),
    };
  },

  /**
   * Get required tier for feature
   */
  getUpgradeTier(feature: string): string {
    const tierMap: Record<string, string> = {
      'advanced-analytics': 'Pro',
      'scheduled-reports': 'Pro',
      'api-access': 'Enterprise',
      'white-label': 'Enterprise',
      'custom-integrations': 'Enterprise',
    };

    return tierMap[feature] || 'Pro';
  },

  /**
   * Get usage summary
   */
  async getUsageSummary(userId: string): Promise<{
    properties: { used: number; limit: number; percentage: number };
    markets: { used: number; limit: number; percentage: number };
    exports: { used: number; limit: number; percentage: number };
    apiCalls: { used: number; limit: number; percentage: number };
  }> {
    const subscription = await billingApi.getSubscription(userId);
    const usage = await billingApi.getCurrentUsage(userId);
    const limits = subscription
      ? billingApi.getUsageLimits(subscription.tier)
      : billingApi.getUsageLimits('starter');

    return {
      properties: {
        used: usage.properties,
        limit: limits.properties === -1 ? Infinity : limits.properties,
        percentage: limits.properties === -1 ? 0 : (usage.properties / limits.properties) * 100,
      },
      markets: {
        used: usage.markets,
        limit: limits.markets === -1 ? Infinity : limits.markets,
        percentage: limits.markets === -1 ? 0 : (usage.markets / limits.markets) * 100,
      },
      exports: {
        used: usage.exportsThisMonth,
        limit: limits.exportsPerMonth === -1 ? Infinity : limits.exportsPerMonth,
        percentage:
          limits.exportsPerMonth === -1 ? 0 : (usage.exportsThisMonth / limits.exportsPerMonth) * 100,
      },
      apiCalls: {
        used: usage.apiCallsThisMonth,
        limit: limits.apiCallsPerMonth === -1 ? Infinity : limits.apiCallsPerMonth,
        percentage:
          limits.apiCallsPerMonth === -1 ? 0 : (usage.apiCallsThisMonth / limits.apiCallsPerMonth) * 100,
      },
    };
  },
};

