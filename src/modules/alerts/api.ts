/**
 * Alerts & Notifications API Module
 * Manages alert rules, notifications, and alert triggers
 * Uses mock data until database tables are created
 */

export type AlertType = 'price_change' | 'market_trend' | 'competitor_undercut' | 'opportunity' | 'system';

export interface AlertRule {
  id: string;
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
  createdAt: string;
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
  metadata?: Record<string, unknown>;
}

// Mock data storage
let mockAlertRules: AlertRule[] = [];
let mockNotifications: Notification[] = [];

export const alertsApi = {
  /**
   * Get user's alert rules
   */
  async getAlertRules(userId: string): Promise<AlertRule[]> {
    return mockAlertRules.filter(r => r.userId === userId);
  },

  /**
   * Create alert rule
   */
  async createAlertRule(rule: Omit<AlertRule, 'id' | 'createdAt'>): Promise<AlertRule> {
    const newRule: AlertRule = {
      ...rule,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    mockAlertRules.push(newRule);
    return newRule;
  },

  /**
   * Update alert rule
   */
  async updateAlertRule(ruleId: string, updates: Partial<AlertRule>): Promise<AlertRule> {
    const index = mockAlertRules.findIndex(r => r.id === ruleId);
    if (index === -1) throw new Error('Alert rule not found');
    
    mockAlertRules[index] = { ...mockAlertRules[index], ...updates };
    return mockAlertRules[index];
  },

  /**
   * Delete alert rule
   */
  async deleteAlertRule(ruleId: string): Promise<void> {
    mockAlertRules = mockAlertRules.filter(r => r.id !== ruleId);
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
  ): Promise<Notification[]> {
    let results = mockNotifications.filter(n => n.userId === userId);
    
    if (filters?.read !== undefined) {
      results = results.filter(n => n.read === filters.read);
    }
    if (filters?.type) {
      results = results.filter(n => n.type === filters.type);
    }
    
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    if (filters?.limit) {
      results = results.slice(0, filters.limit);
    }
    
    return results;
  },

  /**
   * Create notification
   */
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    mockNotifications.push(newNotification);
    return newNotification;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    mockNotifications
      .filter(n => n.userId === userId && !n.read)
      .forEach(n => { n.read = true; });
  },

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    mockNotifications = mockNotifications.filter(n => n.id !== notificationId);
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    return mockNotifications.filter(n => n.userId === userId && !n.read).length;
  },

  /**
   * Trigger alert check for a property
   */
  async checkAlerts(propertyId: string, userId: string): Promise<void> {
    const rules = await this.getAlertRules(userId);
    const enabledRules = rules.filter(r => r.enabled);

    for (const rule of enabledRules) {
      if (rule.conditions?.propertyId === propertyId) {
        // Placeholder for actual alert evaluation
      }
    }
  },
};
