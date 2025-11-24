import { Pet, Client } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PawPrint, Camera, Edit, Trash2, Eye, Calendar, Heart } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

interface PetCardEnhancedProps {
  pet: Pet;
  client?: Client;
  onView?: (pet: Pet) => void;
  onEdit?: (pet: Pet) => void;
  onDelete?: (petId: string) => void;
}

export function PetCardEnhanced({ pet, client, onView, onEdit, onDelete }: PetCardEnhancedProps) {
  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return null;
    try {
      const birth = new Date(dateOfBirth);
      const today = new Date();
      const years = today.getFullYear() - birth.getFullYear();
      const months = today.getMonth() - birth.getMonth();
      
      if (years === 0) {
        return `${months} ${months === 1 ? 'mês' : 'meses'}`;
      }
      return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    } catch {
      return null;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  const age = calculateAge(pet.dateOfBirth);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            {pet.photoUrl ? (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img 
                  src={pet.photoUrl} 
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                <PawPrint className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{pet.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">{pet.species}</Badge>
                {pet.breed && <Badge variant="outline" className="text-xs truncate max-w-[100px]">{pet.breed}</Badge>}
                {!pet.isActive && <Badge variant="destructive" className="text-xs">Inativo</Badge>}
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(pet)}
                className="h-8 w-8 p-0"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(pet)}
                className="h-8 w-8 p-0"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(pet.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {client && (
          <div className="text-sm text-muted-foreground truncate">
            <strong>Dono:</strong> {client.name}
          </div>
        )}
        {age && (
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span>{age}</span>
            {pet.dateOfBirth && (
              <span className="text-xs">• {formatDate(pet.dateOfBirth)}</span>
            )}
          </div>
        )}
        {pet.weight && (
          <div className="text-sm text-muted-foreground">
            <strong>Peso:</strong> {pet.weight} kg
          </div>
        )}
        {pet.microchip && (
          <div className="text-xs text-muted-foreground truncate">
            <strong>Microchip:</strong> {pet.microchip}
          </div>
        )}
        {pet.isNeutered !== undefined && (
          <div className="flex items-center gap-2">
            {pet.isNeutered ? (
              <Badge variant="default" className="text-xs">✓ Castrado</Badge>
            ) : (
              <Badge variant="outline" className="text-xs">Intacto</Badge>
            )}
          </div>
        )}
        {pet.allergies && (
          <div className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
            ⚠️ Alergias registradas
          </div>
        )}
        {(pet.currentMedications || pet.medications) && (
          <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
            💊 Em medicação
          </div>
        )}
      </CardContent>
    </Card>
  );
}

