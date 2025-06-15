
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, Users, Lightbulb, AlertCircle, CheckCircle, BarChart3, Target } from 'lucide-react';

const RecommendationsScreen = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-2xl">Recomendaciones Estratégicas</CardTitle>
            </div>
            <CardDescription>
              Insights generados por IA para optimizar tu proceso de reclutamiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-400">0</div>
                <p className="text-slate-600 text-sm">Recomendaciones Activas</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-400">--</div>
                <p className="text-slate-600 text-sm">Confianza Promedio</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-400">0</div>
                <p className="text-slate-600 text-sm">Alta Prioridad</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-400">--</div>
                <p className="text-slate-600 text-sm">Última Actualización</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-2 border-dashed border-slate-200">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <CardTitle>Identificación de Talento</CardTitle>
              </div>
              <CardDescription>
                Perfiles destacados aparecerán aquí
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center text-slate-500">
                <Target className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">Sin datos suficientes para análisis</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-slate-200">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                <CardTitle>Análisis de Habilidades</CardTitle>
              </div>
              <CardDescription>
                Brechas y oportunidades identificadas
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center text-slate-500">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">Esperando análisis de candidatos</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-slate-200">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <CardTitle>Estrategia de Contratación</CardTitle>
              </div>
              <CardDescription>
                Optimizaciones del proceso
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center text-slate-500">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">Recomendaciones se generarán automáticamente</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-slate-200">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <CardTitle>Precisión del Modelo</CardTitle>
              </div>
              <CardDescription>
                Mejoras y calibración de IA
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center text-slate-500">
                <Brain className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">El modelo se calibrará con nuevos datos</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <CardTitle>Sistema de IA Activo</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 mb-4">
              El sistema de inteligencia artificial está listo para generar recomendaciones 
              personalizadas basándose en los datos de candidatos y resultados de contratación.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <AlertCircle className="h-6 w-6 mb-2 text-orange-500" />
                <div className="text-lg font-bold text-slate-400">0</div>
                <p className="text-sm text-slate-600">Análisis Pendientes</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <CheckCircle className="h-6 w-6 mb-2 text-green-500" />
                <div className="text-lg font-bold text-green-600">Activo</div>
                <p className="text-sm text-slate-600">Estado del Sistema</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Brain className="h-6 w-6 mb-2 text-purple-500" />
                <div className="text-lg font-bold text-slate-400">--</div>
                <p className="text-sm text-slate-600">Precisión Actual</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <div className="flex items-start space-x-2">
                <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-800 font-medium">Próximos pasos:</p>
                  <p className="text-blue-700 text-sm">
                    Sube CVs de candidatos para comenzar a recibir recomendaciones 
                    personalizadas y análisis predictivos.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RecommendationsScreen;
