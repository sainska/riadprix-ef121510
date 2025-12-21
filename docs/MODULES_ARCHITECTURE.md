# 🧩 RiadPrix - Complete Module Architecture

## Module Structure Overview

This document outlines all modules, sub-modules, and their implementations in the RiadPrix platform.

---

## 1️⃣ **User & Access Management Module**

### Status: ✅ Partially Implemented
### Location: `src/modules/auth/`, `src/contexts/AuthContext.tsx`

#### Sub-Modules:
- ✅ **User Registration** - `/auth` page
- ✅ **Login / Logout** - `/auth` page, Header component
- ✅ **Password Reset** - `/auth/reset-password` page
- ✅ **Passwordless Login** - Magic link support in Auth page
- ✅ **Role Management** - `user_roles` table, `/role-management` page
- ✅ **Session Management** - Supabase Auth integration
- ⚠️ **Multi-property access control** - Needs implementation
- ⚠️ **2FA (Two-Factor Authentication)** - Future enhancement

### API Endpoints:
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/reset-password`
- `GET /auth/session`
- `GET /auth/user-roles`
- `PUT /auth/user-roles/:id`

### Database Tables:
- `auth.users` (Supabase managed)
- `profiles`
- `user_roles`

---

## 2️⃣ **Subscription & Billing Module**

### Status: ⚠️ Needs Implementation
### Location: `src/modules/billing/`

#### Sub-Modules:
- ⚠️ **Plan management** - Starter/Pro/Enterprise
- ⚠️ **Usage limits** - Markets, properties, exports tracking
- ⚠️ **Subscription lifecycle** - Trial, active, paused, canceled
- ⚠️ **Invoices & receipts** - PDF generation, storage
- ⚠️ **Payment provider integration** - Stripe integration
- ⚠️ **Coupon & discounts** - Early adopter codes

### API Endpoints:
- `GET /billing/subscription`
- `PUT /billing/subscription`
- `POST /billing/upgrade`
- `POST /billing/downgrade`
- `GET /billing/invoices`
- `GET /billing/usage`
- `POST /billing/webhook/stripe`

### Database Tables:
- `subscriptions`
- `invoices`
- `usage_tracking`
- `coupons`

---

## 3️⃣ **Property Management Module**

### Status: ✅ Implemented
### Location: `src/pages/Properties.tsx`, `src/components/properties/`

#### Sub-Modules:
- ✅ **Add/Edit/Delete property** - Full CRUD in Properties page
- ✅ **Property type classification** - Enum: riad, apartment, villa, hotel, guesthouse
- ✅ **Location mapping** - City, neighborhood, geo-coordinates
- ✅ **Property performance overview** - Dashboard integration
- ⚠️ **Multi-listing grouping** - Needs implementation
- ⚠️ **Property tagging** - Luxury, budget, family tags

### API Endpoints:
- `GET /properties`
- `GET /properties/:id`
- `POST /properties`
- `PUT /properties/:id`
- `DELETE /properties/:id`
- `GET /properties/:id/performance`

### Database Tables:
- `properties`
- `property_tags` (future)

---

## 4️⃣ **Market & Location Intelligence Module**

### Status: ✅ Partially Implemented
### Location: `src/pages/Markets.tsx`, `src/components/dashboard/`

#### Sub-Modules:
- ✅ **City-level analytics** - Markets page
- ✅ **Neighborhood benchmarking** - Database structure exists
- ✅ **Property-type segmentation** - Filtering implemented
- ⚠️ **Competitor density analysis** - Needs calculation logic
- ⚠️ **Supply vs demand indicators** - Needs data aggregation
- ⚠️ **Market saturation score** - Needs algorithm

### API Endpoints:
- `GET /markets`
- `GET /markets/:id`
- `GET /markets/:id/analytics`
- `GET /markets/:id/neighborhoods`
- `GET /markets/:id/competitor-density`
- `GET /markets/:id/saturation-score`

### Database Tables:
- `markets`
- `neighborhoods`
- `market_analytics` (future)

---

## 5️⃣ **Pricing Benchmarking Engine Module**

### Status: ✅ Implemented
### Location: `src/components/dashboard/PriceBenchmark.tsx`, `src/lib/api.ts`

#### Sub-Modules:
- ✅ **Min / Median / Max calculations** - PriceBenchmark component
- ✅ **Price percentile ranking** - Basic implementation
- ⚠️ **Competitive positioning score** - Needs algorithm
- ⚠️ **Similar property clustering** - Needs ML/model
- ✅ **Dynamic date range comparisons** - Dashboard filters
- ⚠️ **Currency normalization** - Needs implementation

### API Endpoints:
- `GET /benchmarks`
- `GET /benchmarks/:propertyType`
- `GET /benchmarks/percentiles`
- `GET /benchmarks/positioning-score`
- `GET /benchmarks/similar-properties`

### Database Tables:
- `price_benchmarks`
- `price_history`

---

## 6️⃣ **Seasonality & Trend Analysis Module**

### Status: ✅ Implemented
### Location: `src/components/dashboard/SeasonalityChart.tsx`

#### Sub-Modules:
- ✅ **Weekly / monthly seasonality curves** - SeasonalityChart component
- ⚠️ **Event-driven demand spikes** - Needs event data integration
- ⚠️ **Year-over-year comparisons** - Needs historical data
- ⚠️ **Occupancy trend modeling** - Needs occupancy data
- ⚠️ **Lead time demand analysis** - Needs booking data

### API Endpoints:
- `GET /analytics/seasonality`
- `GET /analytics/trends`
- `GET /analytics/yoy-comparison`
- `GET /analytics/occupancy-trends`
- `GET /analytics/lead-time-analysis`

### Database Tables:
- `seasonality_data`
- `trend_analysis`
- `event_calendar` (future)

---

## 7️⃣ **Pricing Recommendation Engine Module**

### Status: ⚠️ Needs Implementation
### Location: `src/modules/recommendations/`

#### Sub-Modules:
- ⚠️ **Suggested base price** - Algorithm needed
- ⚠️ **Weekend vs weekday pricing** - Logic needed
- ⚠️ **High-season vs low-season pricing** - Seasonality integration
- ⚠️ **Price floor & ceiling logic** - Business rules needed
- ⚠️ **Competitive under/over-pricing alerts** - Alert system needed
- ⚠️ **Risk-based pricing suggestions** - ML model needed

### API Endpoints:
- `GET /recommendations/:propertyId`
- `POST /recommendations/calculate`
- `GET /recommendations/alerts`
- `PUT /recommendations/:id/apply`

### Database Tables:
- `price_recommendations`
- `recommendation_history`
- `pricing_alerts`

---

## 8️⃣ **Competitor Intelligence Module**

### Status: ⚠️ Needs Implementation
### Location: `src/modules/competitors/`

#### Sub-Modules:
- ⚠️ **Similar listing identification** - ML/clustering needed
- ⚠️ **Price movement tracking** - Time-series tracking needed
- ⚠️ **Availability changes** - Web scraping/integration needed
- ⚠️ **New competitor alerts** - Monitoring system needed
- ⚠️ **Competitor pricing heatmaps** - Visualization needed

### API Endpoints:
- `GET /competitors/:propertyId`
- `GET /competitors/:propertyId/similar`
- `GET /competitors/:propertyId/price-movements`
- `GET /competitors/heatmap`

### Database Tables:
- `competitors`
- `competitor_listings`
- `competitor_price_history`

---

## 9️⃣ **Dashboard & Visualization Module**

### Status: ✅ Implemented
### Location: `src/pages/Dashboard.tsx`, `src/components/dashboard/`

#### Sub-Modules:
- ✅ **Interactive charts** - SeasonalityChart, various visualizations
- ✅ **KPI tiles** - QuickStats, MetricCard components
- ✅ **Real-time refresh** - React Query integration
- ✅ **Filterable dashboards** - CitySelector, PropertyTypeFilter
- ⚠️ **Saved dashboard views** - Needs implementation
- ⚠️ **Exportable widgets** - Partial (ExportPanel exists)

### API Endpoints:
- `GET /dashboard`
- `GET /dashboard/kpis`
- `POST /dashboard/views` (save view)
- `GET /dashboard/views`
- `DELETE /dashboard/views/:id`

### Database Tables:
- `dashboard_views` (future)

---

## 🔟 **Reporting & Export Module**

### Status: ✅ Partially Implemented
### Location: `src/pages/Reports.tsx`, `src/pages/ReportExport.tsx`, `src/lib/export.ts`

#### Sub-Modules:
- ✅ **CSV export** - `export.ts` utility
- ✅ **PDF reports** - Browser print dialog
- ⚠️ **Scheduled email reports** - Needs backend cron job
- ⚠️ **Custom report builder** - Needs UI builder
- ⚠️ **Branded reports** - Logo, colors customization

### API Endpoints:
- `GET /reports`
- `POST /reports/generate`
- `GET /reports/:id/download`
- `POST /reports/schedule`
- `GET /reports/scheduled`

### Database Tables:
- `reports`
- `report_schedules`

---

## 1️⃣1️⃣ **API & Data Integration Module**

### Status: ⚠️ Structure Created
### Location: `src/lib/api-external.ts`

#### Sub-Modules:
- ⚠️ **AirDNA data ingestion** - Placeholder exists
- ⚠️ **Airbtics data ingestion** - Placeholder exists
- ⚠️ **Booking.com data ingestion** - Placeholder exists
- ⚠️ **Data normalization & cleaning** - Needs implementation
- ⚠️ **API error handling** - Basic structure exists
- ⚠️ **Data freshness monitoring** - Needs monitoring system

### API Endpoints:
- `POST /integrations/airdna/sync`
- `POST /integrations/airbtics/sync`
- `POST /integrations/booking/sync`
- `GET /integrations/status`
- `GET /integrations/data-freshness`

### Database Tables:
- `data_sync_logs`
- `external_api_configs`

---

## 1️⃣2️⃣ **Data Storage & Analytics Module**

### Status: ✅ Basic Implementation
### Location: Database schema, `src/lib/api.ts`

#### Sub-Modules:
- ✅ **Historical pricing storage** - `price_history` table structure
- ⚠️ **Time-series analytics** - Needs ClickHouse integration (future)
- ⚠️ **Market snapshots** - Needs snapshot system
- ⚠️ **Data versioning** - Needs versioning system
- ⚠️ **Audit logs** - Needs audit table

### API Endpoints:
- `GET /data/history/:propertyId`
- `GET /data/snapshots`
- `POST /data/snapshots/create`
- `GET /data/audit-logs`

### Database Tables:
- `price_history`
- `market_snapshots`
- `audit_logs`

---

## 1️⃣3️⃣ **Alerts & Notifications Module**

### Status: ✅ Partially Implemented
### Location: `src/pages/Notifications.tsx`, `src/components/notifications/`

#### Sub-Modules:
- ⚠️ **Price change alerts** - Needs alert rules engine
- ⚠️ **Market trend alerts** - Needs trend detection
- ⚠️ **Competitor undercut alerts** - Needs competitor monitoring
- ✅ **Email notifications** - Basic structure exists
- ✅ **In-app notifications** - NotificationCenter component exists

### API Endpoints:
- `GET /notifications`
- `POST /notifications`
- `PUT /notifications/:id/read`
- `DELETE /notifications/:id`
- `GET /notifications/preferences`
- `PUT /notifications/preferences`
- `POST /notifications/rules`

### Database Tables:
- `notifications`
- `notification_preferences`
- `alert_rules`

---

## 1️⃣4️⃣ **Localization & UX Module**

### Status: ✅ Implemented
### Location: `src/contexts/LanguageContext.tsx`, `src/contexts/ThemeContext.tsx`

#### Sub-Modules:
- ✅ **Multi-language support** - EN/FR implemented
- ⚠️ **Arabic (AR) support** - Needs translation files
- ⚠️ **Currency switching** - Needs implementation
- ✅ **Light/Dark mode** - ThemeContext implemented
- ⚠️ **Accessibility support** - Needs audit & improvements
- ✅ **Responsive design** - Tailwind responsive classes

### Configuration:
- Language files: `src/locales/`
- Theme: `src/contexts/ThemeContext.tsx`
- Currency: Future module

---

## 1️⃣5️⃣ **Admin & Backoffice Module**

### Status: ✅ Partially Implemented
### Location: `src/pages/AdminDashboard.tsx`, `src/pages/RoleManagement.tsx`

#### Sub-Modules:
- ✅ **User management** - AdminDashboard has placeholder
- ⚠️ **Market data management** - Needs admin interface
- ⚠️ **API usage monitoring** - Needs analytics dashboard
- ⚠️ **Feature toggles** - Needs feature flag system
- ⚠️ **System health dashboard** - Needs monitoring integration

### API Endpoints:
- `GET /admin/users`
- `PUT /admin/users/:id`
- `DELETE /admin/users/:id`
- `GET /admin/api-usage`
- `GET /admin/system-health`
- `PUT /admin/feature-flags`

---

## 1️⃣6️⃣ **Monitoring & Reliability Module**

### Status: ✅ Basic Implementation
### Location: `src/lib/monitoring.ts`, `src/components/ErrorBoundary.tsx`

#### Sub-Modules:
- ✅ **Error tracking** - ErrorBoundary, monitoring.ts
- ⚠️ **Performance monitoring** - Needs integration (Sentry, etc.)
- ⚠️ **API latency tracking** - Needs middleware
- ⚠️ **Alerting system** - Needs alerting infrastructure
- ⚠️ **Backup & recovery** - Database level (Supabase managed)

### Integration Points:
- Error logging: `src/lib/monitoring.ts`
- Error UI: `src/components/ErrorBoundary.tsx`
- Future: Sentry, DataDog, etc.

---

## 1️⃣7️⃣ **AI & Advanced Intelligence (Phase 2+)**

### Status: ⚠️ Future Enhancement
### Location: `src/modules/ai/` (to be created)

#### Sub-Modules:
- ⚠️ **Predictive pricing** - ML model needed
- ⚠️ **Revenue uplift estimation** - Algorithm needed
- ⚠️ **What-if pricing scenarios** - Simulation engine needed
- ⚠️ **Automated strategy suggestions** - Decision engine needed
- ⚠️ **AI chat assistant** - LLM integration needed

---

## 1️⃣8️⃣ **Integrations & Automation (Future)**

### Status: ⚠️ Future Enhancement
### Location: `src/modules/integrations/` (to be created)

#### Sub-Modules:
- ⚠️ **PMS integrations** - Property Management Systems
- ⚠️ **Channel manager sync** - Booking sync
- ⚠️ **Calendar sync** - iCal integration
- ⚠️ **Webhooks** - Event publishing
- ⚠️ **Zapier / Make integration** - No-code automation

---

## 1️⃣9️⃣ **Compliance & Trust Module**

### Status: ✅ Partially Implemented
### Location: `src/pages/PrivacyPolicy.tsx`, `src/pages/TermsOfService.tsx`, `src/pages/Cookies.tsx`

#### Sub-Modules:
- ⚠️ **Data provider attribution** - Needs UI implementation
- ⚠️ **GDPR compliance tools** - Needs privacy controls
- ✅ **Consent management** - Cookies page exists
- ⚠️ **Data anonymization** - Needs implementation
- ✅ **Legal disclaimers** - Privacy & Terms pages exist

---

## 📊 Implementation Status Summary

- ✅ **Fully Implemented**: 5 modules
- ⚠️ **Partially Implemented**: 8 modules
- ⚠️ **Needs Implementation**: 6 modules

## 🎯 MVP Priority Modules

For MVP launch, focus on:
1. User & Access Management ✅
2. Property Management ✅
3. Market Intelligence ✅
4. Pricing Benchmarking ✅
5. Dashboard ✅
6. Reporting (Basic) ✅
7. API Integration (Structure) ⚠️

## 📝 Next Steps

1. Complete billing/subscription module
2. Implement pricing recommendations engine
3. Build competitor intelligence tracking
4. Enhance notification/alert system
5. Add scheduled report functionality
6. Integrate external APIs (AirDNA, etc.)

