-- =============================================
-- Jharkhand Tourism Database Schema (Supabase Compatible)
-- =============================================

-- Note: Supabase automatically handles JWT secrets and RLS
-- No need to manually set app.jwt_secret

-- =============================================
-- 1. DESTINATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  tagline VARCHAR(500),
  story TEXT,
  image VARCHAR(500),
  best_season VARCHAR(100),
  distance VARCHAR(100),
  location VARCHAR(255),
  activities TEXT[], -- Array of activities
  highlights TEXT[], -- Array of highlights
  video_url VARCHAR(500),
  weather_temperature INTEGER DEFAULT 25,
  weather_humidity INTEGER DEFAULT 60,
  weather_wind_speed INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. USERS TABLE (extends Supabase auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  preferences TEXT[], -- Array of preferences
  verified BOOLEAN DEFAULT FALSE,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. ITINERARIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS itineraries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  days INTEGER NOT NULL,
  budget_range VARCHAR(100),
  group_type VARCHAR(50),
  destination_ids INTEGER[], -- Array of destination IDs (references destinations table)
  destinations TEXT[], -- Array of destination names (for display)
  activities TEXT[], -- Array of activities
  is_public BOOLEAN DEFAULT FALSE,
  start_city VARCHAR(255), -- Starting city for the trip
  start_date DATE, -- Trip start date
  end_date DATE, -- Trip end date
  duration VARCHAR(100), -- e.g., "3 Days / 2 Nights"
  budget VARCHAR(100), -- Budget estimate
  interests TEXT[], -- User interests/preferences
  generated_plan JSONB, -- Full AI-generated itinerary plan
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. MARKETPLACE ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS marketplace_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artisan_name VARCHAR(255) NOT NULL,
  artisan_location VARCHAR(255),
  price VARCHAR(100) NOT NULL,
  image VARCHAR(500),
  story TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0,
  category VARCHAR(100) NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  badge VARCHAR(100),
  in_stock BOOLEAN DEFAULT TRUE,
  contact_info VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. CULTURAL EVENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS cultural_events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(500),
  event_type VARCHAR(100),
  ticket_price VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. RESTAURANTS/EATERIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
  cuisine VARCHAR(100),
  rating DECIMAL(2,1) DEFAULT 0.0,
  price_range VARCHAR(50), -- Budget, Mid-range, Fine dining
  specialties TEXT[], -- Array of specialty dishes
  image VARCHAR(500),
  address VARCHAR(500),
  phone VARCHAR(20),
  hours VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. GUIDES TABLE
-- =============================================
-- 7. GUIDES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS guides (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(500),
  location VARCHAR(255) NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0.0,
  specialties TEXT[], -- Array of specialties
  verified BOOLEAN DEFAULT FALSE,
  price_per_day VARCHAR(100),
  description TEXT,
  contact_info VARCHAR(255),
  languages TEXT[], -- Languages spoken
  experience_years INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 8. REVIEWS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 9. BOOKINGS TABLE (for guides/homestays)
-- =============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  guide_id INTEGER REFERENCES guides(id) ON DELETE CASCADE,
  marketplace_item_id INTEGER REFERENCES marketplace_items(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  duration_days INTEGER DEFAULT 1,
  total_price DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 10. WISHLISTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, destination_id)
);

-- =============================================
-- 11. ANALYTICS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  destination_id INTEGER REFERENCES destinations(id) ON DELETE CASCADE,
  visits_count INTEGER DEFAULT 0,
  bookings_count INTEGER DEFAULT 0,
  rating_average DECIMAL(2,1) DEFAULT 0.0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_destinations_name ON destinations(name);
CREATE INDEX IF NOT EXISTS idx_destinations_location ON destinations(location);
CREATE INDEX IF NOT EXISTS idx_marketplace_category ON marketplace_items(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_verified ON marketplace_items(verified);
CREATE INDEX IF NOT EXISTS idx_reviews_destination ON reviews(destination_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);

-- =============================================
-- CREATE TRIGGERS AFTER ALL TABLES EXIST
-- =============================================
-- Apply triggers to all tables (with DROP IF EXISTS to handle existing triggers)
DO $$
BEGIN
  -- Drop existing triggers if they exist, then create new ones
  DROP TRIGGER IF EXISTS update_destinations_updated_at ON destinations;
  CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON destinations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
  CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_itineraries_updated_at ON itineraries;
  CREATE TRIGGER update_itineraries_updated_at BEFORE UPDATE ON itineraries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_marketplace_items_updated_at ON marketplace_items;
  CREATE TRIGGER update_marketplace_items_updated_at BEFORE UPDATE ON marketplace_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_cultural_events_updated_at ON cultural_events;
  CREATE TRIGGER update_cultural_events_updated_at BEFORE UPDATE ON cultural_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_restaurants_updated_at ON restaurants;
  CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_guides_updated_at ON guides;
  CREATE TRIGGER update_guides_updated_at BEFORE UPDATE ON guides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
  CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
  CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END $$;

-- =============================================
-- ROW LEVEL SECURITY POLICIES (Optional)
-- =============================================
-- Enable RLS on tables where needed
-- ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Example policies (uncomment and modify as needed):
-- CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
-- CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);