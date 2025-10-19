import { Rat, CoatType, Marking, EyeColor, EarType } from "@/types/rat";

export interface FullGeneticOutcome {
  coatColor: string;
  coatColorProbability: number;
  coatType: CoatType;
  coatTypeProbability: number;
  marking: Marking;
  markingProbability: number;
  eyeColor: EyeColor;
  eyeColorProbability: number;
  earType: EarType;
  earTypeProbability: number;
  genotype?: string;
}

interface AlleleOutcome {
  allele: string;
  probability: number;
}

/**
 * Cross two alleles to get possible outcomes
 */
function crossAlleles(allele1: string, allele2: string): AlleleOutcome[] {
  const outcomes: Map<string, number> = new Map();
  
  const a1_options = [allele1[0], allele1[1] || allele1[0]];
  const a2_options = [allele2[0], allele2[1] || allele2[0]];
  
  for (const a1 of a1_options) {
    for (const a2 of a2_options) {
      const sorted = [a1, a2].sort().reverse().join("");
      outcomes.set(sorted, (outcomes.get(sorted) || 0) + 0.25);
    }
  }
  
  return Array.from(outcomes.entries()).map(([allele, probability]) => ({
    allele,
    probability
  }));
}

/**
 * Simulate ear type inheritance (Dumbo is recessive)
 */
function simulateEarType(mother: Rat, father: Rat): { earType: EarType; probability: number }[] {
  const motherEar = mother.earType === "Dumbo" ? "dd" : (mother.earType === "Top" ? "Tt" : "DD");
  const fatherEar = father.earType === "Dumbo" ? "dd" : (father.earType === "Top" ? "Tt" : "DD");
  
  const outcomes = crossAlleles(motherEar, fatherEar);
  const results: Map<EarType, number> = new Map();
  
  for (const outcome of outcomes) {
    let earType: EarType = "Standard";
    if (outcome.allele.includes("d") && !outcome.allele.includes("D")) {
      earType = "Dumbo";
    } else if (outcome.allele.includes("T")) {
      earType = "Top";
    }
    results.set(earType, (results.get(earType) || 0) + outcome.probability);
  }
  
  return Array.from(results.entries()).map(([earType, probability]) => ({
    earType,
    probability: Math.round(probability * 100)
  }));
}

/**
 * Simulate eye color inheritance
 */
function simulateEyeColor(mother: Rat, father: Rat): { eyeColor: EyeColor; probability: number }[] {
  // Simplified: Black is dominant, Ruby and Pink are recessive
  const eyeMap: Record<EyeColor, string> = {
    "Preto": "BB",
    "Ruby": "rr",
    "Red": "rr",
    "Pink": "pp",
    "Odd-eyed": "Oo"
  };
  
  const motherEye = eyeMap[mother.eyeColor] || "BB";
  const fatherEye = eyeMap[father.eyeColor] || "BB";
  
  const outcomes = crossAlleles(motherEye, fatherEye);
  const results: Map<EyeColor, number> = new Map();
  
  for (const outcome of outcomes) {
    let eyeColor: EyeColor = "Preto";
    if (outcome.allele === "pp") {
      eyeColor = "Pink";
    } else if (outcome.allele === "rr") {
      eyeColor = "Ruby";
    } else if (outcome.allele.includes("O")) {
      eyeColor = "Odd-eyed";
    } else if (outcome.allele.includes("B")) {
      eyeColor = "Preto";
    }
    results.set(eyeColor, (results.get(eyeColor) || 0) + outcome.probability);
  }
  
  return Array.from(results.entries()).map(([eyeColor, probability]) => ({
    eyeColor,
    probability: Math.round(probability * 100)
  }));
}

/**
 * Simulate coat type inheritance (Rex, Hairless, etc.)
 */
function simulateCoatType(mother: Rat, father: Rat): { coatType: CoatType; probability: number }[] {
  // Simplified genetic model
  const coatMap: Record<CoatType, string> = {
    "Standard": "++",
    "Rex": "rr",
    "Velveteen": "vv",
    "Hairless": "hh",
    "Double Rex": "RR",
    "Satin": "ss",
    "Harley": "hh" // Same as hairless genetically
  };
  
  const motherCoat = coatMap[mother.coatType] || "++";
  const fatherCoat = coatMap[father.coatType] || "++";
  
  const outcomes = crossAlleles(motherCoat, fatherCoat);
  const results: Map<CoatType, number> = new Map();
  
  for (const outcome of outcomes) {
    let coatType: CoatType = "Standard";
    if (outcome.allele === "rr") {
      coatType = "Rex";
    } else if (outcome.allele === "RR") {
      coatType = "Double Rex";
    } else if (outcome.allele === "hh") {
      coatType = "Hairless";
    } else if (outcome.allele === "vv") {
      coatType = "Velveteen";
    } else if (outcome.allele === "ss") {
      coatType = "Satin";
    }
    results.set(coatType, (results.get(coatType) || 0) + outcome.probability);
  }
  
  return Array.from(results.entries()).map(([coatType, probability]) => ({
    coatType,
    probability: Math.round(probability * 100)
  }));
}

/**
 * Simulate marking inheritance
 */
function simulateMarking(mother: Rat, father: Rat): { marking: Marking; probability: number }[] {
  // Simplified model: Some markings are dominant/recessive
  const markingMap: Record<Marking, string> = {
    "Self": "ss",
    "Berkshire": "bb",
    "Irish": "ii",
    "Hooded": "hh",
    "Blazed": "BB",
    "Variegated": "vv",
    "Capped": "cc",
    "Bareback": "bb",
    "Essex": "ee",
    "Masked": "mm",
    "Dalmatian": "dd",
    "Roan": "rr"
  };
  
  const motherMarking = markingMap[mother.marking] || "ss";
  const fatherMarking = markingMap[father.marking] || "ss";
  
  const outcomes = crossAlleles(motherMarking, fatherMarking);
  const results: Map<Marking, number> = new Map();
  
  for (const outcome of outcomes) {
    let marking: Marking = "Self";
    if (outcome.allele === "bb") marking = "Berkshire";
    else if (outcome.allele === "ii") marking = "Irish";
    else if (outcome.allele === "hh") marking = "Hooded";
    else if (outcome.allele.includes("B")) marking = "Blazed";
    else if (outcome.allele === "vv") marking = "Variegated";
    else if (outcome.allele === "cc") marking = "Capped";
    else if (outcome.allele === "dd") marking = "Dalmatian";
    else if (outcome.allele === "rr") marking = "Roan";
    
    results.set(marking, (results.get(marking) || 0) + outcome.probability);
  }
  
  return Array.from(results.entries()).map(([marking, probability]) => ({
    marking,
    probability: Math.round(probability * 100)
  }));
}

/**
 * Main simulation function - calculates ALL genetic outcomes
 */
export function simulateFullGenetics(
  mother: Rat,
  father: Rat
): FullGeneticOutcome[] {
  const earOutcomes = simulateEarType(mother, father);
  const eyeOutcomes = simulateEyeColor(mother, father);
  const coatTypeOutcomes = simulateCoatType(mother, father);
  const markingOutcomes = simulateMarking(mother, father);
  
  // Combine all outcomes
  const combinedOutcomes: FullGeneticOutcome[] = [];
  
  // For simplicity, we'll show top combinations
  for (const ear of earOutcomes) {
    for (const eye of eyeOutcomes) {
      for (const coat of coatTypeOutcomes) {
        for (const marking of markingOutcomes) {
          const combinedProb = (ear.probability / 100) * 
                              (eye.probability / 100) * 
                              (coat.probability / 100) * 
                              (marking.probability / 100);
          
          if (combinedProb >= 0.01) { // Only show outcomes with >1% probability
            combinedOutcomes.push({
              coatColor: mother.coatColor, // Color comes from separate genotype calculation
              coatColorProbability: 0,
              coatType: coat.coatType,
              coatTypeProbability: coat.probability,
              marking: marking.marking,
              markingProbability: marking.probability,
              eyeColor: eye.eyeColor,
              eyeColorProbability: eye.probability,
              earType: ear.earType,
              earTypeProbability: ear.probability,
            });
          }
        }
      }
    }
  }
  
  // Sort by combined probability and return top results
  return combinedOutcomes
    .sort((a, b) => 
      (b.coatTypeProbability * b.markingProbability * b.eyeColorProbability * b.earTypeProbability) -
      (a.coatTypeProbability * a.markingProbability * a.eyeColorProbability * a.earTypeProbability)
    )
    .slice(0, 20); // Top 20 most likely combinations
}

/**
 * Get summary statistics for each trait
 */
export function getTraitSummary(mother: Rat, father: Rat) {
  return {
    ears: simulateEarType(mother, father),
    eyes: simulateEyeColor(mother, father),
    coatTypes: simulateCoatType(mother, father),
    markings: simulateMarking(mother, father),
  };
}
