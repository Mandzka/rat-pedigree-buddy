import { Pet, Service, Client } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

interface PetsUnderCareProps {
  pets: Pet[];
  services: Service[];
  clients: Client[];
}

export function PetsUnderCare({ pets, services, clients }: PetsUnderCareProps) {
  const activeServices = services.filter(s => s.status === "Em Andamento");
  const activePetIds = new Set<string>();
  activeServices.forEach(s => s.petIds.forEach(id => activePetIds.add(id)));
  
  const petsUnderCare = pets.filter(p => activePetIds.has(p.id));

  const getPetServices = (petId: string) => {
    return activeServices.filter(s => s.petIds.includes(petId));
  };

  if (petsUnderCare.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Cães Sob Cuidados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Nenhum cão está sob seus cuidados no momento
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5" />
          Cães Sob Cuidados ({petsUnderCare.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {petsUnderCare.map(pet => {
            const client = clients.find(c => c.id === pet.clientId);
            const petServices = getPetServices(pet.id);
            
            return (
              <div key={pet.id} className="border rounded-lg p-3 bg-blue-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{pet.name}</span>
                      {pet.isNeutered !== undefined && (
                        <Badge variant={pet.isNeutered ? "default" : "outline"} className="text-xs">
                          {pet.isNeutered ? "Castrado" : "Intacto"}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div><strong>Dono:</strong> {client?.name || "Não encontrado"}</div>
                      {pet.breed && <div><strong>Raça:</strong> {pet.breed}</div>}
                      {pet.weight && <div><strong>Peso:</strong> {pet.weight} kg</div>}
                    </div>
                    <div className="mt-2 space-y-1">
                      {petServices.map(service => (
                        <Badge 
                          key={service.id} 
                          variant="outline" 
                          className="text-xs mr-1"
                        >
                          {service.serviceType}
                          {service.startTime && ` - ${service.startTime.substring(0, 5)}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}


