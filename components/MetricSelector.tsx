import React from 'react';
import { UniversityData, Metric } from '../types.ts';
import { METRICS } from '../constants/data.ts';
import { CheckSquareIcon } from './Icons.tsx';

interface MetricSelectorProps {
  selectedMetrics: Array<keyof UniversityData>;
  onMetricChange: (metricKey: keyof UniversityData) => void;
}

const MetricSelector: React.FC<MetricSelectorProps> = ({ selectedMetrics, onMetricChange }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <CheckSquareIcon className="text-cyan-500" />
        <h2 className="text-xl font-bold text-slate-800">Seleccionar Métricas a Visualizar</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {METRICS.map(metric => {
          const isSelected = selectedMetrics.includes(metric.key);
          return (
            <label
              key={metric.key}
              className={`flex items-center p-3 rounded-md transition-colors duration-200 cursor-pointer border ${
                isSelected
                  ? 'bg-cyan-500/10 border-cyan-500'
                  : 'bg-gray-50 hover:bg-gray-100 border-transparent'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onMetricChange(metric.key)}
                className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span className="ml-3 text-sm font-medium text-slate-700">{metric.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default MetricSelector;