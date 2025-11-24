import { useState, useEffect } from "react";
import { VaccineRecord } from "@/types/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { generateId } from "@/lib/utils";

interface AddVaccineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddVaccine: (vaccine: VaccineRecord) => void;
  petId: string;
  editingVaccine?: VaccineRecord | null;
}

export function AddVaccineDialog({ open, onOpenChange, onAddVaccine, petId, editingVaccine }: AddVaccineDialogProps) {
  const [vaccineType, setVaccineType] = useState(editingVaccine?.vaccineType || "");
  const [date, setDate] = useState(editingVaccine?.date ? editingVaccine.date.split('T')[0] : new Date().toISOString().split('T')[0]);
  const [nextDueDate, setNextDueDate] = useState(editingVaccine?.nextDueDate ? editingVaccine.nextDueDate.split('T')[0] : "");
  const [veterinarian, setVeterinarian] = useState(editingVaccine?.veterinarian || "");
  const [batchNumber, setBatchNumber] = useState(editingVaccine?.batchNumber || "");
  const [notes, setNotes] = useState(editingVaccine?.notes || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      if (editingVaccine) {
        setVaccineType(editingVaccine.vaccineType);
        setDate(editingVaccine.date.split('T')[0]);
        setNextDueDate(editingVaccine.nextDueDate ? editingVaccine.nextDueDate.split('T')[0] : "");
        setVeterinarian(editingVaccine.veterinarian || "");
        setBatchNumber(editingVaccine.batchNumber || "");
        setNotes(editingVaccine.notes || "");
      } else {
        setVaccineType("");
        setDate(new Date().toISOString().split('T')[0]);
        setNextDueDate("");
        setVeterinarian("");
        setBatchNumber("");
        setNotes("");
      }
      setError("");
    }
  }, [open, editingVaccine]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!vaccineType.trim()) {
      setError("Por favor, informe o tipo de vacina.");
      return;
    }

    const now = new Date().toISOString();
    const vaccine: VaccineRecord = {
      id: editingVaccine?.id || generateId(),
      petId,
      vaccineType: vaccineType.trim(),
      date: new Date(date).toISOString(),
      nextDueDate: nextDueDate ? new Date(nextDueDate).toISOString() : undefined,
      veterinarian: veterinarian.trim() || undefined,
      batchNumber: batchNumber.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: editingVaccine?.createdAt || now,
    };

    onAddVaccine(vaccine);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingVaccine ? "Editar Vacina" : "Nova Vacina"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="vaccineType">Tipo de Vacina *</Label>
              <Input
                id="vaccineType"
                value={vaccineType}
                onChange={(e) => setVaccineType(e.target.value)}
                placeholder="Ex: V10, Antirrábica, Gripe, etc."
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Data de Aplicação *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nextDueDate">Próxima Dose</Label>
                <Input
                  id="nextDueDate"
                  type="date"
                  value={nextDueDate}
                  onChange={(e) => setNextDueDate(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="veterinarian">Veterinário</Label>
                <Input
                  id="veterinarian"
                  value={veterinarian}
                  onChange={(e) => setVeterinarian(e.target.value)}
                  placeholder="Nome do veterinário"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="batchNumber">Número do Lote</Label>
                <Input
                  id="batchNumber"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  placeholder="Número do lote"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observações adicionais"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingVaccine ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


