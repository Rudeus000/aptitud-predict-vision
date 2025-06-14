
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const CandidateDashboard = () => {
  const candidateData = {
    profile: {
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      phone: '+52 555 987 6543',
      position: 'Desarrollador Full Stack',
      score: 87,
      cvUploaded: true,
      lastUpdate: '2 días'
    },
    applications: [
      {
        id: '1',
        position: 'Senior Developer',
        company: 'La Pontificia',
        status: 'En revisión',
        dateApplied: '15 Jun 2025',
        score: 87
      },
      {
        id: '2',
        position: 'Tech Lead',
        company: 'La Pontificia',
        status: 'Entrevista programada',
        dateApplied: '10 Jun 2025',
        score: 92
      }
    ],
    skills: [
      { name: 'JavaScript', level: 90 },
      { name: 'React', level: 85 },
      { name: 'Node.js', level: 80 },
      { name: 'Python', level: 75 }
    ],
    softSkills: [
      { name: 'Comunicación', level: 88 },
      { name: 'Trabajo en equipo', level: 92 },
      { name: 'Liderazgo', level: 75 },
      { name: 'Adaptabilidad', level: 85 }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'en revisión': return 'bg-yellow-100 text-yellow-800';
      case 'entrevista programada': return 'bg-blue-100 text-blue-800';
      case 'aprobado': return 'bg-green-100 text-green-800';
      case 'rechazado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillColor = (level: number) => {
    if (level >= 85) return 'bg-green-500';
    if (level >= 70) return 'bg-blue-500';
    if (level >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header del perfil */}
        <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {candidateData.profile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">{candidateData.profile.name}</h1>
                  <p className="text-slate-600">{candidateData.profile.position}</p>
                  <p className="text-sm text-slate-500">{candidateData.profile.email}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white mb-2">
                  <div>
                    <div className="text-xl font-bold">{candidateData.profile.score}%</div>
                    <div className="text-xs">Aptitud</div>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  CV {candidateData.profile.cvUploaded ? 'Actualizado' : 'Pendiente'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Postulaciones actuales */}
            <Card>
              <CardHeader>
                <CardTitle>Mis Postulaciones</CardTitle>
                <CardDescription>
                  Estado actual de tus aplicaciones en La Pontificia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidateData.applications.map((app) => (
                  <div key={app.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-800">{app.position}</h4>
                        <p className="text-sm text-slate-600">{app.company}</p>
                      </div>
                      <Badge className={getStatusColor(app.status)}>
                        {app.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>Aplicado: {app.dateApplied}</span>
                      <span className="font-medium text-blue-600">Compatibilidad: {app.score}%</span>
                    </div>
                  </div>
                ))}
                
                {candidateData.applications.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📋</div>
                    <p className="text-slate-600">No tienes postulaciones activas</p>
                    <Button className="mt-4" variant="outline">
                      Explorar Oportunidades
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Retroalimentación y mejoras */}
            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones para Mejorar tu Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Sugerencias de IA</h4>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Considera agregar certificaciones en cloud computing (AWS/Azure)</li>
                    <li>• Mejora tu sección de proyectos con ejemplos específicos</li>
                    <li>• Desarrolla más habilidades de liderazgo para roles senior</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Fortalezas Identificadas</h4>
                  <ul className="space-y-2 text-green-700">
                    <li>• Excelentes habilidades de trabajo en equipo</li>
                    <li>• Sólida experiencia en desarrollo full stack</li>
                    <li>• Alta adaptabilidad a nuevas tecnologías</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna lateral */}
          <div className="space-y-6">
            {/* Habilidades técnicas */}
            <Card>
              <CardHeader>
                <CardTitle>Habilidades Técnicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidateData.skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-slate-500">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${getSkillColor(skill.level)}`}
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Habilidades blandas */}
            <Card>
              <CardHeader>
                <CardTitle>Habilidades Blandas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidateData.softSkills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-slate-500">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Acciones rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  📄 Actualizar CV
                </Button>
                <Button className="w-full" variant="outline">
                  📊 Ver Análisis Completo
                </Button>
                <Button className="w-full" variant="outline">
                  📝 Completar Encuesta
                </Button>
                <Button className="w-full" variant="outline">
                  🔔 Configurar Alertas
                </Button>
              </CardContent>
            </Card>

            {/* Estadísticas */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">2</div>
                  <p className="text-sm text-slate-600">Postulaciones Activas</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">87%</div>
                  <p className="text-sm text-slate-600">Puntuación de Aptitud</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{candidateData.profile.lastUpdate}</div>
                  <p className="text-sm text-slate-600">Última Actualización</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CandidateDashboard;
