/**
 * System Health & Reliability Module
 * Tracks data ingestion, API health, and system status
 */

import { supabase } from '@/integrations/supabase/client';
import { integrationsApi } from '../integrations/api';

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  services: {
    database: ServiceStatus;
    api: ServiceStatus;
    dataIngestion: ServiceStatus;
  };
  dataFreshness: {
    airdna: DataStatus;
    airbtics: DataStatus;
    booking: DataStatus;
  };
  lastUpdated: string;
}

export interface ServiceStatus {
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  errorRate?: number;
  message?: string;
}

export interface DataStatus {
  status: 'fresh' | 'stale' | 'error';
  lastSync: string;
  ageInHours: number;
  recordsProcessed: number;
  errorMessage?: string;
}

export const systemHealthApi = {
  /**
   * Get overall system health
   */
  async getSystemHealth(): Promise<SystemHealth> {
    // Check data freshness
    const dataFreshness = await integrationsApi.getDataFreshness();

    const airdnaStatus = dataFreshness.find((d) => d.source === 'airdna');
    const airbticsStatus = dataFreshness.find((d) => d.source === 'airbtics');
    const bookingStatus = dataFreshness.find((d) => d.source === 'booking');

    // Check database connectivity
    const dbStatus = await this.checkDatabaseHealth();

    // Determine overall status
    let overallStatus: SystemHealth['status'] = 'healthy';
    if (
      dbStatus.status === 'down' ||
      airdnaStatus?.status === 'error' ||
      airbticsStatus?.status === 'error' ||
      bookingStatus?.status === 'error'
    ) {
      overallStatus = 'down';
    } else if (
      dbStatus.status === 'degraded' ||
      airdnaStatus?.status === 'stale' ||
      airbticsStatus?.status === 'stale'
    ) {
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      services: {
        database: dbStatus,
        api: { status: 'up' }, // Would check API health
        dataIngestion: {
          status:
            airdnaStatus?.status === 'error' || airbticsStatus?.status === 'error' ? 'degraded' : 'up',
        },
      },
      dataFreshness: {
        airdna: this.mapDataStatus(airdnaStatus),
        airbtics: this.mapDataStatus(airbticsStatus),
        booking: this.mapDataStatus(bookingStatus),
      },
      lastUpdated: new Date().toISOString(),
    };
  },

  /**
   * Check database health
   */
  async checkDatabaseHealth(): Promise<ServiceStatus> {
    try {
      const startTime = Date.now();
      const { error } = await supabase.from('markets').select('id').limit(1);
      const responseTime = Date.now() - startTime;

      if (error) {
        return {
          status: 'down',
          message: error.message,
        };
      }

      return {
        status: responseTime > 1000 ? 'degraded' : 'up',
        responseTime,
      };
    } catch (error: any) {
      return {
        status: 'down',
        message: error.message,
      };
    }
  },

  /**
   * Map data freshness to DataStatus
   */
  mapDataStatus(
    freshness: { lastSync: string; dataAge: number; status: string } | undefined
  ): DataStatus {
    if (!freshness) {
      return {
        status: 'error',
        lastSync: new Date(0).toISOString(),
        ageInHours: 999,
        recordsProcessed: 0,
        errorMessage: 'No data available',
      };
    }

    return {
      status: freshness.status as 'fresh' | 'stale' | 'error',
      lastSync: freshness.lastSync,
      ageInHours: freshness.dataAge * 24,
      recordsProcessed: 0, // Would get from sync logs
    };
  },

  /**
   * Get data completeness warnings
   */
  async getDataCompletenessWarnings(): Promise<Array<{ message: string; severity: 'low' | 'medium' | 'high' }>> {
    const warnings: Array<{ message: string; severity: 'low' | 'medium' | 'high' }> = [];

    const freshness = await integrationsApi.getDataFreshness();

    freshness.forEach((source) => {
      if (source.status === 'error') {
        warnings.push({
          message: `${source.source} data sync has failed. Some features may be limited.`,
          severity: 'high',
        });
      } else if (source.dataAge > 14) {
        warnings.push({
          message: `${source.source} data is ${source.dataAge} days old. Consider manual refresh.`,
          severity: source.dataAge > 30 ? 'high' : 'medium',
        });
      }
    });

    return warnings;
  },
};

