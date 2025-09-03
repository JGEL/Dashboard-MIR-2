import React, { Fragment } from 'react';
import { UniversityData, Metric } from '../types.ts';

interface EvolutionTableProps {
  data: UniversityData[];
  metrics: Metric[];
}

const EvolutionTable: React.FC<EvolutionTableProps> = ({ data, metrics }) => {
  const groupedData = data.reduce((acc, current) => {
    (acc[current.name] = acc[current.name] || []).push(current);
    return acc;
  }, {} as { [key: string]: UniversityData[] });

  for(const name in groupedData) {
      groupedData[name].sort((a,b) => b.year - a.year);
  }
  
  const headers = ['Año', 'Ranking', ...metrics.map(m => m.label)];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Universidad</th>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-6 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedData).map(([uniName, yearlyData], index) => (
            <Fragment key={uniName}>
              {yearlyData.map((yearData, yearIndex) => (
                <tr key={`${uniName}-${yearData.year}`} className="bg-white border-b border-gray-200 last:border-b-0 hover:bg-gray-50/60 transition-colors">
                  {yearIndex === 0 && (
                     <th scope="row" rowSpan={yearlyData.length} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap align-top bg-gray-50/50">
                        {uniName}
                     </th>
                  )}
                  <td className="px-6 py-4 font-semibold">{yearData.year}</td>
                  <td className="px-6 py-4 font-bold text-slate-800 text-center">{yearData.rank}</td>
                  {metrics.map(metric => (
                      <td key={metric.key} className="px-6 py-4 font-mono">
                         {
                             metric.isPercentage 
                             ? `${(yearData[metric.key] as number).toFixed(2)}%`
                             : (yearData[metric.key] as number).toLocaleString('es-ES')
                         }
                      </td>
                  ))}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EvolutionTable;