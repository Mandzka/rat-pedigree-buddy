import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Rat, Litter } from "@/types/rat";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";

interface AddLitterDialogProps {
  onAddLitter: (litter: Litter) => void;
  allRats: Rat[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddLitterDialog({ onAddLitter, allRats, open: externalOpen, onOpenChange }: AddLitterDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const [formData, setFormData] = useState({
    litterName: "",
    motherId: "",
    fatherId: "",
    birthDate: "",
    totalOffspring: 0,
    malesCount: 0,
    femalesCount: 0,
    survivedCount: 0,
    behavioralNotes: "",
    healthNotes: "",
    generalNotes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.litterName || !formData.motherId || !formData.fatherId || !formData.birthDate) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (formData.totalOffspring <= 0) {
      toast.error("Número total de filhotes deve ser maior que zero");
      return;
    }

    if (formData.malesCount + formData.femalesCount !== formData.totalOffspring) {
      toast.error("A soma de machos e fêmeas deve ser igual ao total de filhotes");
      return;
    }

    const newLitter: Litter = {
      id: crypto.randomUUID(),
      litterCode: formData.litterName,
      motherId: formData.motherId,
      fatherId: formData.fatherId,
      birthDate: formData.birthDate,
      offspringIds: [],
      totalOffspring: formData.totalOffspring,
      malesCount: formData.malesCount,
      femalesCount: formData.femalesCount,
      survivedCount: formData.survivedCount || formData.totalOffspring,
      behavioralNotes: formData.behavioralNotes || undefined,
      healthNotes: formData.healthNotes || undefined,
      generalNotes: formData.generalNotes || undefined,
    };

    onAddLitter(newLitter);
    setOpen(false);
    toast.success(`Ninhada "${newLitter.litterCode}" foi adicionada com sucesso!`);
    
    // Reset form
    setFormData({
      litterName: "",
      motherId: "",
      fatherId: "",
      birthDate: "",
      totalOffspring: 0,
      malesCount: 0,
      femalesCount: 0,
      survivedCount: 0,
      behavioralNotes: "",
      healthNotes: "",
      generalNotes: "",
    });
  };

  const availableMothers = allRats.filter(r => r.sex === "Fêmea" && r.breedingApproved);
  const availableFathers = allRats.filter(r => r.sex === "Macho" && r.breedingApproved);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Adicionar Nova Ninhada</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Informações Básicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="litterName">Nome da Ninhada *</Label>
                <Input
                  id="litterName"
                  value={formData.litterName}
                  onChange={(e) => setFormData({ ...formData, litterName: e.target.value })}
                  placeholder="Ex: Rainbow, Estrela, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Pais */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Pais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mother">Mãe *</Label>
                <Select value={formData.motherId} onValueChange={(value) => setFormData({ ...formData, motherId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a mãe" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMothers.map(r => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name} - {r.coatColor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="father">Pai *</Label>
                <Select value={formData.fatherId} onValueChange={(value) => setFormData({ ...formData, fatherId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o pai" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFathers.map(r => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name} - {r.coatColor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Filhotes */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Filhotes</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalOffspring">Total de Filhotes *</Label>
                <Input
                  id="totalOffspring"
                  type="number"
                  min="1"
                  value={formData.totalOffspring}
                  onChange={(e) => {
                    const total = parseInt(e.target.value) || 0;
                    setFormData({ 
                      ...formData, 
                      totalOffspring: total,
                      survivedCount: total // Auto-preenchir sobreviventes
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="survivedCount">Sobreviventes</Label>
                <Input
                  id="survivedCount"
                  type="number"
                  min="0"
                  max={formData.totalOffspring}
                  value={formData.survivedCount}
                  onChange={(e) => setFormData({ ...formData, survivedCount: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="malesCount">Machos</Label>
                <Input
                  id="malesCount"
                  type="number"
                  min="0"
                  max={formData.totalOffspring}
                  value={formData.malesCount}
                  onChange={(e) => {
                    const males = parseInt(e.target.value) || 0;
                    const females = Math.max(0, formData.totalOffspring - males);
                    setFormData({ 
                      ...formData, 
                      malesCount: males,
                      femalesCount: females
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="femalesCount">Fêmeas</Label>
                <Input
                  id="femalesCount"
                  type="number"
                  min="0"
                  max={formData.totalOffspring}
                  value={formData.femalesCount}
                  onChange={(e) => {
                    const females = parseInt(e.target.value) || 0;
                    const males = Math.max(0, formData.totalOffspring - females);
                    setFormData({ 
                      ...formData, 
                      femalesCount: females,
                      malesCount: males
                    });
                  }}
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Observações</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="behavioralNotes">Comportamento</Label>
                <Textarea
                  id="behavioralNotes"
                  value={formData.behavioralNotes}
                  onChange={(e) => setFormData({ ...formData, behavioralNotes: e.target.value })}
                  placeholder="Observações sobre comportamento dos filhotes..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="healthNotes">Saúde</Label>
                <Textarea
                  id="healthNotes"
                  value={formData.healthNotes}
                  onChange={(e) => setFormData({ ...formData, healthNotes: e.target.value })}
                  placeholder="Observações sobre saúde dos filhotes..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="generalNotes">Notas Gerais</Label>
                <Textarea
                  id="generalNotes"
                  value={formData.generalNotes}
                  onChange={(e) => setFormData({ ...formData, generalNotes: e.target.value })}
                  placeholder="Outras observações importantes..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Adicionar Ninhada
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
