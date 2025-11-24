import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Litter, Rat } from "@/types/rat";
import { LitterOffspringDialog } from "./LitterOffspringDialog";
import { Calendar, Users, Baby, Trash2 } from "lucide-react";

interface CompactLitterCardProps {
  litter: Litter;
  onAddRats: (rats: Rat[]) => void;
  onDeleteLitter: (litterId: string) => void;
  allRats: Rat[];
}

export function CompactLitterCard({ litter, onAddRats, onDeleteLitter, allRats }: CompactLitterCardProps) {
  const mother = allRats.find(r => r.id === litter.motherId);
  const father = allRats.find(r => r.id === litter.fatherId);
  const offspring = allRats.filter(r => r.litterId === litter.id);

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-4 h-4" />
            {litter.litterCode}
          </CardTitle>
          <div className="flex gap-1">
            <Badge variant="outline" className="text-xs">
              {litter.totalOffspring}
            </Badge>
            {offspring.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {offspring.length}
              </Badge>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive h-6 w-6 p-0">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Ninhada</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir a ninhada "{litter.litterCode}"? 
                    Esta ação não pode ser desfeita e também excluirá todos os filhotes cadastrados desta ninhada.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDeleteLitter(litter.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {/* Informações dos Pais - Compacto */}
        <div className="grid grid-cols-2 gap-2 p-2 bg-muted/30 rounded text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Mãe</p>
            <p className="font-medium text-sm">{mother?.name || "Desconhecida"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pai</p>
            <p className="font-medium text-sm">{father?.name || "Desconhecido"}</p>
          </div>
        </div>

        {/* Data de Nascimento */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{new Date(litter.birthDate).toLocaleDateString('pt-BR')}</span>
        </div>

        {/* Botão de Ação */}
        <div className="flex justify-center">
          <LitterOffspringDialog 
            litter={litter} 
            onAddRats={onAddRats} 
            allRats={allRats}
          />
        </div>
      </CardContent>
    </Card>
  );
}
