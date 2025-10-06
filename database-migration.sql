/*
  # Real Estate Database Schema Migration

  Run this SQL in your Supabase SQL Editor when the service becomes available.

  ## What this creates:
  - Properties table with sample data
  - Chat history table
  - User profiles table
  - Row Level Security policies
  - Performance indexes
*/

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  location text NOT NULL,
  area text NOT NULL,
  bedrooms integer NOT NULL DEFAULT 0,
  bathrooms integer NOT NULL DEFAULT 0,
  sqft integer NOT NULL DEFAULT 0,
  property_type text NOT NULL DEFAULT 'house',
  status text NOT NULL DEFAULT 'available',
  amenities text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat history table
CREATE TABLE IF NOT EXISTS chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  message text NOT NULL,
  response text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Properties policies (public read, authenticated write)
CREATE POLICY "Properties are viewable by everyone"
  ON properties FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update properties"
  ON properties FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Chat history policies
CREATE POLICY "Users can view their own chat history"
  ON chat_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert chat messages"
  ON chat_history FOR INSERT
  TO public
  WITH CHECK (true);

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_area ON properties(area);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_chat_history_user ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created ON chat_history(created_at);

-- Insert sample properties
INSERT INTO properties (title, description, price, location, area, bedrooms, bathrooms, sqft, property_type, status, amenities, images, featured) VALUES
('Modern Downtown Apartment', 'Stunning modern apartment in the heart of downtown with panoramic city views. Features high-end finishes, smart home technology, and premium appliances.', 850000, '123 Main St, Downtown', 'Downtown', 2, 2, 1200, 'apartment', 'available', ARRAY['Pool', 'Gym', 'Parking', 'Security', 'Balcony', 'Smart Home'], ARRAY['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'], true),
('Luxury Villa with Ocean View', 'Spectacular luxury villa featuring breathtaking ocean views, infinity pool, and private beach access. Perfect for those seeking the ultimate coastal lifestyle.', 2500000, '456 Ocean Drive, Coastal Area', 'Coastal Area', 5, 4, 4500, 'house', 'available', ARRAY['Ocean View', 'Pool', 'Garden', 'Private Beach', 'Wine Cellar', 'Home Theater'], ARRAY['https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg', 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'], true),
('Cozy Suburban Home', 'Charming family home in quiet suburban neighborhood. Large backyard, updated kitchen, and close to top-rated schools.', 650000, '789 Maple Avenue, Suburbs', 'Suburbs', 4, 3, 2800, 'house', 'available', ARRAY['Garden', 'Garage', 'Fireplace', 'Updated Kitchen'], ARRAY['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg', 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'], false),
('Penthouse Suite', 'Exclusive penthouse suite with 360-degree city views. Features luxury amenities, private elevator, and rooftop terrace.', 3200000, '321 Sky Tower, Financial District', 'Financial District', 3, 3, 3500, 'apartment', 'available', ARRAY['Rooftop Terrace', 'Private Elevator', 'Concierge', 'Gym', 'Spa', 'Wine Storage'], ARRAY['https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg', 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg'], true),
('Historic Townhouse', 'Beautiful historic townhouse with modern renovations. Original features preserved with contemporary comforts added.', 1100000, '555 Heritage Lane, Old Town', 'Old Town', 3, 2, 2200, 'townhouse', 'available', ARRAY['Historic Features', 'Renovated Kitchen', 'Hardwood Floors', 'Fireplace'], ARRAY['https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg', 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg'], false),
('Modern Condo with Amenities', 'Contemporary condo in luxury building with resort-style amenities. Move-in ready with designer finishes.', 720000, '888 Park Place, Midtown', 'Midtown', 2, 2, 1400, 'condo', 'available', ARRAY['Pool', 'Gym', 'Parking', 'Concierge', 'Pet Friendly'], ARRAY['https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg', 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg'], false)
ON CONFLICT DO NOTHING;
