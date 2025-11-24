import { Service, Client, Pet } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

interface TodayScheduleProps {
  services: Service[];
  clients: Client[];
  pets: Pet[];
}

export function TodaySchedule({ services, clients, pets }: TodayScheduleProps) {
  const today = new Date().toISOString().split('T')[0];
  
  const todayServices = services.filter(s => {
    try {
      return s.startDate.split('T')[0] === today || 
             (s.endDate && s.endDate.split('T')[0] === today) ||
             (s.startDate <= today && (!s.endDate || s.endDate >= today) && s.status !== "Concluído" && s.status !== "Cancelado");
    } catch {
      return false;
    }
  });

  const getServiceTypeColor = (type: Service['serviceType']) => {
    switch (type) {
      case "Hospedagem": return "bg-purple-100 text-purple-800 border-purple-300";
      case "Dog Walking": return "bg-blue-100 text-blue-800 border-blue-300";
      case "Treinamento": return "bg-green-100 text-green-800 border-green-300";
      case "Pet Sitting": return "bg-orange-100 text-orange-800 border-orange-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getServiceTypeIcon = (type: Service['serviceType']) => {
    switch (type) {
      case "Hospedagem": return "🏨";
      case "Dog Walking": return "🚶";
      case "Treinamento": return "🎓";
      case "Pet Sitting": return "🏠";
      default: return "🐾";
    }
  };

  const formatTime = (time?: string) => {
    if (!time) return "";
    try {
      return time.substring(0, 5); // HH:mm
    } catch {
      return time;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  if (todayServices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Agenda de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Nenhum serviço agendado para hoje
          </p>
        </CardContent>
      </Card>
    );
  }

  // Separar por status
  const activeServices = todayServices.filter(s => s.status === "Em Andamento");
  const scheduledServices = todayServices.filter(s => s.status === "Agendado");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Agenda de Hoje ({todayServices.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeServices.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Em Andamento</h3>
            <div className="space-y-2">
              {activeServices.map(service => {
                const client = clients.find(c => c.id === service.clientId);
                const servicePets = pets.filter(p => service.petIds.includes(p.id));
                return (
                  <div 
                    key={service.id} 
                    className={`border rounded-lg p-3 ${getServiceTypeColor(service.serviceType)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{getServiceTypeIcon(service.serviceType)}</span>
                          <span className="font-semibold">{service.serviceType}</span>
                          <Badge variant="default" className="text-xs">Em Andamento</Badge>
                        </div>
                        <div className="text-sm mt-1">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <strong>Cliente:</strong> {client?.name || "Não encontrado"}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span>🐕</span>
                            <span>{servicePets.map(p => p.name).join(", ") || "Nenhum pet"}</span>
                          </div>
                          {service.startTime && (
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              <span>Início: {formatTime(service.startTime)}</span>
                            </div>
                          )}
                          {service.location && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              <span>{service.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {scheduledServices.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Agendados</h3>
            <div className="space-y-2">
              {scheduledServices.map(service => {
                const client = clients.find(c => c.id === service.clientId);
                const servicePets = pets.filter(p => service.petIds.includes(p.id));
                return (
                  <div 
                    key={service.id} 
                    className={`border rounded-lg p-3 ${getServiceTypeColor(service.serviceType)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{getServiceTypeIcon(service.serviceType)}</span>
                          <span className="font-semibold">{service.serviceType}</span>
                          <Badge variant="outline" className="text-xs">Agendado</Badge>
                        </div>
                        <div className="text-sm mt-1">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <strong>Cliente:</strong> {client?.name || "Não encontrado"}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span>🐕</span>
                            <span>{servicePets.map(p => p.name).join(", ") || "Nenhum pet"}</span>
                          </div>
                          {service.startTime && (
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatTime(service.startTime)}</span>
                            </div>
                          )}
                          {service.location && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              <span>{service.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


