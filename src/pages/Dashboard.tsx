
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileText, Users, TrendingUp, Brain, Clock, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">CVs Procesados</CardTitle>
                  <CardDescription className="text-blue-100">Total acumulado</CardDescription>
                </div>
                <FileText className="h-8 w-8 text-blue-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-blue-100 text-sm">Comienza subiendo CVs</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Candidatos Activos</CardTitle>
                  <CardDescription className="text-green-100">En proceso</CardDescription>
                </div>
                <Users className="h-8 w-8 text-green-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-green-100 text-sm">Sin candidatos registrados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Análisis Completados</CardTitle>
                  <CardDescription className="text-purple-100">Con predicción IA</CardDescription>
                </div>
                <Brain className="h-8 w-8 text-purple-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-purple-100 text-sm">Esperando análisis</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Tiempo Promedio</CardTitle>
                  <CardDescription className="text-orange-100">Por análisis</CardDescription>
                </div>
                <Clock className="h-8 w-8 text-orange-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">--</div>
              <p className="text-orange-100 text-sm">Sin datos suficientes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <CardTitle>Habilidades Más Valoradas</CardTitle>
              </div>
              <CardDescription>
                Las competencias se mostrarán después de analizar candidatos
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-40">
              <div className="text-center text-slate-500">
                <Brain className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                <p>No hay datos disponibles</p>
                <p className="text-sm">Sube CVs para comenzar el análisis</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <CardTitle>Candidatos Destacados</CardTitle>
              </div>
              <CardDescription>
                Los mejores perfiles aparecerán aquí
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-40">
              <div className="text-center text-slate-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                <p>No hay candidatos registrados</p>
                <p className="text-sm">Los perfiles destacados aparecerán aquí</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <CardTitle>Análisis Predictivo</CardTitle>
            </div>
            <CardDescription>
              Rendimiento del modelo de Machine Learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-400">--</div>
                <p className="text-slate-600">Precisión del Modelo</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-400">--</div>
                <p className="text-slate-600">Tasa de Éxito</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-400">0</div>
                <p className="text-slate-600">Predicciones Realizadas</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Sistema listo para análisis</span>
              </div>
              <p className="text-blue-600 text-sm mt-1">
                El modelo de IA se calibrará automáticamente con los primeros análisis
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
