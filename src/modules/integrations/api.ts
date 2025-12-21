/**
 * External API Integration Module
 * Handles data ingestion from AirDNA, Airbtics, Booking.com
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export type ApiIngestionLogRow = Tables<'api_ingestion_logs'>;

export type IntegrationSource = 'airdna' | 'airbtics' | 'booking' | 'manual';

export interface SyncStatus {
  source: IntegrationSource;
  status: 'success' | 'error' | 'in_progress';
  recordsProcessed: number;
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
}

export interface DataFreshness {
  source: IntegrationSource;
  lastSync: string;
  dataAge: number; // days
  status: 'fresh' | 'stale' | 'error';
  nextSyncScheduled?: string;
}

export const integrationsApi = {
  /**
   * Sync data from AirDNA
   */
  async syncAirDNA(marketId?: string): Promise<SyncStatus> {
    // This would call backend function or external API
    // For now, placeholder implementation

    const logId = await this.startSyncLog('airdna', marketId);

    try {
      // Placeholder: would make actual API call here
      // const response = await fetch('/api/integrations/airdna/sync', { ... });
      
      // Simulate processing
      const recordsProcessed = 0;

      await this.completeSyncLog(logId, 'success', recordsProcessed);
      
      return {
        source: 'airdna',
        status: 'success',
        recordsProcessed,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      await this.completeSyncLog(logId, 'error', 0, error.message);
      
      return {
        source: 'airdna',
        status: 'error',
        recordsProcessed: 0,
        errorMessage: error.message,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };
    }
  },

  /**
   * Sync data from Airbtics
   */
  async syncAirbtics(marketId?: string): Promise<SyncStatus> {
    const logId = await this.startSyncLog('airbtics', marketId);

    try {
      // Placeholder implementation
      const recordsProcessed = 0;

      await this.completeSyncLog(logId, 'success', recordsProcessed);
      
      return {
        source: 'airbtics',
        status: 'success',
        recordsProcessed,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      await this.completeSyncLog(logId, 'error', 0, error.message);
      
      return {
        source: 'airbtics',
        status: 'error',
        recordsProcessed: 0,
        errorMessage: error.message,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };
    }
  },

  /**
   * Sync data from Booking.com
   */
  async syncBooking(marketId?: string): Promise<SyncStatus> {
    const logId = await this.startSyncLog('booking', marketId);

    try {
      // Placeholder implementation
      const recordsProcessed = 0;

      await this.completeSyncLog(logId, 'success', recordsProcessed);
      
      return {
        source: 'booking',
        status: 'success',
        recordsProcessed,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      await this.completeSyncLog(logId, 'error', 0, error.message);
      
      return {
        source: 'booking',
        status: 'error',
        recordsProcessed: 0,
        errorMessage: error.message,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };
    }
  },

  /**
   * Get sync status for all integrations
   */
  async getSyncStatus(): Promise<SyncStatus[]> {
    const { data, error } = await supabase
      .from('api_ingestion_logs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return (data || []).map((log) => ({
      source: log.source as IntegrationSource,
      status: log.status as 'success' | 'error' | 'in_progress',
      recordsProcessed: log.records_processed || 0,
      errorMessage: log.error_message || undefined,
      startedAt: log.started_at,
      completedAt: log.completed_at || undefined,
    }));
  },

  /**
   * Get data freshness for all sources
   */
  async getDataFreshness(): Promise<DataFreshness[]> {
    const sources: IntegrationSource[] = ['airdna', 'airbtics', 'booking'];
    const freshness: DataFreshness[] = [];

    for (const source of sources) {
      const { data } = await supabase
        .from('api_ingestion_logs')
        .select('completed_at')
        .eq('source', source)
        .eq('status', 'success')
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      if (data && data.completed_at) {
        const lastSync = new Date(data.completed_at);
        const now = new Date();
        const dataAge = Math.floor(
          (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60 * 24)
        );

        freshness.push({
          source,
          lastSync: data.completed_at,
          dataAge,
          status: dataAge < 7 ? 'fresh' : dataAge < 30 ? 'stale' : 'error',
        });
      } else {
        freshness.push({
          source,
          lastSync: new Date(0).toISOString(),
          dataAge: 999,
          status: 'error',
        });
      }
    }

    return freshness;
  },

  /**
   * Start sync log
   */
  async startSyncLog(
    source: IntegrationSource,
    marketId?: string
  ): Promise<string> {
    const { data, error } = await supabase
      .from('api_ingestion_logs')
      .insert({
        source,
        market_id: marketId || null,
        status: 'in_progress',
        records_processed: 0,
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  },

  /**
   * Complete sync log
   */
  async completeSyncLog(
    logId: string,
    status: 'success' | 'error',
    recordsProcessed: number,
    errorMessage?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('api_ingestion_logs')
      .update({
        status,
        records_processed: recordsProcessed,
        error_message: errorMessage || null,
        completed_at: new Date().toISOString(),
      })
      .eq('id', logId);

    if (error) throw error;
  },

  /**
   * Get sync logs
   */
  async getSyncLogs(limit: number = 50): Promise<ApiIngestionLogRow[]> {
    const { data, error } = await supabase
      .from('api_ingestion_logs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as ApiIngestionLogRow[];
  },
};

