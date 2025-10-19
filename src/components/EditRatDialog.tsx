import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Rat, CoatType, Marking, EyeColor, EarType, RatStatus, RatDestination } from "@/types/rat";
import { ratColorDatabase } from "@/data/ratColors";

interface EditRatDialogProps {
  rat: Rat;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedRat: Rat) => void;
  allRats: Rat[];
}

export function EditRatDialog({ rat, open, onOpenChange, onSave, allRats }: EditRatDialogProps) {
  const [formData, setFormData] = useState<Rat>(rat);

  useEffect(() => {
    setFormData(rat);
  }, [rat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const availableParents = allRats.filter(r => 
    r.id !== formData.id && 
    r.sex !== formData.sex &&
    new Date(r.dateOfBirth) < new Date(formData.dateOfBirth)
  );

  const availableMothers = availableParents.filter(r => r.sex === "Fêmea");
  const availableFathers = availableParents.filter(r => r.sex === "Macho");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Rato - {rat.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informações Básicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="registrationNumber">Registro</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber || ""}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth.split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sex">Sexo</Label>
                <Select
                  value={formData.sex}
                  onValueChange={(value: "Macho" | "Fêmea") => setFormData({ ...formData, sex: value })}
                >
                  <SelectTrigger id="sex">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Macho">Macho</SelectItem>
                    <SelectItem value="Fêmea">Fêmea</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: RatStatus) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vivo">Vivo</SelectItem>
                    <SelectItem value="Falecido">Falecido</SelectItem>
                    <SelectItem value="Aposentado">Aposentado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.status === "Falecido" && (
                <div>
                  <Label htmlFor="dateOfDeath">Data de Falecimento</Label>
                  <Input
                    id="dateOfDeath"
                    type="date"
                    value={formData.dateOfDeath?.split('T')[0] || ""}
                    onChange={(e) => setFormData({ ...formData, dateOfDeath: e.target.value })}
                  />
                </div>
              )}
              <div>
                <Label htmlFor="destination">Destino</Label>
                <Select
                  value={formData.destination}
                  onValueChange={(value: RatDestination) => setFormData({ ...formData, destination: value })}
                >
                  <SelectTrigger id="destination">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reprodução">Reprodução</SelectItem>
                    <SelectItem value="Pet">Pet</SelectItem>
                    <SelectItem value="Vendido">Vendido</SelectItem>
                    <SelectItem value="Doado">Doado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Pedigree */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Pedigree</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mother">Mãe</Label>
                <Select
                  value={formData.motherId || "unknown"}
                  onValueChange={(value) => setFormData({ ...formData, motherId: value === "unknown" ? undefined : value })}
                >
                  <SelectTrigger id="mother">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unknown">Desconhecido</SelectItem>
                    {availableMothers.map(r => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name} - {r.coatColor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="father">Pai</Label>
                <Select
                  value={formData.fatherId || "unknown"}
                  onValueChange={(value) => setFormData({ ...formData, fatherId: value === "unknown" ? undefined : value })}
                >
                  <SelectTrigger id="father">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unknown">Desconhecido</SelectItem>
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

          {/* Características Físicas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Características Físicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="coatType">Tipo de Pelagem</Label>
                <Select
                  value={formData.coatType}
                  onValueChange={(value: CoatType) => setFormData({ ...formData, coatType: value })}
                >
                  <SelectTrigger id="coatType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Rex">Rex</SelectItem>
                    <SelectItem value="Velveteen">Velveteen</SelectItem>
                    <SelectItem value="Hairless">Hairless</SelectItem>
                    <SelectItem value="Double Rex">Double Rex</SelectItem>
                    <SelectItem value="Satin">Satin</SelectItem>
                    <SelectItem value="Harley">Harley</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="coatColor">Cor (Fenótipo)</Label>
                <Select
                  value={formData.coatColor}
                  onValueChange={(value) => setFormData({ ...formData, coatColor: value })}
                >
                  <SelectTrigger id="coatColor">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {ratColorDatabase.map((group) => (
                      <div key={group.group}>
                        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                          {group.group}
                        </div>
                        {group.colors.map((color) => (
                          <SelectItem key={color.name} value={color.name}>
                            {color.name}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="marking">Marcação</Label>
                <Select
                  value={formData.marking}
                  onValueChange={(value: Marking) => setFormData({ ...formData, marking: value })}
                >
                  <SelectTrigger id="marking">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Self">Self</SelectItem>
                    <SelectItem value="Berkshire">Berkshire</SelectItem>
                    <SelectItem value="Irish">Irish</SelectItem>
                    <SelectItem value="Hooded">Hooded</SelectItem>
                    <SelectItem value="Blazed">Blazed</SelectItem>
                    <SelectItem value="Variegated">Variegated</SelectItem>
                    <SelectItem value="Capped">Capped</SelectItem>
                    <SelectItem value="Bareback">Bareback</SelectItem>
                    <SelectItem value="Essex">Essex</SelectItem>
                    <SelectItem value="Masked">Masked</SelectItem>
                    <SelectItem value="Dalmatian">Dalmatian</SelectItem>
                    <SelectItem value="Roan">Roan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="eyeColor">Cor dos Olhos</Label>
                <Select
                  value={formData.eyeColor}
                  onValueChange={(value: EyeColor) => setFormData({ ...formData, eyeColor: value })}
                >
                  <SelectTrigger id="eyeColor">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Preto">Preto</SelectItem>
                    <SelectItem value="Ruby">Ruby</SelectItem>
                    <SelectItem value="Red">Red</SelectItem>
                    <SelectItem value="Odd-eyed">Odd-eyed</SelectItem>
                    <SelectItem value="Pink">Pink</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="earType">Tipo de Orelha</Label>
                <Select
                  value={formData.earType}
                  onValueChange={(value: EarType) => setFormData({ ...formData, earType: value })}
                >
                  <SelectTrigger id="earType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Dumbo">Dumbo</SelectItem>
                    <SelectItem value="Top">Top</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="specialMarks">Marcas Especiais</Label>
                <Input
                  id="specialMarks"
                  value={formData.specialMarks || ""}
                  onChange={(e) => setFormData({ ...formData, specialMarks: e.target.value })}
                  placeholder="ex: odd eye específico"
                />
              </div>
            </div>
          </div>

          {/* Genética */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informações Genéticas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="genotype">Genótipo Completo</Label>
                <Input
                  id="genotype"
                  value={formData.genotype || ""}
                  onChange={(e) => setFormData({ ...formData, genotype: e.target.value })}
                  placeholder="ex: aa BB dd"
                />
              </div>
              <div>
                <Label htmlFor="carrierGenes">Genes Portadores</Label>
                <Input
                  id="carrierGenes"
                  value={formData.carrierGenes || ""}
                  onChange={(e) => setFormData({ ...formData, carrierGenes: e.target.value })}
                  placeholder="ex: cm, pb"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="geneticNotes">Notas Genéticas</Label>
                <Textarea
                  id="geneticNotes"
                  value={formData.geneticNotes || ""}
                  onChange={(e) => setFormData({ ...formData, geneticNotes: e.target.value })}
                  placeholder="ex: suspeita de heterozigose cm/Ch"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="deformities">Deformidades</Label>
                <Textarea
                  id="deformities"
                  value={formData.deformities || ""}
                  onChange={(e) => setFormData({ ...formData, deformities: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Reprodução */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Reprodução</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isBreeder"
                  checked={formData.isBreeder}
                  onCheckedChange={(checked) => setFormData({ ...formData, isBreeder: checked })}
                />
                <Label htmlFor="isBreeder">Ativo para Reprodução</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="breedingApproved"
                  checked={formData.breedingApproved}
                  onCheckedChange={(checked) => setFormData({ ...formData, breedingApproved: checked })}
                />
                <Label htmlFor="breedingApproved">Aprovado para Reprodução</Label>
              </div>
              {formData.sex === "Fêmea" && (
                <div>
                  <Label htmlFor="numberOfLitters">Número de Ninhadas</Label>
                  <Input
                    id="numberOfLitters"
                    type="number"
                    min="0"
                    value={formData.numberOfLitters || 0}
                    onChange={(e) => setFormData({ ...formData, numberOfLitters: parseInt(e.target.value) || 0 })}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Temperamento */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Temperamento</h3>
            <div>
              <Label htmlFor="temperamentNotes">Notas de Temperamento</Label>
              <Textarea
                id="temperamentNotes"
                value={formData.temperamentNotes || ""}
                onChange={(e) => setFormData({ ...formData, temperamentNotes: e.target.value })}
                placeholder="Observações gerais sobre comportamento"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="sociability">Sociabilidade (1-5)</Label>
                <Input
                  id="sociability"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.temperamentScores?.sociability || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    temperamentScores: {
                      ...formData.temperamentScores!,
                      sociability: parseInt(e.target.value) || 1
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="courage">Coragem (1-5)</Label>
                <Input
                  id="courage"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.temperamentScores?.courage || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    temperamentScores: {
                      ...formData.temperamentScores!,
                      courage: parseInt(e.target.value) || 1
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="curiosity">Curiosidade (1-5)</Label>
                <Input
                  id="curiosity"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.temperamentScores?.curiosity || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    temperamentScores: {
                      ...formData.temperamentScores!,
                      curiosity: parseInt(e.target.value) || 1
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="calmness">Calma (1-5)</Label>
                <Input
                  id="calmness"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.temperamentScores?.calmness || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    temperamentScores: {
                      ...formData.temperamentScores!,
                      calmness: parseInt(e.target.value) || 1
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="dominance">Dominância (1-5)</Label>
                <Input
                  id="dominance"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.temperamentScores?.dominance || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    temperamentScores: {
                      ...formData.temperamentScores!,
                      dominance: parseInt(e.target.value) || 1
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="humanAttachment">Apego ao Humano (1-5)</Label>
                <Input
                  id="humanAttachment"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.temperamentScores?.humanAttachment || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    temperamentScores: {
                      ...formData.temperamentScores!,
                      humanAttachment: parseInt(e.target.value) || 1
                    }
                  })}
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="notes">Observações Gerais</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
