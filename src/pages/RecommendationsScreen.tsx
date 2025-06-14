
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const RecommendationsScreen = () => {
  const recommendations = [
    {
      id: '1',
      type: 'talent_identification',
      priority: 'high',
      title: 'Oportunidad de Talento Excepcional',
      description: 'Hemos identificado 3 candidatos con puntuaciones superiores al 90% que podrían ser ideales para roles de liderazgo técnico.',
      insights: [
        'Ana García (94%) - Excelente para arquitectura de software',
        'María López (92%) - Ideal para gestión de equipos',
        'Carlos Mendoza (89%) - Perfecto para proyectos de IA'
      ],
      action: 'Revisar perfiles destacados',
      confidence: 96
    },
    {
      id: '2',
      type: 'skill_gap',
      priority: 'medium',
      title: 'Brecha Identificada en Habilidades',
      description: 'Análisis muestra escasez de candidatos con experiencia en cloud computing y DevOps en el pool actual.',
      insights: [
        'Solo 23% de candidatos tienen experiencia en AWS/Azure',
        'Déficit del 40% en habilidades de containerización',
        'Oportunidad para programas de capacitación interna'
      ],
      action: 'Ajustar criterios de búsqueda',
      confidence: 87
    },
    {
      id: '3',
      type: 'hiring_strategy',
      priority: 'medium',
      title: 'Optimización del Proceso de Selección',
      description: 'Los candidatos con mayor puntuación en "trabajo en equipo" tienden a tener mejor rendimiento a largo plazo.',
      insights: [
        'Correlación del 78% entre trabajo en equipo y retención',
        'Candidatos con alta adaptabilidad se integran 40% más rápido',
        'Recomendar priorizar habilidades blandas en filtros'
      ],
      action: 'Actualizar criterios de evaluación',
      confidence: 82
    },
    {
      id: '4',
      type: 'market_trend',
      priority: 'low',
      title: 'Tendencia del Mercado Laboral',
      description: 'Incremento del 25% en candidatos con experiencia remota en los últimos 6 meses.',
      insights: [
        'Mayor disponibilidad de talento senior remoto',
        'Habilidades de comunicación digital más valoradas',
        'Oportunidad para expandir búsqueda geográfica'
      ],
      action: 'Considerar posiciones remotas',
      confidence: 91
    },
    {
      id: '5',
      type: 'prediction_accuracy',
      priority: 'high',
      title: 'Mejora en Precisión del Modelo',
      description: 'El modelo de IA ha mejorado su precisión al 94.2% tras incorporar feedback de las últimas contrataciones.',
      insights: [
        'Reducción del 15% en falsos positivos',
        'Mejor identificación de liderazgo potencial',
        'Algoritmo optimizado para cultura organizacional'
      ],
      action: 'Aprovechar mayor precisión predictiva',
      confidence: 94
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'talent_identification': return '🎯';
      case 'skill_gap': return '📊';
      case 'hiring_strategy': return '🚀';
      case 'market_trend': return '📈';
      case 'prediction_accuracy': return '🤖';
      default: return '💡';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-blue-600';
    if (confidence >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Recomendaciones Estratégicas</CardTitle>
            <CardDescription>
              Insights generados por IA para optimizar tu proceso de reclutamiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">5</div>
                <p className="text-slate-600 text-sm">Recomendaciones Activas</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">91%</div>
                <p className="text-slate-600 text-sm">Confianza Promedio</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">2</div>
                <p className="text-slate-600 text-sm">Alta Prioridad</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24h</div>
                <p className="text-slate-600 text-sm">Última Actualización</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {recommendations.map((rec) => (
            <Card key={rec.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTypeIcon(rec.type)}</span>
                    <div>
                      <CardTitle className="text-xl">{rec.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {rec.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getPriorityColor(rec.priority)} border`}>
                      {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'} Prioridad
                    </Badge>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${getConfidenceColor(rec.confidence)}`}>
                        {rec.confidence}% confianza
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">Insights Clave:</h4>
                  <ul className="space-y-1">
                    {rec.insights.map((insight, index) => (
                      <li key={index} className="flex items-start space-x-2 text-slate-700">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="text-sm text-slate-600">
                    <strong>Acción recomendada:</strong> {rec.action}
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      Aplicar Recomendación
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🔄</span>
              <span>Mejora Continua</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 mb-4">
              Nuestro sistema de IA se actualiza continuamente basándose en los resultados de contratación 
              y feedback de desempeño para generar recomendaciones cada vez más precisas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-lg font-bold text-blue-600">247</div>
                <p className="text-sm text-slate-600">Análisis Realizados</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-lg font-bold text-green-600">156</div>
                <p className="text-sm text-slate-600">Recomendaciones Aplicadas</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-lg font-bold text-purple-600">94.2%</div>
                <p className="text-sm text-slate-600">Precisión del Modelo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RecommendationsScreen;
