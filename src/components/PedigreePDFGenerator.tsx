import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { Rat } from '@/types/rat';

interface PedigreePDFGeneratorProps {
  rat: Rat;
  allRats: Rat[];
}

export function PedigreePDFGenerator({ rat, allRats }: PedigreePDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePedigreePDF = () => {
    setIsGenerating(true);
    
    try {
      console.log('Iniciando geração de PDF para:', rat.name);
      
      // Criar PDF simples
      const pdf = new jsPDF();
      
      // Adicionar texto básico
      pdf.text('Poke Ratos Rattery', 20, 20);
      pdf.text(`Pedigree de ${rat.name}`, 20, 30);
      pdf.text(`Nome: ${rat.name}`, 20, 40);
      pdf.text(`Sexo: ${rat.sex}`, 20, 50);
      pdf.text(`Cor: ${rat.coatColor}`, 20, 60);
      
      // Baixar o PDF
      pdf.save(`pedigree_${rat.name.replace(/\s+/g, '_')}.pdf`);
      
      console.log('PDF gerado com sucesso');
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={generatePedigreePDF}
      disabled={isGenerating}
      className="text-white"
      style={{ backgroundColor: '#c4a3ff' }}
      onMouseEnter={(e) => e.target.style.backgroundColor = '#b393e6'}
      onMouseLeave={(e) => e.target.style.backgroundColor = '#c4a3ff'}
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      {isGenerating ? 'Gerando PDF...' : 'Gerar Pedigree PDF'}
    </Button>
  );
}

