-- COMPREHENSIVE SCHEMA FOR KISAAN BANDHU

-- 1. Profiles Table (User management)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  location_lat_long JSONB, -- {lat: 28.6139, lon: 77.2090}
  phone_number TEXT,
  language_preference TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Fields/Farms Table
CREATE TABLE IF NOT EXISTS fields (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  area_size_acres DECIMAL(10, 2),
  coordinates JSONB, -- GeoJSON polygon or center point
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Soil Health Intelligence Table
CREATE TABLE IF NOT EXISTS soil_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  field_id UUID REFERENCES fields(id) ON DELETE CASCADE,
  nitrogen DECIMAL(10, 2),
  phosphorus DECIMAL(10, 2),
  potassium DECIMAL(10, 2),
  ph DECIMAL(3, 1),
  moisture_percentage DECIMAL(5, 2),
  report_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Satellite Crop Monitoring (NDVI) Table
CREATE TABLE IF NOT EXISTS satellite_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  field_id UUID REFERENCES fields(id) ON DELETE CASCADE,
  ndvi_index DECIMAL(4, 3), -- Range 0 to 1
  vegetation_health_status TEXT, -- 'Good', 'Stressed', 'Poor'
  captured_at TIMESTAMP WITH TIME ZONE,
  source TEXT DEFAULT 'ISRO-Sentinel'
);

-- 5. AI Crop Recommendation Table (Output from Agentic AI)
CREATE TABLE IF NOT EXISTS crop_recommendations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  field_id UUID REFERENCES fields(id),
  crop_suggested TEXT NOT NULL,
  confidence DECIMAL(4, 3),
  rationale TEXT, -- Explainable AI advice
  actions JSONB, -- Array of strings/objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Alerts Table (Climate Risk Prediction)
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Knowledge Base Table (For RAG-Based Assistant)
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB, -- Source URL, Category (Govt Scheme, Best Practice)
  embedding VECTOR(1536) -- For OpenAI or similar model embeddings
);

-- SYNC SUPPORT: Automated Updated_At trigger
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_fields_modtime BEFORE UPDATE ON fields FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_alerts_modtime BEFORE UPDATE ON alerts FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- RLS POLICIES (Simplified)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can only access their own fields" ON fields FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own alerts" ON alerts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own recommendations" ON crop_recommendations FOR ALL USING (auth.uid() = user_id);
