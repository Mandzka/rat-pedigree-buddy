import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Rat, CoatType, CoatTexture, Marking, EyeColor, EarType } from "@/types/rat";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ratColorDatabase } from "@/data/ratColors";

interface AddRatDialogProps {
  onAddRat: (rat: Rat) => void;
  allRats: Rat[];
}

export function AddRatDialog({ onAddRat, allRats }: AddRatDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    sex: "Macho" as const,
    origin: "Nascido na Rattery" as const,
    coatType: "Standard" as CoatType,
    coatTexture: "Liso" as CoatTexture,
    coatColor: "",
    marking: "Self" as Marking,
    eyeColor: "Preto" as EyeColor,
    earType: "Standard" as EarType,
    genotype: "",
    deformities: "",
    breedingApproved: false,
    inbreedingCoefficient: 0,
    temperamentNotes: "",
    sociability: 3,
    courage: 3,
    curiosity: 3,
    calmness: 3,
    dominance: 3,
    humanAttachment: 3,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.dateOfBirth || !formData.coatColor) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const newRat: Rat = {
      id: crypto.randomUUID(),
      name: formData.name,
      dateOfBirth: formData.dateOfBirth,
      sex: formData.sex,
      origin: formData.origin,
      coatType: formData.coatType,
      coatTexture: formData.coatTexture,
      coatColor: formData.coatColor,
      marking: formData.marking,
      eyeColor: formData.eyeColor,
      earType: formData.earType,
      genotype: formData.genotype || undefined,
      deformities: formData.deformities || undefined,
      breedingApproved: formData.breedingApproved,
      inbreedingCoefficient: formData.inbreedingCoefficient,
      temperamentNotes: formData.temperamentNotes || undefined,
      temperamentScores: {
        sociability: formData.sociability,
        courage: formData.courage,
        curiosity: formData.curiosity,
        calmness: formData.calmness,
        dominance: formData.dominance,
        humanAttachment: formData.humanAttachment,
      },
    };

    onAddRat(newRat);
    setOpen(false);
    toast.success(`${newRat.name} foi adicionado com sucesso!`);
    
    // Reset form
    setFormData({
      name: "",
      dateOfBirth: "",
      sex: "Macho",
      origin: "Nascido na Rattery",
      coatType: "Standard",
      coatTexture: "Liso",
      coatColor: "",
      marking: "Self",
      eyeColor: "Preto",
      earType: "Standard",
      genotype: "",
      deformities: "",
      breedingApproved: false,
      inbreedingCoefficient: 0,
      temperamentNotes: "",
      sociability: 3,
      courage: 3,
      curiosity: 3,
      calmness: 3,
      dominance: 3,
      humanAttachment: 3,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="shadow-lg">
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Rato
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Adicionar Novo Rato</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Informações Básicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do rato"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Data de Nascimento *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sex">Sexo</Label>
                <Select value={formData.sex} onValueChange={(value: any) => setFormData({ ...formData, sex: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Macho">Macho</SelectItem>
                    <SelectItem value="Fêmea">Fêmea</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="origin">Origem</Label>
                <Select value={formData.origin} onValueChange={(value: any) => setFormData({ ...formData, origin: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nascido na Rattery">Nascido na Rattery</SelectItem>
                    <SelectItem value="Comprado">Comprado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Características Físicas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Características Físicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coatType">Tipo de Pelagem</Label>
                <Select value={formData.coatType} onValueChange={(value: CoatType) => setFormData({ ...formData, coatType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Rex">Rex</SelectItem>
                    <SelectItem value="Velveteen">Velveteen</SelectItem>
                    <SelectItem value="Hairless">Hairless</SelectItem>
                    <SelectItem value="Double Rex">Double Rex</SelectItem>
                    <SelectItem value="Satin">Satin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="coatTexture">Textura</Label>
                <Select value={formData.coatTexture} onValueChange={(value: CoatTexture) => setFormData({ ...formData, coatTexture: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Liso">Liso</SelectItem>
                    <SelectItem value="Ondulado">Ondulado</SelectItem>
                    <SelectItem value="Cacheado">Cacheado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="coatColor">Cor da Pelagem *</Label>
                <Select 
                  value={formData.coatColor} 
                  onValueChange={(value) => {
                    const selectedColor = ratColorDatabase
                      .flatMap(group => group.colors)
                      .find(c => c.name === value);
                    setFormData({ 
                      ...formData, 
                      coatColor: value,
                      genotype: selectedColor?.genotype || formData.genotype
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a cor" />
                  </SelectTrigger>
                  <SelectContent>
                    {ratColorDatabase.map(group => (
                      <div key={group.group}>
                        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                          {group.group}
                        </div>
                        {group.colors.map(color => (
                          <SelectItem key={color.name} value={color.name}>
                            {color.name}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="marking">Marcação</Label>
                <Select value={formData.marking} onValueChange={(value: Marking) => setFormData({ ...formData, marking: value })}>
                  <SelectTrigger>
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
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="eyeColor">Cor dos Olhos</Label>
                <Select value={formData.eyeColor} onValueChange={(value: EyeColor) => setFormData({ ...formData, eyeColor: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Preto">Preto</SelectItem>
                    <SelectItem value="Ruby">Ruby</SelectItem>
                    <SelectItem value="Odd-eyed">Odd-eyed</SelectItem>
                    <SelectItem value="Vermelho">Vermelho</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="earType">Tipo de Orelha</Label>
                <Select value={formData.earType} onValueChange={(value: EarType) => setFormData({ ...formData, earType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Dumbo">Dumbo</SelectItem>
                    <SelectItem value="Top">Top</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Informações Genéticas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Genética e Reprodução</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="genotype">
                  Genótipo
                  {formData.coatColor && (
                    <span className="text-xs text-muted-foreground ml-2">
                      (Auto-preenchido)
                    </span>
                  )}
                </Label>
                <Input
                  id="genotype"
                  value={formData.genotype}
                  onChange={(e) => setFormData({ ...formData, genotype: e.target.value })}
                  placeholder="Ex: Aa Bb Dd"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inbreedingCoefficient">Coef. Inbreeding (%)</Label>
                <Input
                  id="inbreedingCoefficient"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.inbreedingCoefficient}
                  onChange={(e) => setFormData({ ...formData, inbreedingCoefficient: parseFloat(e.target.value) })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="deformities">Deformidades</Label>
                <Textarea
                  id="deformities"
                  value={formData.deformities}
                  onChange={(e) => setFormData({ ...formData, deformities: e.target.value })}
                  placeholder="Descreva qualquer deformidade ou condição especial"
                />
              </div>
              <div className="col-span-2 flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <Label htmlFor="breedingApproved" className="cursor-pointer">
                  Aprovado para Reprodução
                </Label>
                <Switch
                  id="breedingApproved"
                  checked={formData.breedingApproved}
                  onCheckedChange={(checked) => setFormData({ ...formData, breedingApproved: checked })}
                />
              </div>
            </div>
          </div>

          {/* Temperamento */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Temperamento</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="temperamentNotes">Observações</Label>
                <Textarea
                  id="temperamentNotes"
                  value={formData.temperamentNotes}
                  onChange={(e) => setFormData({ ...formData, temperamentNotes: e.target.value })}
                  placeholder="Ex: Calmo e curioso, adora interagir com pessoas, não morde."
                />
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>🌿 Sociabilidade</Label>
                    <span className="text-sm text-muted-foreground">{formData.sociability}/5</span>
                  </div>
                  <Slider
                    value={[formData.sociability]}
                    onValueChange={([value]) => setFormData({ ...formData, sociability: value })}
                    min={1}
                    max={5}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>💪 Coragem</Label>
                    <span className="text-sm text-muted-foreground">{formData.courage}/5</span>
                  </div>
                  <Slider
                    value={[formData.courage]}
                    onValueChange={([value]) => setFormData({ ...formData, courage: value })}
                    min={1}
                    max={5}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>🐭 Curiosidade</Label>
                    <span className="text-sm text-muted-foreground">{formData.curiosity}/5</span>
                  </div>
                  <Slider
                    value={[formData.curiosity]}
                    onValueChange={([value]) => setFormData({ ...formData, curiosity: value })}
                    min={1}
                    max={5}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>🧘‍♂️ Calma</Label>
                    <span className="text-sm text-muted-foreground">{formData.calmness}/5</span>
                  </div>
                  <Slider
                    value={[formData.calmness]}
                    onValueChange={([value]) => setFormData({ ...formData, calmness: value })}
                    min={1}
                    max={5}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>🧩 Dominância</Label>
                    <span className="text-sm text-muted-foreground">{formData.dominance}/5</span>
                  </div>
                  <Slider
                    value={[formData.dominance]}
                    onValueChange={([value]) => setFormData({ ...formData, dominance: value })}
                    min={1}
                    max={5}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>❤️ Apego ao Humano</Label>
                    <span className="text-sm text-muted-foreground">{formData.humanAttachment}/5</span>
                  </div>
                  <Slider
                    value={[formData.humanAttachment]}
                    onValueChange={([value]) => setFormData({ ...formData, humanAttachment: value })}
                    min={1}
                    max={5}
                    step={1}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Adicionar Rato
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
