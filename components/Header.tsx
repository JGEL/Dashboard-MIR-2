
import React from 'react';
import { GraduationCapIcon } from './Icons.tsx';

const Header: React.FC = () => {
  return (
    <header className="text-center p-4 rounded-lg bg-white/70 backdrop-blur-sm border border-gray-200/80 shadow-sm">
      <div className="flex justify-center items-center gap-4">
        <GraduationCapIcon />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Dashboard de Rendimiento en el examen MIR
        </h1>
      </div>
      <p className="mt-3 text-lg text-cyan-500">
        Compare estadísticas de rendimiento de universidades españolas
      </p>
    </header>
  );
};

export default Header;