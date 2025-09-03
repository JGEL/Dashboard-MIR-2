

import React from 'react';
import { UniversityData } from '../types.ts';

interface ComparisonTableProps {
  data: UniversityData[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ data }) => {
  const headers = [
    'Universidad',
    'Ranking',
    'Admitidos',
    'Presentados',
    'Superan Nota Corte',
    'Plazas Adjudicadas',
    'Sin Plaza (Abs.)',
    '% Pres./Admit.',
    '% Plazas/Pres.',
    '% Sin Plaza/Pres.',
    '% Plazas/Sup. Nota',
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-6 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((uni, index) => {
            const withoutPlaza = uni.presented - uni.placesAwarded;
            const percentageWithoutPlaza = uni.presented > 0 ? (withoutPlaza / uni.presented) * 100 : 0;
            return (
              <tr key={uni.name} className="bg-white border-b border-gray-200 last:border-b-0 hover:bg-gray-50/60 transition-colors">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {uni.name}
                </th>
                <td className="px-6 py-4 font-bold text-slate-800 text-center">{uni.rank}</td>
                <td className="px-6 py-4">{uni.admitted.toLocaleString('es-ES')}</td>
                <td className="px-6 py-4">{uni.presented.toLocaleString('es-ES')}</td>
                <td className="px-6 py-4">{uni.passedCutoff.toLocaleString('es-ES')}</td>
                <td className="px-6 py-4">{uni.placesAwarded.toLocaleString('es-ES')}</td>
                <td className="px-6 py-4">{withoutPlaza.toLocaleString('es-ES')}</td>
                <td className="px-6 py-4 font-mono">{uni.percentagePresentedOverAdmitted.toFixed(2)}%</td>
                <td className="px-6 py-4 font-mono">{uni.percentagePlacesOverPresented.toFixed(2)}%</td>
                <td className="px-6 py-4 font-mono">{percentageWithoutPlaza.toFixed(2)}%</td>
                <td className="px-6 py-4 font-mono">{uni.percentagePlacesOverPassed.toFixed(2)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;