import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rat } from "@/types/rat";
import { formatAge } from "@/utils/ageCalculator";
import { Heart, Calendar, Star } from "lucide-react";

interface RatCardProps {
  rat: Rat;
  onClick: () => void;
}

export function RatCard({ rat, onClick }: RatCardProps) {

  return (
    <Card
      className="cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-hover)] hover:-translate-y-1 relative z-10"
      style={{ boxShadow: "var(--shadow-card)" }}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">{rat.name}</h3>
            <p className="text-muted-foreground text-sm flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatAge(rat.dateOfBirth)}
            </p>
          </div>
          {rat.breedingApproved && (
            <Badge className="text-white border-0" style={{ backgroundColor: '#ff9a9e' }}>
              <Heart className="w-3 h-3 mr-1" />
              Reprodutor
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Sexo:</span>
            <span className="ml-1 font-medium">{rat.sex}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Pelagem:</span>
            <span className="ml-1 font-medium">{rat.coatType}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Cor:</span>
            <span className="ml-1 font-medium">{rat.coatColor}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Marcação:</span>
            <span className="ml-1 font-medium">{rat.marking}</span>
          </div>
          {rat.tutorName && (
            <div className="text-sm col-span-2">
              <span className="text-muted-foreground">Nome do Tutor:</span>
              <span className="ml-1 font-medium text-primary">{rat.tutorName}</span>
            </div>
          )}
          {rat.litterName && (
            <div className="text-sm col-span-2">
              <span className="text-muted-foreground">Ninhada:</span>
              <span className="ml-1 font-medium text-secondary-foreground">{rat.litterName}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex gap-2">
            <Badge 
              variant="outline" 
              className="text-xs text-white"
              style={
                rat.origin === 'Comprado' ? { backgroundColor: '#a6b49c', borderColor: '#a6b49c' } :
                rat.origin === 'Nascido na Rattery' ? { backgroundColor: '#d3a17c', borderColor: '#d3a17c' } :
                {}
              }
            >
              {rat.origin}
            </Badge>
            <Badge 
              className="text-xs text-white"
              style={
                rat.destination === 'Reprodução' ? { backgroundColor: '#c4a3ff' } :
                rat.destination === 'Matriz' ? { backgroundColor: '#ffb3d1' } :
                rat.destination === 'Padreador' ? { backgroundColor: '#a3d5ff' } :
                rat.destination === 'Comprado' ? { backgroundColor: '#a6b49c' } :
                rat.destination === 'Nascido na Rattery' ? { backgroundColor: '#d3a17c' } :
                rat.destination === 'Pet' ? { backgroundColor: '#a8e6cf' } :
                rat.destination === 'À venda' ? { backgroundColor: '#ffd3a5' } :
                rat.destination === 'Para adoção' ? { backgroundColor: '#a8d8ea' } :
                rat.destination === 'Vendido' ? { backgroundColor: '#c7ceea' } :
                rat.destination === 'Doado' ? { backgroundColor: '#f0a3ff' } :
                { backgroundColor: '#6b7280' }
              }
            >
              {rat.destination}
            </Badge>
          </div>
          {averageTemperament > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span>{averageTemperament.toFixed(1)}/5</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
