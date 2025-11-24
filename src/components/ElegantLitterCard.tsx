import React from 'react';
import { Litter, Rat } from '@/types/rat';
import { Calendar, Users, Baby, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface ElegantLitterCardProps {
  litter: Litter;
  onDeleteLitter: (litterId: string) => void;
  allRats: Rat[];
}

export function ElegantLitterCard({ litter, onDeleteLitter, allRats }: ElegantLitterCardProps) {
  const mother = allRats.find(r => r.id === litter.motherId);
  const father = allRats.find(r => r.id === litter.fatherId);
  const offspring = allRats.filter(r => r.litterId === litter.id);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <h3 className="font-semibold text-gray-900">{litter.litterCode}</h3>
          </div>
          <div className="flex gap-1">
            <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#f5f0eb', color: '#8b5a3c' }}>
              {litter.totalOffspring}
            </span>
            {offspring.length > 0 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {offspring.length}
              </span>
            )}
          </div>
        </div>

        {/* Parents Info */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg mb-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Mãe</p>
            <p className="text-sm font-medium text-gray-900">{mother?.name || "Desconhecida"}</p>
            {mother && (
              <p className="text-xs text-gray-500">{mother.coatColor}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Pai</p>
            <p className="text-sm font-medium text-gray-900">{father?.name || "Desconhecido"}</p>
            {father && (
              <p className="text-xs text-gray-500">{father.coatColor}</p>
            )}
          </div>
        </div>

        {/* Birth Date */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Calendar className="h-4 w-4" />
          <span>{new Date(litter.birthDate).toLocaleDateString('pt-BR')}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 text-white"
            style={{ backgroundColor: '#d3a17c' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#c1916b'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#d3a17c'}
            onClick={() => {
              // This will trigger the LitterOffspringDialog
              const event = new CustomEvent('openLitterOffspring', { detail: { litter } });
              window.dispatchEvent(event);
            }}
          >
            <Baby className="h-4 w-4 mr-1" />
            Criar Fichas
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDeleteLitter(litter.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
