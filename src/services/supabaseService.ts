import { supabase } from '@/integrations/supabase/client';
import { Rat, Litter } from '@/types/rat';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

// Type aliases for Supabase types
type RatRow = Tables<'rats'>;
type RatInsert = TablesInsert<'rats'>;
type RatUpdate = TablesUpdate<'rats'>;

type LitterRow = Tables<'litters'>;
type LitterInsert = TablesInsert<'litters'>;
type LitterUpdate = TablesUpdate<'litters'>;

// Convert Supabase row to Rat type
function convertRatRowToRat(row: RatRow): Rat {
  return {
    id: row.id,
    name: row.name,
    dateOfBirth: row.date_of_birth,
    dateOfDeath: row.date_of_death || undefined,
    sex: row.sex,
    origin: row.origin,
    status: row.status,
    destination: row.destination,
    isBreeder: row.is_breeder,
    motherId: row.mother_id || undefined,
    fatherId: row.father_id || undefined,
    litterId: row.litter_id || undefined,
    coatType: row.coat_type,
    coatColor: row.coat_color,
    marking: row.marking,
    eyeColor: row.eye_color,
    earType: row.ear_type,
    specialMarks: row.special_marks || undefined,
    genotype: row.genotype || undefined,
    carrierGenes: row.carrier_genes || undefined,
    geneticNotes: row.genetic_notes || undefined,
    deformities: row.deformities || undefined,
    breedingApproved: row.breeding_approved,
    inbreedingCoefficient: row.inbreeding_coefficient || undefined,
    numberOfLitters: row.number_of_litters || undefined,
    temperamentNotes: row.temperament_notes || undefined,
    notes: row.notes || undefined,
    registrationNumber: row.registration_number || undefined,
    photos: row.photos || undefined,
  };
}

// Convert Rat type to Supabase insert
function convertRatToInsert(rat: Rat): RatInsert {
  return {
    id: rat.id,
    name: rat.name,
    date_of_birth: rat.dateOfBirth,
    date_of_death: rat.dateOfDeath || null,
    sex: rat.sex,
    origin: rat.origin,
    status: rat.status,
    destination: rat.destination,
    is_breeder: rat.isBreeder,
    mother_id: rat.motherId || null,
    father_id: rat.fatherId || null,
    litter_id: rat.litterId || null,
    coat_type: rat.coatType,
    coat_color: rat.coatColor,
    marking: rat.marking,
    eye_color: rat.eyeColor,
    ear_type: rat.earType,
    special_marks: rat.specialMarks || null,
    genotype: rat.genotype || null,
    carrier_genes: rat.carrierGenes || null,
    genetic_notes: rat.geneticNotes || null,
    deformities: rat.deformities || null,
    breeding_approved: rat.breedingApproved,
    inbreeding_coefficient: rat.inbreedingCoefficient || null,
    number_of_litters: rat.numberOfLitters || null,
    temperament_notes: rat.temperamentNotes || null,
    notes: rat.notes || null,
    registration_number: rat.registrationNumber || null,
    photos: rat.photos || null,
  };
}

// Convert Supabase row to Litter type
function convertLitterRowToLitter(row: LitterRow): Litter {
  return {
    id: row.id,
    litterCode: row.litter_code || undefined,
    motherId: row.mother_id,
    fatherId: row.father_id,
    birthDate: row.birth_date,
    expectedBirthDate: row.expected_birth_date || undefined,
    matingDate: row.mating_date || undefined,
    offspringIds: row.offspring_ids || [],
    totalOffspring: row.total_offspring,
    malesCount: row.males_count || undefined,
    femalesCount: row.females_count || undefined,
    survivedCount: row.survived_count || undefined,
    estimatedCOI: row.estimated_coi || undefined,
    predictedPhenotypes: row.predicted_phenotypes as any || undefined,
    averageTemperament: row.average_temperament || undefined,
    behavioralNotes: row.behavioral_notes || undefined,
    healthNotes: row.health_notes || undefined,
    generalNotes: row.general_notes || undefined,
  };
}

// Convert Litter type to Supabase insert
function convertLitterToInsert(litter: Litter): LitterInsert {
  return {
    id: litter.id,
    litter_code: litter.litterCode || null,
    mother_id: litter.motherId,
    father_id: litter.fatherId,
    birth_date: litter.birthDate,
    expected_birth_date: litter.expectedBirthDate || null,
    mating_date: litter.matingDate || null,
    offspring_ids: litter.offspringIds || [],
    total_offspring: litter.totalOffspring,
    males_count: litter.malesCount || null,
    females_count: litter.femalesCount || null,
    survived_count: litter.survivedCount || null,
    estimated_coi: litter.estimatedCOI || null,
    predicted_phenotypes: litter.predictedPhenotypes || null,
    average_temperament: litter.averageTemperament || null,
    behavioral_notes: litter.behavioralNotes || null,
    health_notes: litter.healthNotes || null,
    general_notes: litter.generalNotes || null,
  };
}

// Rat operations
export const ratService = {
  async getAll(): Promise<Rat[]> {
    const { data, error } = await supabase
      .from('rats')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching rats:', error);
      throw error;
    }

    return data?.map(convertRatRowToRat) || [];
  },

  async getById(id: string): Promise<Rat | null> {
    const { data, error } = await supabase
      .from('rats')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching rat:', error);
      return null;
    }

    return data ? convertRatRowToRat(data) : null;
  },

  async create(rat: Rat): Promise<Rat> {
    const insertData = convertRatToInsert(rat);
    
    const { data, error } = await supabase
      .from('rats')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating rat:', error);
      throw error;
    }

    return convertRatRowToRat(data);
  },

  async update(rat: Rat): Promise<Rat> {
    const updateData: RatUpdate = convertRatToInsert(rat);
    
    const { data, error } = await supabase
      .from('rats')
      .update(updateData)
      .eq('id', rat.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating rat:', error);
      throw error;
    }

    return convertRatRowToRat(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('rats')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting rat:', error);
      throw error;
    }
  },

  async getByLitterId(litterId: string): Promise<Rat[]> {
    const { data, error } = await supabase
      .from('rats')
      .select('*')
      .eq('litter_id', litterId)
      .order('name');

    if (error) {
      console.error('Error fetching rats by litter:', error);
      throw error;
    }

    return data?.map(convertRatRowToRat) || [];
  },
};

// Litter operations
export const litterService = {
  async getAll(): Promise<Litter[]> {
    const { data, error } = await supabase
      .from('litters')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching litters:', error);
      throw error;
    }

    return data?.map(convertLitterRowToLitter) || [];
  },

  async getById(id: string): Promise<Litter | null> {
    const { data, error } = await supabase
      .from('litters')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching litter:', error);
      return null;
    }

    return data ? convertLitterRowToLitter(data) : null;
  },

  async create(litter: Litter): Promise<Litter> {
    const insertData = convertLitterToInsert(litter);
    
    const { data, error } = await supabase
      .from('litters')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating litter:', error);
      throw error;
    }

    return convertLitterRowToLitter(data);
  },

  async update(litter: Litter): Promise<Litter> {
    const updateData: LitterUpdate = convertLitterToInsert(litter);
    
    const { data, error } = await supabase
      .from('litters')
      .update(updateData)
      .eq('id', litter.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating litter:', error);
      throw error;
    }

    return convertLitterRowToLitter(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('litters')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting litter:', error);
      throw error;
    }
  },
};
