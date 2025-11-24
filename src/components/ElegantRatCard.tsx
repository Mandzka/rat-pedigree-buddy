import React from 'react';
import { Rat } from '@/types/rat';
import { formatAge } from '@/utils/ageCalculator';
import { Heart, Calendar, Star, Eye } from 'lucide-react';

interface ElegantRatCardProps {
  rat: Rat;
  onClick: () => void;
}

export function ElegantRatCard({ rat, onClick }: ElegantRatCardProps) {

  const getStatusColor = (destination: string) => {
    switch (destination) {
      case 'Reprodução': return 'text-white';
      case 'Matriz': return 'text-white';
      case 'Padreador': return 'text-white';
      case 'Pet': return 'text-white';
      case 'À venda': return 'text-white';
      case 'Para adoção': return 'text-white';
      case 'Vendido': return 'text-white';
      case 'Doado': return 'text-white';
      case 'Comprado': return 'text-white';
      case 'Nascido na Rattery': return 'text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
              {rat.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{formatAge(rat.dateOfBirth)}</span>
            </div>
          </div>
          {rat.breedingApproved && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: '#ff9a9e' }}>
              <Heart className="h-3 w-3" />
              <span>Reprodutor</span>
            </div>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-sm">
            <span className="text-gray-500">Sexo:</span>
            <span className="ml-1 font-medium text-gray-900">{rat.sex}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Pelagem:</span>
            <span className="ml-1 font-medium text-gray-900">{rat.coatType}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Cor:</span>
            <span className="ml-1 font-medium text-gray-900">{rat.coatColor}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Marcação:</span>
            <span className="ml-1 font-medium text-gray-900">{rat.marking}</span>
          </div>
        </div>

        {/* Additional Info */}
        {(rat.tutorName || rat.litterName) && (
          <div className="space-y-1 mb-4">
            {rat.tutorName && (
              <div className="text-sm">
                <span className="text-gray-500">Tutor:</span>
                <span className="ml-1 font-medium text-red-600">{rat.tutorName}</span>
              </div>
            )}
            {rat.litterName && (
              <div className="text-sm">
                <span className="text-gray-500">Ninhada:</span>
                <span className="ml-1 font-medium text-gray-700">{rat.litterName}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex gap-2">
            <span 
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rat.destination)}`}
              style={
                rat.destination === 'Reprodução' ? { backgroundColor: '#c4a3ff' } :
                rat.destination === 'Matriz' ? { backgroundColor: '#ffb3d1' } :
                rat.destination === 'Padreador' ? { backgroundColor: '#a3d5ff' } :
                rat.destination === 'Comprado' ? { backgroundColor: '#a6b49c' } :
                rat.destination === 'Nascido na Rattery' ? { backgroundColor: '#d3a17c' } :
                rat.destination === 'Pet' ? { backgroundColor: '#a8e6cf' } :
                rat.destination === 'À venda' ? { backgroundColor: '#ffd3a5' } :
                rat.destination === 'Para adoção' ? { backgroundColor: '#a8d8ea' } :
                rat.destination === 'Vendido' ? { backgroundColor: '#c7ceea' } :
                rat.destination === 'Doado' ? { backgroundColor: '#f0a3ff' } :
                {}
              }
            >
              {rat.destination}
            </span>
            <span 
              className="px-2 py-1 rounded-full text-xs font-medium text-white"
              style={
                rat.origin === 'Comprado' ? { backgroundColor: '#a6b49c' } :
                rat.origin === 'Nascido na Rattery' ? { backgroundColor: '#d3a17c' } :
                { backgroundColor: '#6b7280' }
              }
            >
              {rat.origin}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
