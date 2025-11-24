-- SQL script para criar tabelas do Rattery Management System
-- Execute este script no Supabase SQL Editor

-- Tabela de ratos (rats)
CREATE TABLE IF NOT EXISTS rats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tutor_name TEXT,
  litter_name TEXT,
  date_of_birth DATE NOT NULL,
  date_of_death DATE,
  sex TEXT NOT NULL CHECK (sex IN ('Macho', 'Fêmea')),
  origin TEXT CHECK (origin IN ('Nascido na Rattery', 'Comprado')),
  
  -- Status
  status TEXT DEFAULT 'Vivo' CHECK (status IN ('Vivo', 'Falecido', 'Aposentado')),
  destination TEXT DEFAULT 'Reprodução' CHECK (destination IN ('Reprodução', 'Pet', 'À venda', 'Para adoção', 'Vendido', 'Doado', 'Matriz', 'Padreador', 'Aposentada', 'Aposentado')),
  is_breeder BOOLEAN DEFAULT false,
  
  -- Características físicas
  coat_type TEXT DEFAULT 'Standard' CHECK (coat_type IN ('Standard', 'Rex', 'Velveteen', 'Hairless', 'Double Rex', 'Satin', 'Harley')),
  coat_color TEXT NOT NULL,
  marking TEXT DEFAULT 'Self' CHECK (marking IN ('Self', 'Berkshire', 'Irish', 'English Irish', 'Down Under', 'Hooded', 'Bareback', 'Capped', 'Masked', 'Blaze', 'Blazed', 'Variegated', 'Var-Capped', 'Essex', 'Dalmatian', 'Roan')),
  eye_color TEXT DEFAULT 'Preto' CHECK (eye_color IN ('Preto', 'Ruby', 'Red', 'Odd-eyed', 'Pink')),
  ear_type TEXT DEFAULT 'Standard' CHECK (ear_type IN ('Standard', 'Dumbo', 'Top')),
  special_marks TEXT,
  
  -- Informações genéticas
  genotype TEXT,
  color_genotype TEXT,
  eye_genotype TEXT,
  ear_genotype TEXT,
  coat_genotype TEXT,
  marking_genotype TEXT,
  carrier_genes TEXT,
  genetic_notes TEXT,
  deformities TEXT,
  
  -- Reprodução
  breeding_approved BOOLEAN DEFAULT false,
  inbreeding_coefficient DECIMAL(5,2),
  number_of_litters INTEGER DEFAULT 0,
  
  -- Temperamento
  temperament_notes TEXT,
  temperament_scores JSONB,
  
  -- Pedigree
  mother_id UUID REFERENCES rats(id) ON DELETE SET NULL,
  father_id UUID REFERENCES rats(id) ON DELETE SET NULL,
  litter_id UUID,
  litter_ids UUID[] DEFAULT ARRAY[]::UUID[],
  offspring_ids UUID[] DEFAULT ARRAY[]::UUID[],
  
  -- Metadata
  photos TEXT[],
  notes TEXT,
  registration_number TEXT UNIQUE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de ninhadas (litters)
CREATE TABLE IF NOT EXISTS litters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  litter_code TEXT UNIQUE,
  mother_id UUID NOT NULL REFERENCES rats(id) ON DELETE CASCADE,
  father_id UUID NOT NULL REFERENCES rats(id) ON DELETE CASCADE,
  birth_date DATE NOT NULL,
  expected_birth_date DATE,
  mating_date DATE,
  
  -- Filhotes
  offspring_ids UUID[] DEFAULT ARRAY[]::UUID[],
  total_offspring INTEGER DEFAULT 0,
  males_count INTEGER,
  females_count INTEGER,
  survived_count INTEGER,
  
  -- Genética
  estimated_coi DECIMAL(5,2),
  predicted_phenotypes JSONB,
  
  -- Comportamento e observações
  average_temperament TEXT,
  behavioral_notes TEXT,
  health_notes TEXT,
  general_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Adicionar constraint para referência de litter_id
ALTER TABLE rats 
ADD CONSTRAINT fk_litter FOREIGN KEY (litter_id) REFERENCES litters(id) ON DELETE SET NULL;

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_rats_sex ON rats(sex);
CREATE INDEX IF NOT EXISTS idx_rats_status ON rats(status);
CREATE INDEX IF NOT EXISTS idx_rats_destination ON rats(destination);
CREATE INDEX IF NOT EXISTS idx_rats_mother_id ON rats(mother_id);
CREATE INDEX IF NOT EXISTS idx_rats_father_id ON rats(father_id);
CREATE INDEX IF NOT EXISTS idx_rats_litter_id ON rats(litter_id);
CREATE INDEX IF NOT EXISTS idx_rats_created_at ON rats(created_at);

CREATE INDEX IF NOT EXISTS idx_litters_mother_id ON litters(mother_id);
CREATE INDEX IF NOT EXISTS idx_litters_father_id ON litters(father_id);
CREATE INDEX IF NOT EXISTS idx_litters_birth_date ON litters(birth_date);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_rats_updated_at BEFORE UPDATE ON rats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_litters_updated_at BEFORE UPDATE ON litters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança (RLS)
ALTER TABLE rats ENABLE ROW LEVEL SECURITY;
ALTER TABLE litters ENABLE ROW LEVEL SECURITY;

-- Permitir todas as operações para usuários autenticados
-- Ajuste essas políticas conforme suas necessidades
CREATE POLICY "Enable read access for all users" ON rats
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON rats
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON rats
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON rats
  FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON litters
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON litters
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON litters
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON litters
  FOR DELETE USING (true);



