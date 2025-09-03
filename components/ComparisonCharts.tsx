import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { UniversityData } from '../types.ts';

interface ComparisonChartsProps {
  data: UniversityData[];
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

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { fullName } = payload[0].payload;
    // The rank is directly available on the payload of the 'rank' Bar
    const rankPayload = payload.find(p => p.dataKey === 'rank');
    const displayRank = rankPayload ? rankPayload.payload.rank : payload[0].payload.rank;

    return (
      <div className="p-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg text-sm">
        <p className="label font-bold text-slate-900">{fullName}</p>
        <p className="text-xs text-gray-500 mb-2">{`(${label})`}</p>
        {displayRank && <p className="text-sm font-semibold text-cyan-600 mb-2">Ranking: {displayRank}</p>}
        {payload.map((pld: any, index: number) => (
          <div key={index} style={{ color: pld.color }}>
            {`${pld.name}: ${pld.value.toLocaleString('es-ES', { maximumFractionDigits: 2 })}${pld.unit || ''}`}
          </div>
        ))}
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

const ComparisonCharts: React.FC<ComparisonChartsProps> = ({ data }) => {
    
    const chartDataPercentages = data.map(uni => ({
        name: uni.abbreviation,
        fullName: uni.name,
        rank: uni.rank,
        'Presentados / Admitidos (%)': uni.percentagePresentedOverAdmitted,
        'Plazas / Presentados (%)': uni.percentagePlacesOverPresented,
        'Plazas / Superan Nota (%)': uni.percentagePlacesOverPassed,
    }));
    
    const chartDataAbsolute = data.map(uni => ({
        name: uni.abbreviation,
        fullName: uni.name,
        rank: uni.rank,
        Admitidos: uni.admitted,
        Presentados: uni.presented,
        'Plazas Adjudicadas': uni.placesAwarded
    }));
    
    const withoutPlazaData = data.map(uni => ({
        name: uni.abbreviation,
        fullName: uni.name,
        rank: uni.rank,
        'Sin Plaza (Absoluto)': uni.presented - uni.placesAwarded,
        '% Sin Plaza / Presentados': uni.presented > 0 ? ((uni.presented - uni.placesAwarded) / uni.presented) * 100 : 0,
    }));

    const presentedOverAdmittedDomain = getDynamicPercentageDomain(data.map(d => d.percentagePresentedOverAdmitted));
    const placesOverPresentedDomain = getDynamicPercentageDomain(data.map(d => d.percentagePlacesOverPresented));
    const placesOverPassedDomain = getDynamicPercentageDomain(data.map(d => d.percentagePlacesOverPassed));
    const withoutPlazaDomain = getDynamicPercentageDomain(withoutPlazaData.map(d => d['% Sin Plaza / Presentados']));


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6">
        {/* Fila Principal - 2 Gráficas */}
        <div className="xl:col-span-3">
            <ChartCard title="Cifras Absolutas: Admisión y Plazas">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartDataAbsolute} margin={{ top: 5, right: 20, left: -10, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" interval={0} tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 12 }}/>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(203, 213, 225, 0.4)' }}/>
                        <Legend wrapperStyle={{ bottom: -5, left: 20, fontSize: '12px' }} />
                        <Bar dataKey="Admitidos" fill={COLORS[0]} />
                        <Bar dataKey="Presentados" fill={COLORS[1]} />
                        <Bar dataKey="Plazas Adjudicadas" fill={COLORS[2]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
        <div className="xl:col-span-3">
            <ChartCard title="Ranking Nacional (% Plazas / Sup. Nota)">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartDataAbsolute} margin={{ top: 5, right: 20, left: -10, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" interval={0} tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <YAxis reversed tick={{ fill: '#6b7280', fontSize: 12 }} domain={[1, 'auto']}/>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(203, 213, 225, 0.4)' }}/>
                        <Bar dataKey="rank" name="Ranking">
                             {chartDataAbsolute.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
        
        {/* Fila Secundaria - 3 Gráficas */}
        <div className="xl:col-span-2">
            <ChartCard title="% Plazas que Superan Nota de Corte">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartDataPercentages} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" domain={placesOverPassedDomain} tick={{ fill: '#6b7280', fontSize: 12 }} unit="%"/>
                        <YAxis type="category" dataKey="name" width={60} tick={{ fill: '#6b7280', fontSize: 12 }}/>
                        <Tooltip content={<CustomTooltip unit="%"/>} cursor={{ fill: 'rgba(203, 213, 225, 0.4)' }}/>
                        <Bar dataKey="Plazas / Superan Nota (%)" unit="%">
                             {chartDataPercentages.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
        <div className="xl:col-span-2">
            <ChartCard title="% Plazas sobre los Presentados">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartDataPercentages} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" domain={placesOverPresentedDomain} tick={{ fill: '#6b7280', fontSize: 12 }} unit="%"/>
                        <YAxis type="category" dataKey="name" width={60} tick={{ fill: '#6b7280', fontSize: 12 }}/>
                        <Tooltip content={<CustomTooltip unit="%"/>} cursor={{ fill: 'rgba(203, 213, 225, 0.4)' }}/>
                        <Bar dataKey="Plazas / Presentados (%)" unit="%">
                             {chartDataPercentages.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
        <div className="xl:col-span-2">
            <ChartCard title="% Presentados sobre los Admitidos">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartDataPercentages} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" domain={presentedOverAdmittedDomain} tick={{ fill: '#6b7280', fontSize: 12 }} unit="%"/>
                        <YAxis type="category" dataKey="name" width={60} tick={{ fill: '#6b7280', fontSize: 12 }}/>
                        <Tooltip content={<CustomTooltip unit="%"/>} cursor={{ fill: 'rgba(203, 213, 225, 0.4)' }}/>
                        <Bar dataKey="Presentados / Admitidos (%)" unit="%">
                            {chartDataPercentages.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>

        {/* Fila Final - 2 Gráficas */}
        <div className="xl:col-span-3">
            <ChartCard title="Alumnos Sin Plaza (Absoluto)">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={withoutPlazaData} margin={{ top: 5, right: 20, left: -10, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" interval={0} tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(203, 213, 225, 0.4)' }}/>
                        <Legend wrapperStyle={{ bottom: -5, left: 20, fontSize: '12px' }} />
                        <Bar dataKey="Sin Plaza (Absoluto)" fill="#ef4444" />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
        <div className="xl:col-span-3">
            <ChartCard title="% Sin Plaza sobre los Presentados">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={withoutPlazaData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" domain={withoutPlazaDomain} tick={{ fill: '#6b7280', fontSize: 12 }} unit="%"/>
                        <YAxis type="category" dataKey="name" width={60} tick={{ fill: '#6b7280', fontSize: 12 }}/>
                        <Tooltip content={<CustomTooltip unit="%"/>} cursor={{ fill: 'rgba(203, 213, 225, 0.4)' }}/>
                        <Bar dataKey="% Sin Plaza / Presentados" unit="%">
                             {withoutPlazaData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    </div>
  );
};

export default ComparisonCharts;