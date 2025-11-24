import React, { useState, useEffect } from "react";
import { Client, Pet, Service, MedicalRecord, VaccineRecord, PetEvent, Task, Alert } from "../types/client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alert-dialog";
import { Users, PawPrint, Calendar, Plus, Search, Phone, Mail, MapPin, Edit, Trash2, Clock, DollarSign, TrendingUp, FileText } from "lucide-react";
import { AddClientDialog } from "../components/AddClientDialog";
import { AddPetDialog } from "../components/AddPetDialog";
import { AddServiceDialog } from "../components/AddServiceDialog";
import { PetProfileDialog } from "../components/PetProfileDialog";
import { PetCardEnhanced } from "../components/PetCardEnhanced";
import { TodaySchedule } from "../components/TodaySchedule";
import { PetsUnderCare } from "../components/PetsUnderCare";
import { AlertsPanel } from "../components/AlertsPanel";
import { TasksPanel } from "../components/TasksPanel";
import { clientService, petService, serviceService } from "../services/petCareService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

const Index = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [vaccineRecords, setVaccineRecords] = useState<VaccineRecord[]>([]);
  const [petEvents, setPetEvents] = useState<PetEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddClientDialog, setShowAddClientDialog] = useState(false);
  const [showAddPetDialog, setShowAddPetDialog] = useState(false);
  const [showAddServiceDialog, setShowAddServiceDialog] = useState(false);
  const [viewingPet, setViewingPet] = useState<Pet | null>(null);
  const [showPetProfile, setShowPetProfile] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  const [deletePetId, setDeletePetId] = useState<string | null>(null);
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadDataAsync = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (supabaseUrl) {
          try {
            const [clientsData, petsData, servicesData] = await Promise.all([
              clientService.getAll(),
              petService.getAll(),
              serviceService.getAll(),
            ]);
            if (mounted) {
              setClients(clientsData);
              setPets(petsData);
              setServices(servicesData);
            }
            return;
      } catch (error) {
            console.warn("Error loading from Supabase, falling back to localStorage:", error);
          }
        }
        if (mounted) {
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error("Error loading data:", error);
        if (mounted) {
          loadFromLocalStorage();
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    loadDataAsync();
    return () => {
      mounted = false;
    };
  }, []);

  const loadFromLocalStorage = () => {
    try {
      const storedClients = localStorage.getItem("petCareClients");
      const storedPets = localStorage.getItem("petCarePets");
      const storedServices = localStorage.getItem("petCareServices");
      const storedMedicalRecords = localStorage.getItem("petCareMedicalRecords");
      const storedVaccineRecords = localStorage.getItem("petCareVaccineRecords");
      const storedPetEvents = localStorage.getItem("petCarePetEvents");
      const storedTasks = localStorage.getItem("petCareTasks");
      const storedAlerts = localStorage.getItem("petCareAlerts");
      
      if (storedClients) {
        try {
          setClients(JSON.parse(storedClients));
        } catch (e) {
          console.error("Error parsing clients:", e);
        }
      }
      if (storedPets) {
        try {
          setPets(JSON.parse(storedPets));
        } catch (e) {
          console.error("Error parsing pets:", e);
        }
      }
      if (storedServices) {
        try {
          setServices(JSON.parse(storedServices));
        } catch (e) {
          console.error("Error parsing services:", e);
        }
      }
      if (storedMedicalRecords) {
        try {
          setMedicalRecords(JSON.parse(storedMedicalRecords));
        } catch (e) {
          console.error("Error parsing medical records:", e);
        }
      }
      if (storedVaccineRecords) {
        try {
          setVaccineRecords(JSON.parse(storedVaccineRecords));
        } catch (e) {
          console.error("Error parsing vaccine records:", e);
        }
      }
      if (storedPetEvents) {
        try {
          setPetEvents(JSON.parse(storedPetEvents));
        } catch (e) {
          console.error("Error parsing pet events:", e);
        }
      }
      if (storedTasks) {
        try {
          setTasks(JSON.parse(storedTasks));
        } catch (e) {
          console.error("Error parsing tasks:", e);
        }
      }
      if (storedAlerts) {
        try {
          setAlerts(JSON.parse(storedAlerts));
        } catch (e) {
          console.error("Error parsing alerts:", e);
        }
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem("petCareClients", JSON.stringify(clients));
      localStorage.setItem("petCarePets", JSON.stringify(pets));
      localStorage.setItem("petCareServices", JSON.stringify(services));
      localStorage.setItem("petCareMedicalRecords", JSON.stringify(medicalRecords));
      localStorage.setItem("petCareVaccineRecords", JSON.stringify(vaccineRecords));
      localStorage.setItem("petCarePetEvents", JSON.stringify(petEvents));
      localStorage.setItem("petCareTasks", JSON.stringify(tasks));
      localStorage.setItem("petCareAlerts", JSON.stringify(alerts));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [clients, pets, services, medicalRecords, vaccineRecords, petEvents, tasks, alerts]);

  // Gerar alertas automaticamente baseado em vacinas e pagamentos
  useEffect(() => {
    const newAlerts: Alert[] = [];
    const existingAlertIds = new Set(alerts.map(a => a.id));

    // Alertas de vacinas vencendo
    vaccineRecords.forEach(vaccine => {
      if (vaccine.nextDueDate) {
        try {
          const dueDate = new Date(vaccine.nextDueDate);
          const today = new Date();
          const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          // Criar alerta se vence em 30 dias ou já venceu
          if (daysDiff <= 30 && !existingAlertIds.has(`vaccine-${vaccine.id}`)) {
            const pet = pets.find(p => p.id === vaccine.petId);
            newAlerts.push({
              id: `vaccine-${vaccine.id}`,
              type: "Vacina",
              title: `Vacina vencendo: ${vaccine.vaccineType}`,
              description: pet ? `Pet: ${pet.name} - Próxima dose: ${format(new Date(vaccine.nextDueDate), "dd/MM/yyyy", { locale: ptBR })}` : undefined,
              priority: daysDiff <= 0 ? "Urgente" : daysDiff <= 7 ? "Alta" : "Média",
              status: "Ativo",
              relatedPetId: vaccine.petId,
              dueDate: vaccine.nextDueDate,
              createdAt: new Date().toISOString(),
            });
          }
        } catch (e) {
          // Ignorar erro
        }
      }
    });

    // Alertas de pagamentos pendentes
    services.forEach(service => {
      if (service.price && service.status === "Concluído") {
        // Assumir que pagamento está pendente se não há registro financeiro (implementar depois)
        // Por enquanto, apenas serviços com mais de 7 dias concluídos sem pagamento
        try {
          if (service.completedAt) {
            const completedDate = new Date(service.completedAt);
            const today = new Date();
            const daysDiff = Math.ceil((today.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysDiff >= 7 && !existingAlertIds.has(`payment-${service.id}`)) {
              const client = clients.find(c => c.id === service.clientId);
              newAlerts.push({
                id: `payment-${service.id}`,
                type: "Pagamento",
                title: `Pagamento pendente: ${service.serviceType}`,
                description: client ? `Cliente: ${client.name} - Valor: R$ ${service.price.toFixed(2)}` : undefined,
                priority: daysDiff >= 30 ? "Urgente" : daysDiff >= 14 ? "Alta" : "Média",
                status: "Ativo",
                relatedServiceId: service.id,
                createdAt: new Date().toISOString(),
              });
            }
          }
        } catch (e) {
          // Ignorar erro
        }
      }
    });

    if (newAlerts.length > 0) {
      setAlerts([...alerts, ...newAlerts]);
    }
  }, [vaccineRecords, services, pets, clients]); // Não incluir alerts para evitar loop

  const handleAddClient = async (client: Client) => {
    try {
      if (editingClient) {
        const updated = await clientService.update(client);
        setClients(clients.map(c => c.id === updated.id ? updated : c));
        setEditingClient(null);
      } else {
        const newClient = await clientService.create(client);
        setClients([...clients, newClient]);
      }
      setShowAddClientDialog(false);
      } catch (error) {
      if (editingClient) {
        setClients(clients.map(c => c.id === client.id ? client : c));
      } else {
        setClients([...clients, client]);
      }
      setShowAddClientDialog(false);
    }
  };

  const handleAddPet = async (pet: Pet) => {
    try {
      if (editingPet) {
        const updated = await petService.update(pet);
        setPets(pets.map(p => p.id === updated.id ? updated : p));
        setEditingPet(null);
      } else {
        const newPet = await petService.create(pet);
        setPets([...pets, newPet]);
      }
      setShowAddPetDialog(false);
      } catch (error) {
      if (editingPet) {
        setPets(pets.map(p => p.id === pet.id ? pet : p));
      } else {
        setPets([...pets, pet]);
      }
      setShowAddPetDialog(false);
    }
  };

  const handleAddService = async (service: Service) => {
    try {
      if (editingService) {
        const updated = await serviceService.update(service);
        setServices(services.map(s => s.id === updated.id ? updated : s));
        setEditingService(null);
      } else {
        const newService = await serviceService.create(service);
        setServices([...services, newService]);
      }
      setShowAddServiceDialog(false);
    } catch (error) {
      if (editingService) {
        setServices(services.map(s => s.id === service.id ? service : s));
      } else {
        setServices([...services, service]);
      }
      setShowAddServiceDialog(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await clientService.delete(id);
    } catch (error) {
      // Fallback
    }
    setClients(clients.filter(c => c.id !== id));
    setPets(pets.filter(p => p.clientId !== id));
    setDeleteClientId(null);
  };

  const handleDeletePet = async (id: string) => {
    try {
      await petService.delete(id);
    } catch (error) {
      // Fallback
    }
    setPets(pets.filter(p => p.id !== id));
    setDeletePetId(null);
  };

  const handleDeleteService = async (id: string) => {
    try {
      await serviceService.delete(id);
    } catch (error) {
      // Fallback
    }
    setServices(services.filter(s => s.id !== id));
    setDeleteServiceId(null);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clients.find(c => c.id === pet.clientId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcomingServices = services
    .filter(s => {
      try {
        return s.status === "Agendado" && new Date(s.startDate) >= new Date();
      } catch (e) {
        return false;
      }
    })
    .sort((a, b) => {
      try {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      } catch (e) {
        return 0;
      }
    })
    .slice(0, 5);

  const getStatusColor = (status: Service['status']) => {
    switch (status) {
      case "Agendado": return "bg-blue-100 text-blue-800";
      case "Em Andamento": return "bg-yellow-100 text-yellow-800";
      case "Concluído": return "bg-green-100 text-green-800";
      case "Cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getServiceTypeIcon = (type: Service['serviceType']) => {
    switch (type) {
      case "Pet Sitting": return "🏠";
      case "Dog Walking": return "🚶";
      case "Treinamento": return "🎓";
      case "Hospedagem": return "🏨";
      default: return "🐾";
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Carregando...</div>
          <div className="text-sm text-gray-600">Inicializando Pet Care Manager</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PawPrint className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">DogDoc</h1>
                <p className="text-sm text-blue-100">Sistema de Documentação Profissional de Cães</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold">{clients.length}</div>
                <div className="text-xs text-blue-100">Clientes</div>
                    </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{pets.length}</div>
                <div className="text-xs text-blue-100">Pets</div>
                </div>
              </div>
            </div>
      </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar clientes, pets ou serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="pets">Pets</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total de Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{clients.length}</div>
                    <Users className="w-8 h-8 text-blue-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total de Pets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{pets.length}</div>
                    <PawPrint className="w-8 h-8 text-purple-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Serviços Agendados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">
                      {services.filter(s => s.status === "Agendado").length}
                    </div>
                    <Calendar className="w-8 h-8 text-green-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Faturamento Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">
                      R$ {services.filter(s => s.status === "Concluído" && s.price).reduce((sum, s) => sum + (s.price || 0), 0).toFixed(2)}
                    </div>
                    <DollarSign className="w-8 h-8 text-yellow-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Registros Médicos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{medicalRecords.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {medicalRecords.filter(m => {
                      try {
                        return new Date(m.date) >= new Date(new Date().setMonth(new Date().getMonth() - 1));
                      } catch {
                        return false;
                      }
                    }).length} no último mês
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Vacinas Pendentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {vaccineRecords.filter(v => {
                      if (!v.nextDueDate) return false;
                      try {
                        return new Date(v.nextDueDate) <= new Date();
                      } catch {
                        return false;
                      }
                    }).length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Precisam de atenção</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Taxa de Conclusão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {services.length > 0 
                      ? Math.round((services.filter(s => s.status === "Concluído").length / services.length) * 100)
                      : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {services.filter(s => s.status === "Concluído").length} de {services.length} serviços
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TodaySchedule services={services} clients={clients} pets={pets} />
              <PetsUnderCare pets={pets} services={services} clients={clients} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AlertsPanel
                alerts={alerts}
                pets={pets}
                services={services}
                onResolve={(alertId) => {
                  setAlerts(alerts.map(a => 
                    a.id === alertId 
                      ? { ...a, status: "Resolvido" as const, resolvedAt: new Date().toISOString() }
                      : a
                  ));
                }}
                onDismiss={(alertId) => {
                  setAlerts(alerts.map(a => 
                    a.id === alertId 
                      ? { ...a, status: "Ignorado" as const }
                      : a
                  ));
                }}
              />
              <TasksPanel
                tasks={tasks}
                pets={pets}
                onToggleTask={(taskId) => {
                  setTasks(tasks.map(t => {
                    if (t.id === taskId) {
                      if (t.status === "Pendente") {
                        return { ...t, status: "Em Andamento" as const };
                      } else if (t.status === "Em Andamento") {
                        return { ...t, status: "Concluída" as const, completedAt: new Date().toISOString() };
                      }
                      return { ...t, status: "Pendente" as const };
                    }
                    return t;
                  }));
                }}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Próximos Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingServices.length === 0 ? (
                  <p className="text-muted-foreground">Nenhum serviço agendado</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingServices.map(service => {
                      const client = clients.find(c => c.id === service.clientId);
                      const servicePets = pets.filter(p => service.petIds.includes(p.id));
                      return (
                        <div key={service.id} className="border rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-2xl">{getServiceTypeIcon(service.serviceType)}</div>
                            <div>
                              <div className="font-semibold">{service.serviceType}</div>
                              <div className="text-sm text-muted-foreground">
                                {client?.name} - {servicePets.map(p => p.name).join(", ")}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {service.startDate ? formatDate(service.startDate) : 'Data não informada'}
                                {service.startTime && ` às ${service.startTime}`}
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Clientes</h2>
              <Button onClick={() => {
                setEditingClient(null);
                setShowAddClientDialog(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Cliente
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map(client => {
                const clientPets = pets.filter(p => p.clientId === client.id);
                return (
                  <Card key={client.id}>
                    <CardHeader>
                      <CardTitle>{client.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {client.phone}
                        </div>
                      )}
                      {client.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {client.email}
                        </div>
                      )}
                      {client.address && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {client.address}
                        </div>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        <PawPrint className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{clientPets.length} {clientPets.length === 1 ? 'pet' : 'pets'}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
            <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingClient(client);
                            setShowAddClientDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
            </Button>
              <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteClientId(client.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {filteredClients.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">Nenhum cliente encontrado</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Pets</h2>
              <Button onClick={() => {
                setEditingPet(null);
                if (clients.length === 0) {
                  alert("Por favor, adicione um cliente primeiro");
                  return;
                }
                setShowAddPetDialog(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Pet
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPets.map(pet => {
                const owner = clients.find(c => c.id === pet.clientId);
                return (
                  <PetCardEnhanced
                    key={pet.id}
                    pet={pet}
                    client={owner}
                    onView={(pet) => {
                      setViewingPet(pet);
                      setShowPetProfile(true);
                    }}
                    onEdit={(pet) => {
                      setEditingPet(pet);
                      setShowAddPetDialog(true);
                    }}
                    onDelete={(petId) => setDeletePetId(petId)}
                  />
                );
              })}
              {filteredPets.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">Nenhum pet encontrado</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Serviços</h2>
              <Button onClick={() => {
                setEditingService(null);
                if (clients.length === 0) {
                  alert("Por favor, adicione um cliente primeiro");
                  return;
                }
                setShowAddServiceDialog(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Agendar Serviço
            </Button>
            </div>
            <div className="space-y-4">
              {services
                .sort((a, b) => {
                  try {
                    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
                  } catch (e) {
                    return 0;
                  }
                })
                .map(service => {
                  const client = clients.find(c => c.id === service.clientId);
                  const servicePets = pets.filter(p => service.petIds.includes(p.id));
                  return (
                    <Card key={service.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="text-3xl">{getServiceTypeIcon(service.serviceType)}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-semibold">{service.serviceType}</h3>
                                <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                              </div>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <div><strong>Cliente:</strong> {client?.name}</div>
                                <div><strong>Pets:</strong> {servicePets.map(p => p.name).join(", ")}</div>
                                <div className="flex items-center gap-4">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {service.startDate ? formatDate(service.startDate) : 'Data não informada'}
                                    {service.endDate && ` - ${formatDate(service.endDate)}`}
                                  </span>
                                  {service.startTime && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {service.startTime}
                                      {service.endTime && ` - ${service.endTime}`}
                                    </span>
                                  )}
                                </div>
                                <div><strong>Local:</strong> {service.location}</div>
                                {service.address && <div><strong>Endereço:</strong> {service.address}</div>}
                                {service.price && (
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4" />
                                    <strong>R$ {service.price.toFixed(2)}</strong>
                                  </div>
                                )}
                                {service.notes && <div className="mt-2">{service.notes}</div>}
            </div>
          </div>
        </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingService(service);
                                setShowAddServiceDialog(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteServiceId(service.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
        </div>
            </div>
                      </CardContent>
                    </Card>
                  );
                })}
              {services.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum serviço cadastrado</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AddClientDialog
        open={showAddClientDialog}
        onOpenChange={setShowAddClientDialog}
        onAddClient={handleAddClient}
        editingClient={editingClient}
      />

      <AddPetDialog
        open={showAddPetDialog}
        onOpenChange={setShowAddPetDialog}
        onAddPet={handleAddPet}
        clients={clients}
        editingPet={editingPet}
      />

      <AddServiceDialog
        open={showAddServiceDialog}
        onOpenChange={setShowAddServiceDialog}
        onAddService={handleAddService}
        clients={clients}
        pets={pets}
        editingService={editingService}
      />

      {viewingPet && (
        <PetProfileDialog
          pet={viewingPet}
          open={showPetProfile}
          onOpenChange={(open) => {
            setShowPetProfile(open);
            if (!open) setViewingPet(null);
          }}
          client={clients.find(c => c.id === viewingPet.clientId)}
          services={services}
          medicalRecords={medicalRecords.filter(m => m.petId === viewingPet.id)}
          vaccineRecords={vaccineRecords.filter(v => v.petId === viewingPet.id)}
          events={petEvents.filter(e => e.petId === viewingPet.id)}
        />
      )}

      <AlertDialog open={!!deleteClientId} onOpenChange={(open) => !open && setDeleteClientId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Todos os pets e serviços relacionados também serão excluídos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteClientId && handleDeleteClient(deleteClientId)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deletePetId} onOpenChange={(open) => !open && setDeletePetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este pet?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletePetId && handleDeletePet(deletePetId)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteServiceId} onOpenChange={(open) => !open && setDeleteServiceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este serviço?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteServiceId && handleDeleteService(deleteServiceId)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
