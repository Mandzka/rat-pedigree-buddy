import { ratColorDatabase, getColorByName } from "@/data/ratColors";
import { Rat, CoatType, EyeColor, EarType } from "@/types/rat";

/**
 * Gera genótipo automático baseado no fenótipo do rato
 */
export function generateGenotypeFromPhenotype(rat: Partial<Rat>): string {
  let genotype = "";
  
  // Buscar cor no banco de dados
  const colorInfo = getColorByName(rat.coatColor || "");
  if (colorInfo) {
    genotype = colorInfo.genotype;
  } else {
    // Se não encontrar a cor exata, tentar inferir baseado em características
    genotype = inferGenotypeFromCharacteristics(rat);
  }
  
  return genotype;
}

/**
 * Atualiza características automáticas baseadas na cor selecionada
 */
export function updateCharacteristicsFromColor(colorName: string): Partial<Rat> {
  const colorInfo = getColorByName(colorName);
  if (!colorInfo) return {};
  
  const updates: Partial<Rat> = {};
  
  // Atualizar cor dos olhos se especificada na cor
  if (colorInfo.eyeColor) {
    updates.eyeColor = colorInfo.eyeColor as EyeColor;
  }
  
  // Atualizar tipo de orelha se especificado na cor
  if (colorInfo.earType) {
    updates.earType = colorInfo.earType as EarType;
  }
  
  // Atualizar tipo de pelagem se especificado na cor
  if (colorInfo.coatType) {
    updates.coatType = colorInfo.coatType as CoatType;
  }
  
  return updates;
}

/**
 * Infere genótipo baseado em características quando não há cor específica no banco
 */
function inferGenotypeFromCharacteristics(rat: Partial<Rat>): string {
  let genotype = "";
  
  // Locus A (Agouti)
  if (rat.coatColor?.toLowerCase().includes("agouti")) {
    genotype += "A- ";
  } else {
    genotype += "aa ";
  }
  
  // Locus B (Brown)
  if (rat.coatColor?.toLowerCase().includes("brown") || 
      rat.coatColor?.toLowerCase().includes("mink") ||
      rat.coatColor?.toLowerCase().includes("cinnamon")) {
    genotype += "bb ";
  } else {
    genotype += "B- ";
  }
  
  // Locus D (Dilution)
  if (rat.coatColor?.toLowerCase().includes("blue") ||
      rat.coatColor?.toLowerCase().includes("dilute")) {
    genotype += "dd ";
  } else {
    genotype += "D- ";
  }
  
  // Locus C (Albino)
  if (rat.eyeColor === "Pink" || rat.coatColor?.toLowerCase().includes("white")) {
    genotype += "cc";
  } else {
    genotype += "C-";
  }
  
  return genotype.trim();
}

/**
 * Gera cor dos olhos automática baseada no genótipo
 */
export function generateEyeColorFromGenotype(genotype: string): EyeColor {
  const genotypeLower = genotype.toLowerCase();
  
  // Albino (PEW)
  if (genotypeLower.includes("cc")) {
    return "Pink";
  }
  
  // Siamese/Himalayan/Burmese
  if (genotypeLower.includes("ch") || genotypeLower.includes("cb")) {
    return "Red";
  }
  
  // Ruby eyes (geralmente associado a certas diluições)
  if (genotypeLower.includes("rr")) {
    return "Ruby";
  }
  
  // Para cores específicas, buscar no banco de dados
  const allColors = ratColorDatabase.flatMap(group => group.colors);
  const matchingColor = allColors.find(color => 
    color.genotype.toLowerCase() === genotypeLower
  );
  
  if (matchingColor?.eyeColor) {
    return matchingColor.eyeColor as EyeColor;
  }
  
  return "Preto";
}

/**
 * Gera tipo de orelha automático baseado no genótipo
 */
export function generateEarTypeFromGenotype(genotype: string): EarType {
  if (genotype.includes("du")) {
    return "Dumbo";
  }
  
  if (genotype.includes("to")) {
    return "Top";
  }
  
  return "Dumbo"; // Padrão para Dumbo quando não especificado
}

/**
 * Gera tipo de pelagem automático baseado no genótipo
 */
export function generateCoatTypeFromGenotype(genotype: string): CoatType {
  if (genotype.includes("rr")) {
    return "Rex";
  }
  
  if (genotype.includes("rr rr")) {
    return "Double Rex";
  }
  
  if (genotype.includes("hr")) {
    return "Hairless";
  }
  
  if (genotype.includes("sa")) {
    return "Satin";
  }
  
  if (genotype.includes("ha")) {
    return "Harley";
  }
  
  if (genotype.includes("ve")) {
    return "Velveteen";
  }
  
  return "Standard";
}

/**
 * Atualiza características automáticas baseadas no genótipo
 */
export function updateCharacteristicsFromGenotype(rat: Partial<Rat>, forceUpdate: boolean = false): Partial<Rat> {
  if (!rat.genotype) return rat;
  
  const updatedRat = { ...rat };
  
  // Atualizar cor dos olhos
  if (forceUpdate || !updatedRat.eyeColor) {
    updatedRat.eyeColor = generateEyeColorFromGenotype(rat.genotype);
  }
  
  // Atualizar tipo de orelha
  if (forceUpdate || !updatedRat.earType) {
    updatedRat.earType = generateEarTypeFromGenotype(rat.genotype);
  }
  
  // Atualizar tipo de pelagem
  if (forceUpdate || !updatedRat.coatType) {
    updatedRat.coatType = generateCoatTypeFromGenotype(rat.genotype);
  }
  
  return updatedRat;
}

/**
 * Valida se o genótipo é consistente com o fenótipo
 */
export function validateGenotypePhenotypeConsistency(rat: Partial<Rat>): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  if (!rat.genotype || !rat.coatColor) {
    return { isValid: true, warnings: [] };
  }
  
  const colorInfo = getColorByName(rat.coatColor);
  if (colorInfo && colorInfo.genotype !== rat.genotype) {
    warnings.push(`Genótipo "${rat.genotype}" pode não corresponder ao fenótipo "${rat.coatColor}"`);
  }
  
  // Verificar consistência de olhos
  const expectedEyeColor = generateEyeColorFromGenotype(rat.genotype);
  if (rat.eyeColor && rat.eyeColor !== expectedEyeColor) {
    warnings.push(`Cor dos olhos "${rat.eyeColor}" pode não ser consistente com genótipo "${rat.genotype}"`);
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}
