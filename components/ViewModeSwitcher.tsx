import React from 'react';
import { ViewMode } from '../types.ts';
import { AnalyticsIcon, TrendingUpIcon } from './Icons.tsx';

interface ViewModeSwitcherProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const ViewModeSwitcher: React.FC<ViewModeSwitcherProps> = ({ viewMode, setViewMode }) => {
  const modes = [
    { id: 'COMPARISON', label: 'Comparativa por Año', icon: <AnalyticsIcon /> },
    { id: 'EVOLUTION', label: 'Evolución Anual', icon: <TrendingUpIcon className="text-cyan-500"/> },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row justify-center items-center gap-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-slate-800">Modo de Vista:</h3>
      </div>
      <div className="flex flex-wrap justify-center gap-2 rounded-lg bg-gray-100 p-1">
        {modes.map(mode => (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id as ViewMode)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-cyan-500 flex items-center gap-2 ${
              viewMode === mode.id
                ? 'bg-cyan-500 text-white shadow'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            {React.cloneElement(mode.icon, {className: `w-5 h-5 ${viewMode === mode.id ? 'text-white' : 'text-cyan-500'}`})}
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ViewModeSwitcher;