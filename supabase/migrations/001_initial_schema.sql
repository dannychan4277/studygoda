-- CampusFee Supabase Schema
-- D3: programs, city_guides, lazy_packs, testimonials, leads

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- programs — language school / course listings
-- ============================================================
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Philippines',
  city TEXT NOT NULL,
  course_type TEXT NOT NULL,
  weekly_fee_usd NUMERIC NOT NULL,
  min_weeks INTEGER DEFAULT 1,
  max_weeks INTEGER DEFAULT 24,
  accommodation TEXT,
  facilities TEXT[] DEFAULT '{}',
  google_rating NUMERIC DEFAULT 0,
  photo_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- city_guides — city living cost data
-- ============================================================
CREATE TABLE city_guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city TEXT UNIQUE NOT NULL,
  country TEXT NOT NULL DEFAULT 'Philippines',
  weekly_food_usd NUMERIC NOT NULL,
  weekly_transport_usd NUMERIC NOT NULL,
  weekly_misc_usd NUMERIC NOT NULL,
  flight_twd_min INTEGER,
  flight_twd_max INTEGER,
  notes TEXT
);

-- ============================================================
-- lazy_packs — curated study abroad packages
-- ============================================================
CREATE TABLE lazy_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  price_twd INTEGER NOT NULL,
  weeks INTEGER NOT NULL DEFAULT 4,
  tags TEXT[] DEFAULT '{}',
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- testimonials — PTT/Dcard review quotes
-- ============================================================
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  source TEXT NOT NULL,
  source_url TEXT,
  quote TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- leads — inquiry form submissions
-- ============================================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  preferred_weeks INTEGER NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- RLS Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE lazy_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Public read for content tables
CREATE POLICY "Public read programs" ON programs FOR SELECT USING (true);
CREATE POLICY "Public read city_guides" ON city_guides FOR SELECT USING (true);
CREATE POLICY "Public read lazy_packs" ON lazy_packs FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);

-- Leads: insert-only for anonymous
CREATE POLICY "Insert leads" ON leads FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX idx_programs_city ON programs(city);
CREATE INDEX idx_programs_country ON programs(country);
CREATE INDEX idx_programs_course_type ON programs(course_type);
CREATE INDEX idx_programs_slug ON programs(slug);
CREATE INDEX idx_lazy_packs_program_id ON lazy_packs(program_id);
CREATE INDEX idx_testimonials_program_id ON testimonials(program_id);
CREATE INDEX idx_leads_email_program ON leads(email, program_id);
