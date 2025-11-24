export interface Client {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pet {
  id: string;
  clientId: string;
  name: string;
  species: "Cão" | "Gato" | "Outro";
  breed?: string;
  sex: "Macho" | "Fêmea";
  dateOfBirth?: string;
  weight?: number;
  color?: string;
  microchip?: string;
  vaccinations?: string;
  // Campos adicionais para cães
  isNeutered?: boolean;
  lastHeatDate?: string; // Para fêmeas - última vez no cio
  dewormingHistory?: string; // Histórico de vermífugos
  currentMedications?: string; // Medicações em uso
  tutorBehavioralNotes?: string; // Ficha comportamental do tutor
  observedBehavioralNotes?: string; // Ficha comportamental observada
  // Campos legados (mantidos para compatibilidade)
  medications?: string;
  allergies?: string;
  specialInstructions?: string;
  temperamentNotes?: string;
  photoUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ServiceType = "Pet Sitting" | "Dog Walking" | "Treinamento" | "Hospedagem";

export type ServiceStatus = "Agendado" | "Em Andamento" | "Concluído" | "Cancelado";

export interface Service {
  id: string;
  clientId: string;
  petIds: string[];
  serviceType: ServiceType;
  status: ServiceStatus;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  duration?: number; // em minutos
  location: "Casa do Cliente" | "Meu Estabelecimento";
  address?: string;
  price?: number;
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  petId: string;
  date: string;
  type: "Consulta" | "Vacina" | "Cirurgia" | "Emergência" | "Exame" | "Tratamento" | "Outro";
  veterinarian?: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  medications?: string;
  cost?: number;
  nextAppointment?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VaccineRecord {
  id: string;
  petId: string;
  vaccineType: string;
  date: string;
  nextDueDate?: string;
  veterinarian?: string;
  batchNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface PetEvent {
  id: string;
  petId: string;
  type: "Nascimento" | "Adoção" | "Cirurgia" | "Doença" | "Mudança Comportamental" | "Treinamento" | "Outro";
  date: string;
  title: string;
  description?: string;
  attachments?: string[];
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: "Banho" | "Limpeza" | "Compras" | "Veterinário" | "Outro";
  priority: "Baixa" | "Média" | "Alta" | "Urgente";
  status: "Pendente" | "Em Andamento" | "Concluída";
  dueDate?: string;
  assignedToPetId?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  id: string;
  type: "Vacina" | "Vermífugo" | "Pagamento" | "Consulta" | "Tarefa" | "Outro";
  title: string;
  description?: string;
  priority: "Baixa" | "Média" | "Alta" | "Urgente";
  status: "Ativo" | "Resolvido" | "Ignorado";
  relatedPetId?: string;
  relatedServiceId?: string;
  dueDate?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface FeedingSchedule {
  id: string;
  petId: string;
  brand?: string;
  quantity?: string;
  times: string[]; // Array de horários (ex: ["08:00", "18:00"])
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialRecord {
  id: string;
  type: "Receita" | "Despesa";
  category: string; // Ex: "Hospedagem", "Passeio", "Ração", "Brinquedos"
  description: string;
  amount: number;
  date: string;
  relatedServiceId?: string;
  relatedPetId?: string;
  paymentStatus?: "Pago" | "Pendente" | "Atrasado";
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

