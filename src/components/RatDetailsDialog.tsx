import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Rat } from "@/types/rat";
import { formatAge } from "@/utils/ageCalculator";
import { Calendar, Heart, Star, Dna, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RatDetailsDialogProps {
  rat: Rat | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RatDetailsDialog({ rat, open, onOpenChange }: RatDetailsDialogProps) {
  if (!rat) return null;

  const temperamentScores = rat.temperamentScores;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {rat.name}
            {rat.breedingApproved && (
              <Badge className="bg-gradient-to-r from-primary to-accent border-0">
                <Heart className="w-3 h-3 mr-1" />
                Reprodutor
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Informações Básicas
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Idade</p>
                <p className="font-medium">{formatAge(rat.dateOfBirth)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                <p className="font-medium">{new Date(rat.dateOfBirth).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sexo</p>
                <p className="font-medium">{rat.sex}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Origem</p>
                <p className="font-medium">{rat.origin}</p>
              </div>
            </div>
          </div>

          {/* Características Físicas */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Características Físicas
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Pelagem</p>
                <p className="font-medium">{rat.coatType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Textura</p>
                <p className="font-medium">{rat.coatTexture}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cor</p>
                <p className="font-medium">{rat.coatColor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Marcação</p>
                <p className="font-medium">{rat.marking}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Olhos</p>
                <p className="font-medium">{rat.eyeColor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Orelhas</p>
                <p className="font-medium">{rat.earType}</p>
              </div>
            </div>
          </div>

          {/* Genética */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Dna className="w-5 h-5" />
              Genética e Reprodução
            </h3>
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              {rat.genotype && (
                <div>
                  <p className="text-sm text-muted-foreground">Genótipo</p>
                  <p className="font-medium font-mono">{rat.genotype}</p>
                </div>
              )}
              {rat.inbreedingCoefficient !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Coeficiente de Inbreeding: {rat.inbreedingCoefficient}%
                  </p>
                  <Progress value={rat.inbreedingCoefficient} className="h-2" />
                </div>
              )}
              {rat.deformities && (
                <div>
                  <p className="text-sm text-muted-foreground">Deformidades</p>
                  <p className="font-medium">{rat.deformities}</p>
                </div>
              )}
            </div>
          </div>

          {/* Temperamento */}
          {temperamentScores && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Star className="w-5 h-5" />
                Temperamento
              </h3>
              {rat.temperamentNotes && (
                <p className="text-sm p-4 bg-muted/50 rounded-lg italic">
                  "{rat.temperamentNotes}"
                </p>
              )}
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>🌿 Sociabilidade</span>
                    <span className="font-medium">{temperamentScores.sociability}/5</span>
                  </div>
                  <Progress value={temperamentScores.sociability * 20} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>💪 Coragem</span>
                    <span className="font-medium">{temperamentScores.courage}/5</span>
                  </div>
                  <Progress value={temperamentScores.courage * 20} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>🐭 Curiosidade</span>
                    <span className="font-medium">{temperamentScores.curiosity}/5</span>
                  </div>
                  <Progress value={temperamentScores.curiosity * 20} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>🧘‍♂️ Calma</span>
                    <span className="font-medium">{temperamentScores.calmness}/5</span>
                  </div>
                  <Progress value={temperamentScores.calmness * 20} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>🧩 Dominância</span>
                    <span className="font-medium">{temperamentScores.dominance}/5</span>
                  </div>
                  <Progress value={temperamentScores.dominance * 20} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>❤️ Apego ao Humano</span>
                    <span className="font-medium">{temperamentScores.humanAttachment}/5</span>
                  </div>
                  <Progress value={temperamentScores.humanAttachment * 20} className="h-2" />
                </div>
              </div>
            </div>
          )}

          {rat.notes && (
            <div className="space-y-2">
              <h3 className="font-semibold">Observações</h3>
              <p className="text-sm p-4 bg-muted/50 rounded-lg">{rat.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
