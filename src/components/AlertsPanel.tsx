import { Alert, Pet, Service } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, Check } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

interface AlertsPanelProps {
  alerts: Alert[];
  pets: Pet[];
  services: Service[];
  onResolve?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
}

export function AlertsPanel({ alerts, pets, services, onResolve, onDismiss }: AlertsPanelProps) {
  const activeAlerts = alerts.filter(a => a.status === "Ativo");
  
  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case "Urgente": return "bg-red-600 text-white";
      case "Alta": return "bg-orange-500 text-white";
      case "Média": return "bg-yellow-500 text-white";
      case "Baixa": return "bg-blue-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case "Vacina": return "💉";
      case "Vermífugo": return "🪱";
      case "Pagamento": return "💰";
      case "Consulta": return "🩺";
      case "Tarefa": return "✓";
      default: return "⚠️";
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return format(new Date(dateStr), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  if (activeAlerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Nenhum alerta ativo
          </p>
        </CardContent>
      </Card>
    );
  }

  // Ordenar por prioridade
  const sortedAlerts = [...activeAlerts].sort((a, b) => {
    const priorityOrder = { "Urgente": 0, "Alta": 1, "Média": 2, "Baixa": 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          Alertas ({activeAlerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedAlerts.map(alert => {
            const pet = alert.relatedPetId ? pets.find(p => p.id === alert.relatedPetId) : null;
            const service = alert.relatedServiceId ? services.find(s => s.id === alert.relatedServiceId) : null;

            return (
              <div 
                key={alert.id} 
                className={`border rounded-lg p-3 ${getPriorityColor(alert.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getTypeIcon(alert.type)}</span>
                      <span className="font-semibold">{alert.title}</span>
                      <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                        {alert.priority}
                      </Badge>
                    </div>
                    {alert.description && (
                      <p className="text-sm opacity-90 mb-1">{alert.description}</p>
                    )}
                    {pet && (
                      <div className="text-xs opacity-90">
                        <strong>Pet:</strong> {pet.name}
                      </div>
                    )}
                    {service && (
                      <div className="text-xs opacity-90">
                        <strong>Serviço:</strong> {service.serviceType}
                      </div>
                    )}
                    {alert.dueDate && (
                      <div className="text-xs opacity-90 mt-1">
                        <strong>Vencimento:</strong> {formatDate(alert.dueDate)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {onResolve && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onResolve(alert.id)}
                        className="h-7 w-7 p-0 text-white hover:bg-white/20"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    {onDismiss && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDismiss(alert.id)}
                        className="h-7 w-7 p-0 text-white hover:bg-white/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
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


