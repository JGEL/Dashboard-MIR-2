Propósito Principal

La aplicación es un Dashboard Interactivo de Rendimiento en el examen MIR, una herramienta de análisis de datos diseñada para visualizar y comparar el rendimiento de las universidades españolas en el examen MIR (Médico Interno Residente). Utiliza datos oficiales del Ministerio de Sanidad desde el año 2014 hasta 2025.

Funcionalidades Clave

La aplicación se estructura en dos modos de visualización principales:

Modo de Comparativa por Año: 
- Permite al usuario seleccionar un año específico. El usuario puede elegir hasta 5 universidades para compararlas lado a lado en ese año.
- Muestra una serie de gráficos de barras que comparan métricas clave como:
- Cifras absolutas (admitidos, presentados, plazas adjudicadas).
- Ranking Nacional, calculado en base al % de Plazas / Superan Nota.
- Diversos porcentajes de rendimiento (ej. % de plazas sobre presentados).
- Incluye una tabla detallada con todos los datos numéricos para un análisis más profundo.
  
Modo de Evolución Anual:
- Permite al usuario seleccionar hasta 5 universidades para seguir su rendimiento a lo largo del tiempo.
- El usuario puede elegir qué métricas específicas desea visualizar (ej. Ranking, % Plazas / Presentados, etc.).
-Muestra gráficos de líneas que ilustran la tendencia de las métricas seleccionadas para cada universidad a través de los años.
- Se complementa con una tabla de evolución que agrupa los datos históricos por universidad.

Características Destacadas

Resúmenes con Inteligencia Artificial: Una de las características más avanzadas es la integración con la API de Gemini. Con un solo clic, el usuario puede generar un resumen textual que analiza los datos seleccionados, ya sea comparando universidades en un año o describiendo sus tendencias evolutivas. Esto ofrece conclusiones rápidas y claras sin necesidad de interpretar todos los gráficos manualmente.
Interfaz Interactiva y Responsiva: Construida con React y TailwindCSS, la interfaz es moderna, fácil de usar y se adapta a diferentes tamaños de pantalla. Los selectores de universidades incluyen una función de búsqueda para facilitar la elección.
Visualizaciones Claras: Utiliza la librería recharts para crear gráficos interactivos con tooltips informativos que aparecen al pasar el cursor, facilitando la comprensión de los datos.
Ranking Calculado: La aplicación no solo muestra datos brutos, sino que también procesa la información para calcular y asignar un Ranking Nacional a cada universidad anualmente, añadiendo una valiosa capa de análisis.
En resumen, es una herramienta potente y especializada para estudiantes, académicos y administradores del ámbito médico que deseen analizar de forma visual e intuitiva el panorama de rendimiento de las universidades en el examen MIR, con la capacidad añadida de obtener análisis generados por IA.
