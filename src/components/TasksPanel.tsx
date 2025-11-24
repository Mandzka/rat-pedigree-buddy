import { Task, Pet } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Check, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

interface TasksPanelProps {
  tasks: Task[];
  pets: Pet[];
  onToggleTask?: (taskId: string) => void;
  onAddTask?: () => void;
}

export function TasksPanel({ tasks, pets, onToggleTask, onAddTask }: TasksPanelProps) {
  const pendingTasks = tasks.filter(t => t.status === "Pendente" || t.status === "Em Andamento");
  
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case "Urgente": return "text-red-600";
      case "Alta": return "text-orange-600";
      case "Média": return "text-yellow-600";
      case "Baixa": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  const getTypeIcon = (type: Task['type']) => {
    switch (type) {
      case "Banho": return "🛁";
      case "Limpeza": return "🧹";
      case "Compras": return "🛒";
      case "Veterinário": return "🩺";
      default: return "✓";
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

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    try {
      return new Date(dueDate) < new Date();
    } catch {
      return false;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            Tarefas Pendentes ({pendingTasks.length})
          </CardTitle>
          {onAddTask && (
            <Button size="sm" variant="outline" onClick={onAddTask}>
              <Plus className="w-4 h-4 mr-1" />
              Nova Tarefa
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {pendingTasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Nenhuma tarefa pendente
          </p>
        ) : (
          <div className="space-y-2">
            {pendingTasks.map(task => {
              const pet = task.assignedToPetId ? pets.find(p => p.id === task.assignedToPetId) : null;
              const overdue = isOverdue(task.dueDate);

              return (
                <div 
                  key={task.id} 
                  className={`border rounded-lg p-3 ${task.status === "Em Andamento" ? "bg-blue-50" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={task.status === "Em Andamento" || task.status === "Concluída"}
                      onCheckedChange={() => onToggleTask?.(task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getTypeIcon(task.type)}</span>
                        <span className="font-semibold">{task.title}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority}
                        </Badge>
                        {task.status === "Em Andamento" && (
                          <Badge variant="default" className="text-xs">Em Andamento</Badge>
                        )}
                        {overdue && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Atrasada
                          </Badge>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-1">{task.description}</p>
                      )}
                      {pet && (
                        <div className="text-xs text-muted-foreground">
                          <strong>Pet:</strong> {pet.name}
                        </div>
                      )}
                      {task.dueDate && (
                        <div className={`text-xs flex items-center gap-1 mt-1 ${overdue ? "text-red-600 font-semibold" : "text-muted-foreground"}`}>
                          <Clock className="w-3 h-3" />
                          <span>Prazo: {formatDate(task.dueDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


