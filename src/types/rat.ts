export type CoatType = "Standard" | "Rex" | "Velveteen" | "Hairless" | "Double Rex" | "Satin";
export type CoatTexture = "Liso" | "Ondulado" | "Cacheado";
export type Marking = "Self" | "Berkshire" | "Irish" | "Hooded" | "Blazed" | "Variegated" | "Capped" | "Bareback";
export type EyeColor = "Preto" | "Ruby" | "Odd-eyed" | "Vermelho";
export type EarType = "Standard" | "Dumbo" | "Top";

export interface TemperamentScore {
  sociability: number; // 1-5
  courage: number; // 1-5
  curiosity: number; // 1-5
  calmness: number; // 1-5
  dominance: number; // 1-5
  humanAttachment: number; // 1-5
}

export interface Rat {
  id: string;
  name: string;
  dateOfBirth: string;
  sex: "Macho" | "Fêmea";
  origin: "Nascido na Rattery" | "Comprado";
  
  // Características físicas
  coatType: CoatType;
  coatTexture: CoatTexture;
  coatColor: string;
  marking: Marking;
  eyeColor: EyeColor;
  earType: EarType;
  
  // Informações genéticas
  genotype?: string;
  deformities?: string;
  
  // Reprodução
  breedingApproved: boolean;
  inbreedingCoefficient?: number; // 0-100%
  
  // Temperamento
  temperamentNotes?: string;
  temperamentScores?: TemperamentScore;
  
  // Pedigree
  motherId?: string;
  fatherId?: string;
  
  // Metadata
  photos?: string[];
  notes?: string;
}

export interface Litter {
  id: string;
  motherId: string;
  fatherId: string;
  birthDate: string;
  ratIds: string[];
  averageTemperament?: string;
  behavioralNotes?: string;
}
