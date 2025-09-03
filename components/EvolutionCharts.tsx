import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UniversityData, Metric } from '../types.ts';

interface EvolutionChartsProps {
  data: UniversityData[];
  metrics: Metric[];
  allYears: number[];
}

const COLORS = ['#06b6d4', '#f59e0b', '#84cc16', '#ec4899', '#8b5cf6'];

const getDynamicPercentageDomain = (values: number[]): [number, number] => {
  if (!values || values.length === 0) {
    return [0, 100];
  }
  const minVal = Math.min(...values);
  if (minVal < 50) {
    return [0, 100];
  }
  const domainMin = Math.floor((minVal - 10) / 5) * 5;
  return [Math.max(0, domainMin), 100];
};

const CustomTooltip: React.FC<any> = ({ active, payload, label, unit, isRankChart }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className="p-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg text-sm">
        <p className="label font-bold text-slate-900">{`Año: ${label}`}</p>
        {payload.map((pld: any, index: number) => {
          if (pld.value === null || pld.value === undefined) return null;

          const value = typeof pld.value === 'number'
            ? pld.value.toLocaleString('es-ES', { maximumFractionDigits: 2 })
            : pld.value;
            
          if (isRankChart) {
            return (
              <div key={index} style={{ color: pld.color }}>
                {`${pld.name}: Ranking #${value}`}
              </div>
            );
          }
          
          const rankKey = `${pld.dataKey}_rank`;
          const rank = dataPoint[rankKey];
          return (
            <div key={index} style={{ color: pld.color }}>
              {`${pld.name}: ${value}${unit}`}
              {rank !== null && rank > 0 && <span className="ml-2 text-cyan-600 font-semibold">{`(Ranking: #${rank})`}</span>}
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm h-80">
        <h3 className="font-bold text-center text-slate-800 mb-4">{title}</h3>
        {children}
    </div>
);

const EvolutionCharts: React.FC<EvolutionChartsProps> = ({ data, metrics, allYears }) => {
  
  const universityNames = [...new Set(data.map(d => d.name))];
  
  const firstYearWithData = Math.min(
    ...universityNames.map(name => {
      const uniYears = data.filter(d => d.name === name).map(d => d.year);
      return uniYears.length > 0 ? Math.min(...uniYears) : Infinity;
    })
  );

  const relevantYears = isFinite(firstYearWithData)
    ? allYears.filter(year => year >= firstYearWithData)
    : [];

  const universityAbbreviations = Object.fromEntries(
    universityNames.map(name => [name, data.find(d => d.name === name)?.abbreviation || name])
  );

  const chartDataByMetric = metrics.map(metric => {
    const processedData = relevantYears.sort((a,b) => a - b).map(year => {
      const yearEntry: {[key:string]: string | number | null} = { year: year.toString() };
      universityNames.forEach(name => {
        const uniDataForYear = data.find(d => d.name === name && d.year === year);
        const abbrev = universityAbbreviations[name];
        yearEntry[abbrev] = uniDataForYear ? uniDataForYear[metric.key] as number : null;
        yearEntry[`${abbrev}_rank`] = uniDataForYear ? uniDataForYear.rank : null;
      });
      return yearEntry;
    });

    let domain: [number | 'auto', number | 'auto'] = ['auto', 'auto'];
    if (metric.isPercentage) {
        const values = data
            .filter(d => d.year >= firstYearWithData)
            .map(d => d[metric.key] as number)
            .filter(v => v > 0);
        domain = getDynamicPercentageDomain(values);
    }

    return { metric, processedData, domain };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {chartDataByMetric.map(({ metric, processedData, domain }) => {
        const isRankChart = metric.key === 'rank';
        
        const hasData = processedData.some(entry => universityNames.some(name => entry[universityAbbreviations[name]] !== null));
        if (!hasData) return null;

        return (
          <ChartCard title={metric.label} key={metric.key}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedData} margin={{ top: 5, right: 20, left: isRankChart ? 10 : -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }} 
                  reversed={isRankChart}
                  domain={isRankChart ? [1, 'auto'] : domain}
                  unit={!isRankChart && metric.isPercentage ? '%' : ''}
                  label={isRankChart ? { value: 'Posición', angle: -90, position: 'insideLeft', fill: '#6b7280', offset: -5 } : undefined}
                />
                <Tooltip content={<CustomTooltip unit={metric.isPercentage ? '%' : ''} isRankChart={isRankChart} />} cursor={{ stroke: 'rgba(203, 213, 225, 0.8)' }}/>
                <Legend wrapperStyle={{ bottom: -5, left: 20, fontSize: '12px' }} />
                {universityNames.map((name, index) => (
                  <Line
                    key={name}
                    name={universityAbbreviations[name]}
                    type="monotone"
                    dataKey={universityAbbreviations[name]}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        );
      })}
    </div>
  );
};

export default EvolutionCharts;