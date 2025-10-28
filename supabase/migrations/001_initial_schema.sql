-- Initial schema for Matsya Ocean Insights platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Species table for marine species data
CREATE TABLE species (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scientific_name TEXT NOT NULL,
    common_name TEXT,
    kingdom TEXT,
    phylum TEXT,
    class TEXT,
    order_name TEXT,
    family TEXT,
    genus TEXT,
    species_name TEXT,
    authority TEXT,
    year_described INTEGER,
    conservation_status TEXT,
    habitat TEXT,
    distribution TEXT,
    depth_range TEXT,
    length_max DECIMAL,
    weight_max DECIMAL,
    obis_id TEXT,
    gbif_id TEXT,
    fishbase_id TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- eDNA samples table
CREATE TABLE edna_samples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sample_id TEXT UNIQUE NOT NULL,
    location_name TEXT NOT NULL,
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL,
    collection_date DATE NOT NULL,
    depth_meters DECIMAL,
    temperature_celsius DECIMAL,
    salinity DECIMAL,
    ph_level DECIMAL,
    species_detected INTEGER DEFAULT 0,
    total_sequences INTEGER DEFAULT 0,
    diversity_index DECIMAL,
    status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'processed', 'failed')),
    file_path TEXT,
    file_size BIGINT,
    file_type TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DNA sequences table
CREATE TABLE dna_sequences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    edna_sample_id UUID REFERENCES edna_samples(id) ON DELETE CASCADE,
    sequence_name TEXT NOT NULL,
    sequence_data TEXT NOT NULL,
    sequence_length INTEGER NOT NULL,
    gene_marker TEXT, -- COI, 16S, 18S, 12S, etc.
    quality_score DECIMAL,
    blast_results JSONB,
    species_matches JSONB,
    best_match_species TEXT,
    best_match_confidence DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analyses table for storing analysis results
CREATE TABLE analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'biodiversity', 'correlation', 'classification', etc.
    description TEXT,
    parameters JSONB,
    results JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    progress INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- User profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    institution TEXT,
    role TEXT DEFAULT 'researcher', -- 'researcher', 'student', 'educator', 'admin'
    bio TEXT,
    avatar_url TEXT,
    location TEXT,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Research projects table
CREATE TABLE research_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    start_date DATE,
    end_date DATE,
    location_name TEXT,
    bounding_box JSONB, -- Geographic bounds
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project members (many-to-many relationship)
CREATE TABLE project_members (
    project_id UUID REFERENCES research_projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (project_id, user_id)
);

-- Indexes for better performance
CREATE INDEX idx_species_scientific_name ON species(scientific_name);
CREATE INDEX idx_species_location ON species(latitude, longitude);
CREATE INDEX idx_edna_samples_location ON edna_samples(latitude, longitude);
CREATE INDEX idx_edna_samples_date ON edna_samples(collection_date);
CREATE INDEX idx_edna_samples_status ON edna_samples(status);
CREATE INDEX idx_dna_sequences_sample ON dna_sequences(edna_sample_id);
CREATE INDEX idx_dna_sequences_gene_marker ON dna_sequences(gene_marker);
CREATE INDEX idx_analyses_user ON analyses(created_by);
CREATE INDEX idx_analyses_status ON analyses(status);

-- Row Level Security (RLS) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE edna_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE dna_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view all profiles" ON user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for edna_samples
CREATE POLICY "Users can view all samples" ON edna_samples
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own samples" ON edna_samples
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own samples" ON edna_samples
    FOR UPDATE USING (auth.uid() = created_by);

-- Policies for analyses
CREATE POLICY "Users can view all analyses" ON analyses
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own analyses" ON analyses
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own analyses" ON analyses
    FOR UPDATE USING (auth.uid() = created_by);

-- Functions and triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_species_updated_at BEFORE UPDATE ON species
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_edna_samples_updated_at BEFORE UPDATE ON edna_samples
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_research_projects_updated_at BEFORE UPDATE ON research_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO species (scientific_name, common_name, kingdom, phylum, class, order_name, family, genus, species_name, conservation_status, habitat, latitude, longitude, image_url) VALUES
('Epinephelus marginatus', 'Dusky Grouper', 'Animalia', 'Chordata', 'Actinopterygii', 'Perciformes', 'Serranidae', 'Epinephelus', 'marginatus', 'Vulnerable', 'Rocky reefs, 20-200m depth', 35.5, 14.2, 'https://example.com/dusky-grouper.jpg'),
('Thunnus albacares', 'Yellowfin Tuna', 'Animalia', 'Chordata', 'Actinopterygii', 'Perciformes', 'Scombridae', 'Thunnus', 'albacares', 'Near Threatened', 'Pelagic, tropical and subtropical waters', 0.0, 0.0, 'https://example.com/yellowfin-tuna.jpg'),
('Serranus scriba', 'Painted Comber', 'Animalia', 'Chordata', 'Actinopterygii', 'Perciformes', 'Serranidae', 'Serranus', 'scriba', 'Least Concern', 'Rocky bottoms, 5-150m depth', 42.3, 3.2, 'https://example.com/painted-comber.jpg'),
('Hippocampus hippocampus', 'Short-snouted Seahorse', 'Animalia', 'Chordata', 'Actinopterygii', 'Syngnathiformes', 'Syngnathidae', 'Hippocampus', 'hippocampus', 'Data Deficient', 'Seagrass beds and algae', 36.8, 10.2, 'https://example.com/seahorse.jpg'),
('Scyliorhinus canicula', 'Small-spotted Catshark', 'Animalia', 'Chordata', 'Chondrichthyes', 'Carcharhiniformes', 'Scyliorhinidae', 'Scyliorhinus', 'canicula', 'Least Concern', 'Sandy and muddy bottoms, 10-400m', 51.5, -8.0, 'https://example.com/catshark.jpg');