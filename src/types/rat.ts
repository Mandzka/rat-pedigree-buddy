export type CoatType = "Standard" | "Rex" | "Velveteen" | "Hairless" | "Double Rex" | "Satin" | "Harley";
export type Marking = 
  // Padrões Self (sem marcações)
  "Self" |
  // Padrões reconhecidos pela AFRMA
  "Berkshire" | "Irish" | "English Irish" | "Down Under" | "Hooded" | "Bareback" | "Capped" | "Masked" |
  // Padrões com blaze
  "Blaze" | "Blazed" |
  // Padrões variegados
  "Variegated" | "Var-Capped" |
  // Outros padrões
  "Essex" | "Dalmatian" | "Roan" | "Marbled";
export type EyeColor = "Preto" | "Ruby" | "Red" | "Odd-eyed" | "Pink";
export type EarType = "Dumbo" | "Top";
export type RatStatus = "Vivo" | "Falecido" | "Aposentado";
export type RatDestination = "Reprodução" | "Pet" | "À venda" | "Para adoção" | "Vendido" | "Doado" | "Matriz" | "Padreador";

export interface Rat {
  id: string;
  name: string; // Nome de registro (dado por você)
  tutorName?: string; // Nome que o tutor vai dar
  litterName?: string; // Nome da ninhada (para busca/filtro)
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
  colorGenotype?: string; // Genótipo da cor (ex: aa BB dd)
  eyeGenotype?: string; // Genótipo dos olhos (ex: C-)
  earGenotype?: string; // Genótipo das orelhas (ex: du)
  coatGenotype?: string; // Genótipo da pelagem (ex: rr)
  markingGenotype?: string; // Genótipo das marcações (ex: hh)
  carrierGenes?: string; // Genes portadores (carrega mas não expressa)
  geneticNotes?: string; // Ex: "suspeita de heterozigose cm/Ch"
  deformities?: string;
  
  // Reprodução
  breedingApproved: boolean;
  inbreedingCoefficient?: number; // COI calculado (0-100%)
  numberOfLitters?: number; // Contador de ninhadas (fêmeas)
  
  // Temperamento
  temperamentNotes?: string;
  
  // Pedigree
  motherId?: string;
  fatherId?: string;
  litterId?: string; // ID da ninhada de origem
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
