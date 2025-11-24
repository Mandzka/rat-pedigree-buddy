import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { generateId } from "@/lib/utils";

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddClient: (client: Client) => void;
  editingClient?: Client | null;
}

export function AddClientDialog({ open, onOpenChange, onAddClient, editingClient }: AddClientDialogProps) {
  const [name, setName] = useState(editingClient?.name || "");
  const [email, setEmail] = useState(editingClient?.email || "");
  const [phone, setPhone] = useState(editingClient?.phone || "");
  const [address, setAddress] = useState(editingClient?.address || "");
  const [notes, setNotes] = useState(editingClient?.notes || "");
  const [error, setError] = useState("");

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (editingClient) {
        setName(editingClient.name || "");
        setEmail(editingClient.email || "");
        setPhone(editingClient.phone || "");
        setAddress(editingClient.address || "");
        setNotes(editingClient.notes || "");
      } else {
        setName("");
        setEmail("");
        setPhone("");
        setAddress("");
        setNotes("");
      }
      setError("");
    }
  }, [open, editingClient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!name.trim() || !phone.trim()) {
      setError("Por favor, preencha todos os campos obrigatórios (Nome e Telefone).");
      return;
    }

    const now = new Date().toISOString();
    const client: Client = {
      id: editingClient?.id || generateId(),
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim(),
      address: address.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: editingClient?.createdAt || now,
      updatedAt: now,
    };

    onAddClient(client);
    handleReset();
  };

  const handleReset = () => {
    if (!editingClient) {
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setNotes("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingClient ? "Editar Cliente" : "Adicionar Cliente"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome completo do cliente"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Endereço completo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas adicionais sobre o cliente"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingClient ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

