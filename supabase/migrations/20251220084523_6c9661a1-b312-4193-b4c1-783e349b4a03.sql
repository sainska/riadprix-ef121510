-- ============================================
-- RIADPRIX MVP DATABASE SCHEMA
-- ============================================

-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('owner', 'manager', 'admin');

-- 2. Create property type enum
CREATE TYPE public.property_type AS ENUM ('riad', 'apartment', 'villa', 'hotel', 'guesthouse', 'other');

-- 3. Create subscription tier enum
CREATE TYPE public.subscription_tier AS ENUM ('starter', 'pro', 'enterprise');

-- ============================================
-- CORE TABLES
-- ============================================

-- User profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  language TEXT DEFAULT 'en',
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'owner',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Markets (cities)
CREATE TABLE public.markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_fr TEXT,
  country TEXT NOT NULL DEFAULT 'Morocco',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Neighborhoods
CREATE TABLE public.neighborhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID NOT NULL REFERENCES public.markets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_fr TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Properties
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  property_type property_type NOT NULL DEFAULT 'riad',
  market_id UUID REFERENCES public.markets(id),
  neighborhood_id UUID REFERENCES public.neighborhoods(id),
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  max_guests INTEGER DEFAULT 2,
  current_price DECIMAL(10, 2),
  currency TEXT DEFAULT 'MAD',
  airbnb_url TEXT,
  booking_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pricing data (historical time-series)
CREATE TABLE public.pricing_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID NOT NULL REFERENCES public.markets(id) ON DELETE CASCADE,
  neighborhood_id UUID REFERENCES public.neighborhoods(id),
  property_type property_type NOT NULL,
  date DATE NOT NULL,
  min_price DECIMAL(10, 2),
  median_price DECIMAL(10, 2),
  max_price DECIMAL(10, 2),
  avg_price DECIMAL(10, 2),
  sample_size INTEGER DEFAULT 0,
  occupancy_rate DECIMAL(5, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Market benchmarks (aggregated stats)
CREATE TABLE public.benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID NOT NULL REFERENCES public.markets(id) ON DELETE CASCADE,
  property_type property_type NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  min_price DECIMAL(10, 2),
  median_price DECIMAL(10, 2),
  max_price DECIMAL(10, 2),
  avg_occupancy DECIMAL(5, 2),
  total_listings INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Price recommendations
CREATE TABLE public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  recommended_price DECIMAL(10, 2) NOT NULL,
  confidence_score DECIMAL(3, 2),
  reasoning TEXT,
  valid_from DATE NOT NULL,
  valid_to DATE NOT NULL,
  is_applied BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Subscriptions
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier subscription_tier NOT NULL DEFAULT 'starter',
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- API ingestion logs
CREATE TABLE public.api_ingestion_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  market_id UUID REFERENCES public.markets(id),
  status TEXT NOT NULL,
  records_processed INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_pricing_data_market_date ON public.pricing_data(market_id, date);
CREATE INDEX idx_pricing_data_property_type ON public.pricing_data(property_type);
CREATE INDEX idx_properties_user ON public.properties(user_id);
CREATE INDEX idx_properties_market ON public.properties(market_id);
CREATE INDEX idx_benchmarks_market ON public.benchmarks(market_id);
CREATE INDEX idx_recommendations_property ON public.recommendations(property_id);
CREATE INDEX idx_neighborhoods_market ON public.neighborhoods(market_id);

-- ============================================
-- SECURITY DEFINER FUNCTION FOR ROLE CHECKS
-- ============================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_ingestion_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User roles policies (users can view their own roles, admins can manage all)
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Markets policies (public read, admin write)
CREATE POLICY "Markets are publicly readable"
  ON public.markets FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage markets"
  ON public.markets FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Neighborhoods policies (public read, admin write)
CREATE POLICY "Neighborhoods are publicly readable"
  ON public.neighborhoods FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage neighborhoods"
  ON public.neighborhoods FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Properties policies
CREATE POLICY "Users can view own properties"
  ON public.properties FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own properties"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own properties"
  ON public.properties FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own properties"
  ON public.properties FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all properties"
  ON public.properties FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Pricing data policies (authenticated users can read)
CREATE POLICY "Authenticated users can view pricing data"
  ON public.pricing_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage pricing data"
  ON public.pricing_data FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Benchmarks policies (authenticated users can read)
CREATE POLICY "Authenticated users can view benchmarks"
  ON public.benchmarks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage benchmarks"
  ON public.benchmarks FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Recommendations policies
CREATE POLICY "Users can view own property recommendations"
  ON public.recommendations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE properties.id = recommendations.property_id 
      AND properties.user_id = auth.uid()
    )
  );

-- Subscriptions policies
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
  ON public.subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- API logs policies (admin only)
CREATE POLICY "Admins can view api logs"
  ON public.api_ingestion_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage api logs"
  ON public.api_ingestion_logs FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile and default role on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  
  -- Assign default 'owner' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'owner');
  
  -- Create starter subscription
  INSERT INTO public.subscriptions (user_id, tier)
  VALUES (NEW.id, 'starter');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SEED DATA: MOROCCAN MARKETS & NEIGHBORHOODS
-- ============================================

INSERT INTO public.markets (name, name_fr, country, latitude, longitude) VALUES
  ('Marrakech', 'Marrakech', 'Morocco', 31.6295, -7.9811),
  ('Fes', 'Fès', 'Morocco', 34.0181, -5.0078),
  ('Casablanca', 'Casablanca', 'Morocco', 33.5731, -7.5898),
  ('Essaouira', 'Essaouira', 'Morocco', 31.5085, -9.7595),
  ('Chefchaouen', 'Chefchaouen', 'Morocco', 35.1688, -5.2636),
  ('Tangier', 'Tanger', 'Morocco', 35.7595, -5.8340);

-- Marrakech neighborhoods
INSERT INTO public.neighborhoods (market_id, name, name_fr)
SELECT id, 'Medina', 'Médina' FROM public.markets WHERE name = 'Marrakech'
UNION ALL
SELECT id, 'Gueliz', 'Guéliz' FROM public.markets WHERE name = 'Marrakech'
UNION ALL
SELECT id, 'Hivernage', 'Hivernage' FROM public.markets WHERE name = 'Marrakech'
UNION ALL
SELECT id, 'Palmeraie', 'Palmeraie' FROM public.markets WHERE name = 'Marrakech';

-- Fes neighborhoods
INSERT INTO public.neighborhoods (market_id, name, name_fr)
SELECT id, 'Fes el-Bali', 'Fès el-Bali' FROM public.markets WHERE name = 'Fes'
UNION ALL
SELECT id, 'Fes el-Jdid', 'Fès el-Jdid' FROM public.markets WHERE name = 'Fes'
UNION ALL
SELECT id, 'Ville Nouvelle', 'Ville Nouvelle' FROM public.markets WHERE name = 'Fes';

-- Casablanca neighborhoods
INSERT INTO public.neighborhoods (market_id, name, name_fr)
SELECT id, 'Anfa', 'Anfa' FROM public.markets WHERE name = 'Casablanca'
UNION ALL
SELECT id, 'Maarif', 'Maârif' FROM public.markets WHERE name = 'Casablanca'
UNION ALL
SELECT id, 'Corniche', 'Corniche' FROM public.markets WHERE name = 'Casablanca';