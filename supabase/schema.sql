-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Characters table
CREATE TABLE IF NOT EXISTS characters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  faction TEXT NOT NULL,
  wiki_link TEXT,
  
  -- Elo Ratings
  overall_elo INTEGER DEFAULT 1200,
  hand_to_hand_elo INTEGER DEFAULT 1200,
  bladed_weapons_elo INTEGER DEFAULT 1200,
  firearms_elo INTEGER DEFAULT 1200,
  battle_iq_elo INTEGER DEFAULT 1200,
  physical_stats_elo INTEGER DEFAULT 1200,
  speed_elo INTEGER DEFAULT 1200,
  durability_elo INTEGER DEFAULT 1200,
  stamina_elo INTEGER DEFAULT 1200,
  assassination_elo INTEGER DEFAULT 1200,
  
  -- Stats
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Match history table
CREATE TABLE IF NOT EXISTS match_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  opponent_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  opponent_name TEXT NOT NULL,
  result TEXT NOT NULL CHECK (result IN ('WIN', 'LOSS')),
  elo_change INTEGER NOT NULL,
  scenario_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization metadata table
CREATE TABLE IF NOT EXISTS organization_metadata (
  faction TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_characters_faction ON characters(faction);
CREATE INDEX IF NOT EXISTS idx_characters_overall_elo ON characters(overall_elo DESC);
CREATE INDEX IF NOT EXISTS idx_match_history_character_id ON match_history(character_id);
CREATE INDEX IF NOT EXISTS idx_match_history_created_at ON match_history(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_org_metadata_updated_at BEFORE UPDATE ON organization_metadata
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - Allow public read, but restrict writes
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_metadata ENABLE ROW LEVEL SECURITY;

-- Policies: Allow everyone to read, but only authenticated users to write
-- For now, we'll allow anonymous writes (you can restrict this later)
CREATE POLICY "Allow public read access" ON characters
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON characters
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON characters
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON characters
    FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON match_history
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON match_history
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access" ON organization_metadata
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON organization_metadata
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON organization_metadata
    FOR UPDATE USING (true);

