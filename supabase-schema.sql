-- Create tables for Rat Pedigree Buddy

-- Create rats table
CREATE TABLE IF NOT EXISTS public.rats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    date_of_death DATE,
    sex TEXT NOT NULL CHECK (sex IN ('Macho', 'Fêmea')),
    origin TEXT DEFAULT 'Nascido na Rattery' CHECK (origin IN ('Nascido na Rattery', 'Comprado')),
    status TEXT DEFAULT 'Vivo' CHECK (status IN ('Vivo', 'Falecido', 'Aposentado')),
    destination TEXT DEFAULT 'Reprodução' CHECK (destination IN ('Reprodução', 'Pet', 'Vendido', 'Doado')),
    is_breeder BOOLEAN DEFAULT false,
    mother_id UUID REFERENCES public.rats(id),
    father_id UUID REFERENCES public.rats(id),
    litter_id UUID REFERENCES public.litters(id),
    coat_type TEXT DEFAULT 'Standard' CHECK (coat_type IN ('Standard', 'Rex', 'Velveteen', 'Hairless', 'Double Rex', 'Satin', 'Harley')),
    coat_color TEXT NOT NULL,
    marking TEXT DEFAULT 'Self' CHECK (marking IN ('Self', 'Berkshire', 'Irish', 'Hooded', 'Blazed', 'Variegated', 'Capped', 'Bareback', 'Essex', 'Masked', 'Dalmatian', 'Roan')),
    eye_color TEXT DEFAULT 'Preto' CHECK (eye_color IN ('Preto', 'Ruby', 'Red', 'Odd-eyed', 'Pink')),
    ear_type TEXT DEFAULT 'Standard' CHECK (ear_type IN ('Standard', 'Dumbo', 'Top')),
    special_marks TEXT,
    genotype TEXT,
    carrier_genes TEXT,
    genetic_notes TEXT,
    deformities TEXT,
    breeding_approved BOOLEAN DEFAULT false,
    inbreeding_coefficient DECIMAL(5,2),
    number_of_litters INTEGER DEFAULT 0,
    temperament_notes TEXT,
    temperament_scores JSONB,
    notes TEXT,
    registration_number TEXT,
    photos TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create litters table
CREATE TABLE IF NOT EXISTS public.litters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    litter_code TEXT,
    mother_id UUID NOT NULL REFERENCES public.rats(id),
    father_id UUID NOT NULL REFERENCES public.rats(id),
    birth_date DATE NOT NULL,
    expected_birth_date DATE,
    mating_date DATE,
    offspring_ids UUID[] DEFAULT '{}',
    total_offspring INTEGER NOT NULL DEFAULT 0,
    males_count INTEGER DEFAULT 0,
    females_count INTEGER DEFAULT 0,
    survived_count INTEGER,
    estimated_coi DECIMAL(5,2),
    predicted_phenotypes JSONB,
    average_temperament TEXT,
    behavioral_notes TEXT,
    health_notes TEXT,
    general_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rats_mother_id ON public.rats(mother_id);
CREATE INDEX IF NOT EXISTS idx_rats_father_id ON public.rats(father_id);
CREATE INDEX IF NOT EXISTS idx_rats_litter_id ON public.rats(litter_id);
CREATE INDEX IF NOT EXISTS idx_rats_sex ON public.rats(sex);
CREATE INDEX IF NOT EXISTS idx_rats_breeding_approved ON public.rats(breeding_approved);
CREATE INDEX IF NOT EXISTS idx_rats_coat_color ON public.rats(coat_color);
CREATE INDEX IF NOT EXISTS idx_rats_name ON public.rats(name);

CREATE INDEX IF NOT EXISTS idx_litters_mother_id ON public.litters(mother_id);
CREATE INDEX IF NOT EXISTS idx_litters_father_id ON public.litters(father_id);
CREATE INDEX IF NOT EXISTS idx_litters_litter_code ON public.litters(litter_code);
CREATE INDEX IF NOT EXISTS idx_litters_birth_date ON public.litters(birth_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_rats_updated_at BEFORE UPDATE ON public.rats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_litters_updated_at BEFORE UPDATE ON public.litters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.rats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.litters ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you may want to restrict this based on your needs)
CREATE POLICY "Allow all operations on rats" ON public.rats
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on litters" ON public.litters
    FOR ALL USING (true);

-- Grant permissions
GRANT ALL ON public.rats TO authenticated;
GRANT ALL ON public.litters TO authenticated;
GRANT ALL ON public.rats TO anon;
GRANT ALL ON public.litters TO anon;
