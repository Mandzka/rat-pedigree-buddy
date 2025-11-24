import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Rat } from "@/types/rat";
import { formatAge } from "@/utils/ageCalculator";
import { Calendar, Heart, Dna, Activity, Edit, Trash2, FileText, Trees } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface RatDetailsDialogProps {
  rat: Rat | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (rat: Rat) => void;
  onDelete: (ratId: string) => void;
  allRats: Rat[];
  onShowPedigree?: (rat: Rat) => void;
  onShowTree?: (rat: Rat) => void;
}

export function RatDetailsDialog({ rat, open, onOpenChange, onEdit, onDelete, allRats, onShowPedigree, onShowTree }: RatDetailsDialogProps) {
  const navigate = useNavigate();
  
  if (!rat) return null;

  console.log('RatDetailsDialog renderizando:', rat.name);
  
  const handleViewPedigree = () => {
    if (onShowPedigree) {
      onShowPedigree(rat);
    }
  };

  const handleViewTree = () => {
    if (onShowTree) {
      onShowTree(rat);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl flex items-center gap-2">
              {rat.name}
              {rat.breedingApproved && (
                <Badge className="text-white border-0" style={{ backgroundColor: '#ff9a9e' }}>
                  <Heart className="w-3 h-3 mr-1" />
                  Reprodutor
                </Badge>
              )}
            </DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(rat)}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir {rat.name}? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        onDelete(rat.id);
                        onOpenChange(false);
                        toast.success(`${rat.name} foi excluído com sucesso!`);
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Botões */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleViewPedigree}
              className="text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              style={{ backgroundColor: '#c4a3ff' }}
            >
              <FileText className="h-5 w-5" />
              Certificado
            </Button>
            <Button
              onClick={handleViewTree}
              variant="outline"
              className="px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Trees className="h-5 w-5" />
              Árvore Genealógica
            </Button>
          </div>

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
                <p className="text-sm text-muted-foreground">Sexo</p>
                <p className="font-medium">{rat.sex}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Origem</p>
                <p className="font-medium">{rat.origin}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Destino</p>
                <p className="font-medium">{rat.destination}</p>
              </div>
              {rat.tutorName && (
                <div>
                  <p className="text-sm text-muted-foreground">Nome do Tutor</p>
                  <p className="font-medium">{rat.tutorName}</p>
                </div>
              )}
              {rat.litterName && (
                <div>
                  <p className="text-sm text-muted-foreground">Ninhada</p>
                  <p className="font-medium">{rat.litterName}</p>
                </div>
              )}
            </div>
          </div>

          {/* Características Físicas */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Dna className="w-5 h-5" />
              Características Físicas
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Cor da Pelagem</p>
                <p className="font-medium">{rat.coatColor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Pelagem</p>
                <p className="font-medium">{rat.coatType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Marcação</p>
                <p className="font-medium">{rat.marking}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cor dos Olhos</p>
                <p className="font-medium">{rat.eyeColor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Orelha</p>
                <p className="font-medium">{rat.earType}</p>
              </div>
            </div>
          </div>

          {/* Genética */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Dna className="w-5 h-5" />
              Genética
            </h3>
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              {rat.genotype && (
                <div>
                  <p className="text-sm text-muted-foreground">Genótipo Completo</p>
                  <p className="font-medium">{rat.genotype}</p>
                </div>
              )}
              {rat.colorGenotype && (
                <div>
                  <p className="text-sm text-muted-foreground">Genótipo da Cor</p>
                  <p className="font-medium">{rat.colorGenotype}</p>
                </div>
              )}
              {rat.eyeGenotype && (
                <div>
                  <p className="text-sm text-muted-foreground">Genótipo dos Olhos</p>
                  <p className="font-medium">{rat.eyeGenotype}</p>
                </div>
              )}
              {rat.earGenotype && (
                <div>
                  <p className="text-sm text-muted-foreground">Genótipo das Orelhas</p>
                  <p className="font-medium">{rat.earGenotype}</p>
                </div>
              )}
              {rat.coatGenotype && (
                <div>
                  <p className="text-sm text-muted-foreground">Genótipo da Pelagem</p>
                  <p className="font-medium">{rat.coatGenotype}</p>
                </div>
              )}
              {rat.markingGenotype && (
                <div>
                  <p className="text-sm text-muted-foreground">Genótipo da Marcação</p>
                  <p className="font-medium">{rat.markingGenotype}</p>
                </div>
              )}
              {rat.inbreedingCoefficient !== undefined && rat.inbreedingCoefficient > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Coeficiente de Endogamia</p>
                  <div className="flex items-center gap-2">
                    <Progress value={rat.inbreedingCoefficient * 100} className="flex-1" />
                    <span className="text-sm font-medium">{(rat.inbreedingCoefficient * 100).toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reprodução */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Reprodução
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Ativo para Reprodução</p>
                <p className="font-medium">{rat.isBreeder ? "Sim" : "Não"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aprovado para Reprodução</p>
                <p className="font-medium">{rat.breedingApproved ? "Sim" : "Não"}</p>
              </div>
              {rat.sex === "Fêmea" && rat.numberOfLitters !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground">Número de Ninhadas</p>
                  <p className="font-medium">{rat.numberOfLitters}</p>
                </div>
              )}
            </div>
          </div>

          {/* Observações */}
          {rat.temperamentNotes && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Observações
              </h3>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm">{rat.temperamentNotes}</p>
              </div>
            </div>
          )}

          {rat.notes && (
            <div className="space-y-2">
              <h3 className="font-semibold">Notas Adicionais</h3>
              <p className="text-sm p-4 bg-muted/50 rounded-lg">{rat.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}