-- ADDITIONAL FEATURES FOR KISAAN BANDHU

-- 1. Crop Disease Detection Table
CREATE TABLE IF NOT EXISTS disease_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  field_id UUID REFERENCES fields(id),
  image_url TEXT, -- Path to uploaded plant image
  disease_name TEXT,
  confidence DECIMAL(4, 3),
  treatment_advice TEXT,
  status TEXT DEFAULT 'analyzed', -- 'pending', 'analyzed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Weather Alerts Table (External triggers)
CREATE TABLE IF NOT EXISTS weather_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  location_name TEXT,
  alert_type TEXT, -- 'Rain', 'Frost', 'Heatwave', 'Cyclone'
  description TEXT,
  severity TEXT,
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Finance & Government Schemes Table
CREATE TABLE IF NOT EXISTS finance_schemes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  eligibility_criteria TEXT,
  application_link TEXT,
  category TEXT, -- 'Subsidy', 'Loan', 'Insurance'
  state TEXT, -- 'Central', 'Maharashtra', 'Punjab', etc.
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. User Subscriptions to Schemes
CREATE TABLE IF NOT EXISTS user_scheme_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  scheme_id UUID REFERENCES finance_schemes(id),
  status TEXT DEFAULT 'interested', -- 'interested', 'applied', 'approved'
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
