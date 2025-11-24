import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Rat, CoatType, Marking, EyeColor, EarType, RatStatus, RatDestination } from "@/types/rat";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ratColorDatabase } from "@/data/ratColors";
import { combineAFRMAGenotypesFromDatabase, getAFRMACharacteristics, afrmaCoatGenotypes, afrmaEarGenotypes, afrmaEyeGenotypes } from "@/data/afrmaGenetics";
import { calculateInbreedingCoefficient } from "@/utils/inbreedingCalculator";

interface AddRatDialogProps {
  onAddRat: (rat: Rat) => void;
  allRats: Rat[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddRatDialog({ onAddRat, allRats, open: externalOpen, onOpenChange }: AddRatDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const [formData, setFormData] = useState({
    name: "",
    tutorName: "",
    litterName: "",
    dateOfBirth: "",
    dateOfDeath: "",
    sex: "Macho" as "Macho" | "Fêmea",
    origin: "Nascido na Rattery" as const,
    status: "Vivo" as RatStatus,
    destination: "Reprodução" as RatDestination,
    isBreeder: false,
    motherId: undefined,
    fatherId: undefined,
    coatType: "Standard" as CoatType,
    coatColor: "",
    marking: "Self" as Marking,
    eyeColor: "Preto" as EyeColor,
    earType: "Dumbo" as EarType,
    specialMarks: "",
    genotype: "",
    colorGenotype: "",
    eyeGenotype: "",
    earGenotype: "",
    coatGenotype: "",
    markingGenotype: "",
    carrierGenes: "",
    geneticNotes: "",
    deformities: "",
    breedingApproved: false,
    inbreedingCoefficient: 0,
    numberOfLitters: 0,
    temperamentNotes: "",
    notes: "",
    registrationNumber: "",
  });

  // Função para calcular coeficiente de inbreeding automaticamente
  const calculateInbreeding = (motherId?: string, fatherId?: string) => {
    if (!motherId || !fatherId || motherId === "unknown" || fatherId === "unknown") {
      console.log('COI Debug: Pais não selecionados ou desconhecidos');
      return 0;
    }
    
    const mother = allRats.find(r => r.id === motherId);
    const father = allRats.find(r => r.id === fatherId);
    
    if (!mother || !father) {
      console.log('COI Debug: Mãe ou pai não encontrados');
      return 0;
    }
    
    try {
      // Criar um rato temporário para calcular o COI
      const tempRat: Rat = {
        id: 'temp',
        name: 'temp',
        dateOfBirth: new Date().toISOString(),
        sex: 'Macho',
        origin: 'Nascido na Rattery',
        status: 'Vivo',
        destination: 'Reprodução',
        isBreeder: false,
        motherId: motherId,
        fatherId: fatherId,
        coatType: 'Standard',
        coatColor: '',
        marking: 'Self',
        eyeColor: 'Preto',
        earType: 'Dumbo',
        breedingApproved: false,
        photos: [],
        litterIds: [],
        offspringIds: []
      };
      
      const coi = calculateInbreedingCoefficient(tempRat, allRats);
      console.log('=== DEBUG COI ===');
      console.log('Mãe:', mother.name);
      console.log('Pai:', father.name);
      console.log('COI calculado:', coi);
      console.log('=================');
      return coi;
    } catch (error) {
      console.error('Erro ao calcular coeficiente de inbreeding:', error);
      return 0;
    }
  };

  // Função para combinar genótipos separados
  const combineGenotypes = () => {
    const parts = [
      formData.colorGenotype,
      formData.markingGenotype,
      formData.eyeGenotype,
      formData.earGenotype,
      formData.coatGenotype
    ].filter(part => part && part.trim());
    
    return parts.join(' ');
  };

  // Atualizar genótipo completo quando os separados mudarem
  useEffect(() => {
    const combined = combineGenotypes();
    if (combined && combined !== formData.genotype) {
      setFormData(prev => ({ ...prev, genotype: combined }));
    }
  }, [formData.colorGenotype, formData.markingGenotype, formData.eyeGenotype, formData.earGenotype, formData.coatGenotype]);

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
      dateOfDeath: formData.dateOfDeath || undefined,
      sex: formData.sex,
      origin: formData.origin,
      status: formData.status,
      destination: formData.destination,
      isBreeder: formData.isBreeder,
      motherId: formData.motherId,
      fatherId: formData.fatherId,
      coatType: formData.coatType,
      coatColor: formData.coatColor,
      marking: formData.marking,
      eyeColor: formData.eyeColor,
      earType: formData.earType,
      specialMarks: formData.specialMarks || undefined,
      genotype: formData.genotype || undefined,
      colorGenotype: formData.colorGenotype || undefined,
      eyeGenotype: formData.eyeGenotype || undefined,
      earGenotype: formData.earGenotype || undefined,
      coatGenotype: formData.coatGenotype || undefined,
      markingGenotype: formData.markingGenotype || undefined,
      carrierGenes: formData.carrierGenes || undefined,
      geneticNotes: formData.geneticNotes || undefined,
      deformities: formData.deformities || undefined,
      breedingApproved: formData.breedingApproved,
      inbreedingCoefficient: formData.inbreedingCoefficient,
      numberOfLitters: formData.numberOfLitters,
      temperamentNotes: formData.temperamentNotes || undefined,
      notes: formData.notes || undefined,
      registrationNumber: formData.registrationNumber || undefined,
    };

    onAddRat(newRat);
    setOpen(false);
    toast.success(`${newRat.name} foi adicionado com sucesso!`);
    
    // Reset form
    setFormData({
      name: "",
      tutorName: "",
      litterName: "",
      dateOfBirth: "",
      dateOfDeath: "",
      sex: "Macho",
      origin: "Nascido na Rattery",
      status: "Vivo",
      destination: "Reprodução",
      isBreeder: false,
      motherId: undefined,
      fatherId: undefined,
      coatType: "Standard",
      coatColor: "",
      marking: "Self",
      eyeColor: "Preto",
      earType: "Dumbo",
      specialMarks: "",
      genotype: "",
      colorGenotype: "",
      eyeGenotype: "",
      earGenotype: "",
      coatGenotype: "",
      markingGenotype: "",
      carrierGenes: "",
      geneticNotes: "",
      deformities: "",
      breedingApproved: false,
      inbreedingCoefficient: 0,
      numberOfLitters: 0,
      temperamentNotes: "",
      notes: "",
      registrationNumber: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                <Label htmlFor="name">Nome de Registro *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome de registro do rato"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tutorName">Nome do Tutor</Label>
                <Input
                  id="tutorName"
                  value={formData.tutorName || ""}
                  onChange={(e) => setFormData({ ...formData, tutorName: e.target.value })}
                  placeholder="Nome que o tutor vai dar"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="litterName">Nome da Ninhada</Label>
                <Input
                  id="litterName"
                  value={formData.litterName || ""}
                  onChange={(e) => setFormData({ ...formData, litterName: e.target.value })}
                  placeholder="Nome da ninhada (para busca)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Data de Nascimento *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Validar que o ano tem no máximo 4 dígitos
                    if (value && value.length > 0) {
                      const parts = value.split('-');
                      if (parts[0] && parts[0].length > 4) {
                        return; // Não permitir mais de 4 dígitos no ano
                      }
                    }
                    setFormData({ ...formData, dateOfBirth: value });
                  }}
                  max="9999-12-31"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sex">Sexo</Label>
                <Select value={formData.sex} onValueChange={(value: "Macho" | "Fêmea") => setFormData({ ...formData, sex: value })}>
                  <SelectTrigger id="sex">
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Macho">Macho</SelectItem>
                    <SelectItem value="Fêmea">Fêmea</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="origin">Origem</Label>
                <Select value={formData.origin} onValueChange={(value: "Nascido na Rattery" | "Comprado" | "Doado" | "Outro") => setFormData({ ...formData, origin: value })}>
                  <SelectTrigger id="origin">
                    <SelectValue placeholder="Selecione a origem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nascido na Rattery">Nascido na Rattery</SelectItem>
                    <SelectItem value="Comprado">Comprado</SelectItem>
                    <SelectItem value="Doado">Doado</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: RatStatus) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vivo">Vivo</SelectItem>
                    <SelectItem value="Falecido">Falecido</SelectItem>
                    <SelectItem value="Aposentado">Aposentado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destino</Label>
                <Select value={formData.destination} onValueChange={(value: RatDestination) => setFormData({ ...formData, destination: value })}>
                  <SelectTrigger id="destination">
                    <SelectValue placeholder="Selecione o destino" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reprodução">Reprodução</SelectItem>
                    <SelectItem value="Pet">Pet</SelectItem>
                    <SelectItem value="À venda">À venda</SelectItem>
                    <SelectItem value="Para adoção">Para adoção</SelectItem>
                    <SelectItem value="Vendido">Vendido</SelectItem>
                    <SelectItem value="Doado">Doado</SelectItem>
                    <SelectItem value="Matriz">Matriz (Fêmea reprodutora)</SelectItem>
                    <SelectItem value="Padreador">Padreador (Macho reprodutor)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.status === "Falecido" && (
                <div className="space-y-2">
                  <Label htmlFor="dateOfDeath">Data de Falecimento</Label>
                  <Input
                    id="dateOfDeath"
                    type="date"
                    value={formData.dateOfDeath}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Validar que o ano tem no máximo 4 dígitos
                      if (value && value.length > 0) {
                        const parts = value.split('-');
                        if (parts[0] && parts[0].length > 4) {
                          return; // Não permitir mais de 4 dígitos no ano
                        }
                      }
                      setFormData({ ...formData, dateOfDeath: value });
                    }}
                    max="9999-12-31"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Número de Registro</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  placeholder="Auto-gerado se vazio"
                />
              </div>
              <div className="col-span-2 flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <Label htmlFor="isBreeder" className="cursor-pointer">
                  Ativo para Reprodução
                </Label>
                <Switch
                  id="isBreeder"
                  checked={formData.isBreeder}
                  onCheckedChange={(checked) => setFormData({ ...formData, isBreeder: checked })}
                />
              </div>
            </div>
          </div>

          {/* Pedigree */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Pedigree</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mother">Mãe</Label>
                <Select value={formData.motherId || ""} onValueChange={(value) => {
                  const newMotherId = value === "unknown" ? undefined : value;
                  const inbreedingCoeff = calculateInbreeding(newMotherId, formData.fatherId);
                  setFormData({ 
                    ...formData, 
                    motherId: newMotherId,
                    inbreedingCoefficient: inbreedingCoeff
                  });
                }}>
                  <SelectTrigger id="mother">
                    <SelectValue placeholder="Selecione a mãe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unknown">Desconhecido</SelectItem>
                    {allRats.filter(r => r.sex === "Fêmea").map(r => (
                      <SelectItem key={r.id} value={r.id}>{r.name} - {r.coatColor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="father">Pai</Label>
                <Select value={formData.fatherId || ""} onValueChange={(value) => {
                  const newFatherId = value === "unknown" ? undefined : value;
                  const inbreedingCoeff = calculateInbreeding(formData.motherId, newFatherId);
                  setFormData({ 
                    ...formData, 
                    fatherId: newFatherId,
                    inbreedingCoefficient: inbreedingCoeff
                  });
                }}>
                  <SelectTrigger id="father">
                    <SelectValue placeholder="Selecione o pai" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unknown">Desconhecido</SelectItem>
                    {allRats.filter(r => r.sex === "Macho").map(r => (
                      <SelectItem key={r.id} value={r.id}>{r.name} - {r.coatColor}</SelectItem>
                    ))}
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
                <Select value={formData.coatType} onValueChange={(value: CoatType) => {
                  // Atualizar genótipo da pelagem
                  const coatGenotype = afrmaCoatGenotypes[value as keyof typeof afrmaCoatGenotypes] || "";
                  
                  // Recalcular genótipo completo
                  const genotypes = combineAFRMAGenotypesFromDatabase(
                    formData.coatColor,
                    formData.marking,
                    formData.eyeColor,
                    formData.earType,
                    value
                  );
                  
                  setFormData({ 
                    ...formData, 
                    coatType: value,
                    coatGenotype: coatGenotype,
                    genotype: genotypes.completeGenotype
                  });
                }}>
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
                <Label htmlFor="earType">Tipo de Orelha</Label>
                <Select value={formData.earType} onValueChange={(value: EarType) => {
                  // Atualizar genótipo da orelha
                  const earGenotype = afrmaEarGenotypes[value as keyof typeof afrmaEarGenotypes] || "";
                  
                  // Recalcular genótipo completo
                  const genotypes = combineAFRMAGenotypesFromDatabase(
                    formData.coatColor,
                    formData.marking,
                    formData.eyeColor,
                    value,
                    formData.coatType
                  );
                  
                  setFormData({ 
                    ...formData, 
                    earType: value,
                    earGenotype: earGenotype,
                    genotype: genotypes.completeGenotype
                  });
                }}>
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
                <Label htmlFor="coatColor">Cor da Pelagem *</Label>
                <Select 
                  value={formData.coatColor} 
                  onValueChange={(value) => {
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
                        formData.marking,
                        characteristics.eyeColor || formData.eyeColor,
                        formData.earType,
                        formData.coatType
                      );
                      
                      console.log('=== DEBUG GENÓTIPOS ===');
                      console.log('Cor selecionada:', value);
                      console.log('Cor encontrada no banco:', selectedColor);
                      console.log('Características AFRMA:', characteristics);
                      console.log('Genótipos calculados:', genotypes);
                      console.log('========================');
                      
                      // Atualizar formulário com dados AFRMA
                      setFormData({ 
                        ...formData, 
                        coatColor: value,
                        genotype: genotypes.completeGenotype,
                        colorGenotype: genotypes.colorGenotype,
                        eyeGenotype: genotypes.eyeGenotype,
                        earGenotype: genotypes.earGenotype,
                        coatGenotype: genotypes.coatGenotype,
                        eyeColor: characteristics.eyeColor || formData.eyeColor,
                        earType: characteristics.earType || formData.earType,
                        coatType: characteristics.coatType || formData.coatType
                      });
                    } else {
                      // Se não encontrar, apenas atualizar a cor
                      setFormData({ 
                        ...formData, 
                        coatColor: value
                      });
                    }
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
                    <SelectItem value="Marbled">Marbled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="eyeColor">Cor dos Olhos</Label>
                <Select value={formData.eyeColor} onValueChange={(value: EyeColor) => {
                  // Atualizar genótipo dos olhos
                  const eyeGenotype = afrmaEyeGenotypes[value as keyof typeof afrmaEyeGenotypes] || "";
                  
                  // Recalcular genótipo completo
                  const genotypes = combineAFRMAGenotypesFromDatabase(
                    formData.coatColor,
                    formData.marking,
                    value,
                    formData.earType,
                    formData.coatType
                  );
                  
                  setFormData({ 
                    ...formData, 
                    eyeColor: value,
                    eyeGenotype: eyeGenotype,
                    genotype: genotypes.completeGenotype
                  });
                }}>
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
            </div>
          </div>

          {/* Informações Genéticas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Genética e Reprodução</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="colorGenotype">
                  Genótipo da Cor
                  {formData.coatColor && (
                    <span className="text-xs text-muted-foreground ml-2">
                      (Auto-preenchido)
                    </span>
                  )}
                </Label>
                <Input
                  id="colorGenotype"
                  value={formData.colorGenotype}
                  onChange={(e) => setFormData({ ...formData, colorGenotype: e.target.value })}
                  placeholder="Ex: aa BB dd"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eyeGenotype">Genótipo dos Olhos</Label>
                <Input
                  id="eyeGenotype"
                  value={formData.eyeGenotype}
                  onChange={(e) => setFormData({ ...formData, eyeGenotype: e.target.value })}
                  placeholder="Ex: C-, cc, ch"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="earGenotype">Genótipo das Orelhas</Label>
                <Input
                  id="earGenotype"
                  value={formData.earGenotype}
                  onChange={(e) => setFormData({ ...formData, earGenotype: e.target.value })}
                  placeholder="Ex: du, to"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coatGenotype">Genótipo da Pelagem</Label>
                <Input
                  id="coatGenotype"
                  value={formData.coatGenotype}
                  onChange={(e) => setFormData({ ...formData, coatGenotype: e.target.value })}
                  placeholder="Ex: rr, sa, hr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genotype">
                  Genótipo Completo
                  <span className="text-xs text-muted-foreground ml-2">
                    (Combinação automática)
                  </span>
                </Label>
                <Input
                  id="genotype"
                  value={formData.genotype}
                  onChange={(e) => setFormData({ ...formData, genotype: e.target.value })}
                  placeholder="Ex: aa BB dd C- du rr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carrierGenes">Genes Portadores</Label>
                <Input
                  id="carrierGenes"
                  value={formData.carrierGenes}
                  onChange={(e) => setFormData({ ...formData, carrierGenes: e.target.value })}
                  placeholder="Ex: cm (carrega marten), dd (carrega diluição)"
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
                  readOnly
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">Calculado automaticamente baseado nos pais selecionados</p>
              </div>
              {formData.sex === "Fêmea" && (
                <div className="space-y-2">
                  <Label htmlFor="numberOfLitters">Número de Ninhadas</Label>
                  <Input
                    id="numberOfLitters"
                    type="number"
                    min="0"
                    value={formData.numberOfLitters}
                    onChange={(e) => setFormData({ ...formData, numberOfLitters: parseInt(e.target.value) || 0 })}
                  />
                </div>
              )}
              <div className="col-span-2 space-y-2">
                <Label htmlFor="specialMarks">Marcas Especiais</Label>
                <Input
                  id="specialMarks"
                  value={formData.specialMarks}
                  onChange={(e) => setFormData({ ...formData, specialMarks: e.target.value })}
                  placeholder="Ex: blazed assimétrico, odd-eye específico"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="geneticNotes">Anotações Genéticas</Label>
                <Textarea
                  id="geneticNotes"
                  value={formData.geneticNotes}
                  onChange={(e) => setFormData({ ...formData, geneticNotes: e.target.value })}
                  placeholder="Ex: suspeita de heterozigose cm/Ch, possível portador de rr"
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
            </div>
          </div>

          {/* Observações Gerais */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Observações Gerais</h3>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionais</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Qualquer informação adicional sobre o rato..."
                rows={4}
              />
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
