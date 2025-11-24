import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Rat, Litter, CoatType, Marking, EyeColor, EarType } from "@/types/rat";
import { Plus, Users, Baby } from "lucide-react";
import { toast } from "sonner";
import { ratColorDatabase } from "@/data/ratColors";
import { combineAFRMAGenotypesFromDatabase, getAFRMACharacteristics } from "@/data/afrmaGenetics";

interface LitterOffspringDialogProps {
  litter: Litter;
  onAddRats: (rats: Rat[]) => void;
  allRats: Rat[];
}

interface OffspringFormData {
  name: string;
  tutorName: string;
  sex: "Macho" | "Fêmea";
  coatColor: string;
  marking: Marking;
  eyeColor: EyeColor;
  earType: EarType;
  coatType: CoatType;
  genotype: string;
  specialMarks: string;
  temperamentNotes: string;
  notes: string;
}

export function LitterOffspringDialog({ litter, onAddRats, allRats }: LitterOffspringDialogProps) {
  const [open, setOpen] = useState(false);
  const [offspringForms, setOffspringForms] = useState<OffspringFormData[]>([]);

  // Inicializar formulários baseado na ninhada
  useEffect(() => {
    if (litter && open) {
      const forms: OffspringFormData[] = [];
      
      // Criar formulários para machos
      for (let i = 1; i <= (litter.malesCount || 0); i++) {
        forms.push({
          name: `${litter.litterCode}-M${i.toString().padStart(2, '0')}`,
          tutorName: "",
          sex: "Macho",
          coatColor: "",
          marking: "Self",
          eyeColor: "Preto",
          earType: "Dumbo",
          coatType: "Standard",
          genotype: "",
          specialMarks: "",
          temperamentNotes: "",
          notes: "",
        });
      }
      
      // Criar formulários para fêmeas
      for (let i = 1; i <= (litter.femalesCount || 0); i++) {
        forms.push({
          name: `${litter.litterCode}-F${i.toString().padStart(2, '0')}`,
          tutorName: "",
          sex: "Fêmea",
          coatColor: "",
          marking: "Self",
          eyeColor: "Preto",
          earType: "Dumbo",
          coatType: "Standard",
          genotype: "",
          specialMarks: "",
          temperamentNotes: "",
          notes: "",
        });
      }
      
      setOffspringForms(forms);
    }
  }, [litter, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validForms = offspringForms.filter(form => form.name && form.coatColor);
    
    if (validForms.length === 0) {
      toast.error("Preencha pelo menos um filhote com nome e cor");
      return;
    }

    const newRats: Rat[] = validForms.map((form, index) => ({
      id: crypto.randomUUID(),
      name: form.name,
      tutorName: form.tutorName || undefined,
      litterName: litter.litterCode || `Ninhada ${litter.id}`,
      dateOfBirth: litter.birthDate,
      sex: form.sex,
      origin: "Nascido na Rattery" as const,
      status: "Vivo" as const,
      destination: "Reprodução" as const,
      isBreeder: false,
      motherId: litter.motherId,
      fatherId: litter.fatherId,
      litterId: litter.id,
      coatType: form.coatType,
      coatColor: form.coatColor,
      marking: form.marking,
      eyeColor: form.eyeColor,
      earType: form.earType,
      specialMarks: form.specialMarks || undefined,
      genotype: form.genotype || undefined,
      breedingApproved: false,
      inbreedingCoefficient: 0,
      temperamentNotes: form.temperamentNotes || undefined,
      notes: form.notes || undefined,
    }));

    onAddRats(newRats);
    setOpen(false);
    toast.success(`${newRats.length} filhotes da ninhada "${litter.litterCode}" foram adicionados!`);
  };

  const updateForm = (index: number, field: keyof OffspringFormData, value: any) => {
    const updatedForms = [...offspringForms];
    updatedForms[index] = { ...updatedForms[index], [field]: value };
    
    // Se mudou a cor, atualizar genótipo automaticamente usando sistema AFRMA
    if (field === 'coatColor') {
      // Buscar cor no banco de dados AFRMA
      const selectedColor = ratColorDatabase
        .flatMap(group => group.colors)
        .find(c => c.name === value);
      
      if (selectedColor) {
        // Obter características automáticas da cor
        const characteristics = getAFRMACharacteristics(value);
        
        // Combinar genótipos usando sistema AFRMA
        const genotypes = combineAFRMAGenotypesFromDatabase(
          value,
          updatedForms[index].marking,
          characteristics.eyeColor || updatedForms[index].eyeColor,
          updatedForms[index].earType,
          updatedForms[index].coatType
        );
        
        // Atualizar formulário com dados AFRMA
        updatedForms[index].genotype = genotypes.completeGenotype;
        updatedForms[index].eyeColor = characteristics.eyeColor || updatedForms[index].eyeColor;
        updatedForms[index].earType = characteristics.earType || updatedForms[index].earType;
        updatedForms[index].coatType = characteristics.coatType || updatedForms[index].coatType;
      }
    }
    
    setOffspringForms(updatedForms);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Baby className="w-4 h-4 mr-2" />
          Criar Fichas dos Filhotes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Criar Fichas dos Filhotes - {litter.litterCode}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Preencha as informações dos filhotes. Os campos obrigatórios são nome e cor.
            </p>
            
            {offspringForms.map((form, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <h4 className="font-semibold text-lg border-b pb-2">
                  {form.name} ({form.sex})
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${index}`}>Nome de Registro *</Label>
                    <Input
                      id={`name-${index}`}
                      value={form.name}
                      onChange={(e) => updateForm(index, 'name', e.target.value)}
                      placeholder="Nome de registro do filhote"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`tutorName-${index}`}>Nome do Tutor</Label>
                    <Input
                      id={`tutorName-${index}`}
                      value={form.tutorName}
                      onChange={(e) => updateForm(index, 'tutorName', e.target.value)}
                      placeholder="Nome que o tutor vai dar"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`coatColor-${index}`}>Cor da Pelagem *</Label>
                    <Select 
                      value={form.coatColor} 
                      onValueChange={(value) => updateForm(index, 'coatColor', value)}
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
                    <Label htmlFor={`marking-${index}`}>Marcação</Label>
                    <Select 
                      value={form.marking} 
                      onValueChange={(value: Marking) => updateForm(index, 'marking', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Self">Self</SelectItem>
                        <SelectItem value="Berkshire">Berkshire</SelectItem>
                        <SelectItem value="Irish">Irish</SelectItem>
                        <SelectItem value="English Irish">English Irish</SelectItem>
                        <SelectItem value="Down Under">Down Under</SelectItem>
                        <SelectItem value="Hooded">Hooded</SelectItem>
                        <SelectItem value="Bareback">Bareback</SelectItem>
                        <SelectItem value="Capped">Capped</SelectItem>
                        <SelectItem value="Masked">Masked</SelectItem>
                        <SelectItem value="Blaze">Blaze</SelectItem>
                        <SelectItem value="Blazed">Blazed</SelectItem>
                        <SelectItem value="Variegated">Variegated</SelectItem>
                        <SelectItem value="Var-Capped">Var-Capped</SelectItem>
                        <SelectItem value="Essex">Essex</SelectItem>
                        <SelectItem value="Dalmatian">Dalmatian</SelectItem>
                        <SelectItem value="Roan">Roan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`eyeColor-${index}`}>Cor dos Olhos</Label>
                    <Select 
                      value={form.eyeColor} 
                      onValueChange={(value: EyeColor) => updateForm(index, 'eyeColor', value)}
                    >
                      <SelectTrigger>
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
                  
                  <div className="space-y-2">
                    <Label htmlFor={`earType-${index}`}>Tipo de Orelha</Label>
                    <Select 
                      value={form.earType} 
                      onValueChange={(value: EarType) => updateForm(index, 'earType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dumbo">Dumbo</SelectItem>
                        <SelectItem value="Top">Top</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`coatType-${index}`}>Tipo de Pelagem</Label>
                    <Select 
                      value={form.coatType} 
                      onValueChange={(value: CoatType) => updateForm(index, 'coatType', value)}
                    >
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
                        <SelectItem value="Harley">Harley</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`genotype-${index}`}>Genótipo</Label>
                    <Input
                      id={`genotype-${index}`}
                      value={form.genotype}
                      onChange={(e) => updateForm(index, 'genotype', e.target.value)}
                      placeholder="Auto-preenchido baseado na cor"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`specialMarks-${index}`}>Marcas Especiais</Label>
                    <Input
                      id={`specialMarks-${index}`}
                      value={form.specialMarks}
                      onChange={(e) => updateForm(index, 'specialMarks', e.target.value)}
                      placeholder="Ex: blazed assimétrico"
                    />
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor={`temperamentNotes-${index}`}>Notas de Temperamento</Label>
                    <Textarea
                      id={`temperamentNotes-${index}`}
                      value={form.temperamentNotes}
                      onChange={(e) => updateForm(index, 'temperamentNotes', e.target.value)}
                      placeholder="Observações sobre comportamento..."
                      rows={2}
                    />
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor={`notes-${index}`}>Notas Gerais</Label>
                    <Textarea
                      id={`notes-${index}`}
                      value={form.notes}
                      onChange={(e) => updateForm(index, 'notes', e.target.value)}
                      placeholder="Outras observações..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Fichas ({offspringForms.filter(f => f.name && f.coatColor).length} filhotes)
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
