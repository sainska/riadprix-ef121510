/**
 * Customer Feedback & Learning Loop Module
 * Collects feedback, feature requests, and support tickets
 */

import { supabase } from '@/integrations/supabase/client';

export type FeedbackType = 'bug' | 'feature_request' | 'improvement' | 'question' | 'compliment';

export interface Feedback {
  id?: string;
  userId: string;
  type: FeedbackType;
  title: string;
  description: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt?: string;
  metadata?: Record<string, any>;
}

export interface FeatureRequest {
  id?: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  votes: number;
  userVoted: boolean;
  status: 'under_review' | 'planned' | 'in_progress' | 'completed' | 'rejected';
  createdAt?: string;
}

export interface SupportTicket {
  id?: string;
  userId: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  createdAt?: string;
  assignedTo?: string;
}

export const feedbackApi = {
  /**
   * Submit feedback
   */
  async submitFeedback(feedback: Omit<Feedback, 'id' | 'createdAt' | 'status'>): Promise<Feedback> {
    // In production, would save to feedback table
    // For now, return the feedback object
    return {
      ...feedback,
      id: `fb_${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Get user's feedback history
   */
  async getUserFeedback(userId: string): Promise<Feedback[]> {
    // Would query feedback table
    return [];
  },

  /**
   * Submit feature request
   */
  async submitFeatureRequest(
    request: Omit<FeatureRequest, 'id' | 'votes' | 'userVoted' | 'status' | 'createdAt'>
  ): Promise<FeatureRequest> {
    return {
      ...request,
      id: `fr_${Date.now()}`,
      votes: 1,
      userVoted: true,
      status: 'under_review',
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Vote on feature request
   */
  async voteFeatureRequest(featureRequestId: string, userId: string): Promise<void> {
    // Would update votes in feature_requests table
  },

  /**
   * Get popular feature requests
   */
  async getPopularFeatureRequests(limit: number = 10): Promise<FeatureRequest[]> {
    // Would query feature_requests table ordered by votes
    return [];
  },

  /**
   * Create support ticket
   */
  async createSupportTicket(
    ticket: Omit<SupportTicket, 'id' | 'status' | 'createdAt'>
  ): Promise<SupportTicket> {
    return {
      ...ticket,
      id: `ticket_${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Get user's support tickets
   */
  async getUserTickets(userId: string): Promise<SupportTicket[]> {
    return [];
  },
};

