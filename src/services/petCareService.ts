import { supabase } from '@/integrations/supabase/client';
import { Client, Pet, Service } from '@/types/client';

// Client operations
export const clientService = {
  async getAll(): Promise<Client[]> {
    try {
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('Supabase not configured');
      }

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }

      return data?.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email || undefined,
        phone: row.phone,
        address: row.address || undefined,
        notes: row.notes || undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })) || [];
    } catch (error) {
      console.warn('Supabase not available, returning empty array:', error);
      return [];
    }
  },

  async getById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching client:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      email: data.email || undefined,
      phone: data.phone,
      address: data.address || undefined,
      notes: data.notes || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async create(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('Supabase not configured');
      }

      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: client.name,
          email: client.email || null,
          phone: client.phone,
          address: client.address || null,
          notes: client.notes || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating client:', error);
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        email: data.email || undefined,
        phone: data.phone,
        address: data.address || undefined,
        notes: data.notes || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.warn('Supabase not available, using fallback:', error);
      throw error; // Let the component handle localStorage fallback
    }
  },

  async update(client: Client): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update({
        name: client.name,
        email: client.email || null,
        phone: client.phone,
        address: client.address || null,
        notes: client.notes || null,
      })
      .eq('id', client.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating client:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email || undefined,
      phone: data.phone,
      address: data.address || undefined,
      notes: data.notes || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  },
};

// Pet operations
export const petService = {
  async getAll(clientId?: string): Promise<Pet[]> {
    let query = supabase
      .from('pets')
      .select('*')
      .order('name', { ascending: true });

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching pets:', error);
      throw error;
    }

    return data?.map(row => ({
      id: row.id,
      clientId: row.client_id,
      name: row.name,
      species: row.species,
      breed: row.breed || undefined,
      sex: row.sex,
      dateOfBirth: row.date_of_birth || undefined,
      weight: row.weight || undefined,
      color: row.color || undefined,
      microchip: row.microchip || undefined,
      vaccinations: row.vaccinations || undefined,
      medications: row.medications || undefined,
      allergies: row.allergies || undefined,
      specialInstructions: row.special_instructions || undefined,
      temperamentNotes: row.temperament_notes || undefined,
      photoUrl: row.photo_url || undefined,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })) || [];
  },

  async getById(id: string): Promise<Pet | null> {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching pet:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      clientId: data.client_id,
      name: data.name,
      species: data.species,
      breed: data.breed || undefined,
      sex: data.sex,
      dateOfBirth: data.date_of_birth || undefined,
      weight: data.weight || undefined,
      color: data.color || undefined,
      microchip: data.microchip || undefined,
      vaccinations: data.vaccinations || undefined,
      medications: data.medications || undefined,
      allergies: data.allergies || undefined,
      specialInstructions: data.special_instructions || undefined,
      temperamentNotes: data.temperament_notes || undefined,
      photoUrl: data.photo_url || undefined,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async create(pet: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pet> {
    const { data, error } = await supabase
      .from('pets')
      .insert({
        client_id: pet.clientId,
        name: pet.name,
        species: pet.species,
        breed: pet.breed || null,
        sex: pet.sex,
        date_of_birth: pet.dateOfBirth || null,
        weight: pet.weight || null,
        color: pet.color || null,
        microchip: pet.microchip || null,
        vaccinations: pet.vaccinations || null,
        medications: pet.medications || null,
        allergies: pet.allergies || null,
        special_instructions: pet.specialInstructions || null,
        temperament_notes: pet.temperamentNotes || null,
        photo_url: pet.photoUrl || null,
        is_active: pet.isActive,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating pet:', error);
      throw error;
    }

    return {
      id: data.id,
      clientId: data.client_id,
      name: data.name,
      species: data.species,
      breed: data.breed || undefined,
      sex: data.sex,
      dateOfBirth: data.date_of_birth || undefined,
      weight: data.weight || undefined,
      color: data.color || undefined,
      microchip: data.microchip || undefined,
      vaccinations: data.vaccinations || undefined,
      medications: data.medications || undefined,
      allergies: data.allergies || undefined,
      specialInstructions: data.special_instructions || undefined,
      temperamentNotes: data.temperament_notes || undefined,
      photoUrl: data.photo_url || undefined,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async update(pet: Pet): Promise<Pet> {
    const { data, error } = await supabase
      .from('pets')
      .update({
        client_id: pet.clientId,
        name: pet.name,
        species: pet.species,
        breed: pet.breed || null,
        sex: pet.sex,
        date_of_birth: pet.dateOfBirth || null,
        weight: pet.weight || null,
        color: pet.color || null,
        microchip: pet.microchip || null,
        vaccinations: pet.vaccinations || null,
        medications: pet.medications || null,
        allergies: pet.allergies || null,
        special_instructions: pet.specialInstructions || null,
        temperament_notes: pet.temperamentNotes || null,
        photo_url: pet.photoUrl || null,
        is_active: pet.isActive,
      })
      .eq('id', pet.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating pet:', error);
      throw error;
    }

    return {
      id: data.id,
      clientId: data.client_id,
      name: data.name,
      species: data.species,
      breed: data.breed || undefined,
      sex: data.sex,
      dateOfBirth: data.date_of_birth || undefined,
      weight: data.weight || undefined,
      color: data.color || undefined,
      microchip: data.microchip || undefined,
      vaccinations: data.vaccinations || undefined,
      medications: data.medications || undefined,
      allergies: data.allergies || undefined,
      specialInstructions: data.special_instructions || undefined,
      temperamentNotes: data.temperament_notes || undefined,
      photoUrl: data.photo_url || undefined,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting pet:', error);
      throw error;
    }
  },
};

// Service operations
export const serviceService = {
  async getAll(filters?: { status?: Service['status']; serviceType?: Service['serviceType']; startDate?: string }): Promise<Service[]> {
    let query = supabase
      .from('services')
      .select('*')
      .order('start_date', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.serviceType) {
      query = query.eq('service_type', filters.serviceType);
    }

    if (filters?.startDate) {
      query = query.gte('start_date', filters.startDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }

    return data?.map(row => ({
      id: row.id,
      clientId: row.client_id,
      petIds: row.pet_ids || [],
      serviceType: row.service_type,
      status: row.status,
      startDate: row.start_date,
      endDate: row.end_date || undefined,
      startTime: row.start_time || undefined,
      endTime: row.end_time || undefined,
      duration: row.duration || undefined,
      location: row.location,
      address: row.address || undefined,
      price: row.price || undefined,
      notes: row.notes || undefined,
      completedAt: row.completed_at || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })) || [];
  },

  async getById(id: string): Promise<Service | null> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching service:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      clientId: data.client_id,
      petIds: data.pet_ids || [],
      serviceType: data.service_type,
      status: data.status,
      startDate: data.start_date,
      endDate: data.end_date || undefined,
      startTime: data.start_time || undefined,
      endTime: data.end_time || undefined,
      duration: data.duration || undefined,
      location: data.location,
      address: data.address || undefined,
      price: data.price || undefined,
      notes: data.notes || undefined,
      completedAt: data.completed_at || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async create(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert({
        client_id: service.clientId,
        pet_ids: service.petIds,
        service_type: service.serviceType,
        status: service.status,
        start_date: service.startDate,
        end_date: service.endDate || null,
        start_time: service.startTime || null,
        end_time: service.endTime || null,
        duration: service.duration || null,
        location: service.location,
        address: service.address || null,
        price: service.price || null,
        notes: service.notes || null,
        completed_at: service.completedAt || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating service:', error);
      throw error;
    }

    return {
      id: data.id,
      clientId: data.client_id,
      petIds: data.pet_ids || [],
      serviceType: data.service_type,
      status: data.status,
      startDate: data.start_date,
      endDate: data.end_date || undefined,
      startTime: data.start_time || undefined,
      endTime: data.end_time || undefined,
      duration: data.duration || undefined,
      location: data.location,
      address: data.address || undefined,
      price: data.price || undefined,
      notes: data.notes || undefined,
      completedAt: data.completed_at || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async update(service: Service): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update({
        client_id: service.clientId,
        pet_ids: service.petIds,
        service_type: service.serviceType,
        status: service.status,
        start_date: service.startDate,
        end_date: service.endDate || null,
        start_time: service.startTime || null,
        end_time: service.endTime || null,
        duration: service.duration || null,
        location: service.location,
        address: service.address || null,
        price: service.price || null,
        notes: service.notes || null,
        completed_at: service.completedAt || null,
      })
      .eq('id', service.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating service:', error);
      throw error;
    }

    return {
      id: data.id,
      clientId: data.client_id,
      petIds: data.pet_ids || [],
      serviceType: data.service_type,
      status: data.status,
      startDate: data.start_date,
      endDate: data.end_date || undefined,
      startTime: data.start_time || undefined,
      endTime: data.end_time || undefined,
      duration: data.duration || undefined,
      location: data.location,
      address: data.address || undefined,
      price: data.price || undefined,
      notes: data.notes || undefined,
      completedAt: data.completed_at || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  },
};

