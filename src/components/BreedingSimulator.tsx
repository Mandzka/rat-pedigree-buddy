import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Rat } from "@/types/rat";
import { simulateBreeding } from "@/utils/inbreedingCalculator";
import { simulateGenotypes, GenotypeOutcome } from "@/utils/genotypeSimulator";
import { AlertTriangle, Heart, Sparkles } from "lucide-react";

interface BreedingSimulatorProps {
  rats: Rat[];
}

export function BreedingSimulator({ rats }: BreedingSimulatorProps) {
  const [open, setOpen] = useState(false);
  const [motherId, setMotherId] = useState<string>("");
  const [fatherId, setFatherId] = useState<string>("");
  const [results, setResults] = useState<{
    coi: number;
    relationship: string;
    warning?: string;
    genotypes: GenotypeOutcome[];
  } | null>(null);

  const females = rats.filter(r => r.sex === "Fêmea");
  const males = rats.filter(r => r.sex === "Macho");

  const handleSimulate = () => {
    if (!motherId || !fatherId) return;

    const mother = rats.find(r => r.id === motherId);
    const father = rats.find(r => r.id === fatherId);

    if (!mother || !father) return;

    const breedingResult = simulateBreeding(mother, father, rats);
    
    const genotypeResults = simulateGenotypes(
      mother.genotype || "",
      father.genotype || ""
    );

    setResults({
      coi: breedingResult.estimatedCOI,
      relationship: breedingResult.relationshipType,
      warning: breedingResult.warning,
      genotypes: genotypeResults,
    });
  };

  const handleReset = () => {
    setMotherId("");
    setFatherId("");
    setResults(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="shadow-lg">
          <Sparkles className="w-5 h-5 mr-2" />
          Simular Cruzamento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Heart className="w-6 h-6" />
            Simulador de Cruzamentos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Parent Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mãe (Fêmea)</label>
              <Select value={motherId} onValueChange={setMotherId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a mãe" />
                </SelectTrigger>
                <SelectContent>
                  {females.map(rat => (
                    <SelectItem key={rat.id} value={rat.id}>
                      {rat.name} - {rat.coatColor}
                      {rat.genotype && ` (${rat.genotype})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Pai (Macho)</label>
              <Select value={fatherId} onValueChange={setFatherId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o pai" />
                </SelectTrigger>
                <SelectContent>
                  {males.map(rat => (
                    <SelectItem key={rat.id} value={rat.id}>
                      {rat.name} - {rat.coatColor}
                      {rat.genotype && ` (${rat.genotype})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={handleSimulate} 
              disabled={!motherId || !fatherId}
              className="flex-1"
            >
              Calcular Resultados
            </Button>
            <Button 
              onClick={handleReset} 
              variant="outline"
            >
              Limpar
            </Button>
          </div>

          {/* Results */}
          {results && (
            <div className="space-y-4 animate-in fade-in-50 duration-300">
              {/* Warning Alert */}
              {results.warning && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{results.warning}</AlertDescription>
                </Alert>
              )}

              {/* COI Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Coeficiente de Inbreeding (COI)</CardTitle>
                  <CardDescription>
                    Relacionamento: {results.relationship}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="text-5xl font-bold text-primary">
                      {results.coi}%
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-full transition-all rounded-full ${
                            results.coi > 12.5
                              ? "bg-destructive"
                              : results.coi > 6.25
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(results.coi, 100)}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {results.coi === 0 && "Sem consanguinidade detectada"}
                        {results.coi > 0 && results.coi <= 6.25 && "Consanguinidade baixa - aceitável"}
                        {results.coi > 6.25 && results.coi <= 12.5 && "Consanguinidade moderada - atenção"}
                        {results.coi > 12.5 && "Consanguinidade alta - não recomendado"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Genotype Outcomes */}
              <Card>
                <CardHeader>
                  <CardTitle>Possíveis Resultados de Cores</CardTitle>
                  <CardDescription>
                    Baseado nos genótipos dos pais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {results.genotypes.length > 0 ? (
                    <div className="space-y-3">
                      {results.genotypes.map((outcome, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{outcome.phenotype}</p>
                            <p className="text-sm text-muted-foreground">
                              Genótipo: {outcome.genotype}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                              {outcome.probability}%
                            </p>
                            <div className="w-24 bg-background rounded-full h-2 mt-1">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${outcome.probability}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      Genótipos não informados para os pais selecionados
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
