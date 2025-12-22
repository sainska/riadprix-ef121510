/**
 * Module Exports
 * Central export point for all RiadPrix modules
 */

// Billing & Subscription
export { billingApi } from './billing/api';
export type { SubscriptionStatus, UsageLimits, CurrentUsage, Invoice } from './billing/api';

// Recommendations
export { recommendationsApi } from './recommendations/api';

// Competitors
export { competitorsApi } from './competitors/api';
export type { SimilarListing, CompetitorPriceMovement, CompetitorHeatmapData } from './competitors/api';

// Alerts & Notifications
export { alertsApi } from './alerts/api';
export type { AlertRule, Notification, AlertType } from './alerts/api';

// Integrations
export { integrationsApi } from './integrations/api';
export type { SyncStatus, IntegrationSource } from './integrations/api';
export type { DataFreshness as IntegrationDataFreshness } from './integrations/api';

// Data Trust & Attribution
export { dataTrustApi } from './data-trust/api';
export type { DataSourceAttribution, DataConfidenceScore, CoverageDisclaimer } from './data-trust/api';
export type { DataFreshness } from './data-trust/api';

// Market Coverage
export { marketCoverageApi } from './market-coverage/api';

// Property Matching
export { propertyMatchingApi } from './property-matching/api';

// Market Positioning
export { marketPositioningApi } from './market-positioning/api';

// Revenue Impact
export { revenueImpactApi } from './revenue-impact/api';
export type { RevenueImpact, PriceChangeSimulation } from './revenue-impact/api';

// Onboarding
export { onboardingApi } from './onboarding/api';

// Manual Control
export { manualControlApi } from './manual-control/api';

// Historical Comparison
export { historicalComparisonApi } from './historical-comparison/api';
export type { HistoricalComparison, YearOverYearComparison, PercentileShift } from './historical-comparison/api';

// Local Intelligence
export { localIntelligenceApi } from './local-intelligence/api';

// Account Health
export { accountHealthApi } from './account-health/api';

// Feedback
export { feedbackApi } from './feedback/api';

// System Health
export { systemHealthApi } from './system-health/api';
