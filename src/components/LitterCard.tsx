import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Litter, Rat } from "@/types/rat";
import { LitterOffspringDialog } from "./LitterOffspringDialog";
import { Calendar, Users, Baby, Trash2 } from "lucide-react";

interface LitterCardProps {
  litter: Litter;
  onAddRats: (rats: Rat[]) => void;
  onDeleteLitter: (litterId: string) => void;
  allRats: Rat[];
}

export function LitterCard({ litter, onAddRats, onDeleteLitter, allRats }: LitterCardProps) {
  const mother = allRats.find(r => r.id === litter.motherId);
  const father = allRats.find(r => r.id === litter.fatherId);
  const offspring = allRats.filter(r => r.litterId === litter.id);

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="w-5 h-5" />
            {litter.litterCode}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">
              {litter.totalOffspring} filhotes
            </Badge>
            {offspring.length > 0 && (
              <Badge variant="secondary">
                {offspring.length} cadastrados
              </Badge>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
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
      <CardContent className="space-y-4">
        {/* Informações dos Pais */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Mãe</p>
            <p className="font-medium">{mother?.name || "Desconhecida"}</p>
            {mother && (
              <p className="text-xs text-muted-foreground">{mother.coatColor}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pai</p>
            <p className="font-medium">{father?.name || "Desconhecido"}</p>
            {father && (
              <p className="text-xs text-muted-foreground">{father.coatColor}</p>
            )}
          </div>
        </div>

        {/* Data de Nascimento */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Nascidos em {new Date(litter.birthDate).toLocaleDateString('pt-BR')}</span>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-blue-50 rounded">
            <p className="text-sm font-medium text-blue-700">{litter.malesCount || 0}</p>
            <p className="text-xs text-blue-600">Machos</p>
          </div>
          <div className="p-2 bg-pink-50 rounded">
            <p className="text-sm font-medium text-pink-700">{litter.femalesCount || 0}</p>
            <p className="text-xs text-pink-600">Fêmeas</p>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <p className="text-sm font-medium text-green-700">{litter.survivedCount || litter.totalOffspring}</p>
            <p className="text-xs text-green-600">Sobreviventes</p>
          </div>
        </div>

        {/* Filhotes Cadastrados */}
        {offspring.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Filhotes Cadastrados:</p>
            <div className="space-y-1">
              {offspring.map(rat => (
                <div key={rat.id} className="flex justify-between items-center text-sm p-2 bg-muted/30 rounded">
                  <span className="font-medium">{rat.name}</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {rat.sex}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {rat.coatColor}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Observações */}
        {(litter.behavioralNotes || litter.healthNotes || litter.generalNotes) && (
          <div>
            <p className="text-sm font-medium mb-2">Observações:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              {litter.behavioralNotes && (
                <p><strong>Comportamento:</strong> {litter.behavioralNotes}</p>
              )}
              {litter.healthNotes && (
                <p><strong>Saúde:</strong> {litter.healthNotes}</p>
              )}
              {litter.generalNotes && (
                <p><strong>Geral:</strong> {litter.generalNotes}</p>
              )}
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="pt-2 border-t">
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
