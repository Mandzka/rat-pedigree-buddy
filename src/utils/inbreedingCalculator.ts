import { Rat } from "@/types/rat";

/**
 * Calculate the inbreeding coefficient (COI) using the path method
 * This is a simplified version that traces common ancestors
 * 
 * @param rat - The rat to calculate COI for
 * @param allRats - All rats in the database
 * @param generations - Number of generations to trace (default: 5)
 * @returns Inbreeding coefficient as a percentage (0-100)
 */
export function calculateInbreedingCoefficient(
  rat: Rat,
  allRats: Rat[],
  generations: number = 5
): number {
  if (!rat.motherId || !rat.fatherId) {
    return 0; // No inbreeding if parents are unknown
  }

  const mother = allRats.find(r => r.id === rat.motherId);
  const father = allRats.find(r => r.id === rat.fatherId);

  if (!mother || !father) {
    return 0;
  }

  // Find common ancestors between mother and father lines
  const motherAncestors = getAncestors(mother, allRats, generations);
  const fatherAncestors = getAncestors(father, allRats, generations);

  // Find common ancestors
  const commonAncestors = motherAncestors.filter(mAncestor =>
    fatherAncestors.some(fAncestor => fAncestor.id === mAncestor.id)
  );

  if (commonAncestors.length === 0) {
    return 0;
  }

  // Simplified COI calculation
  // For each common ancestor, calculate their contribution
  let coi = 0;
  
  for (const ancestor of commonAncestors) {
    const pathsFromMother = countPathsToAncestor(mother, ancestor.id, allRats, generations);
    const pathsFromFather = countPathsToAncestor(father, ancestor.id, allRats, generations);
    
    // Each path contributes (1/2)^n where n is the number of individuals in the path
    // This is a simplified version - proper calculation would need path lengths
    const contribution = (pathsFromMother * pathsFromFather) / Math.pow(2, 4);
    coi += contribution;
  }

  // Convert to percentage and cap at 100%
  return Math.min(Math.round(coi * 100), 100);
}

/**
 * Get all ancestors up to a certain number of generations
 */
function getAncestors(rat: Rat, allRats: Rat[], maxGenerations: number): Rat[] {
  const ancestors: Rat[] = [];
  const visited = new Set<string>();

  function collectAncestors(currentRat: Rat, generation: number) {
    if (generation > maxGenerations || visited.has(currentRat.id)) {
      return;
    }

    visited.add(currentRat.id);

    if (currentRat.motherId) {
      const mother = allRats.find(r => r.id === currentRat.motherId);
      if (mother) {
        ancestors.push(mother);
        collectAncestors(mother, generation + 1);
      }
    }

    if (currentRat.fatherId) {
      const father = allRats.find(r => r.id === currentRat.fatherId);
      if (father) {
        ancestors.push(father);
        collectAncestors(father, generation + 1);
      }
    }
  }

  collectAncestors(rat, 1);
  return ancestors;
}

/**
 * Count the number of paths from a rat to a specific ancestor
 */
function countPathsToAncestor(
  rat: Rat,
  ancestorId: string,
  allRats: Rat[],
  maxDepth: number,
  currentDepth: number = 0
): number {
  if (currentDepth > maxDepth) {
    return 0;
  }

  if (rat.id === ancestorId) {
    return 1;
  }

  let paths = 0;

  if (rat.motherId) {
    const mother = allRats.find(r => r.id === rat.motherId);
    if (mother) {
      paths += countPathsToAncestor(mother, ancestorId, allRats, maxDepth, currentDepth + 1);
    }
  }

  if (rat.fatherId) {
    const father = allRats.find(r => r.id === rat.fatherId);
    if (father) {
      paths += countPathsToAncestor(father, ancestorId, allRats, maxDepth, currentDepth + 1);
    }
  }

  return paths;
}

/**
 * Simulate a breeding between two rats and calculate expected COI for offspring
 */
export function simulateBreeding(
  mother: Rat,
  father: Rat,
  allRats: Rat[]
): {
  estimatedCOI: number;
  relationshipType: string;
  warning?: string;
} {
  // Create a temporary offspring to calculate COI
  const tempOffspring: Rat = {
    id: "temp",
    name: "Simulação",
    dateOfBirth: new Date().toISOString(),
    sex: "Macho",
    origin: "Nascido na Rattery",
    coatType: mother.coatType,
    coatTexture: mother.coatTexture,
    coatColor: mother.coatColor,
    marking: mother.marking,
    eyeColor: mother.eyeColor,
    earType: mother.earType,
    breedingApproved: false,
    motherId: mother.id,
    fatherId: father.id,
  };

  const coi = calculateInbreedingCoefficient(tempOffspring, allRats);
  
  let relationshipType = "Não relacionados";
  let warning: string | undefined;

  // Determine relationship type
  if (mother.motherId === father.motherId && mother.fatherId === father.fatherId && mother.motherId && father.fatherId) {
    relationshipType = "Irmãos completos";
    warning = "⚠️ Cruzamento de irmãos completos - alto risco de problemas genéticos!";
  } else if (
    (mother.motherId === father.motherId && mother.motherId) ||
    (mother.fatherId === father.fatherId && mother.fatherId)
  ) {
    relationshipType = "Meio-irmãos";
    warning = "⚠️ Cruzamento de meio-irmãos - risco moderado.";
  } else if (
    mother.id === father.motherId ||
    mother.id === father.fatherId ||
    father.id === mother.motherId ||
    father.id === mother.fatherId
  ) {
    relationshipType = "Pai/Mãe x Filho/Filha";
    warning = "⚠️ Cruzamento consanguíneo direto - risco muito alto!";
  } else if (coi > 12.5) {
    relationshipType = "Primos ou mais próximos";
    warning = "⚠️ COI elevado detectado - verifique o pedigree cuidadosamente.";
  } else if (coi > 6.25) {
    relationshipType = "Relacionamento distante";
  }

  return {
    estimatedCOI: coi,
    relationshipType,
    warning,
  };
}
