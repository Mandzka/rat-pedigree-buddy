import { useState, useEffect } from "react";
import { Service, Client, Pet, ServiceType } from "@/types/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { generateId } from "@/lib/utils";

interface AddServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddService: (service: Service) => void;
  clients: Client[];
  pets: Pet[];
  editingService?: Service | null;
}

export function AddServiceDialog({ open, onOpenChange, onAddService, clients, pets, editingService }: AddServiceDialogProps) {
  const [clientId, setClientId] = useState(editingService?.clientId || "");
  const [selectedPetIds, setSelectedPetIds] = useState<string[]>(editingService?.petIds || []);
  const [serviceType, setServiceType] = useState<ServiceType>(editingService?.serviceType || "Pet Sitting");
  const [location, setLocation] = useState<"Casa do Cliente" | "Meu Estabelecimento">(editingService?.location || "Casa do Cliente");
  const [startDate, setStartDate] = useState(editingService?.startDate || "");
  const [endDate, setEndDate] = useState(editingService?.endDate || "");
  const [startTime, setStartTime] = useState(editingService?.startTime || "");
  const [endTime, setEndTime] = useState(editingService?.endTime || "");
  const [duration, setDuration] = useState(editingService?.duration?.toString() || "");
  const [address, setAddress] = useState(editingService?.address || "");
  const [price, setPrice] = useState(editingService?.price?.toString() || "");
  const [notes, setNotes] = useState(editingService?.notes || "");
  const [error, setError] = useState("");

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (editingService) {
        setClientId(editingService.clientId || "");
        setSelectedPetIds(editingService.petIds || []);
        setServiceType(editingService.serviceType || "Pet Sitting");
        setLocation(editingService.location || "Casa do Cliente");
        setStartDate(editingService.startDate || "");
        setEndDate(editingService.endDate || "");
        setStartTime(editingService.startTime || "");
        setEndTime(editingService.endTime || "");
        setDuration(editingService.duration?.toString() || "");
        setAddress(editingService.address || "");
        setPrice(editingService.price?.toString() || "");
        setNotes(editingService.notes || "");
      } else {
        setClientId("");
        setSelectedPetIds([]);
        setServiceType("Pet Sitting");
        setLocation("Casa do Cliente");
        setStartDate("");
        setEndDate("");
        setStartTime("");
        setEndTime("");
        setDuration("");
        setAddress("");
        setPrice("");
        setNotes("");
      }
      setError("");
    }
  }, [open, editingService]);

  const clientPets = pets.filter(p => p.clientId === clientId);

  const togglePet = (petId: string) => {
    setSelectedPetIds(prev => 
      prev.includes(petId) 
        ? prev.filter(id => id !== petId)
        : [...prev, petId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!clientId || selectedPetIds.length === 0 || !startDate) {
      setError("Por favor, preencha todos os campos obrigatórios (Cliente, Pet(s) e Data de Início).");
      return;
    }

    const now = new Date().toISOString();
    const service: Service = {
      id: editingService?.id || generateId(),
      clientId,
      petIds: selectedPetIds,
      serviceType,
      status: editingService?.status || "Agendado",
      startDate,
      endDate: endDate || undefined,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      duration: duration ? parseInt(duration) : undefined,
      location,
      address: address.trim() || undefined,
      price: price ? parseFloat(price) : undefined,
      notes: notes.trim() || undefined,
      completedAt: editingService?.completedAt || undefined,
      createdAt: editingService?.createdAt || now,
      updatedAt: now,
    };

    onAddService(service);
    if (!editingService) {
      handleReset();
    }
  };

  const handleReset = () => {
    setClientId("");
    setSelectedPetIds([]);
    setServiceType("Pet Sitting");
    setLocation("Casa do Cliente");
    setStartDate("");
    setEndDate("");
    setStartTime("");
    setEndTime("");
    setDuration("");
    setAddress("");
    setPrice("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingService ? "Editar Serviço" : "Agendar Serviço"}</DialogTitle>
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
              <Select value={clientId} onValueChange={setClientId} required>
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

            {clientId && (
              <div className="grid gap-2">
                <Label>Pets *</Label>
                <div className="border rounded-md p-4 max-h-48 overflow-y-auto">
                  {clientPets.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum pet cadastrado para este cliente</p>
                  ) : (
                    <div className="space-y-2">
                      {clientPets.map((pet) => (
                        <div key={pet.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={pet.id}
                            checked={selectedPetIds.includes(pet.id)}
                            onCheckedChange={() => togglePet(pet.id)}
                          />
                          <label
                            htmlFor={pet.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {pet.name} ({pet.species})
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="serviceType">Tipo de Serviço *</Label>
                <Select value={serviceType} onValueChange={(v) => setServiceType(v as ServiceType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pet Sitting">Pet Sitting</SelectItem>
                    <SelectItem value="Dog Walking">Dog Walking</SelectItem>
                    <SelectItem value="Treinamento">Treinamento</SelectItem>
                    <SelectItem value="Hospedagem">Hospedagem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Localização *</Label>
                <Select value={location} onValueChange={(v) => setLocation(v as typeof location)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Casa do Cliente">Casa do Cliente</SelectItem>
                    <SelectItem value="Meu Estabelecimento">Meu Estabelecimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Data de Início *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">Data de Término</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Horário de Início</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">Horário de Término</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duração (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="60"
                />
              </div>
            </div>

            {location === "Casa do Cliente" && (
              <div className="grid gap-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Endereço do serviço"
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas sobre o serviço"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingService ? "Salvar" : "Agendar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

