import React from 'react';
import { Rat, Litter } from '@/types/rat';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface PedigreeTreeProps {
  rat: Rat;
  allRats: Rat[];
  allLitters: Litter[];
}

export function PedigreeTree({ rat, allRats, allLitters }: PedigreeTreeProps) {
  // Função para gerar PDF da árvore genealógica
  const generatePedigreePDF = () => {
    // Importar jsPDF dinamicamente
    import('jspdf').then(({ default: jsPDF }) => {
      const doc = new jsPDF('landscape', 'mm', 'a4');
      
      // Título
      doc.setFontSize(20);
      doc.text(`Árvore Genealógica de ${rat.name}`, 20, 20);
      
      // Informações do rato principal
      doc.setFontSize(12);
      doc.text(`Nome: ${rat.name}`, 20, 40);
      doc.text(`Sexo: ${rat.sex}`, 20, 50);
      doc.text(`Cor: ${rat.coatColor}`, 20, 60);
      doc.text(`Pelagem: ${rat.coatType}`, 20, 70);
      doc.text(`Marcação: ${rat.marking}`, 20, 80);
      
      if (rat.genotype) {
        doc.text(`Genótipo: ${rat.genotype}`, 20, 90);
      }
      
      // Informações dos pais
      const { mother, father } = findParents(rat.id);
      if (mother || father) {
        doc.text('PAIS:', 20, 110);
        if (mother) {
          doc.text(`Mãe: ${mother.name} (${mother.coatColor})`, 30, 120);
        }
        if (father) {
          doc.text(`Pai: ${father.name} (${father.coatColor})`, 30, 130);
        }
      }
      
      // Informações dos avós
      const grandparents = findGrandparents(rat.id);
      if (grandparents.maternalGrandmother || grandparents.maternalGrandfather || 
          grandparents.paternalGrandmother || grandparents.paternalGrandfather) {
        doc.text('AVÓS:', 20, 150);
        
        if (grandparents.maternalGrandmother || grandparents.maternalGrandfather) {
          doc.text('Maternos:', 30, 160);
          if (grandparents.maternalGrandmother) {
            doc.text(`Avó: ${grandparents.maternalGrandmother.name}`, 40, 170);
          }
          if (grandparents.maternalGrandfather) {
            doc.text(`Avô: ${grandparents.maternalGrandfather.name}`, 40, 180);
          }
        }
        
        if (grandparents.paternalGrandmother || grandparents.paternalGrandfather) {
          doc.text('Paternos:', 30, 200);
          if (grandparents.paternalGrandmother) {
            doc.text(`Avó: ${grandparents.paternalGrandmother.name}`, 40, 210);
          }
          if (grandparents.paternalGrandfather) {
            doc.text(`Avô: ${grandparents.paternalGrandfather.name}`, 40, 220);
          }
        }
      }
      
      // Salvar PDF
      doc.save(`pedigree-${rat.name.replace(/\s+/g, '-')}.pdf`);
    });
  };
  // Função para encontrar os pais de um rato através das ninhadas
  const findParents = (ratId: string): { mother: Rat | null; father: Rat | null } => {
    // Procurar por ninhadas onde este rato é filhote
    const litter = allLitters.find(l => l.offspringIds.includes(ratId));
    if (!litter) return { mother: null, father: null };

    const mother = allRats.find(r => r.id === litter.motherId) || null;
    const father = allRats.find(r => r.id === litter.fatherId) || null;

    return { mother, father };
  };

  // Função para encontrar os avós
  const findGrandparents = (ratId: string) => {
    const { mother, father } = findParents(ratId);
    
    const maternalGrandmother = mother ? findParents(mother.id).mother : null;
    const maternalGrandfather = mother ? findParents(mother.id).father : null;
    const paternalGrandmother = father ? findParents(father.id).mother : null;
    const paternalGrandfather = father ? findParents(father.id).father : null;

    return {
      maternalGrandmother,
      maternalGrandfather,
      paternalGrandmother,
      paternalGrandfather
    };
  };

  const { mother, father } = findParents(rat.id);
  const grandparents = findGrandparents(rat.id);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
        Árvore Genealógica de {rat.name}
      </h3>
      
      <div className="relative">
        {/* Avós - Maternos e Paternos lado a lado */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-16">
            {/* Avós Maternos */}
            <div className="flex gap-4">
              <div className="text-center">
                <div className="bg-blue-100 rounded-lg p-3 mb-2 min-w-[120px] border-2 border-blue-300">
                  <div className="text-sm font-medium text-gray-900">
                    {grandparents.maternalGrandmother?.name || "Desconhecida"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {grandparents.maternalGrandmother?.coatColor || ""}
                  </div>
                </div>
                <div className="text-xs text-blue-600 font-medium">Avó Materna</div>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-lg p-3 mb-2 min-w-[120px] border-2 border-blue-300">
                  <div className="text-sm font-medium text-gray-900">
                    {grandparents.maternalGrandfather?.name || "Desconhecido"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {grandparents.maternalGrandfather?.coatColor || ""}
                  </div>
                </div>
                <div className="text-xs text-blue-600 font-medium">Avô Materno</div>
              </div>
            </div>

            {/* Avós Paternos */}
            <div className="flex gap-4">
              <div className="text-center">
                <div className="bg-green-100 rounded-lg p-3 mb-2 min-w-[120px] border-2 border-green-300">
                  <div className="text-sm font-medium text-gray-900">
                    {grandparents.paternalGrandmother?.name || "Desconhecida"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {grandparents.paternalGrandmother?.coatColor || ""}
                  </div>
                </div>
                <div className="text-xs text-green-600 font-medium">Avó Paterna</div>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-lg p-3 mb-2 min-w-[120px] border-2 border-green-300">
                  <div className="text-sm font-medium text-gray-900">
                    {grandparents.paternalGrandfather?.name || "Desconhecido"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {grandparents.paternalGrandfather?.coatColor || ""}
                  </div>
                </div>
                <div className="text-xs text-green-600 font-medium">Avô Paterno</div>
              </div>
            </div>
          </div>
        </div>

        {/* Linhas conectando avós aos pais */}
        <div className="flex justify-center mb-4">
          <div className="flex gap-16">
            {/* Linhas dos avós maternos */}
            <div className="flex gap-4">
              <div className="w-[120px] h-0.5 bg-blue-300"></div>
              <div className="w-[120px] h-0.5 bg-blue-300"></div>
            </div>
            {/* Linhas dos avós paternos */}
            <div className="flex gap-4">
              <div className="w-[120px] h-0.5 bg-green-300"></div>
              <div className="w-[120px] h-0.5 bg-green-300"></div>
            </div>
          </div>
        </div>

        {/* Pais */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-8">
            <div className="text-center">
              <div className="bg-blue-50 rounded-lg p-3 mb-2 min-w-[120px] border-2 border-blue-200">
                <div className="text-sm font-medium text-gray-900">
                  {mother?.name || "Desconhecida"}
                </div>
                <div className="text-xs text-gray-500">
                  {mother?.coatColor || ""}
                </div>
                <div className="text-xs text-blue-600 font-medium">
                  {mother?.sex || ""}
                </div>
              </div>
              <div className="text-xs text-gray-500">Mãe</div>
            </div>
            <div className="text-center">
              <div className="bg-green-50 rounded-lg p-3 mb-2 min-w-[120px] border-2 border-green-200">
                <div className="text-sm font-medium text-gray-900">
                  {father?.name || "Desconhecido"}
                </div>
                <div className="text-xs text-gray-500">
                  {father?.coatColor || ""}
                </div>
                <div className="text-xs text-green-600 font-medium">
                  {father?.sex || ""}
                </div>
              </div>
              <div className="text-xs text-gray-500">Pai</div>
            </div>
          </div>
        </div>

        {/* Linhas conectando pais ao rato */}
        <div className="flex justify-center mb-4">
          <div className="flex gap-8">
            <div className="w-[120px] h-0.5 bg-gray-300"></div>
            <div className="w-[120px] h-0.5 bg-gray-300"></div>
          </div>
        </div>

        {/* Rato Principal */}
        <div className="flex justify-center">
          <div className="text-center">
            <div className="bg-purple-50 rounded-lg p-4 mb-2 min-w-[150px] border-2 border-purple-200">
              <div className="text-lg font-semibold text-gray-900">
                {rat.name}
              </div>
              <div className="text-sm text-gray-500">
                {rat.coatColor}
              </div>
              <div className="text-sm text-purple-600 font-medium">
                {rat.sex}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {rat.coatType} • {rat.marking}
              </div>
            </div>
            <div className="text-sm font-medium text-purple-600">Rato Principal</div>
          </div>
        </div>
      </div>

      {/* Informações Genéticas */}
      {rat.genotype && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Genótipos AFRMA</h4>
          <div className="text-sm text-gray-700 font-mono">
            {rat.genotype}
          </div>
          {rat.specialGenotype && rat.specialGenotype !== "Padrão" && (
            <div className="text-sm text-purple-600 font-semibold mt-1">
              ✨ {rat.specialGenotype}
            </div>
          )}
        </div>
      )}

      {/* Botão para gerar PDF */}
      <div className="mt-6 text-center">
        <Button
          onClick={generatePedigreePDF}
          className="text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
          style={{ backgroundColor: '#d3a17c' }}
        >
          <Download className="h-4 w-4" />
          Gerar PDF do Pedigree
        </Button>
      </div>
    </div>
  );
}