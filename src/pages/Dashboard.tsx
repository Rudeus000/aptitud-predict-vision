
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const Dashboard = () => {
  const mockData = {
    totalCVs: 247,
    processedToday: 12,
    averageScore: 78.5,
    topSkills: [
      { name: 'Liderazgo', count: 145, percentage: 60 },
      { name: 'Trabajo en equipo', count: 132, percentage: 55 },
      { name: 'Comunicación', count: 128, percentage: 52 },
      { name: 'Adaptabilidad', count: 98, percentage: 40 },
      { name: 'Resolución de problemas', count: 89, percentage: 36 }
    ],
    recentCandidates: [
      { name: 'Ana García', score: 92, position: 'Desarrolladora Senior' },
      { name: 'Carlos Mendoza', score: 87, position: 'Analista de Datos' },
      { name: 'María López', score: 85, position: 'Gerente de Proyecto' }
    ]
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">CVs Procesados</CardTitle>
              <CardDescription className="text-blue-100">Total acumulado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockData.totalCVs}</div>
              <p className="text-blue-100 text-sm">+{mockData.processedToday} hoy</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Puntuación Promedio</CardTitle>
              <CardDescription className="text-green-100">Aptitud general</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockData.averageScore}%</div>
              <div className="w-full bg-green-400 rounded-full h-2 mt-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${mockData.averageScore}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Candidatos Activos</CardTitle>
              <CardDescription className="text-purple-100">En proceso</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">89</div>
              <p className="text-purple-100 text-sm">23 nuevos esta semana</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Análisis Completados</CardTitle>
              <CardDescription className="text-orange-100">Con predicción</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">156</div>
              <p className="text-orange-100 text-sm">98.5% precisión</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Habilidades Blandas Más Valoradas</CardTitle>
              <CardDescription>
                Distribución de competencias en los candidatos analizados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.topSkills.map((skill, index) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-slate-500">{skill.count} candidatos</span>
                  </div>
                  <Progress value={skill.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Candidatos Destacados</CardTitle>
              <CardDescription>
                Los perfiles con mayor puntuación de aptitud
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.recentCandidates.map((candidate, index) => (
                <div key={candidate.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{candidate.name}</p>
                      <p className="text-sm text-slate-500">{candidate.position}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{candidate.score}%</div>
                    <div className="text-xs text-slate-500">Aptitud</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Análisis Predictivo - Últimos 30 días</CardTitle>
            <CardDescription>
              Rendimiento del modelo de Machine Learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">94.2%</div>
                <p className="text-slate-600">Precisión del Modelo</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">87.5%</div>
                <p className="text-slate-600">Tasa de Éxito Predicho</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">156</div>
                <p className="text-slate-600">Predicciones Realizadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
