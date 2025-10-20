import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Rat, Litter } from "@/types/rat";
import { Baby } from "lucide-react";
import { toast } from "sonner";

interface AddLitterDialogProps {
  onAddLitter: (litter: Litter) => void;
  allRats: Rat[];
}

export function AddLitterDialog({ onAddLitter, allRats }: AddLitterDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    litterName: "",
    motherId: "",
    fatherId: "",
    birthDate: "",
    matingDate: "",
    totalOffspring: 0,
    malesCount: 0,
    femalesCount: 0,
    survivedCount: 0,
    healthNotes: "",
    generalNotes: "",
  });

  const mothers = allRats.filter(r => r.sex === "Fêmea");
  const fathers = allRats.filter(r => r.sex === "Macho");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.litterName || !formData.motherId || !formData.fatherId || !formData.birthDate) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (formData.totalOffspring < 1) {
      toast.error("Deve haver pelo menos 1 filhote");
      return;
    }

    const newLitter: Litter = {
      id: crypto.randomUUID(),
      litterCode: formData.litterName,
      motherId: formData.motherId,
      fatherId: formData.fatherId,
      birthDate: formData.birthDate,
      matingDate: formData.matingDate || undefined,
      offspringIds: [],
      totalOffspring: formData.totalOffspring,
      malesCount: formData.malesCount,
      femalesCount: formData.femalesCount,
      survivedCount: formData.survivedCount,
      healthNotes: formData.healthNotes || undefined,
      generalNotes: formData.generalNotes || undefined,
    };

    onAddLitter(newLitter);
    setOpen(false);
    toast.success(`Ninhada ${newLitter.litterCode} cadastrada com sucesso!`);
    
    // Reset form
    setFormData({
      litterName: "",
      motherId: "",
      fatherId: "",
      birthDate: "",
      matingDate: "",
      totalOffspring: 0,
      malesCount: 0,
      femalesCount: 0,
      survivedCount: 0,
      healthNotes: "",
      generalNotes: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="secondary" className="shadow-lg">
          <Baby className="w-5 h-5 mr-2" />
          Adicionar Ninhada
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Adicionar Nova Ninhada</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Informações da Ninhada</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="litterName">Nome da Ninhada *</Label>
                <Input
                  id="litterName"
                  value={formData.litterName}
                  onChange={(e) => setFormData({ ...formData, litterName: e.target.value })}
                  placeholder="Ex: Rainbow, Luna, etc"
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
              <div className="space-y-2">
                <Label htmlFor="matingDate">Data de Acasalamento</Label>
                <Input
                  id="matingDate"
                  type="date"
                  value={formData.matingDate}
                  onChange={(e) => setFormData({ ...formData, matingDate: e.target.value })}
                />
              </div>
            </div>
          </div>

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
                    {mothers.map(r => (
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
                    {fathers.map(r => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name} - {r.coatColor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Filhotes</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalOffspring">Total de Filhotes *</Label>
                <Input
                  id="totalOffspring"
                  type="number"
                  min="1"
                  value={formData.totalOffspring || ""}
                  onChange={(e) => setFormData({ ...formData, totalOffspring: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="malesCount">Machos</Label>
                <Input
                  id="malesCount"
                  type="number"
                  min="0"
                  value={formData.malesCount || ""}
                  onChange={(e) => setFormData({ ...formData, malesCount: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="femalesCount">Fêmeas</Label>
                <Input
                  id="femalesCount"
                  type="number"
                  min="0"
                  value={formData.femalesCount || ""}
                  onChange={(e) => setFormData({ ...formData, femalesCount: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="survivedCount">Sobreviveram</Label>
                <Input
                  id="survivedCount"
                  type="number"
                  min="0"
                  value={formData.survivedCount || ""}
                  onChange={(e) => setFormData({ ...formData, survivedCount: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Observações</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="healthNotes">Notas de Saúde</Label>
                <Textarea
                  id="healthNotes"
                  value={formData.healthNotes}
                  onChange={(e) => setFormData({ ...formData, healthNotes: e.target.value })}
                  placeholder="Saúde geral da ninhada, problemas observados..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="generalNotes">Observações Gerais</Label>
                <Textarea
                  id="generalNotes"
                  value={formData.generalNotes}
                  onChange={(e) => setFormData({ ...formData, generalNotes: e.target.value })}
                  placeholder="Outras observações sobre a ninhada..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Cadastrar Ninhada</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
