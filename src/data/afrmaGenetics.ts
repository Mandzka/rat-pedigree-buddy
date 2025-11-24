/**
 * Genótipos Oficiais AFRMA (American Fancy Rat & Mouse Association)
 * Baseado nos padrões oficiais da AFRMA
 * 
 * Referências:
 * - https://www.afrma.org/geneticcodesrat.htm
 * - https://www.afrma.org/ratgenpart1.htm
 * - https://www.afrma.org/ratgenpart3.htm
 */

export interface AFRMAGenotype {
  gene: string;
  dominant: string;
  recessive: string;
  description: string;
  examples?: string[];
}

export interface AFRMAColorGenotype {
  name: string;
  genotype: string;
  description: string;
  eyeColor?: string;
  earType?: string;
  coatType?: string;
}

export interface AFRMAMarkingGenotype {
  name: string;
  genotype: string;
  description: string;
  genetics: string;
}

// Genótipos de Cores Oficiais AFRMA
export const afrmaColorGenotypes: AFRMAColorGenotype[] = [
  // Cores Base
  {
    name: "Agouti",
    genotype: "A- B- D-",
    description: "Cor selvagem padrão",
    eyeColor: "Preto"
  },
  {
    name: "Black (Preto)",
    genotype: "aa BB DD",
    description: "Preto sólido",
    eyeColor: "Preto"
  },
  {
    name: "Chocolate",
    genotype: "aa bb DD",
    description: "Marrom escuro",
    eyeColor: "Preto"
  },
  {
    name: "Cinnamon",
    genotype: "aa bb dd",
    description: "Marrom claro",
    eyeColor: "Preto"
  },
  {
    name: "Blue",
    genotype: "aa BB dd",
    description: "Azul (diluição do preto)",
    eyeColor: "Preto"
  },
  {
    name: "Russian Blue",
    genotype: "aa bb dd",
    description: "Azul russo (dupla diluição)",
    eyeColor: "Preto"
  },
  
  // Cores com Albino
  {
    name: "PEW (Pink Eyed White)",
    genotype: "aa/A- -- cc",
    description: "Branco com olhos vermelhos (albino)",
    eyeColor: "Pink"
  },
  {
    name: "REW (Red Eyed White)",
    genotype: "aa/A- -- cc",
    description: "Branco com olhos vermelhos",
    eyeColor: "Red"
  },
  
  // Cores Himalaia/Siamese
  {
    name: "Himalayan",
    genotype: "aa/A- -- ch",
    description: "Branco com pontas escuras",
    eyeColor: "Red"
  },
  {
    name: "Siamese",
    genotype: "aa/A- -- ch",
    description: "Corpo claro com pontas escuras",
    eyeColor: "Red"
  },
  {
    name: "Burmese",
    genotype: "aa/A- -- cb",
    description: "Marrom escuro com pontas mais escuras",
    eyeColor: "Red"
  },
  
  // Cores com Ruby Eyes
  {
    name: "Topaz",
    genotype: "A- -- rr",
    description: "Laranja/mel",
    eyeColor: "Ruby"
  },
  {
    name: "Amber",
    genotype: "A- -- rr",
    description: "Âmbar",
    eyeColor: "Ruby"
  },
  
  // Cores Marten AFRMA
  {
    name: "Black Marten",
    genotype: "aa B- D- cm",
    description: "Preto com barriga e patas prateadas",
    eyeColor: "Preto"
  },
  {
    name: "Blue Marten",
    genotype: "aa B- dd cm",
    description: "Azul com barriga prateada",
    eyeColor: "Preto"
  },
  {
    name: "Agouti Marten",
    genotype: "A- B- D- cm",
    description: "Agouti com barriga clara tipo marten",
    eyeColor: "Preto"
  },
  {
    name: "Cinnamon Marten",
    genotype: "A- bb D- cm",
    description: "Canela com barriga prateada",
    eyeColor: "Preto"
  }
];

// Genótipos de Marcações Oficiais AFRMA
export const afrmaMarkingGenotypes: AFRMAMarkingGenotype[] = [
  {
    name: "Self",
    genotype: "hh",
    description: "Sem marcações - cor sólida",
    genetics: "Homozygous hooded recessive"
  },
  {
    name: "Berkshire",
    genotype: "Hh",
    description: "Corpo colorido com barriga branca",
    genetics: "Heterozygous hooded"
  },
  {
    name: "Irish",
    genotype: "Hh",
    description: "Barriga branca, patas brancas, ponta da cauda branca",
    genetics: "Heterozygous hooded (lightly marked)"
  },
  {
    name: "English Irish",
    genotype: "Hh",
    description: "Triângulo branco no peito",
    genetics: "Heterozygous hooded (English variant)"
  },
  {
    name: "Down Under",
    genotype: "Du",
    description: "Marcações no dorso + barriga",
    genetics: "Dominant marking gene (Australian)"
  },
  {
    name: "Hooded",
    genotype: "HH",
    description: "Capuz + linha da espinha",
    genetics: "Homozygous hooded dominant"
  },
  {
    name: "Bareback",
    genotype: "HH",
    description: "Capuz sem linha da espinha",
    genetics: "Homozygous hooded dominant (spine bred off)"
  },
  {
    name: "Capped",
    genotype: "HH",
    description: "Apenas cabeça colorida",
    genetics: "Homozygous hooded dominant (cap only)"
  },
  {
    name: "Masked",
    genotype: "HH",
    description: "Máscara no rosto",
    genetics: "Homozygous hooded dominant (mask only)"
  },
  {
    name: "Blaze",
    genotype: "HH + Bl",
    description: "Listra branca na testa",
    genetics: "Homozygous hooded + blaze modifier"
  },
  {
    name: "Variegated",
    genotype: "HH + Var",
    description: "Marcações irregulares",
    genetics: "Homozygous hooded + variegated modifier"
  },
  {
    name: "Var-Capped",
    genotype: "HH + Var",
    description: "Capped com manchas",
    genetics: "Homozygous hooded + variegated modifier"
  }
];

// Genótipos de Orelhas
export const afrmaEarGenotypes = {
  "Top": "to",
  "Dumbo": "du"
};

// Genótipos de Pelagem
export const afrmaCoatGenotypes = {
  "Standard": "re/re", // Genótipo recessivo para pelagem normal
  "Rex": "Re/re", // Heterozigoto Rex (dominante)
  "Velveteen": "ve",
  "Hairless": "hr",
  "Double Rex": "Re/Re", // Homozigoto Rex
  "Satin": "sa",
  "Harley": "ha"
};

// Genótipos de Olhos
export const afrmaEyeGenotypes = {
  "Preto": "C-",
  "Ruby": "rr",
  "Red": "cc",
  "Odd-eyed": "C- + cc",
  "Pink": "cc"
};

import { getColorByName } from "./ratColors";

/**
 * Função para combinar genótipos automaticamente usando o banco de cores atual
 */
export function combineAFRMAGenotypesFromDatabase(
  color: string,
  marking: string,
  eyeColor: string,
  earType: string,
  coatType: string
): {
  colorGenotype: string;
  eyeGenotype: string;
  earGenotype: string;
  coatGenotype: string;
  markingGenotype: string;
  completeGenotype: string;
} {
  console.log('=== DEBUG combineAFRMAGenotypesFromDatabase ===');
  console.log('Inputs:', { color, marking, eyeColor, earType, coatType });
  
  // Buscar genótipo da cor no banco de cores atual
  const colorInfo = getColorByName(color);
  const colorGenotype = colorInfo?.genotype || "";
  console.log('Color info:', colorInfo);
  console.log('Color genotype:', colorGenotype);
  
  // Buscar genótipo da marcação
  const markingInfo = afrmaMarkingGenotypes.find(m => m.name === marking);
  const markingGenotype = markingInfo?.genotype || "";
  console.log('Marking info:', markingInfo);
  console.log('Marking genotype:', markingGenotype);
  
  // Genótipos específicos
  const eyeGenotype = afrmaEyeGenotypes[eyeColor as keyof typeof afrmaEyeGenotypes] || "";
  const earGenotype = afrmaEarGenotypes[earType as keyof typeof afrmaEarGenotypes] || "";
  const coatGenotype = afrmaCoatGenotypes[coatType as keyof typeof afrmaCoatGenotypes] || "";
  
  console.log('Individual genotypes:', { eyeGenotype, earGenotype, coatGenotype });
  
  // Combinar genótipo completo
  const parts = [
    colorGenotype,
    markingGenotype,
    eyeGenotype,
    earGenotype,
    coatGenotype
  ].filter(part => part && part.trim());
  
  const completeGenotype = parts.join(' ');
  console.log('Parts:', parts);
  console.log('Complete genotype:', completeGenotype);
  console.log('===============================================');
  
  return {
    colorGenotype,
    eyeGenotype,
    earGenotype,
    coatGenotype,
    markingGenotype,
    completeGenotype
  };
}

/**
 * Função para obter características automáticas baseadas na cor
 */
export function getAFRMACharacteristics(color: string): {
  eyeColor?: string;
  earType?: string;
  coatType?: string;
} {
  // Primeiro tentar no banco de cores AFRMA
  const afrmaColorInfo = afrmaColorGenotypes.find(c => c.name === color);
  if (afrmaColorInfo) {
    return {
      eyeColor: afrmaColorInfo.eyeColor,
      earType: afrmaColorInfo.earType,
      coatType: afrmaColorInfo.coatType
    };
  }
  
  // Se não encontrar, retornar vazio
  return {};
}
