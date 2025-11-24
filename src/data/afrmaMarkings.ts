/**
 * Padrões de Marcação Reconhecidos pela AFRMA
 * American Fancy Rat & Mouse Association
 * 
 * Baseado em: https://www.afrma.org/ratmkd.htm
 */

export interface MarkingDescription {
  name: string;
  description: string;
  genetics?: string;
  notes?: string;
}

export const afrmaMarkings: MarkingDescription[] = [
  {
    name: "Self",
    description: "Sem marcações - cor sólida em todo o corpo"
  },
  {
    name: "Berkshire",
    description: "Corpo colorido com barriga branca"
  },
  {
    name: "Irish",
    description: "Barriga branca, quatro patas brancas e ponta da cauda branca. As patas brancas devem parecer com as manchas de um coelho holandês."
  },
  {
    name: "English Irish",
    description: "Triângulo branco equilátero no peito com patas dianteiras brancas e patas traseiras brancas até metade do comprimento."
  },
  {
    name: "Down Under",
    description: "Marcações padrão no lado superior e listra ou manchas correspondentes na barriga. Listra da barriga deve ser sólida e simétrica."
  },
  {
    name: "Hooded",
    description: "Capuz colorido cobrindo cabeça, pescoço e ombros. Marcação da espinha se estende em linha ininterrupta do capuz até a cauda."
  },
  {
    name: "Bareback",
    description: "Marcações como o Hooded mas sem a marcação da espinha. Capuz colorido na cabeça, pescoço e ombros."
  },
  {
    name: "Capped",
    description: "Corpo branco puro com cabeça colorida. A cor deve estar confinada apenas à área da cabeça."
  },
  {
    name: "Masked",
    description: "Corpo branco puro com máscara colorida cobrindo o rosto, incluindo ao redor dos olhos e acima do nariz."
  },
  {
    name: "Blaze",
    description: "Listra branca na testa"
  },
  {
    name: "Blazed",
    description: "Com blaze (listra branca na testa)"
  },
  {
    name: "Variegated",
    description: "Marcações irregulares e manchadas"
  },
  {
    name: "Var-Capped",
    description: "Capped com adição de manchas pela espinha e laterais como um Variegated, mais manchas na barriga"
  },
  {
    name: "Essex",
    description: "Marcação específica com características próprias"
  },
  {
    name: "Dalmatian",
    description: "Manchas escuras sobre fundo branco, similar ao padrão do cão dálmata"
  },
  {
    name: "Roan",
    description: "Pelagem com pelos brancos intercalados"
  }
];

/**
 * Função para obter descrição de uma marcação
 */
export function getMarkingDescription(markingName: string): MarkingDescription | undefined {
  return afrmaMarkings.find(marking => marking.name === markingName);
}

/**
 * Função para obter todas as marcações organizadas por categoria
 */
export function getMarkingsByCategory() {
  return {
    self: afrmaMarkings.filter(m => m.name === "Self"),
    standard: afrmaMarkings.filter(m => 
      ["Berkshire", "Irish", "English Irish", "Down Under", "Hooded", "Bareback", "Capped", "Masked"].includes(m.name)
    ),
    blaze: afrmaMarkings.filter(m => 
      ["Blaze", "Blazed"].includes(m.name)
    ),
    variegated: afrmaMarkings.filter(m => 
      ["Variegated", "Var-Capped"].includes(m.name)
    ),
    other: afrmaMarkings.filter(m => 
      ["Essex", "Dalmatian", "Roan"].includes(m.name)
    )
  };
}
