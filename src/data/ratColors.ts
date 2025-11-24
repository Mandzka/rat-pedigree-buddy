export interface ColorVariant {
  name: string;
  genotype: string;
  description: string;
  eyeColor?: string; // Cor dos olhos associada
  earType?: string; // Tipo de orelha associada
  coatType?: string; // Tipo de pelagem associada
}

export interface ColorGroup {
  group: string;
  colors: ColorVariant[];
}

export const ratColorDatabase: ColorGroup[] = [
  {
    group: "Cores Base AFRMA",
    colors: [
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
      }
    ]
  },
  {
    group: "Cores com Albino AFRMA",
    colors: [
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
      }
    ]
  },
  {
    group: "Cores Himalaia/Siamese AFRMA",
    colors: [
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
      }
    ]
  },
  {
    group: "Cores com Ruby Eyes AFRMA",
    colors: [
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
      }
    ]
  },
  {
    group: "Cores com Silvermane AFRMA",
    colors: [
      {
        name: "Silvermane",
        genotype: "-- Sm",
        description: "Pelagem com pelos brancos intercalados",
        coatType: "Standard"
      },
      {
        name: "Black Silvermane",
        genotype: "aa BB DD Sm",
        description: "Preto com pelos brancos intercalados (Silvermane)",
        coatType: "Standard",
        eyeColor: "Preto"
      },
      {
        name: "Blue Silvermane",
        genotype: "aa BB dd Sm",
        description: "Azul com pelos brancos intercalados (Silvermane)",
        coatType: "Standard",
        eyeColor: "Preto"
      },
      {
        name: "Powder Silvermane",
        genotype: "aa bb dd Sm",
        description: "Azul pó com pelos brancos intercalados (Silvermane)",
        coatType: "Standard",
        eyeColor: "Preto"
      }
    ]
  },
  {
    group: "Cores Bege/Fawn",
    colors: [
      {
        name: "Beige",
        genotype: "A- bb dd",
        description: "Bege (Cinnamon diluído)",
        eyeColor: "Preto"
      },
      {
        name: "Fawn",
        genotype: "A- bb dd",
        description: "Fawn (marrom bege)",
        eyeColor: "Preto"
      }
    ]
  },
  {
    group: "Cores Marten AFRMA",
    colors: [
      {
        name: "Black Marten",
        genotype: "aa B- D- cm",
        description: "Preto com barriga e patas prateadas"
      },
      {
        name: "Blue Marten",
        genotype: "aa B- dd cm",
        description: "Azul com barriga prateada"
      },
      {
        name: "Agouti Marten",
        genotype: "A- B- D- cm",
        description: "Agouti com barriga clara tipo marten"
      },
      {
        name: "Cinnamon Marten",
        genotype: "A- bb D- cm",
        description: "Canela com barriga prateada"
      }
    ]
  }
];

export const getAllColors = (): ColorVariant[] => {
  return ratColorDatabase.flatMap(group => group.colors);
};

export const getColorByName = (name: string): ColorVariant | undefined => {
  return getAllColors().find(color => color.name === name);
};

export const getGenotypeByColor = (colorName: string): string | undefined => {
  return getColorByName(colorName)?.genotype;
};