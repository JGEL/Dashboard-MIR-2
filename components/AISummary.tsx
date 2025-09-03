import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { UniversityData, Metric } from '../types.ts';
import { SparklesIcon } from './Icons.tsx';

interface AISummaryProps {
  viewMode: 'COMPARISON' | 'EVOLUTION';
  data: UniversityData[];
  year?: number; // For comparison mode
  metrics?: Metric[]; // For evolution mode
}

const AISummary: React.FC<AISummaryProps> = ({ viewMode, data, year, metrics }) => {
  const [summary, setSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const generateSummary = useCallback(async () => {
    if (!data || data.length === 0) {
        return;
    }

    setIsGenerating(true);
    setSummary('');
    setError('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const universityNames = [...new Set(data.map(d => d.name))].join(', ');
      
      const relevantData = data.map(d => {
        // Pass only a subset of data to the AI to be concise and save tokens.
        return {
          universidad: d.abbreviation,
          año: d.year,
          admitidos: d.admitted,
          presentados: d.presented,
          plazas_adjudicadas: d.placesAwarded,
          'plazas_/_presentados_%': d.percentagePlacesOverPresented.toFixed(2),
          'alumnos_sin_plaza': d.withoutPlaceAbsolute,
        }
      });
      
      const dataString = JSON.stringify(relevantData, null, 2);

      let prompt = '';
      if (viewMode === 'COMPARISON') {
        prompt = `
          Eres un analista de datos experto en educación médica superior en España.
          Analiza los siguientes datos de rendimiento en el examen MIR para el año ${year} de las universidades: ${universityNames}.
          Proporciona un resumen conciso y claro en 2 o 3 puntos clave (usando guiones o asteriscos para listas), destacando los aspectos más relevantes de la comparación.
          Céntrate en las métricas clave como el porcentaje de plazas adjudicadas sobre los presentados y el número de alumnos que se quedan sin plaza.
          Usa un tono formal y objetivo. No inventes datos que no estén presentes. La respuesta debe ser un texto plano con formato de lista.
          
          Datos (en formato JSON):
          ${dataString}
        `;
      } else { // EVOLUTION
        const metricLabels = metrics?.map(m => m.label).join(', ') || 'seleccionadas';
        prompt = `
          Eres un analista de datos experto en educación médica superior en España.
          Analiza la evolución anual para las siguientes universidades: ${universityNames}, en estas métricas de rendimiento del examen MIR: ${metricLabels}.
          Proporciona un resumen conciso y claro en 2 o 3 puntos clave (usando guiones o asteriscos para listas), identificando las tendencias más significativas (positivas o negativas) a lo largo del tiempo para estas universidades.
          Usa un tono formal y objetivo. No inventes datos que no estén presentes. La respuesta debe ser un texto plano con formato de lista.
          
          Datos (en formato JSON):
          ${dataString}
        `;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      setSummary(response.text);
    } catch (e) {
      console.error(e);
      setError('No se pudo generar el resumen. Inténtelo de nuevo más tarde.');
    } finally {
      setIsGenerating(false);
    }
  }, [data, viewMode, year, metrics]);

  const renderSummary = (text: string) => {
    return text.split('\n').map((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
            return <li key={index}>{trimmedLine.substring(2)}</li>;
        }
        if(trimmedLine.length > 0){
             return <li key={index} style={{listStyle: 'none', paddingLeft: 0}}>{trimmedLine}</li>;
        }
        return null;
    }).filter(Boolean);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <SparklesIcon className="text-cyan-500 w-6 h-6" />
            <h2 className="text-xl font-bold text-slate-800">Resumen con IA</h2>
        </div>
        <button
          onClick={generateSummary}
          disabled={isGenerating}
          title='Generar resumen'
          className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg shadow-sm hover:bg-cyan-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generando...
            </>
          ) : (
             <>
              <SparklesIcon className="w-5 h-5" />
              Generar Resumen
             </>
          )}
        </button>
      </div>
      {error && <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
      {summary && (
        <div className="mt-4 prose prose-sm max-w-none text-slate-700">
          <ul className="list-disc pl-5 space-y-1">
             {renderSummary(summary)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AISummary;
