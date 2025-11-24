import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Rat, Litter } from '@/types/rat';
import { Button } from '@/components/ui/button';
import { Download, Printer, ArrowLeft, Calendar, Heart, Dna } from 'lucide-react';
import { formatAge } from '@/utils/ageCalculator';
import jsPDF from 'jspdf';

interface PedigreePageProps {}

export default function PedigreePage({}: PedigreePageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rat, setRat] = useState<Rat | null>(null);
  const [allRats, setAllRats] = useState<Rat[]>([]);
  const [litters, setLitters] = useState<Litter[]>([]);
  const [pedigreeData, setPedigreeData] = useState<any>(null);

  useEffect(() => {
    console.log('PedigreePage - ID:', id);
    // Load data from localStorage
    const storedRats = localStorage.getItem("rats");
    const storedLitters = localStorage.getItem("litters");
    
    console.log('PedigreePage - storedRats:', storedRats);
    console.log('PedigreePage - storedLitters:', storedLitters);
    
    if (storedRats) {
      try {
        const parsedRats = JSON.parse(storedRats);
        console.log('PedigreePage - parsedRats:', parsedRats);
        setAllRats(parsedRats);
        const foundRat = parsedRats.find((r: Rat) => r.id === id);
        console.log('PedigreePage - foundRat:', foundRat);
        if (foundRat) {
          setRat(foundRat);
          buildPedigreeData(foundRat, parsedRats);
        } else {
          console.error('Rato não encontrado com ID:', id);
        }
      } catch (error) {
        console.error('Erro ao carregar ratos:', error);
      }
    }
    
    if (storedLitters) {
      try {
        const parsedLitters = JSON.parse(storedLitters);
        setLitters(parsedLitters);
      } catch (error) {
        console.error('Erro ao carregar ninhadas:', error);
      }
    }
  }, [id]);

  const buildPedigreeData = (mainRat: Rat, allRats: Rat[]) => {
    console.log('buildPedigreeData - mainRat:', mainRat);
    console.log('buildPedigreeData - allRats:', allRats);
    
    const data: any = {
      main: mainRat,
      mother: mainRat.motherId ? allRats.find(r => r.id === mainRat.motherId) : null,
      father: mainRat.fatherId ? allRats.find(r => r.id === mainRat.fatherId) : null,
      maternalGrandmother: null,
      maternalGrandfather: null,
      paternalGrandmother: null,
      paternalGrandfather: null,
    };

    console.log('buildPedigreeData - data (antes avós):', data);

    if (data.mother) {
      data.maternalGrandmother = data.mother.motherId ? allRats.find(r => r.id === data.mother.motherId) : null;
      data.maternalGrandfather = data.mother.fatherId ? allRats.find(r => r.id === data.mother.fatherId) : null;
    }

    if (data.father) {
      data.paternalGrandmother = data.father.motherId ? allRats.find(r => r.id === data.father.motherId) : null;
      data.paternalGrandfather = data.father.fatherId ? allRats.find(r => r.id === data.father.fatherId) : null;
    }

    console.log('buildPedigreeData - data (final):', data);
    setPedigreeData(data);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (!rat || !pedigreeData) return;

    const doc = new jsPDF('landscape', 'mm', 'a4');
    
    // Título
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('ÁRVORE GENEALÓGICA', 105, 20, { align: 'center' });
    
    // Header info
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(rat.name, 105, 35, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    let yPos = 45;
    
    // Informações básicas
    doc.text(`Data de Nascimento: ${new Date(rat.dateOfBirth).toLocaleDateString('pt-BR')}`, 20, yPos);
    yPos += 7;
    doc.text(`Sexo: ${rat.sex}`, 20, yPos);
    yPos += 7;
    doc.text(`Cor: ${rat.coatColor} | Pelagem: ${rat.coatType} | Marcação: ${rat.marking}`, 20, yPos);
    
    if (rat.genotype) {
      yPos += 7;
      doc.text(`Genótipo: ${rat.genotype}`, 20, yPos);
    }

    yPos += 15;
    
    // Desenhar árvore genealógica
    const centerX = 105;
    const startY = yPos + 10;
    const boxWidth = 60;
    const boxHeight = 15;
    const hSpacing = 70;
    const vSpacing = 25;
    
    // Nível 0 - Animal principal
    doc.setFillColor(210, 245, 255);
    doc.roundedRect(centerX - boxWidth/2, startY, boxWidth, boxHeight, 2, 2, 'FD');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(rat.name.substring(0, 20), centerX, startY + 5, { align: 'center' });
    doc.setFontSize(7);
    doc.text(`${rat.coatColor} | ${rat.marking}`, centerX, startY + 9, { align: 'center' });
    doc.text(rat.dateOfBirth ? new Date(rat.dateOfBirth).toLocaleDateString('pt-BR') : '', centerX, startY + 13, { align: 'center' });
    
    // Nível 1 - Pais
    if (pedigreeData.mother) {
      doc.setFillColor(255, 220, 220);
      doc.roundedRect(centerX - hSpacing - boxWidth/2, startY + vSpacing, boxWidth, boxHeight, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('MÃE', centerX - hSpacing, startY + vSpacing + 2, { align: 'center' });
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text(pedigreeData.mother.name.substring(0, 20), centerX - hSpacing, startY + vSpacing + 6, { align: 'center' });
      doc.text(`${pedigreeData.mother.coatColor} | ${pedigreeData.mother.marking}`, centerX - hSpacing, startY + vSpacing + 10, { align: 'center' });
    }
    
    if (pedigreeData.father) {
      doc.setFillColor(220, 220, 255);
      doc.roundedRect(centerX + hSpacing - boxWidth/2, startY + vSpacing, boxWidth, boxHeight, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('PAI', centerX + hSpacing, startY + vSpacing + 2, { align: 'center' });
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text(pedigreeData.father.name.substring(0, 20), centerX + hSpacing, startY + vSpacing + 6, { align: 'center' });
      doc.text(`${pedigreeData.father.coatColor} | ${pedigreeData.father.marking}`, centerX + hSpacing, startY + vSpacing + 10, { align: 'center' });
    }
    
    // Linhas conectando
    if (pedigreeData.mother || pedigreeData.father) {
      doc.line(centerX, startY + boxHeight, centerX, startY + vSpacing);
      if (pedigreeData.mother) {
        doc.line(centerX - hSpacing, startY + vSpacing, centerX, startY + vSpacing);
      }
      if (pedigreeData.father) {
        doc.line(centerX, startY + vSpacing, centerX + hSpacing, startY + vSpacing);
      }
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Generated by Poke Ratos Rattery', 105, 195, { align: 'center' });
    
    doc.save(`pedigree_${rat.name}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (!rat || !pedigreeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">Carregando pedigree...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white print:bg-white">
      {/* Header - não imprimir */}
      <div className="print:hidden bg-gradient-to-br from-background via-background to-muted/30 border-b border-gray-200 p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div className="flex items-center gap-2">
              <img src="/image.png" alt="Logo" className="w-8 h-8" />
              <span className="font-semibold text-sm">Poke Ratos</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePrint} variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Button onClick={handleDownloadPDF} className="gap-2" style={{ backgroundColor: '#c4a3ff' }}>
              <Download className="h-4 w-4" />
              Baixar PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo do Pedigree */}
      <div className="container mx-auto p-8 print:p-4">
        {/* Header do pedigree */}
        <div className="text-center mb-12 print:mb-8">
          <h1 className="text-4xl font-bold mb-4 print:text-3xl" style={{ fontFamily: 'Libre Baskerville, serif', color: '#8b5a3c' }}>
            ÁRVORE GENEALÓGICA
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200 print:border-2 print:shadow-none max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 print:text-xl">{rat.name}</h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatAge(rat.dateOfBirth)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>{rat.sex}</span>
              </div>
              <div className="flex items-center gap-2">
                <Dna className="h-4 w-4" />
                <span>{rat.coatColor}</span>
              </div>
            </div>
            {rat.genotype && (
              <p className="text-xs mt-2 text-gray-600">Genótipo: {rat.genotype}</p>
            )}
          </div>
        </div>

        {/* Árvore genealógica */}
        <div className="pedigree-tree max-w-4xl mx-auto">
          {/* Nível 0 - Animal principal */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-4 print:border-2 print:shadow-none min-w-[200px] text-center print:p-2">
              <div className="font-bold text-lg mb-1 print:text-base">{rat.name}</div>
              <div className="text-sm text-gray-600 print:text-xs">
                {rat.coatColor} • {rat.marking} • {rat.coatType}
              </div>
              <div className="text-xs text-gray-500 print:text-xs">
                {rat.dateOfBirth ? new Date(rat.dateOfBirth).toLocaleDateString('pt-BR') : ''}
              </div>
              {rat.genotype && (
                <div className="text-xs text-gray-600 mt-1 print:text-xs">Gen: {rat.genotype}</div>
              )}
            </div>
          </div>

          {/* Nível 1 - Pais */}
          {(pedigreeData.mother || pedigreeData.father) && (
            <div className="flex justify-center gap-16 mb-8 print:gap-8">
              {/* Mãe */}
              {pedigreeData.mother && (
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-300 rounded-lg p-4 print:border-2 print:shadow-none min-w-[180px] text-center print:p-2">
                  <div className="font-bold text-xs mb-1 text-pink-800 print:text-xs">MÃE</div>
                  <div className="font-bold text-base mb-1 print:text-sm">{pedigreeData.mother.name}</div>
                  <div className="text-sm text-gray-600 print:text-xs">
                    {pedigreeData.mother.coatColor} • {pedigreeData.mother.marking}
                  </div>
                  <div className="text-xs text-gray-500 print:text-xs">
                    {pedigreeData.mother.dateOfBirth ? new Date(pedigreeData.mother.dateOfBirth).toLocaleDateString('pt-BR') : ''}
                  </div>
                </div>
              )}
              
              {/* Pai */}
              {pedigreeData.father && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-4 print:border-2 print:shadow-none min-w-[180px] text-center print:p-2">
                  <div className="font-bold text-xs mb-1 text-blue-800 print:text-xs">PAI</div>
                  <div className="font-bold text-base mb-1 print:text-sm">{pedigreeData.father.name}</div>
                  <div className="text-sm text-gray-600 print:text-xs">
                    {pedigreeData.father.coatColor} • {pedigreeData.father.marking}
                  </div>
                  <div className="text-xs text-gray-500 print:text-xs">
                    {pedigreeData.father.dateOfBirth ? new Date(pedigreeData.father.dateOfBirth).toLocaleDateString('pt-BR') : ''}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Nível 2 - Avós */}
          {(pedigreeData.maternalGrandmother || pedigreeData.maternalGrandfather || 
            pedigreeData.paternalGrandmother || pedigreeData.paternalGrandfather) && (
            <div className="grid grid-cols-4 gap-4 print:gap-2">
              {pedigreeData.maternalGrandmother && (
                <div className="bg-gray-50 border border-gray-300 rounded p-2 print:border print:shadow-none text-center print:p-1">
                  <div className="text-xs font-bold text-gray-600">AVÓ (M)</div>
                  <div className="text-xs font-semibold print:text-xs">{pedigreeData.maternalGrandmother.name}</div>
                  <div className="text-xs text-gray-500 print:text-xs">{pedigreeData.maternalGrandmother.coatColor}</div>
                </div>
              )}
              {pedigreeData.maternalGrandfather && (
                <div className="bg-gray-50 border border-gray-300 rounded p-2 print:border print:shadow-none text-center print:p-1">
                  <div className="text-xs font-bold text-gray-600">AVÔ (M)</div>
                  <div className="text-xs font-semibold print:text-xs">{pedigreeData.maternalGrandfather.name}</div>
                  <div className="text-xs text-gray-500 print:text-xs">{pedigreeData.maternalGrandfather.coatColor}</div>
                </div>
              )}
              {pedigreeData.paternalGrandmother && (
                <div className="bg-gray-50 border border-gray-300 rounded p-2 print:border print:shadow-none text-center print:p-1">
                  <div className="text-xs font-bold text-gray-600">AVÓ (P)</div>
                  <div className="text-xs font-semibold print:text-xs">{pedigreeData.paternalGrandmother.name}</div>
                  <div className="text-xs text-gray-500 print:text-xs">{pedigreeData.paternalGrandmother.coatColor}</div>
                </div>
              )}
              {pedigreeData.paternalGrandfather && (
                <div className="bg-gray-50 border border-gray-300 rounded p-2 print:border print:shadow-none text-center print:p-1">
                  <div className="text-xs font-bold text-gray-600">AVÔ (P)</div>
                  <div className="text-xs font-semibold print:text-xs">{pedigreeData.paternalGrandfather.name}</div>
                  <div className="text-xs text-gray-500 print:text-xs">{pedigreeData.paternalGrandfather.coatColor}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 print:mt-8">
          <p className="text-sm text-gray-500 italic">Generated by Poke Ratos Rattery</p>
        </div>
      </div>

      {/* Estilos para impressão */}
      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 1cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}

