
import React, { useState } from 'react';
import { UniversityData } from '../types.ts';
import { ChevronDownIcon, SearchIcon } from './Icons.tsx';

interface UniversitySelectorProps {
  allUniversities: UniversityData[];
  selectedNames: string[];
  onSelectionChange: (name: string) => void;
}

const UniversitySelector: React.FC<UniversitySelectorProps> = ({ allUniversities, selectedNames, onSelectionChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const filteredUniversities = allUniversities.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const MAX_SELECTIONS = 5;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left"
      >
        <h2 className="text-xl font-bold text-slate-800">
          Seleccionar Universidades para Comparar ({selectedNames.length}/{MAX_SELECTIONS})
        </h2>
        <ChevronDownIcon className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Buscar universidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 pl-10 pr-4 text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-11 gap-1.5 pr-2">
            {filteredUniversities.map((uni) => {
              const isSelected = selectedNames.includes(uni.name);
              const isDisabled = !isSelected && selectedNames.length >= MAX_SELECTIONS;

              return (
                <label
                  key={uni.name}
                  title={uni.name}
                  className={`flex items-center px-2 py-1 rounded-md transition-colors duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  } ${
                    isDisabled ? 'cursor-not-allowed opacity-50' : ''
                  } border border-transparent`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelectionChange(uni.name)}
                    disabled={isDisabled}
                    className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 bg-white"
                  />
                  <span className="ml-2 text-sm font-medium text-slate-700">{uni.abbreviation}</span>
                </label>
              );
            })}
          </div>
           {selectedNames.length >= MAX_SELECTIONS && (
            <p className="text-center text-sm text-amber-600 mt-4">
              Ha alcanzado el límite máximo de 5 selecciones.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UniversitySelector;