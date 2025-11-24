import { useState, useEffect } from "react";
import { Pet, Client, Service, MedicalRecord, VaccineRecord, PetEvent } from "@/types/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Heart, Activity, FileText, Camera, MapPin, Clock, DollarSign, Stethoscope, Syringe, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

interface PetProfileDialogProps {
  pet: Pet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client;
  services?: Service[];
  medicalRecords?: MedicalRecord[];
  vaccineRecords?: VaccineRecord[];
  events?: PetEvent[];
}

export function PetProfileDialog({ 
  pet, 
  open, 
  onOpenChange, 
  client,
  services = [],
  medicalRecords = [],
  vaccineRecords = [],
  events = []
}: PetProfileDialogProps) {
  if (!pet) return null;

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return "Não informado";
    try {
      const birth = new Date(dateOfBirth);
      const today = new Date();
      const years = today.getFullYear() - birth.getFullYear();
      const months = today.getMonth() - birth.getMonth();
      
      if (years === 0) {
        return `${months} ${months === 1 ? 'mês' : 'meses'}`;
      }
      return `${years} ${years === 1 ? 'ano' : 'anos'}${months > 0 ? ` e ${months} ${months === 1 ? 'mês' : 'meses'}` : ''}`;
    } catch {
      return "Data inválida";
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  const petServices = services.filter(s => s.petIds.includes(pet.id));
  const sortedMedicalRecords = [...medicalRecords].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const sortedVaccines = [...vaccineRecords].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Camera className="w-6 h-6" />
            Perfil de {pet.name}
          </DialogTitle>
        </DialogHeader>

        {pet.photoUrl && (
          <div className="w-full h-64 mb-6 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            <img 
              src={pet.photoUrl} 
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="medical">Histórico Médico</TabsTrigger>
            <TabsTrigger value="vaccines">Vacinas</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Nome:</strong> {pet.name}</div>
                  <div><strong>Espécie:</strong> {pet.species}</div>
                  {pet.breed && <div><strong>Raça:</strong> {pet.breed}</div>}
                  <div><strong>Sexo:</strong> {pet.sex}</div>
                  <div><strong>Idade:</strong> {calculateAge(pet.dateOfBirth)}</div>
                  {pet.dateOfBirth && <div><strong>Nascimento:</strong> {formatDate(pet.dateOfBirth)}</div>}
                  {pet.weight && <div><strong>Peso:</strong> {pet.weight} kg</div>}
                  {pet.color && <div><strong>Cor:</strong> {pet.color}</div>}
                  {pet.microchip && <div><strong>Microchip:</strong> {pet.microchip}</div>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dono</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {client && (
                    <>
                      <div><strong>Nome:</strong> {client.name}</div>
                      {client.phone && <div><strong>Telefone:</strong> {client.phone}</div>}
                      {client.email && <div><strong>Email:</strong> {client.email}</div>}
                      {client.address && <div><strong>Endereço:</strong> {client.address}</div>}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {pet.isNeutered !== undefined && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🔪 Estado Reprodutivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={pet.isNeutered ? "default" : "outline"}>
                    {pet.isNeutered ? "Castrado/Estéril" : "Não castrado"}
                  </Badge>
                  {pet.sex === "Fêmea" && pet.lastHeatDate && (
                    <div className="mt-2 text-sm">
                      <strong>Última vez no cio:</strong> {formatDate(pet.lastHeatDate)}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {pet.allergies && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-red-600">⚠️ Alergias</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{pet.allergies}</p>
                </CardContent>
              </Card>
            )}

            {pet.currentMedications && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">💊 Medicações em Uso</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{pet.currentMedications}</p>
                </CardContent>
              </Card>
            )}

            {pet.medications && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">💊 Medicações (Legado)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{pet.medications}</p>
                </CardContent>
              </Card>
            )}

            {pet.dewormingHistory && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🪱 Histórico de Vermífugos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{pet.dewormingHistory}</p>
                </CardContent>
              </Card>
            )}

            {pet.vaccinations && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🩺 Vacinações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{pet.vaccinations}</p>
                </CardContent>
              </Card>
            )}

            {pet.specialInstructions && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📋 Instruções Especiais</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{pet.specialInstructions}</p>
                </CardContent>
              </Card>
            )}

            {pet.tutorBehavioralNotes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">👤 Ficha Comportamental do Tutor</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{pet.tutorBehavioralNotes}</p>
                </CardContent>
              </Card>
            )}

            {pet.observedBehavioralNotes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">👁️ Ficha Comportamental Observada</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{pet.observedBehavioralNotes}</p>
                </CardContent>
              </Card>
            )}

            {pet.temperamentNotes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">😊 Temperamento (Legado)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{pet.temperamentNotes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="medical" className="space-y-4 mt-4">
            {sortedMedicalRecords.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhum registro médico encontrado
                </CardContent>
              </Card>
            ) : (
              sortedMedicalRecords.map(record => (
                <Card key={record.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-5 h-5" />
                        <CardTitle className="text-lg">{record.type}</CardTitle>
                        <Badge variant="outline">{formatDate(record.date)}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {record.veterinarian && (
                      <div><strong>Veterinário:</strong> {record.veterinarian}</div>
                    )}
                    <div><strong>Descrição:</strong> {record.description}</div>
                    {record.diagnosis && (
                      <div><strong>Diagnóstico:</strong> {record.diagnosis}</div>
                    )}
                    {record.treatment && (
                      <div><strong>Tratamento:</strong> {record.treatment}</div>
                    )}
                    {record.medications && (
                      <div><strong>Medicações:</strong> {record.medications}</div>
                    )}
                    {record.cost && (
                      <div><strong>Custo:</strong> R$ {record.cost.toFixed(2)}</div>
                    )}
                    {record.nextAppointment && (
                      <div className="text-blue-600">
                        <strong>Próxima consulta:</strong> {formatDate(record.nextAppointment)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="vaccines" className="space-y-4 mt-4">
            {sortedVaccines.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhum registro de vacina encontrado
                </CardContent>
              </Card>
            ) : (
              sortedVaccines.map(vaccine => (
                <Card key={vaccine.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Syringe className="w-5 h-5" />
                        <CardTitle className="text-lg">{vaccine.vaccineType}</CardTitle>
                      </div>
                      <Badge variant="outline">{formatDate(vaccine.date)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {vaccine.veterinarian && (
                      <div><strong>Veterinário:</strong> {vaccine.veterinarian}</div>
                    )}
                    {vaccine.batchNumber && (
                      <div><strong>Lote:</strong> {vaccine.batchNumber}</div>
                    )}
                    {vaccine.nextDueDate && (
                      <div className={new Date(vaccine.nextDueDate) <= new Date() ? "text-red-600 font-semibold" : "text-blue-600"}>
                        <strong>Próxima dose:</strong> {formatDate(vaccine.nextDueDate)}
                      </div>
                    )}
                    {vaccine.notes && (
                      <div><strong>Observações:</strong> {vaccine.notes}</div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="services" className="space-y-4 mt-4">
            {petServices.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhum serviço registrado para este pet
                </CardContent>
              </Card>
            ) : (
              petServices.map(service => (
                <Card key={service.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{service.serviceType}</CardTitle>
                      <Badge className={service.status === "Concluído" ? "bg-green-500" : service.status === "Em Andamento" ? "bg-yellow-500" : service.status === "Cancelado" ? "bg-red-500" : ""}>
                        {service.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{formatDate(service.startDate)}</span>
                      {service.startTime && <span> às {service.startTime}</span>}
                    </div>
                    {service.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{service.location}</span>
                      </div>
                    )}
                    {service.price && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>R$ {service.price.toFixed(2)}</span>
                      </div>
                    )}
                    {service.notes && (
                      <div><strong>Observações:</strong> {service.notes}</div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4 mt-4">
            {sortedEvents.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhum evento registrado
                </CardContent>
              </Card>
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                <div className="space-y-4">
                  {sortedEvents.map((event, index) => (
                    <div key={event.id} className="relative pl-12">
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                        {index + 1}
                      </div>
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{event.title}</CardTitle>
                            <Badge variant="outline">{formatDate(event.date)}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">{event.type}</div>
                        </CardHeader>
                        {event.description && (
                          <CardContent>
                            <p>{event.description}</p>
                          </CardContent>
                        )}
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

