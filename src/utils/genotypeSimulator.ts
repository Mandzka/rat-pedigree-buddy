/**
 * Simulate genetic outcomes from breeding two rats
 * Updated to use AFRMA genetics system
 */

import { getColorByName } from "@/data/ratColors";
import { afrmaEyeGenotypes, afrmaEarGenotypes, afrmaCoatGenotypes, afrmaMarkingGenotypes } from "@/data/afrmaGenetics";

export interface GenotypeOutcome {
  genotype: string;
  phenotype: string;
  probability: number;
  colorGenotype?: string;
  eyeGenotype?: string;
  earGenotype?: string;
  coatGenotype?: string;
  markingGenotype?: string;
}

/**
 * Parse a genotype string into allele pairs
 * Example: "aa BB dd" -> [["a", "a"], ["B", "B"], ["d", "d"]]
 */
function parseGenotype(genotype: string): string[][] {
  console.log('=== DEBUG PARSE GENOTYPE ===');
  console.log('Genótipo para parsear:', genotype);
  
  if (!genotype || genotype.trim() === "") {
    console.log('Genótipo vazio ou inválido');
    return [];
  }

  const genes = genotype.trim().split(/\s+/);
  console.log('Genes separados:', genes);
  
  const result = genes.map(gene => {
    console.log('Processando gene:', gene);
    if (gene.length === 1) {
      console.log('Gene de 1 caractere:', gene, '->', [gene, gene]);
      return [gene, gene]; // Homozygous
    } else if (gene.length === 2) {
      // Check if it's a complex gene like "cm"
      if (gene === "cm" || gene === "mc") {
        console.log('Gene complexo:', gene, '->', [gene, gene]);
        return [gene, gene]; // Treat complex genes as single allele
      }
      console.log('Gene de 2 caracteres:', gene, '->', [gene[0], gene[1]]);
      return [gene[0], gene[1]];
    } else if (gene.includes("-")) {
      // Handle genes like "B-" (dominant with unknown recessive)
      console.log('Gene com traço:', gene, '->', [gene[0], gene[0]]);
      return [gene[0], gene[0]]; // Assume homozygous for simplicity
    } else {
      // Handle any other complex genes
      console.log('Gene complexo genérico:', gene, '->', [gene, gene]);
      return [gene, gene]; // Default case
    }
  });
  
  console.log('Resultado final do parse:', result);
  console.log('===============================================');
  return result;
}

/**
 * Cross two allele pairs to get possible offspring combinations
 */
function crossAlleles(parent1: string[], parent2: string[]): { alleles: string[]; probability: number }[] {
  const combinations: { alleles: string[]; probability: number }[] = [];
  
  for (const allele1 of parent1) {
    for (const allele2 of parent2) {
      // Keep original order for ALL genes - don't sort anything
      const alleles = [allele1, allele2];
      
      const existing = combinations.find(c => 
        c.alleles[0] === alleles[0] && c.alleles[1] === alleles[1]
      );
      
      if (existing) {
        existing.probability += 0.25;
      } else {
        combinations.push({
          alleles,
          probability: 0.25
        });
      }
    }
  }
  
  // Normalize probabilities to ensure they sum to 1.0
  const totalProbability = combinations.reduce((sum, combo) => sum + combo.probability, 0);
  if (totalProbability > 0) {
    combinations.forEach(combo => {
      combo.probability = combo.probability / totalProbability;
    });
  }
  
  return combinations;
}

/**
 * Determine eye genotype from full genotype
 */
function determineEyeGenotype(genotypeStr: string): string {
  console.log('Determinando genótipo dos olhos para:', genotypeStr);
  if (genotypeStr.includes("cc")) {
    console.log('Encontrado cc - Pink eyes');
    return "cc"; // Pink eyes
  }
  if (genotypeStr.includes("C-") || genotypeStr.includes("C")) {
    console.log('Encontrado C- ou C - Black eyes');
    return "C-"; // Black eyes
  }
  console.log('Nenhum genótipo de olhos encontrado, assumindo C- (Black)');
  return "C-"; // Default to black eyes
}

/**
 * Determine ear genotype from full genotype
 */
function determineEarGenotype(genotypeStr: string): string {
  console.log('Determinando genótipo das orelhas para:', genotypeStr);
  if (genotypeStr.includes("du")) {
    console.log('Encontrado du - Dumbo');
    return "du"; // Dumbo
  }
  if (genotypeStr.includes("Du") || genotypeStr.includes("to")) {
    console.log('Encontrado Du ou to - Top');
    return "to"; // Top
  }
  console.log('Nenhum genótipo de orelhas encontrado, assumindo to (Top)');
  return "to"; // Default to Top ears
}

/**
 * Determine coat genotype from full genotype
 */
function determineCoatGenotype(genotypeStr: string): string {
  console.log('Determinando genótipo da pelagem para:', genotypeStr);
  if (genotypeStr.includes("Re/Re")) {
    console.log('Encontrado Re/Re - Double Rex');
    return "Re/Re"; // Double Rex
  }
  if (genotypeStr.includes("Re/re")) {
    console.log('Encontrado Re/re - Rex');
    return "Re/re"; // Rex
  }
  if (genotypeStr.includes("re/re")) {
    console.log('Encontrado re/re - Standard');
    return "re/re"; // Standard
  }
  console.log('Nenhum genótipo de pelagem encontrado, assumindo re/re (Standard)');
  return "re/re"; // Default to Standard coat
}

/**
 * Determine marking genotype from full genotype
 */
function determineMarkingGenotype(genotypeStr: string): string {
  console.log('Determinando genótipo da marcação para:', genotypeStr);
  
  // Parse the genotype to find marking genes
  const markingPatterns = [
    { pattern: /hh/g, genotype: "hh", phenotype: "Hooded" },
    { pattern: /Hh/g, genotype: "Hh", phenotype: "Berkshire" },
    { pattern: /Hi\/hi/g, genotype: "Hi/hi", phenotype: "Irish" },
    { pattern: /Hz\/hz/g, genotype: "Hz/hz", phenotype: "Blaze" },
    { pattern: /Hv\/hv/g, genotype: "Hv/hv", phenotype: "Variegated" },
    { pattern: /H-/g, genotype: "H-", phenotype: "Self" },
    { pattern: /H/g, genotype: "H-", phenotype: "Self" }
  ];
  
  for (const { pattern, genotype, phenotype } of markingPatterns) {
    if (pattern.test(genotypeStr)) {
      console.log(`Encontrado ${genotype} - ${phenotype}`);
      return genotype;
    }
  }
  
  console.log('Nenhum genótipo de marcação encontrado, assumindo H- (Self)');
  return "H-"; // Default to Self marking
}

/**
 * Determine phenotype from genotype using AFRMA database
 */
function determinePhenotype(genotypePairs: string[][]): string {
  console.log('=== DEBUG DETERMINE PHENOTYPE ===');
  console.log('Genotype pairs:', genotypePairs);
  
  if (genotypePairs.length === 0) {
    console.log('Nenhum par de genótipos fornecido');
    return "Desconhecido";
  }

  // Reconstruct genotype string
  const genotypeStr = genotypePairs.map(pair => pair.join("")).join(" ");
  console.log('Genótipo reconstruído:', genotypeStr);
  
  // Check for Marten gene first (cm)
  const hasMarten = genotypeStr.includes("cm");
  console.log('Tem gene Marten (cm):', hasMarten);
  
  // Try to find exact match in AFRMA database
  const allColors = [
    "Agouti", "Black (Preto)", "Chocolate", "Cinnamon", "Blue", "Russian Blue",
    "PEW (Pink Eyed White)", "REW (Red Eyed White)", "Himalayan", "Siamese", "Burmese",
    "Topaz", "Amber", "Silvermane", "Black Marten", "Blue Marten", "Agouti Marten", "Cinnamon Marten"
  ];
  
  for (const colorName of allColors) {
    const colorInfo = getColorByName(colorName);
    if (colorInfo && colorInfo.genotype === genotypeStr) {
      console.log('Cor exata encontrada:', colorName);
      return colorName;
    }
  }
  
  console.log('Nenhuma cor exata encontrada, usando lógica simplificada');
  
  // If no exact match, use simplified logic with Marten priority
  const aLocus = genotypePairs[0];
  const hasAgouti = aLocus.some(a => a === "A");
  
  const bLocus = genotypePairs.length > 1 ? genotypePairs[1] : ["B", "B"];
  const hasBlack = bLocus.some(b => b === "B");
  
  const dLocus = genotypePairs.length > 2 ? genotypePairs[2] : ["D", "D"];
  const hasDense = dLocus.some(d => d === "D");
  
  // Check for Silvermane gene first (Slm/+ is dominant over Marten)
  const hasSilvermane = genotypeStr.includes("Slm");
  if (hasSilvermane) {
    // Silvermane é dominante, então não pode ter Marten ao mesmo tempo
    if (hasAgouti) {
      return "Agouti Silvermane";
    } else if (hasBlack && hasDense) {
      return "Black Silvermane";
    } else if (hasBlack && !hasDense) {
      return "Blue Silvermane";
    } else if (!hasBlack && hasDense) {
      return "Cinnamon Silvermane";
    }
  }
  
  // Marten phenotypes (Marten is recessive, only shows when no Silvermane)
  if (hasMarten) {
    if (hasAgouti) {
      return "Agouti Marten";
    } else if (hasBlack && hasDense) {
      return "Black Marten";
    } else if (hasBlack && !hasDense) {
      return "Blue Marten";
    } else if (!hasBlack && hasDense) {
      return "Cinnamon Marten";
    }
  }
  
  // Non-Marten phenotypes
  if (hasAgouti) {
    if (hasBlack && hasDense) {
      return "Agouti";
    } else if (hasBlack && !hasDense) {
      return "Blue Agouti";
    } else if (!hasBlack && hasDense) {
      return "Cinnamon";
    } else {
      return "Fawn";
    }
  } else {
    if (hasBlack && hasDense) {
      return "Black (Preto)";
    } else if (hasBlack && !hasDense) {
      return "Blue";
    } else if (!hasBlack && hasDense) {
      return "Mink";
    } else {
      return "Russian Blue";
    }
  }
}

/**
 * Cross color genotypes with proper dominance consideration
 */
function crossColorGenotypes(motherGenotype: string, fatherGenotype: string): { genotype: string; probability: number }[] {
  console.log('=== DEBUG CROSS COLOR GENOTYPES ===');
  console.log('Cruzando cores:', motherGenotype, 'x', fatherGenotype);
  
  // Parse the color genotypes
  const motherGenes = parseGenotype(motherGenotype);
  const fatherGenes = parseGenotype(fatherGenotype);
  
  if (motherGenes.length === 0 || fatherGenes.length === 0) {
    return [{ genotype: "Genótipo não informado", probability: 1 }];
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
  
  const outcomes: Map<string, number> = new Map();
  
  function generateCombinations(locusList: { alleles: string[]; probability: number }[][], index: number, currentGenotype: string[], currentProb: number) {
    if (index >= locusList.length) {
      const genotypeStr = currentGenotype.join(" ");
      const phenotype = determinePhenotype(currentGenotype.map(g => g.split("")));
      
      const existing = outcomes.get(phenotype);
      if (existing) {
        outcomes.set(phenotype, existing + currentProb);
      } else {
        outcomes.set(phenotype, currentProb);
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
  
  return Array.from(outcomes.entries()).map(([phenotype, probability]) => ({
    genotype: phenotype, // For now, use phenotype as genotype
    probability
  }));
}

/**
 * Cross specific genotypes (eye, ear, coat, marking)
 */
function crossSpecificGenotypes(motherGenotype: string, fatherGenotype: string): { genotype: string; probability: number }[] {
  console.log('=== DEBUG CROSS SPECIFIC GENOTYPES ===');
  console.log('Cruzando genótipos específicos:', motherGenotype, 'x', fatherGenotype);
  
  // Se os genótipos são iguais, retornar apenas um resultado
  if (motherGenotype === fatherGenotype) {
    console.log('Genótipos iguais, retornando resultado único');
    return [{ genotype: motherGenotype, probability: 1 }];
  }
  
  // Parse the specific genotypes
  const motherGenes = parseGenotype(motherGenotype);
  const fatherGenes = parseGenotype(fatherGenotype);
  
  console.log('Mother genes parsed:', motherGenes);
  console.log('Father genes parsed:', fatherGenes);
  
  if (motherGenes.length === 0 || fatherGenes.length === 0) {
    console.log('Genes não encontrados, retornando genótipo original');
    return [{ genotype: motherGenotype || fatherGenotype || "", probability: 1 }];
  }
  
  // Cross the alleles
  const crosses = crossAlleles(motherGenes[0], fatherGenes[0]);
  console.log('Crosses result:', crosses);
  
  const result = crosses.map(cross => ({
    genotype: cross.alleles.join(""),
    probability: cross.probability
  }));
  
  console.log('Final result:', result);
  console.log('===============================================');
  
  return result;
}

/**
 * Simulate breeding outcomes with AFRMA genetics
 */
export function simulateGenotypes(
  motherGenotype: string,
  fatherGenotype: string,
  mother?: any,
  father?: any
): GenotypeOutcome[] {
  console.log('=== DEBUG SIMULATE GENOTYPES ===');
  console.log('Genótipo da mãe:', motherGenotype);
  console.log('Genótipo do pai:', fatherGenotype);
  console.log('Objeto da mãe:', mother);
  console.log('Objeto do pai:', father);
  
  // Se temos os objetos dos pais, usar seus genótipos específicos
  let motherEyeGenotype = mother?.eyeGenotype || "P- R-";
  let motherEarGenotype = mother?.earGenotype || "to/to";
  let motherCoatGenotype = mother?.coatGenotype || "re/re";
  let motherMarkingGenotype = mother?.markingGenotype || "H-";
  
  let fatherEyeGenotype = father?.eyeGenotype || "P- R-";
  let fatherEarGenotype = father?.earGenotype || "to/to";
  let fatherCoatGenotype = father?.coatGenotype || "re/re";
  let fatherMarkingGenotype = father?.markingGenotype || "H-";
  
  console.log('Genótipos específicos da mãe:', {
    eye: motherEyeGenotype,
    ear: motherEarGenotype,
    coat: motherCoatGenotype,
    marking: motherMarkingGenotype
  });
  
  console.log('Genótipos específicos do pai:', {
    eye: fatherEyeGenotype,
    ear: fatherEarGenotype,
    coat: fatherCoatGenotype,
    marking: fatherMarkingGenotype
  });
  
  const motherGenes = parseGenotype(motherGenotype);
  const fatherGenes = parseGenotype(fatherGenotype);
  
  console.log('Genes da mãe:', motherGenes);
  console.log('Genes do pai:', fatherGenes);
  
  if (motherGenes.length === 0 || fatherGenes.length === 0) {
    console.log('Genótipos dos pais não informados');
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
  
  // Calculate specific genotype crosses
  const eyeCrosses = crossSpecificGenotypes(motherEyeGenotype, fatherEyeGenotype);
  const earCrosses = crossSpecificGenotypes(motherEarGenotype, fatherEarGenotype);
  const coatCrosses = crossSpecificGenotypes(motherCoatGenotype, fatherCoatGenotype);
  const markingCrosses = crossSpecificGenotypes(motherMarkingGenotype, fatherMarkingGenotype);
  
  console.log('=== DEBUG SPECIFIC CROSSES ===');
  console.log('Cruzamentos de olhos:', eyeCrosses);
  console.log('Cruzamentos de orelhas:', earCrosses);
  console.log('Cruzamentos de pelagem:', coatCrosses);
  console.log('Cruzamentos de marcação:', markingCrosses);
  console.log('===============================================');
  
  function generateCombinations(locusList: { alleles: string[]; probability: number }[][], index: number, currentGenotype: string[], currentProb: number) {
    if (index >= locusList.length) {
      const genotypeStr = currentGenotype.join(" ");
      const genotypePairs = currentGenotype.map(g => g.split(""));
      const phenotype = determinePhenotype(genotypePairs);
      const key = `${genotypeStr}-${phenotype}`;
      
      // Use the specific genotype crosses
      const colorGenotype = genotypeStr;
      const eyeGenotype = eyeCrosses[0]?.genotype || "P- R-";
      const earGenotype = earCrosses[0]?.genotype || "to/to";
      const coatGenotype = coatCrosses[0]?.genotype || "re/re";
      const markingGenotype = markingCrosses[0]?.genotype || "H-";
      
      const existing = outcomes.get(key);
      if (existing) {
        existing.probability += currentProb;
      } else {
        outcomes.set(key, {
          genotype: genotypeStr,
          phenotype,
          probability: currentProb,
          colorGenotype,
          eyeGenotype,
          earGenotype,
          coatGenotype,
          markingGenotype
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
  
  console.log('=== FINAL RESULTS ===');
  console.log('Resultados finais:', results);
  console.log('===============================================');
  
  return results;
}
