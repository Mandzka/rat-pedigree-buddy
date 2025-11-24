import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rat } from "@/types/rat";
import { simulateBreeding } from "@/utils/inbreedingCalculator";
import { simulateGenotypes, GenotypeOutcome } from "@/utils/genotypeSimulator";
import { getTraitSummary } from "@/utils/fullGeneticSimulator";
import { AlertTriangle, Heart, Sparkles, Eye, Ear, Palette, TestTube } from "lucide-react";

interface BreedingSimulatorProps {
  rats: Rat[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function BreedingSimulator({ rats, open: externalOpen, onOpenChange }: BreedingSimulatorProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const [motherId, setMotherId] = useState<string>("");
  const [fatherId, setFatherId] = useState<string>("");
  const [results, setResults] = useState<{
    coi: number;
    relationship: string;
    warning?: string;
    genotypes: GenotypeOutcome[];
    traitSummary?: ReturnType<typeof getTraitSummary>;
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
      father.genotype || "",
      mother,
      father
    );

    const traitSummary = getTraitSummary(mother, father);

    setResults({
      coi: breedingResult.estimatedCOI,
      relationship: breedingResult.relationshipType,
      warning: breedingResult.warning,
      genotypes: genotypeResults,
      traitSummary,
    });
  };

  const handleReset = () => {
    setMotherId("");
    setFatherId("");
    setResults(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              className="flex-1 text-white"
              style={{ backgroundColor: '#a6b49c' }}
              onMouseEnter={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = '#95a394';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = '#a6b49c';
                }
              }}
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

              {/* Genetic Outcomes Tabs */}
              <Tabs defaultValue="colors" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="colors">
                    <Palette className="w-4 h-4 mr-2" />
                    Cores
                  </TabsTrigger>
                  <TabsTrigger value="eyes">
                    <Eye className="w-4 h-4 mr-2" />
                    Olhos
                  </TabsTrigger>
                  <TabsTrigger value="ears">
                    <Ear className="w-4 h-4 mr-2" />
                    Orelhas
                  </TabsTrigger>
                  <TabsTrigger value="traits">
                    <TestTube className="w-4 h-4 mr-2" />
                    Outras
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="colors" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Possíveis Cores</CardTitle>
                      <CardDescription>Baseado nos genótipos dos pais</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {results.genotypes.length > 0 ? (
                        <div className="space-y-3">
                          {(() => {
                            // Agrupar por fenótipo (cor) e somar as probabilidades
                            const groupedByPhenotype = results.genotypes.reduce((acc, outcome) => {
                              if (!acc[outcome.phenotype]) {
                                acc[outcome.phenotype] = {
                                  phenotype: outcome.phenotype,
                                  totalProbability: 0,
                                  genotypes: []
                                };
                              }
                              acc[outcome.phenotype].totalProbability += outcome.probability;
                              acc[outcome.phenotype].genotypes.push(outcome.genotype);
                              return acc;
                            }, {} as Record<string, { phenotype: string; totalProbability: number; genotypes: string[] }>);

                            // Converter para array e ordenar por probabilidade
                            return Object.values(groupedByPhenotype)
                              .sort((a, b) => b.totalProbability - a.totalProbability)
                              .map((group, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                >
                                  <div className="flex-1">
                                    <p className="font-medium">{group.phenotype}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Genótipos possíveis: {group.genotypes.length}
                                    </p>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {group.genotypes.slice(0, 3).join(", ")}
                                      {group.genotypes.length > 3 && ` +${group.genotypes.length - 3} mais`}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-primary">
                                      {Math.round(group.totalProbability * 10) / 10}%
                                    </p>
                                    <div className="w-24 bg-background rounded-full h-2 mt-1">
                                      <div
                                        className="h-full bg-primary rounded-full transition-all"
                                        style={{ width: `${group.totalProbability}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ));
                          })()}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground">
                          Genótipos não informados para os pais selecionados
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="eyes" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Possíveis Cores de Olhos</CardTitle>
                      <CardDescription>Baseado nos genótipos dos pais</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {results.genotypes.length > 0 ? (
                        <div className="space-y-3">
                          {(() => {
                            // Agrupar por cor dos olhos e somar as probabilidades
                            const groupedByEyeColor = results.genotypes.reduce((acc, outcome) => {
                              const eyeColor = outcome.eyeGenotype === "cc" ? "Pink" : "Preto";
                              if (!acc[eyeColor]) {
                                acc[eyeColor] = {
                                  eyeColor,
                                  totalProbability: 0,
                                  genotypes: []
                                };
                              }
                              acc[eyeColor].totalProbability += outcome.probability;
                              acc[eyeColor].genotypes.push(outcome.eyeGenotype);
                              return acc;
                            }, {} as Record<string, { eyeColor: string; totalProbability: number; genotypes: string[] }>);

                            return Object.values(groupedByEyeColor)
                              .sort((a, b) => b.totalProbability - a.totalProbability)
                              .map((group, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                >
                                  <div className="flex-1">
                                    <p className="font-medium">{group.eyeColor}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Genótipo: {group.genotypes[0]}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-primary">
                                      {Math.round(group.totalProbability * 10) / 10}%
                                    </p>
                                    <div className="w-24 bg-background rounded-full h-2 mt-1">
                                      <div
                                        className="h-full bg-primary rounded-full transition-all"
                                        style={{ width: `${group.totalProbability}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ));
                          })()}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground">
                          Genótipos não informados para os pais selecionados
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="ears" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Possíveis Tipos de Orelhas</CardTitle>
                      <CardDescription>Baseado nos genótipos dos pais</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {results.genotypes.length > 0 ? (
                        <div className="space-y-3">
                          {(() => {
                            console.log('=== DEBUG EAR TYPE GROUPING ===');
                            console.log('Results genotypes:', results.genotypes);
                            
                            // Agrupar por tipo de orelha e somar as probabilidades
                            const groupedByEarType = results.genotypes.reduce((acc, outcome) => {
                              console.log('Processing outcome:', outcome);
                              console.log('Ear genotype:', outcome.earGenotype);
                              
                              const earType = outcome.earGenotype === "du/du" ? "Dumbo" : "Top";
                              console.log('Ear type determined:', earType);
                              
                              if (!acc[earType]) {
                                acc[earType] = {
                                  earType,
                                  totalProbability: 0,
                                  genotypes: []
                                };
                              }
                              acc[earType].totalProbability += outcome.probability;
                              acc[earType].genotypes.push(outcome.earGenotype);
                              return acc;
                            }, {} as Record<string, { earType: string; totalProbability: number; genotypes: string[] }>);
                            
                            console.log('Grouped by ear type:', groupedByEarType);
                            console.log('===============================================');

                            return Object.values(groupedByEarType)
                              .sort((a, b) => b.totalProbability - a.totalProbability)
                              .map((group, index) => {
                                // Normalizar a probabilidade para garantir que não exceda 100%
                                const normalizedProbability = Math.min(group.totalProbability, 100);
                                
                                return (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                  >
                                    <div className="flex-1">
                                      <p className="font-medium">{group.earType}</p>
                                      <p className="text-sm text-muted-foreground">
                                        Genótipo: {group.genotypes[0]}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-2xl font-bold text-primary">
                                        {Math.round(normalizedProbability * 10) / 10}%
                                      </p>
                                      <div className="w-24 bg-background rounded-full h-2 mt-1">
                                        <div
                                          className="h-full bg-primary rounded-full transition-all"
                                          style={{ width: `${normalizedProbability}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              });
                          })()}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground">
                          Genótipos não informados para os pais selecionados
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="traits" className="mt-4">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Tipos de Pelagem</CardTitle>
                        <CardDescription>Baseado nos genótipos dos pais</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {results.genotypes.length > 0 ? (
                          <div className="space-y-3">
                            {(() => {
                              console.log('=== DEBUG COAT TYPE GROUPING ===');
                              console.log('Results genotypes:', results.genotypes);
                              
                              // Agrupar por tipo de pelagem e somar as probabilidades
                              const groupedByCoatType = results.genotypes.reduce((acc, outcome) => {
                                console.log('Processing outcome:', outcome);
                                console.log('Coat genotype:', outcome.coatGenotype);
                                
                                // Determinar o tipo de pelagem baseado no genótipo
                                let coatType = "Standard"; // Default
                                if (outcome.coatGenotype === "Re/Re") {
                                  coatType = "Double Rex";
                                } else if (outcome.coatGenotype === "Re/re") {
                                  coatType = "Rex";
                                } else if (outcome.coatGenotype === "re/re") {
                                  coatType = "Standard";
                                } else if (outcome.coatGenotype) {
                                  coatType = outcome.coatGenotype; // Use the genotype as fallback
                                }
                                
                                console.log('Coat type determined:', coatType);
                                
                                if (!acc[coatType]) {
                                  acc[coatType] = {
                                    coatType,
                                    totalProbability: 0,
                                    genotypes: []
                                  };
                                }
                                acc[coatType].totalProbability += outcome.probability;
                                acc[coatType].genotypes.push(outcome.coatGenotype);
                                return acc;
                              }, {} as Record<string, { coatType: string; totalProbability: number; genotypes: string[] }>);
                              
                              console.log('Grouped by coat type:', groupedByCoatType);
                              console.log('===============================================');

                              return Object.values(groupedByCoatType)
                                .sort((a, b) => b.totalProbability - a.totalProbability)
                                .map((group, index) => {
                                  // Normalizar a probabilidade para garantir que não exceda 100%
                                  const normalizedProbability = Math.min(group.totalProbability, 100);
                                  
                                  return (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                    >
                                      <div className="flex-1">
                                        <p className="font-medium">{group.coatType}</p>
                                        <p className="text-sm text-muted-foreground">
                                          Genótipo: {group.genotypes[0]}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-2xl font-bold text-primary">
                                          {Math.round(normalizedProbability * 10) / 10}%
                                        </p>
                                        <div className="w-24 bg-background rounded-full h-2 mt-1">
                                          <div
                                            className="h-full bg-primary rounded-full transition-all"
                                            style={{ width: `${normalizedProbability}%` }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                });
                            })()}
                          </div>
                        ) : (
                          <p className="text-center text-muted-foreground">
                            Genótipos não informados para os pais selecionados
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Marcações</CardTitle>
                        <CardDescription>Baseado nos genótipos dos pais</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {results.genotypes.length > 0 ? (
                          <div className="space-y-3">
                            {(() => {
                              console.log('=== DEBUG MARKING GROUPING ===');
                              console.log('Results genotypes:', results.genotypes);
                              
                              // Agrupar por marcação e somar as probabilidades
                              const groupedByMarking = results.genotypes.reduce((acc, outcome) => {
                                console.log('Processing outcome:', outcome);
                                console.log('Marking genotype:', outcome.markingGenotype);
                                
                                // Determinar o tipo de marcação baseado no genótipo
                                let marking = "Self"; // Default
                                if (outcome.markingGenotype === "hh") {
                                  marking = "Hooded";
                                } else if (outcome.markingGenotype === "Hh") {
                                  marking = "Berkshire";
                                } else if (outcome.markingGenotype === "Hi/hi") {
                                  marking = "Irish";
                                } else if (outcome.markingGenotype === "Hz/hz") {
                                  marking = "Blaze";
                                } else if (outcome.markingGenotype === "Hv/hv") {
                                  marking = "Variegated";
                                } else if (outcome.markingGenotype === "H-" || outcome.markingGenotype === "H") {
                                  marking = "Self";
                                } else if (outcome.markingGenotype) {
                                  marking = outcome.markingGenotype; // Use the genotype as fallback
                                }
                                
                                console.log('Marking determined:', marking);
                                
                                if (!acc[marking]) {
                                  acc[marking] = {
                                    marking,
                                    totalProbability: 0,
                                    genotypes: []
                                  };
                                }
                                acc[marking].totalProbability += outcome.probability;
                                acc[marking].genotypes.push(outcome.markingGenotype);
                                return acc;
                              }, {} as Record<string, { marking: string; totalProbability: number; genotypes: string[] }>);
                              
                              console.log('Grouped by marking:', groupedByMarking);
                              console.log('===============================================');

                              return Object.values(groupedByMarking)
                                .sort((a, b) => b.totalProbability - a.totalProbability)
                                .map((group, index) => {
                                  // Normalizar a probabilidade para garantir que não exceda 100%
                                  const normalizedProbability = Math.min(group.totalProbability, 100);
                                  
                                  return (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                    >
                                      <div className="flex-1">
                                        <p className="font-medium">{group.marking}</p>
                                        <p className="text-sm text-muted-foreground">
                                          Genótipo: {group.genotypes[0]}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-2xl font-bold text-primary">
                                          {Math.round(normalizedProbability * 10) / 10}%
                                        </p>
                                        <div className="w-24 bg-background rounded-full h-2 mt-1">
                                          <div
                                            className="h-full bg-primary rounded-full transition-all"
                                            style={{ width: `${normalizedProbability}%` }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                });
                            })()}
                          </div>
                        ) : (
                          <p className="text-center text-muted-foreground">
                            Genótipos não informados para os pais selecionados
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
