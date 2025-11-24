import React from 'react';
import { Rat } from '@/types/rat';

interface PedigreeViewerProps {
  rat: Rat;
  allRats: Rat[];
}

export function PedigreeViewer({ rat, allRats }: PedigreeViewerProps) {
  console.log('PedigreeViewer renderizando:', rat?.name);
  
  if (!rat) {
    return <div>Nenhum rato selecionado</div>;
  }

  const mother = allRats.find(r => r.id === rat.motherId);
  const father = allRats.find(r => r.id === rat.fatherId);

  const generatePDF = () => {
    try {
      const pdf = new (window as any).jsPDF();
      pdf.text(`Pedigree de ${rat.name}`, 20, 20);
      pdf.text(`Nome: ${rat.name}`, 20, 30);
      pdf.text(`Sexo: ${rat.sex}`, 20, 40);
      pdf.text(`Cor: ${rat.coatColor}`, 20, 50);
      pdf.save(`pedigree_${rat.name}.pdf`);
    } catch (error) {
      console.error('Erro PDF:', error);
      alert('Erro ao gerar PDF');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pedigree de {rat.name}</h2>
      
      <button 
        onClick={generatePDF}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Gerar PDF
      </button>

      <div className="border p-4 rounded mb-4">
        <h3 className="font-bold">{rat.name}</h3>
        <p>Sexo: {rat.sex}</p>
        <p>Cor: {rat.coatColor}</p>
        <p>Pelagem: {rat.coatType}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <h4 className="font-bold">Mãe</h4>
          {mother ? (
            <div>
              <p>Nome: {mother.name}</p>
              <p>Cor: {mother.coatColor}</p>
            </div>
          ) : (
            <p>Desconhecida</p>
          )}
        </div>

        <div className="border p-4 rounded">
          <h4 className="font-bold">Pai</h4>
          {father ? (
            <div>
              <p>Nome: {father.name}</p>
              <p>Cor: {father.coatColor}</p>
            </div>
          ) : (
            <p>Desconhecido</p>
          )}
        </div>
      </div>
    </div>
  );
}
