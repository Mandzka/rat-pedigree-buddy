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
  const averageTemperament = rat.temperamentScores
    ? Object.values(rat.temperamentScores).reduce((a, b) => a + b, 0) / 6
    : 0;

  return (
    <Card
      className="cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-hover)] hover:-translate-y-1"
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
            <Badge className="bg-gradient-to-r from-primary to-accent border-0">
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
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Badge variant="outline" className="text-xs">
            {rat.origin}
          </Badge>
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
