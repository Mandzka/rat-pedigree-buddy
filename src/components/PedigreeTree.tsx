import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Rat } from "@/types/rat";
import { Network } from "lucide-react";

interface PedigreeTreeProps {
  rat: Rat;
  allRats: Rat[];
}

interface TreeNode {
  rat: Rat | null;
  generation: number;
}

export function PedigreeTree({ rat, allRats }: PedigreeTreeProps) {
  const findRatById = (id?: string): Rat | null => {
    if (!id) return null;
    return allRats.find(r => r.id === id) || null;
  };

  const buildTree = (currentRat: Rat | null, generation: number = 0): TreeNode[] => {
    if (!currentRat || generation >= 3) return [];
    
    const mother = findRatById(currentRat.motherId);
    const father = findRatById(currentRat.fatherId);
    
    const nodes: TreeNode[] = [];
    
    if (generation > 0) {
      nodes.push({ rat: currentRat, generation });
    }
    
    if (mother) {
      nodes.push(...buildTree(mother, generation + 1));
    } else if (generation < 2) {
      nodes.push({ rat: null, generation: generation + 1 });
    }
    
    if (father) {
      nodes.push(...buildTree(father, generation + 1));
    } else if (generation < 2) {
      nodes.push({ rat: null, generation: generation + 1 });
    }
    
    return nodes;
  };

  const RatCard = ({ node }: { node: TreeNode | null }) => {
    if (!node || !node.rat) {
      return (
        <Card className="w-48 opacity-50">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Desconhecido</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="w-48 hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <p className="font-semibold text-sm truncate">{node.rat.name}</p>
          <p className="text-xs text-muted-foreground">{node.rat.sex}</p>
          <p className="text-xs truncate">{node.rat.coatColor}</p>
          <p className="text-xs truncate">{node.rat.marking}</p>
          {node.rat.genotype && (
            <p className="text-xs font-mono mt-1 truncate" title={node.rat.genotype}>
              {node.rat.genotype}
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  const mother = findRatById(rat.motherId);
  const father = findRatById(rat.fatherId);
  
  const maternalGrandmother = findRatById(mother?.motherId);
  const maternalGrandfather = findRatById(mother?.fatherId);
  const paternalGrandmother = findRatById(father?.motherId);
  const paternalGrandfather = findRatById(father?.fatherId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Network className="w-4 h-4 mr-2" />
          Ver Árvore Genealógica
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Árvore Genealógica - {rat.name}</DialogTitle>
        </DialogHeader>

        <div className="py-6 overflow-x-auto">
          <div className="flex flex-col items-center space-y-8 min-w-max">
            {/* Generation 0 - Subject */}
            <div className="flex justify-center">
              <Card className="w-64 bg-primary/10 border-primary">
                <CardContent className="p-6">
                  <p className="font-bold text-lg">{rat.name}</p>
                  <p className="text-sm text-muted-foreground">{rat.sex}</p>
                  <p className="text-sm">{rat.coatColor}</p>
                  <p className="text-sm">{rat.marking}</p>
                  <p className="text-sm">Orelhas: {rat.earType}</p>
                  <p className="text-sm">Olhos: {rat.eyeColor}</p>
                  {rat.genotype && (
                    <p className="text-sm font-mono mt-2 bg-background/50 p-1 rounded">
                      {rat.genotype}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Connector line */}
            <div className="w-px h-8 bg-border"></div>

            {/* Generation 1 - Parents */}
            <div className="flex gap-12">
              <div className="flex flex-col items-center">
                <p className="text-xs text-muted-foreground mb-2">Mãe</p>
                <RatCard node={mother ? { rat: mother, generation: 1 } : null} />
                
                {/* Connector to grandparents */}
                {(maternalGrandmother || maternalGrandfather) && (
                  <>
                    <div className="w-px h-8 bg-border mt-4"></div>
                    <div className="flex gap-8 mt-4">
                      <div className="flex flex-col items-center">
                        <p className="text-xs text-muted-foreground mb-2">Avó Materna</p>
                        <RatCard node={maternalGrandmother ? { rat: maternalGrandmother, generation: 2 } : null} />
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="text-xs text-muted-foreground mb-2">Avô Materno</p>
                        <RatCard node={maternalGrandfather ? { rat: maternalGrandfather, generation: 2 } : null} />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col items-center">
                <p className="text-xs text-muted-foreground mb-2">Pai</p>
                <RatCard node={father ? { rat: father, generation: 1 } : null} />
                
                {/* Connector to grandparents */}
                {(paternalGrandmother || paternalGrandfather) && (
                  <>
                    <div className="w-px h-8 bg-border mt-4"></div>
                    <div className="flex gap-8 mt-4">
                      <div className="flex flex-col items-center">
                        <p className="text-xs text-muted-foreground mb-2">Avó Paterna</p>
                        <RatCard node={paternalGrandmother ? { rat: paternalGrandmother, generation: 2 } : null} />
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="text-xs text-muted-foreground mb-2">Avô Paterno</p>
                        <RatCard node={paternalGrandfather ? { rat: paternalGrandfather, generation: 2 } : null} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-semibold mb-2">Legenda:</p>
              <p className="text-xs text-muted-foreground">
                Mostrando até 3 gerações (pais e avós)
              </p>
              <p className="text-xs text-muted-foreground">
                Cartões opacos indicam ancestrais desconhecidos
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
