export interface ColorVariant {
  name: string;
  genotype: string;
  description: string;
}

export interface ColorGroup {
  group: string;
  colors: ColorVariant[];
}

export const ratColorDatabase: ColorGroup[] = [
  {
    group: "Cores Base",
    colors: [
      {
        name: "Black (Preto)",
        genotype: "aa BB DD",
        description: "Preto sólido, sem diluição"
      },
      {
        name: "Agouti",
        genotype: "A- B- D-",
        description: "Cor selvagem, padrão natural"
      },
      {
        name: "Blue (Azul)",
        genotype: "aa BB dd",
        description: "Diluição do preto"
      }
    ]
  },
  {
    group: "Diluições de Preto",
    colors: [
      {
        name: "Russian Blue",
        genotype: "aa bb dd",
        description: "Dupla diluição do preto"
      },
      {
        name: "Mink",
        genotype: "aa bb DD",
        description: "Marrom escuro"
      },
      {
        name: "Powder Blue",
        genotype: "aa Brb dd",
        description: "Azul claro suave"
      }
    ]
  },
  {
    group: "Diluições de Agouti",
    colors: [
      {
        name: "Blue Agouti",
        genotype: "A- B- dd",
        description: "Agouti com diluição azul"
      },
      {
        name: "Cinnamon (Canela)",
        genotype: "A- bb DD",
        description: "Agouti marrom"
      },
      {
        name: "Fawn",
        genotype: "A- bb dd",
        description: "Bege/marrom claro"
      },
      {
        name: "Lynx",
        genotype: "A- Brb dd",
        description: "Cinza prateado"
      }
    ]
  },
  {
    group: "Albino e Diluições Extremas",
    colors: [
      {
        name: "PEW (Pink Eyed White)",
        genotype: "aa/A- -- cc",
        description: "Branco com olhos vermelhos (albino)"
      },
      {
        name: "Champagne",
        genotype: "aa bb dd pp",
        description: "Bege rosado muito claro"
      },
      {
        name: "Beige",
        genotype: "aa BB dd pp",
        description: "Bege cinza claro"
      },
      {
        name: "Platinum",
        genotype: "aa bb DD pp",
        description: "Cinza prateado claro"
      }
    ]
  },
  {
    group: "Outras Cores",
    colors: [
      {
        name: "Siamese",
        genotype: "aa/A- -- ch",
        description: "Corpo claro com pontas escuras"
      },
      {
        name: "Himalayan",
        genotype: "aa/A- -- chch",
        description: "Corpo branco com pontas coloridas"
      },
      {
        name: "Burmese",
        genotype: "aa/A- -- cb",
        description: "Tom sépia uniforme"
      },
      {
        name: "Topaz",
        genotype: "A- -- rr",
        description: "Laranja/mel"
      },
      {
        name: "Amber",
        genotype: "A- bb rr",
        description: "Dourado escuro"
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
