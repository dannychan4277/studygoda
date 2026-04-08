-- ============================================================
-- 002: US Language Schools schema
-- Creates normalized tables for schools, courses, cities,
-- exchange rates, and quiz results
-- ============================================================

-- ============================================================
-- cities — city-level cost & environment data
-- ============================================================
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  name_zh TEXT,
  country TEXT NOT NULL DEFAULT 'USA',
  climate TEXT,
  -- Accommodation
  homestay_weekly NUMERIC DEFAULT 0,
  homestay_includes TEXT,
  monthly_rent_single NUMERIC DEFAULT 0,
  monthly_rent_shared NUMERIC DEFAULT 0,
  -- Living expenses (monthly USD)
  monthly_food NUMERIC DEFAULT 0,
  monthly_transport NUMERIC DEFAULT 0,
  monthly_misc NUMERIC DEFAULT 0,
  monthly_insurance NUMERIC DEFAULT 0,
  -- Flight estimates (TWD, from Taipei)
  flight_twd_min INTEGER DEFAULT 0,
  flight_twd_max INTEGER DEFAULT 0,
  -- Visa
  visa_fee_local NUMERIC DEFAULT 0,
  visa_type TEXT,
  visa_note TEXT,
  local_currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- schools — language school listings
-- ============================================================
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'USA',
  brand TEXT,
  photo_url TEXT,
  popularity_score NUMERIC DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  accommodation_types TEXT[] DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- courses — per-school course offerings
-- ============================================================
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  course_type TEXT NOT NULL,
  price_per_week_usd NUMERIC NOT NULL,
  registration_fee NUMERIC DEFAULT 0,
  material_fee NUMERIC DEFAULT 0,
  min_weeks INTEGER DEFAULT 1,
  max_weeks INTEGER DEFAULT 52,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- exchange_rates — currency conversion rates
-- ============================================================
CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  base_currency TEXT NOT NULL,
  target_currency TEXT NOT NULL,
  rate NUMERIC NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(base_currency, target_currency)
);

-- ============================================================
-- quiz_results — matching quiz session data
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  budget_range TEXT,
  duration TEXT,
  goal TEXT,
  city_preference TEXT,
  climate_preference TEXT,
  country_preference TEXT[] DEFAULT '{}',
  recommended_schools UUID[] DEFAULT '{}',
  recommended_json JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- RLS Policies
-- ============================================================
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Public read for content tables
CREATE POLICY "Public read cities" ON cities FOR SELECT USING (true);
CREATE POLICY "Public read schools" ON schools FOR SELECT USING (true);
CREATE POLICY "Public read courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Public read exchange_rates" ON exchange_rates FOR SELECT USING (true);

-- Quiz results: insert-only for anonymous
CREATE POLICY "Insert quiz_results" ON quiz_results FOR INSERT WITH CHECK (true);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_schools_city ON schools(city);
CREATE INDEX idx_schools_country ON schools(country);
CREATE INDEX idx_schools_slug ON schools(slug);
CREATE INDEX idx_schools_brand ON schools(brand);
CREATE INDEX idx_courses_school_id ON courses(school_id);
CREATE INDEX idx_courses_course_type ON courses(course_type);
CREATE INDEX idx_cities_country ON cities(country);
CREATE INDEX idx_exchange_rates_pair ON exchange_rates(base_currency, target_currency);
