export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string
          address: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone: string
          address?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string
          address?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      pets: {
        Row: {
          id: string
          client_id: string
          name: string
          species: "Cão" | "Gato" | "Outro"
          breed: string | null
          sex: "Macho" | "Fêmea"
          date_of_birth: string | null
          weight: number | null
          color: string | null
          microchip: string | null
          vaccinations: string | null
          medications: string | null
          allergies: string | null
          special_instructions: string | null
          temperament_notes: string | null
          photo_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          name: string
          species: "Cão" | "Gato" | "Outro"
          breed?: string | null
          sex: "Macho" | "Fêmea"
          date_of_birth?: string | null
          weight?: number | null
          color?: string | null
          microchip?: string | null
          vaccinations?: string | null
          medications?: string | null
          allergies?: string | null
          special_instructions?: string | null
          temperament_notes?: string | null
          photo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          name?: string
          species?: "Cão" | "Gato" | "Outro"
          breed?: string | null
          sex?: "Macho" | "Fêmea"
          date_of_birth?: string | null
          weight?: number | null
          color?: string | null
          microchip?: string | null
          vaccinations?: string | null
          medications?: string | null
          allergies?: string | null
          special_instructions?: string | null
          temperament_notes?: string | null
          photo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          client_id: string
          pet_ids: string[]
          service_type: "Pet Sitting" | "Dog Walking" | "Treinamento" | "Hospedagem"
          status: "Agendado" | "Em Andamento" | "Concluído" | "Cancelado"
          start_date: string
          end_date: string | null
          start_time: string | null
          end_time: string | null
          duration: number | null
          location: "Casa do Cliente" | "Meu Estabelecimento"
          address: string | null
          price: number | null
          notes: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          pet_ids?: string[]
          service_type: "Pet Sitting" | "Dog Walking" | "Treinamento" | "Hospedagem"
          status?: "Agendado" | "Em Andamento" | "Concluído" | "Cancelado"
          start_date: string
          end_date?: string | null
          start_time?: string | null
          end_time?: string | null
          duration?: number | null
          location: "Casa do Cliente" | "Meu Estabelecimento"
          address?: string | null
          price?: number | null
          notes?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          pet_ids?: string[]
          service_type?: "Pet Sitting" | "Dog Walking" | "Treinamento" | "Hospedagem"
          status?: "Agendado" | "Em Andamento" | "Concluído" | "Cancelado"
          start_date?: string
          end_date?: string | null
          start_time?: string | null
          end_time?: string | null
          duration?: number | null
          location?: "Casa do Cliente" | "Meu Estabelecimento"
          address?: string | null
          price?: number | null
          notes?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rats: {
        Row: {
          id: string
          name: string
          tutor_name: string | null
          litter_name: string | null
          date_of_birth: string
          date_of_death: string | null
          sex: "Macho" | "Fêmea"
          origin: "Nascido na Rattery" | "Comprado"
          status: "Vivo" | "Falecido" | "Aposentado"
          destination: "Reprodução" | "Pet" | "À venda" | "Para adoção" | "Vendido" | "Doado" | "Matriz" | "Padreador" | "Aposentada" | "Aposentado"
          is_breeder: boolean
          mother_id: string | null
          father_id: string | null
          litter_id: string | null
          litter_ids: string[]
          offspring_ids: string[]
          coat_type: "Standard" | "Rex" | "Velveteen" | "Hairless" | "Double Rex" | "Satin" | "Harley"
          coat_color: string
          marking: "Self" | "Berkshire" | "Irish" | "English Irish" | "Down Under" | "Hooded" | "Bareback" | "Capped" | "Masked" | "Blaze" | "Blazed" | "Variegated" | "Var-Capped" | "Essex" | "Dalmatian" | "Roan"
          eye_color: "Preto" | "Ruby" | "Red" | "Odd-eyed" | "Pink"
          ear_type: "Standard" | "Dumbo" | "Top"
          special_marks: string | null
          genotype: string | null
          color_genotype: string | null
          eye_genotype: string | null
          ear_genotype: string | null
          coat_genotype: string | null
          marking_genotype: string | null
          carrier_genes: string | null
          genetic_notes: string | null
          deformities: string | null
          breeding_approved: boolean
          inbreeding_coefficient: number | null
          number_of_litters: number | null
          temperament_notes: string | null
          temperament_scores: Json | null
          notes: string | null
          registration_number: string | null
          photos: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          tutor_name?: string | null
          litter_name?: string | null
          date_of_birth: string
          date_of_death?: string | null
          sex: "Macho" | "Fêmea"
          origin?: "Nascido na Rattery" | "Comprado"
          status?: "Vivo" | "Falecido" | "Aposentado"
          destination?: "Reprodução" | "Pet" | "À venda" | "Para adoção" | "Vendido" | "Doado" | "Matriz" | "Padreador" | "Aposentada" | "Aposentado"
          is_breeder?: boolean
          mother_id?: string | null
          father_id?: string | null
          litter_id?: string | null
          coat_type?: "Standard" | "Rex" | "Velveteen" | "Hairless" | "Double Rex" | "Satin" | "Harley"
          coat_color: string
          marking?: "Self" | "Berkshire" | "Irish" | "Hooded" | "Blazed" | "Variegated" | "Capped" | "Bareback" | "Essex" | "Masked" | "Dalmatian" | "Roan"
          eye_color?: "Preto" | "Ruby" | "Red" | "Odd-eyed" | "Pink"
          ear_type?: "Standard" | "Dumbo" | "Top"
          special_marks?: string | null
          genotype?: string | null
          carrier_genes?: string | null
          genetic_notes?: string | null
          deformities?: string | null
          breeding_approved?: boolean
          inbreeding_coefficient?: number | null
          number_of_litters?: number | null
          temperament_notes?: string | null
          temperament_scores?: Json | null
          notes?: string | null
          registration_number?: string | null
          photos?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          date_of_birth?: string
          date_of_death?: string | null
          sex?: "Macho" | "Fêmea"
          origin?: "Nascido na Rattery" | "Comprado"
          status?: "Vivo" | "Falecido" | "Aposentado"
          destination?: "Reprodução" | "Pet" | "Vendido" | "Doado"
          is_breeder?: boolean
          mother_id?: string | null
          father_id?: string | null
          litter_id?: string | null
          coat_type?: "Standard" | "Rex" | "Velveteen" | "Hairless" | "Double Rex" | "Satin" | "Harley"
          coat_color?: string
          marking?: "Self" | "Berkshire" | "Irish" | "Hooded" | "Blazed" | "Variegated" | "Capped" | "Bareback" | "Essex" | "Masked" | "Dalmatian" | "Roan"
          eye_color?: "Preto" | "Ruby" | "Red" | "Odd-eyed" | "Pink"
          ear_type?: "Standard" | "Dumbo" | "Top"
          special_marks?: string | null
          genotype?: string | null
          carrier_genes?: string | null
          genetic_notes?: string | null
          deformities?: string | null
          breeding_approved?: boolean
          inbreeding_coefficient?: number | null
          number_of_litters?: number | null
          temperament_notes?: string | null
          temperament_scores?: Json | null
          notes?: string | null
          registration_number?: string | null
          photos?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      litters: {
        Row: {
          id: string
          litter_code: string | null
          mother_id: string
          father_id: string
          birth_date: string
          expected_birth_date: string | null
          mating_date: string | null
          offspring_ids: string[]
          total_offspring: number
          males_count: number | null
          females_count: number | null
          survived_count: number | null
          estimated_coi: number | null
          predicted_phenotypes: Json | null
          average_temperament: string | null
          behavioral_notes: string | null
          health_notes: string | null
          general_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          litter_code?: string | null
          mother_id: string
          father_id: string
          birth_date: string
          expected_birth_date?: string | null
          mating_date?: string | null
          offspring_ids?: string[]
          total_offspring: number
          males_count?: number | null
          females_count?: number | null
          survived_count?: number | null
          estimated_coi?: number | null
          predicted_phenotypes?: Json | null
          average_temperament?: string | null
          behavioral_notes?: string | null
          health_notes?: string | null
          general_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          litter_code?: string | null
          mother_id?: string
          father_id?: string
          birth_date?: string
          expected_birth_date?: string | null
          mating_date?: string | null
          offspring_ids?: string[]
          total_offspring?: number
          males_count?: number | null
          females_count?: number | null
          survived_count?: number | null
          estimated_coi?: number | null
          predicted_phenotypes?: Json | null
          average_temperament?: string | null
          behavioral_notes?: string | null
          health_notes?: string | null
          general_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][EnumName]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][CompositeTypeName]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
