/**
 * Alerts & Notifications API Module
 * Manages alert rules, notifications, and alert triggers
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export type NotificationRow = Tables<'notifications'>;
export type AlertRuleRow = Tables<'alert_rules'>;

export type AlertType = 'price_change' | 'market_trend' | 'competitor_undercut' | 'opportunity' | 'system';

export interface AlertRule {
  id?: string;
  userId: string;
  name: string;
  type: AlertType;
  enabled: boolean;
  conditions: {
    propertyId?: string;
    threshold?: number;
    marketId?: string;
    comparisonType?: 'above' | 'below' | 'change';
  };
  notificationPreferences: {
    email: boolean;
    inApp: boolean;
  };
}

export interface Notification {
  id: string;
  userId: string;
  type: AlertType;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export const alertsApi = {
  /**
   * Get user's alert rules
   */
  async getAlertRules(userId: string): Promise<AlertRuleRow[]> {
    const { data, error } = await supabase
      .from('alert_rules')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as AlertRuleRow[];
  },

  /**
   * Create alert rule
   */
  async createAlertRule(rule: AlertRule): Promise<AlertRuleRow> {
    const { data, error } = await supabase
      .from('alert_rules')
      .insert({
        user_id: rule.userId,
        name: rule.name,
        type: rule.type,
        enabled: rule.enabled,
        conditions: rule.conditions,
        notification_preferences: rule.notificationPreferences,
      })
      .select()
      .single();

    if (error) throw error;
    return data as AlertRuleRow;
  },

  /**
   * Update alert rule
   */
  async updateAlertRule(
    ruleId: string,
    updates: Partial<AlertRule>
  ): Promise<AlertRuleRow> {
    const { data, error } = await supabase
      .from('alert_rules')
      .update({
        name: updates.name,
        enabled: updates.enabled,
        conditions: updates.conditions,
        notification_preferences: updates.notificationPreferences,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ruleId)
      .select()
      .single();

    if (error) throw error;
    return data as AlertRuleRow;
  },

  /**
   * Delete alert rule
   */
  async deleteAlertRule(ruleId: string): Promise<void> {
    const { error } = await supabase
      .from('alert_rules')
      .delete()
      .eq('id', ruleId);

    if (error) throw error;
  },

  /**
   * Get user notifications
   */
  async getNotifications(
    userId: string,
    filters?: {
      read?: boolean;
      type?: AlertType;
      limit?: number;
    }
  ): Promise<NotificationRow[]> {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId);

    if (filters?.read !== undefined) {
      query = query.eq('read', filters.read);
    }

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    query = query.order('created_at', { ascending: false });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as NotificationRow[];
  },

  /**
   * Create notification
   */
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<NotificationRow> {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        severity: notification.severity,
        read: notification.read || false,
        metadata: notification.metadata || {},
      })
      .select()
      .single();

    if (error) throw error;
    return data as NotificationRow;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  },

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  },

  /**
   * Trigger alert check for a property (would be called by backend cron job)
   */
  async checkAlerts(propertyId: string, userId: string): Promise<void> {
    // This would typically be a backend function that:
    // 1. Gets all enabled alert rules for the user
    // 2. Evaluates conditions
    // 3. Creates notifications if conditions are met
    // For now, placeholder

    const rules = await this.getAlertRules(userId);
    const enabledRules = rules.filter((r) => r.enabled);

    for (const rule of enabledRules) {
      if (rule.conditions?.propertyId === propertyId) {
        // Evaluate rule conditions
        // If met, create notification
        // This is simplified - real implementation would check actual data
      }
    }
  },
};

