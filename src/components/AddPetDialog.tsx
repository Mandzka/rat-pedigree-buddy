import { useState, useEffect } from "react";
import { Pet, Client } from "@/types/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { generateId } from "@/lib/utils";

interface AddPetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPet: (pet: Pet) => void;
  clients: Client[];
  editingPet?: Pet | null;
}

export function AddPetDialog({ open, onOpenChange, onAddPet, clients, editingPet }: AddPetDialogProps) {
  const [clientId, setClientId] = useState(editingPet?.clientId || "");
  const [name, setName] = useState(editingPet?.name || "");
  const [species, setSpecies] = useState<Pet['species']>(editingPet?.species || "Cão");
  const [breed, setBreed] = useState(editingPet?.breed || "");
  const [sex, setSex] = useState<Pet['sex']>(editingPet?.sex || "Macho");
  const [dateOfBirth, setDateOfBirth] = useState(editingPet?.dateOfBirth || "");
  const [weight, setWeight] = useState(editingPet?.weight?.toString() || "");
  const [color, setColor] = useState(editingPet?.color || "");
  const [microchip, setMicrochip] = useState(editingPet?.microchip || "");
  const [vaccinations, setVaccinations] = useState(editingPet?.vaccinations || "");
  const [medications, setMedications] = useState(editingPet?.medications || "");
  const [allergies, setAllergies] = useState(editingPet?.allergies || "");
  const [specialInstructions, setSpecialInstructions] = useState(editingPet?.specialInstructions || "");
  const [temperamentNotes, setTemperamentNotes] = useState(editingPet?.temperamentNotes || "");
  // Novos campos extensivos
  const [isNeutered, setIsNeutered] = useState(editingPet?.isNeutered || false);
  const [lastHeatDate, setLastHeatDate] = useState(editingPet?.lastHeatDate ? editingPet.lastHeatDate.split('T')[0] : "");
  const [dewormingHistory, setDewormingHistory] = useState(editingPet?.dewormingHistory || "");
  const [currentMedications, setCurrentMedications] = useState(editingPet?.currentMedications || "");
  const [tutorBehavioralNotes, setTutorBehavioralNotes] = useState(editingPet?.tutorBehavioralNotes || "");
  const [observedBehavioralNotes, setObservedBehavioralNotes] = useState(editingPet?.observedBehavioralNotes || "");
  const [error, setError] = useState("");

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (editingPet) {
        setClientId(editingPet.clientId || "");
        setName(editingPet.name || "");
        setSpecies(editingPet.species || "Cão");
        setBreed(editingPet.breed || "");
        setSex(editingPet.sex || "Macho");
        setDateOfBirth(editingPet.dateOfBirth || "");
        setWeight(editingPet.weight?.toString() || "");
        setColor(editingPet.color || "");
        setMicrochip(editingPet.microchip || "");
        setVaccinations(editingPet.vaccinations || "");
        setMedications(editingPet.medications || "");
        setAllergies(editingPet.allergies || "");
        setSpecialInstructions(editingPet.specialInstructions || "");
        setTemperamentNotes(editingPet.temperamentNotes || "");
        setIsNeutered(editingPet.isNeutered || false);
        setLastHeatDate(editingPet.lastHeatDate ? editingPet.lastHeatDate.split('T')[0] : "");
        setDewormingHistory(editingPet.dewormingHistory || "");
        setCurrentMedications(editingPet.currentMedications || "");
        setTutorBehavioralNotes(editingPet.tutorBehavioralNotes || "");
        setObservedBehavioralNotes(editingPet.observedBehavioralNotes || "");
      } else {
        setClientId("");
        setName("");
        setSpecies("Cão");
        setBreed("");
        setSex("Macho");
        setDateOfBirth("");
        setWeight("");
        setColor("");
        setMicrochip("");
        setVaccinations("");
        setMedications("");
        setAllergies("");
        setSpecialInstructions("");
        setTemperamentNotes("");
        setIsNeutered(false);
        setLastHeatDate("");
        setDewormingHistory("");
        setCurrentMedications("");
        setTutorBehavioralNotes("");
        setObservedBehavioralNotes("");
      }
      setError("");
    }
  }, [open, editingPet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!name.trim() || !clientId) {
      setError("Por favor, preencha todos os campos obrigatórios (Nome e Cliente).");
      return;
    }

    const now = new Date().toISOString();
    const pet: Pet = {
      id: editingPet?.id || generateId(),
      clientId,
      name: name.trim(),
      species,
      breed: breed.trim() || undefined,
      sex,
      dateOfBirth: dateOfBirth || undefined,
      weight: weight ? parseFloat(weight) : undefined,
      color: color.trim() || undefined,
      microchip: microchip.trim() || undefined,
      vaccinations: vaccinations.trim() || undefined,
      medications: medications.trim() || undefined,
      allergies: allergies.trim() || undefined,
      specialInstructions: specialInstructions.trim() || undefined,
      temperamentNotes: temperamentNotes.trim() || undefined,
      // Novos campos
      isNeutered: isNeutered || undefined,
      lastHeatDate: lastHeatDate ? new Date(lastHeatDate).toISOString() : undefined,
      dewormingHistory: dewormingHistory.trim() || undefined,
      currentMedications: currentMedications.trim() || undefined,
      tutorBehavioralNotes: tutorBehavioralNotes.trim() || undefined,
      observedBehavioralNotes: observedBehavioralNotes.trim() || undefined,
      isActive: editingPet?.isActive ?? true,
      createdAt: editingPet?.createdAt || now,
      updatedAt: now,
    };

    onAddPet(pet);
    if (!editingPet) {
      handleReset();
    }
  };

  const handleReset = () => {
    setName("");
    setSpecies("Cão");
    setBreed("");
    setSex("Macho");
    setDateOfBirth("");
    setWeight("");
    setColor("");
    setMicrochip("");
    setVaccinations("");
    setMedications("");
    setAllergies("");
    setSpecialInstructions("");
    setTemperamentNotes("");
    setIsNeutered(false);
    setLastHeatDate("");
    setDewormingHistory("");
    setCurrentMedications("");
    setTutorBehavioralNotes("");
    setObservedBehavioralNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingPet ? "Editar Pet" : "Adicionar Pet"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="clientId">Cliente *</Label>
              <Select value={clientId} onValueChange={setClientId} required disabled={!!editingPet}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Pet *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do pet"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="species">Espécie *</Label>
                <Select value={species} onValueChange={(v) => setSpecies(v as Pet['species'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cão">Cão</SelectItem>
                    <SelectItem value="Gato">Gato</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="breed">Raça</Label>
                <Input
                  id="breed"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="Raça do pet"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sex">Sexo *</Label>
                <Select value={sex} onValueChange={(v) => setSex(v as Pet['sex'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Macho">Macho</SelectItem>
                    <SelectItem value="Fêmea">Fêmea</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="color">Cor</Label>
                <Input
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Cor do pet"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="microchip">Microchip</Label>
              <Input
                id="microchip"
                value={microchip}
                onChange={(e) => setMicrochip(e.target.value)}
                placeholder="Número do microchip"
              />
            </div>
            {/* Seção: Informações de Saúde */}
            <div className="border-t pt-4 mt-2">
              <h3 className="text-lg font-semibold mb-4">📋 Informações de Saúde</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="vaccinations">Vacinações</Label>
                  <Textarea
                    id="vaccinations"
                    value={vaccinations}
                    onChange={(e) => setVaccinations(e.target.value)}
                    placeholder="Vacinações e datas (ex: V10 - 15/01/2024, Antirrábica - 15/02/2024)"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dewormingHistory">Histórico de Vermífugos</Label>
                  <Textarea
                    id="dewormingHistory"
                    value={dewormingHistory}
                    onChange={(e) => setDewormingHistory(e.target.value)}
                    placeholder="Histórico de vermífugos aplicados com datas (ex: Drontal Plus - 10/01/2024)"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="currentMedications">Medicações em Uso</Label>
                  <Textarea
                    id="currentMedications"
                    value={currentMedications}
                    onChange={(e) => setCurrentMedications(e.target.value)}
                    placeholder="Medicações que o pet está tomando atualmente, dosagem e frequência"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="allergies">Alergias</Label>
                  <Input
                    id="allergies"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="Alergias conhecidas (medicamentos, alimentos, etc.)"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isNeutered"
                    checked={isNeutered}
                    onCheckedChange={(checked) => setIsNeutered(checked === true)}
                  />
                  <Label htmlFor="isNeutered" className="font-normal cursor-pointer">
                    Castrado/Estéril
                  </Label>
                </div>
                {sex === "Fêmea" && (
                  <div className="grid gap-2">
                    <Label htmlFor="lastHeatDate">Última Vez no Cio</Label>
                    <Input
                      id="lastHeatDate"
                      type="date"
                      value={lastHeatDate}
                      onChange={(e) => setLastHeatDate(e.target.value)}
                      placeholder="Data da última vez no cio"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Seção: Fichas Comportamentais */}
            <div className="border-t pt-4 mt-2">
              <h3 className="text-lg font-semibold mb-4">🐕 Fichas Comportamentais</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tutorBehavioralNotes">Ficha Comportamental do Tutor</Label>
                  <Textarea
                    id="tutorBehavioralNotes"
                    value={tutorBehavioralNotes}
                    onChange={(e) => setTutorBehavioralNotes(e.target.value)}
                    placeholder="Comportamento relatado pelo tutor: como o pet se comporta em casa, com pessoas, outros animais, medos, ansiedades, etc."
                    rows={5}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="observedBehavioralNotes">Ficha Comportamental Observada</Label>
                  <Textarea
                    id="observedBehavioralNotes"
                    value={observedBehavioralNotes}
                    onChange={(e) => setObservedBehavioralNotes(e.target.value)}
                    placeholder="Observações comportamentais feitas por profissionais durante atendimentos, passeios ou hospedagens"
                    rows={5}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="temperamentNotes">Observações de Temperamento (Legado)</Label>
                  <Textarea
                    id="temperamentNotes"
                    value={temperamentNotes}
                    onChange={(e) => setTemperamentNotes(e.target.value)}
                    placeholder="Comportamento e temperamento geral do pet"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Seção: Outras Informações */}
            <div className="border-t pt-4 mt-2">
              <h3 className="text-lg font-semibold mb-4">📝 Outras Informações</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="specialInstructions">Instruções Especiais</Label>
                  <Textarea
                    id="specialInstructions"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Instruções especiais de cuidados, alimentação, exercícios, etc."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingPet ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

