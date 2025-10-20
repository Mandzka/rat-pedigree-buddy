export type CoatType = "Standard" | "Rex" | "Velveteen" | "Hairless" | "Double Rex" | "Satin" | "Harley";
export type Marking = "Self" | "Berkshire" | "Irish" | "Hooded" | "Blazed" | "Variegated" | "Capped" | "Bareback" | "Essex" | "Masked" | "Dalmatian" | "Roan";
export type EyeColor = "Preto" | "Ruby" | "Red" | "Odd-eyed" | "Pink";
export type EarType = "Standard" | "Dumbo" | "Top";
export type RatStatus = "Vivo" | "Falecido" | "Aposentado";
export type RatDestination = "Reprodução" | "Pet" | "Vendido" | "Doado";

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
  dateOfDeath?: string;
  sex: "Macho" | "Fêmea";
  origin: "Nascido na Rattery" | "Comprado";
  
  // Status
  status: RatStatus;
  destination: RatDestination;
  isBreeder: boolean; // Ativo para reprodução
  
  // Características físicas
  coatType: CoatType;
  coatColor: string; // Fenótipo declarado
  marking: Marking;
  eyeColor: EyeColor;
  earType: EarType;
  specialMarks?: string; // Ex: "odd eye específico", "blazed assimétrico"
  
  // Informações genéticas
  genotype?: string; // Genótipo completo conhecido
  carrierGenes?: string; // Genes portadores (carrega mas não expressa)
  geneticNotes?: string; // Ex: "suspeita de heterozigose cm/Ch"
  deformities?: string;
  
  // Reprodução
  breedingApproved: boolean;
  inbreedingCoefficient?: number; // COI calculado (0-100%)
  numberOfLitters?: number; // Contador de ninhadas (fêmeas)
  
  // Temperamento
  temperamentNotes?: string;
  temperamentScores?: TemperamentScore;
  
  // Pedigree
  motherId?: string;
  fatherId?: string;
  litterId?: string; // ID da ninhada a que este rato pertence
  litterIds?: string[]; // IDs das ninhadas que este rato gerou (como pai/mãe)
  offspringIds?: string[]; // IDs dos filhotes diretos
  
  // Metadata
  photos?: string[];
  notes?: string;
  registrationNumber?: string; // Número de registro automático
}

export interface Litter {
  id: string;
  litterCode?: string; // Código da ninhada (ex: "L001-2025")
  motherId: string;
  fatherId: string;
  birthDate: string;
  expectedBirthDate?: string; // Data prevista de parto
  matingDate?: string; // Data de acasalamento/cobertura
  
  // Filhotes
  offspringIds: string[]; // IDs dos ratos filhotes cadastrados
  totalOffspring: number; // Número total de filhotes nascidos
  malesCount?: number;
  femalesCount?: number;
  survivedCount?: number;
  
  // Genética
  estimatedCOI?: number; // COI previsto/real para esta ninhada
  predictedPhenotypes?: { phenotype: string; probability: number }[]; // Previsões
  
  // Comportamento e observações
  averageTemperament?: string;
  behavioralNotes?: string;
  healthNotes?: string;
  generalNotes?: string;
}
