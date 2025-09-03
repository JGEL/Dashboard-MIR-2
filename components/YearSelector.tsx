import React from 'react';
import { CalendarIcon } from './Icons.tsx';

interface YearSelectorProps {
  availableYears: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({ availableYears, selectedYear, onYearChange }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row justify-center items-center gap-4">
      <div className="flex items-center gap-2">
        <CalendarIcon />
        <h3 className="text-lg font-semibold text-slate-800">Año de Datos:</h3>
      </div>
      <div className="flex flex-wrap justify-center gap-2 rounded-lg bg-gray-100 p-1">
        {availableYears.sort((a,b) => a - b).map(year => (
          <button
            key={year}
            onClick={() => onYearChange(year)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-cyan-500 ${
              selectedYear === year
                ? 'bg-cyan-500 text-white shadow'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
};

export default YearSelector;