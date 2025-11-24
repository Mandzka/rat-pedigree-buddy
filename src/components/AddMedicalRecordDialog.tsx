import { useState, useEffect } from "react";
import { MedicalRecord } from "@/types/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { generateId } from "@/lib/utils";

interface AddMedicalRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRecord: (record: MedicalRecord) => void;
  petId: string;
  editingRecord?: MedicalRecord | null;
}

export function AddMedicalRecordDialog({ open, onOpenChange, onAddRecord, petId, editingRecord }: AddMedicalRecordDialogProps) {
  const [type, setType] = useState<MedicalRecord['type']>(editingRecord?.type || "Consulta");
  const [date, setDate] = useState(editingRecord?.date ? editingRecord.date.split('T')[0] : new Date().toISOString().split('T')[0]);
  const [veterinarian, setVeterinarian] = useState(editingRecord?.veterinarian || "");
  const [description, setDescription] = useState(editingRecord?.description || "");
  const [diagnosis, setDiagnosis] = useState(editingRecord?.diagnosis || "");
  const [treatment, setTreatment] = useState(editingRecord?.treatment || "");
  const [medications, setMedications] = useState(editingRecord?.medications || "");
  const [cost, setCost] = useState(editingRecord?.cost?.toString() || "");
  const [nextAppointment, setNextAppointment] = useState(editingRecord?.nextAppointment ? editingRecord.nextAppointment.split('T')[0] : "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      if (editingRecord) {
        setType(editingRecord.type);
        setDate(editingRecord.date.split('T')[0]);
        setVeterinarian(editingRecord.veterinarian || "");
        setDescription(editingRecord.description);
        setDiagnosis(editingRecord.diagnosis || "");
        setTreatment(editingRecord.treatment || "");
        setMedications(editingRecord.medications || "");
        setCost(editingRecord.cost?.toString() || "");
        setNextAppointment(editingRecord.nextAppointment ? editingRecord.nextAppointment.split('T')[0] : "");
      } else {
        setType("Consulta");
        setDate(new Date().toISOString().split('T')[0]);
        setVeterinarian("");
        setDescription("");
        setDiagnosis("");
        setTreatment("");
        setMedications("");
        setCost("");
        setNextAppointment("");
      }
      setError("");
    }
  }, [open, editingRecord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!description.trim()) {
      setError("Por favor, preencha a descrição do registro.");
      return;
    }

    const now = new Date().toISOString();
    const record: MedicalRecord = {
      id: editingRecord?.id || generateId(),
      petId,
      type,
      date: new Date(date).toISOString(),
      veterinarian: veterinarian.trim() || undefined,
      description: description.trim(),
      diagnosis: diagnosis.trim() || undefined,
      treatment: treatment.trim() || undefined,
      medications: medications.trim() || undefined,
      cost: cost ? parseFloat(cost) : undefined,
      nextAppointment: nextAppointment ? new Date(nextAppointment).toISOString() : undefined,
      attachments: editingRecord?.attachments || [],
      createdAt: editingRecord?.createdAt || now,
      updatedAt: now,
    };

    onAddRecord(record);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingRecord ? "Editar Registro Médico" : "Novo Registro Médico"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select value={type} onValueChange={(value) => setType(value as MedicalRecord['type'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consulta">Consulta</SelectItem>
                    <SelectItem value="Vacina">Vacina</SelectItem>
                    <SelectItem value="Cirurgia">Cirurgia</SelectItem>
                    <SelectItem value="Emergência">Emergência</SelectItem>
                    <SelectItem value="Exame">Exame</SelectItem>
                    <SelectItem value="Tratamento">Tratamento</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
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
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o que aconteceu..."
                rows={4}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="diagnosis">Diagnóstico</Label>
              <Input
                id="diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Diagnóstico médico"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="treatment">Tratamento</Label>
              <Textarea
                id="treatment"
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                placeholder="Tratamento prescrito"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="medications">Medicações</Label>
              <Textarea
                id="medications"
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
                placeholder="Medicações prescritas"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cost">Custo (R$)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nextAppointment">Próxima Consulta</Label>
                <Input
                  id="nextAppointment"
                  type="date"
                  value={nextAppointment}
                  onChange={(e) => setNextAppointment(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingRecord ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


