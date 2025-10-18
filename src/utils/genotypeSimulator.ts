/**
 * Simulate genetic outcomes from breeding two rats
 * This is a simplified genetic calculator focusing on coat color genetics
 */

export interface GenotypeOutcome {
  genotype: string;
  phenotype: string;
  probability: number;
}

/**
 * Parse a genotype string into allele pairs
 * Example: "aa BB dd" -> [["a", "a"], ["B", "B"], ["d", "d"]]
 */
function parseGenotype(genotype: string): string[][] {
  if (!genotype || genotype.trim() === "") {
    return [];
  }

  const genes = genotype.trim().split(/\s+/);
  return genes.map(gene => {
    if (gene.length === 1) {
      return [gene, gene]; // Homozygous
    } else if (gene.length === 2) {
      return [gene[0], gene[1]];
    } else {
      // Handle genes like "Brb" (B with ruby modifier)
      return [gene[0], gene.substring(1)];
    }
  });
}

/**
 * Cross two allele pairs to get possible offspring combinations
 */
function crossAlleles(parent1: string[], parent2: string[]): { alleles: string[]; probability: number }[] {
  const combinations: { alleles: string[]; probability: number }[] = [];
  
  for (const allele1 of parent1) {
    for (const allele2 of parent2) {
      const sorted = [allele1, allele2].sort().reverse(); // Dominant first
      const existing = combinations.find(c => 
        c.alleles[0] === sorted[0] && c.alleles[1] === sorted[1]
      );
      
      if (existing) {
        existing.probability += 0.25;
      } else {
        combinations.push({
          alleles: sorted,
          probability: 0.25
        });
      }
    }
  }
  
  return combinations;
}

/**
 * Determine phenotype from genotype (simplified version)
 */
function determinePhenotype(genotypePairs: string[][]): string {
  if (genotypePairs.length === 0) {
    return "Desconhecido";
  }

  // Simplified phenotype determination based on common rat genetics
  let phenotype = "";
  
  // Check A locus (Agouti vs non-agouti)
  const aLocus = genotypePairs[0];
  const hasAgouti = aLocus.some(a => a === "A");
  
  // Check B locus (Black vs Brown)
  const bLocus = genotypePairs.length > 1 ? genotypePairs[1] : ["B", "B"];
  const hasBlack = bLocus.some(b => b === "B");
  
  // Check D locus (Dense vs Dilute)
  const dLocus = genotypePairs.length > 2 ? genotypePairs[2] : ["D", "D"];
  const hasDense = dLocus.some(d => d === "D");
  
  if (hasAgouti) {
    if (hasBlack && hasDense) {
      phenotype = "Agouti";
    } else if (hasBlack && !hasDense) {
      phenotype = "Blue Agouti";
    } else if (!hasBlack && hasDense) {
      phenotype = "Cinnamon";
    } else {
      phenotype = "Fawn";
    }
  } else {
    if (hasBlack && hasDense) {
      phenotype = "Black";
    } else if (hasBlack && !hasDense) {
      phenotype = "Blue";
    } else if (!hasBlack && hasDense) {
      phenotype = "Mink";
    } else {
      phenotype = "Russian Blue";
    }
  }
  
  return phenotype;
}

/**
 * Simulate breeding outcomes
 */
export function simulateGenotypes(
  motherGenotype: string,
  fatherGenotype: string
): GenotypeOutcome[] {
  const motherGenes = parseGenotype(motherGenotype);
  const fatherGenes = parseGenotype(fatherGenotype);
  
  if (motherGenes.length === 0 || fatherGenes.length === 0) {
    return [{
      genotype: "Genótipo não informado",
      phenotype: "Não é possível calcular",
      probability: 100
    }];
  }

  // Ensure both parents have the same number of gene loci
  const maxLoci = Math.max(motherGenes.length, fatherGenes.length);
  
  // Pad with dominant alleles if needed
  while (motherGenes.length < maxLoci) {
    motherGenes.push(["?", "?"]);
  }
  while (fatherGenes.length < maxLoci) {
    fatherGenes.push(["?", "?"]);
  }

  // Calculate all possible combinations
  const outcomes: Map<string, GenotypeOutcome> = new Map();
  
  function generateCombinations(locusList: { alleles: string[]; probability: number }[][], index: number, currentGenotype: string[], currentProb: number) {
    if (index >= locusList.length) {
      const genotypeStr = currentGenotype.map(pair => pair).join(" ");
      const genotypePairs = currentGenotype.map(g => g.split(""));
      const phenotype = determinePhenotype(genotypePairs);
      const key = `${genotypeStr}-${phenotype}`;
      
      const existing = outcomes.get(key);
      if (existing) {
        existing.probability += currentProb;
      } else {
        outcomes.set(key, {
          genotype: genotypeStr,
          phenotype,
          probability: currentProb
        });
      }
      return;
    }
    
    for (const combination of locusList[index]) {
      const alleleString = combination.alleles.join("");
      generateCombinations(
        locusList,
        index + 1,
        [...currentGenotype, alleleString],
        currentProb * combination.probability
      );
    }
  }
  
  const allCrosses = motherGenes.map((motherAlleles, i) => 
    crossAlleles(motherAlleles, fatherGenes[i])
  );
  
  generateCombinations(allCrosses, 0, [], 1);
  
  // Convert probabilities to percentages and sort by probability
  const results = Array.from(outcomes.values())
    .map(outcome => ({
      ...outcome,
      probability: Math.round(outcome.probability * 100 * 10) / 10
    }))
    .sort((a, b) => b.probability - a.probability);
  
  return results;
}
