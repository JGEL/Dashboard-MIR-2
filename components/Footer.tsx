
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 text-center p-6 bg-white/70 backdrop-blur-sm border border-gray-200/80 shadow-sm rounded-lg">
      <div className="max-w-5xl mx-auto text-xs text-slate-600">
        <p>
          <strong>
            Todos los datos corresponden a información oficial del Ministerio de Sanidad.
            Pedimos disculpas por cualquier error o fallo, que agradeceremos sea reportado al autor
            (Joaquín García-Estañ López, <a href="mailto:jgestan@gmail.com" className="text-cyan-600 hover:underline">jgestan@gmail.com</a>).
            Importante: El uso de esta app es libre para estudio e investigación.
            Su uso comercial no está permitido y debe solicitarse permiso al email citado.
          </strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
