
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useCandidateData, useRecommendations } from '@/hooks/useCandidateData';
import CVUploadModal from '@/components/candidate/CVUploadModal';
import AnalysisModal from '@/components/candidate/AnalysisModal';
import SurveyModal from '@/components/candidate/SurveyModal';
import AlertsModal from '@/components/candidate/AlertsModal';

const CandidateDashboard = () => {
  const { data: candidateData, isLoading } = useCandidateData();
  const { data: recommendations } = useRecommendations();
  
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [surveyModalOpen, setSurveyModalOpen] = useState(false);
  const [alertsModalOpen, setAlertsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando datos del candidato...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!candidateData) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-slate-600">No se encontraron datos del candidato.</p>
        </div>
      </Layout>
    );
  }

  const profileData = candidateData.processedData?.data_extraida || {};
  const prediction = candidateData.prediction;
  const skills = candidateData.processedData?.habilidades_indexadas || [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'recibido': return 'bg-yellow-100 text-yellow-800';
      case 'en_revision': return 'bg-blue-100 text-blue-800';
      case 'aprobado': return 'bg-green-100 text-green-800';
      case 'rechazado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
    return colors[index % colors.length];
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
                  {profileData.nombre?.split(' ').map((n: string) => n[0]).join('') || 'CD'}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">{profileData.nombre || 'Candidato'}</h1>
                  <p className="text-slate-600">{profileData.puesto_actual || 'Desarrollador'}</p>
                  <p className="text-sm text-slate-500">{profileData.email || 'email@ejemplo.com'}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white mb-2">
                  <div>
                    <div className="text-xl font-bold">{Math.round(prediction?.probabilidad_exito || 85)}%</div>
                    <div className="text-xs">Aptitud</div>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  CV Actualizado
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
                  Estado actual de tus aplicaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidateData.applications?.length > 0 ? (
                  candidateData.applications.map((app: any) => (
                    <div key={app.postulacion_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-slate-800">{app.nombre_vacante}</h4>
                          <p className="text-sm text-slate-600">La Pontificia</p>
                        </div>
                        <Badge className={getStatusColor(app.estado)}>
                          {app.estado.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>Aplicado: {new Date(app.fecha_postulacion).toLocaleDateString()}</span>
                        <span className="font-medium text-blue-600">
                          Compatibilidad: {Math.round(prediction?.probabilidad_exito || 85)}%
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
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
                    {prediction?.factores_clave?.slice(0, 3).map((factor: string, index: number) => (
                      <li key={index}>• {factor}</li>
                    )) || (
                      <>
                        <li>• Considera agregar certificaciones en cloud computing</li>
                        <li>• Mejora tu sección de proyectos con ejemplos específicos</li>
                        <li>• Desarrolla más habilidades de liderazgo</li>
                      </>
                    )}
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Fortalezas Identificadas</h4>
                  <ul className="space-y-2 text-green-700">
                    <li>• Excelente experiencia técnica en {skills.slice(0, 2).join(' y ')}</li>
                    <li>• {profileData.experiencia_anos} años de experiencia sólida</li>
                    <li>• Perfil altamente compatible con las vacantes</li>
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
                {skills.slice(0, 6).map((skill: string, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{skill}</span>
                      <span className="text-slate-500">{85 + (index * 2)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${getSkillColor(index)}`}
                        style={{ width: `${85 + (index * 2)}%` }}
                      ></div>
                    </div>
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
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={() => setCvModalOpen(true)}
                >
                  📄 Actualizar CV
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setAnalysisModalOpen(true)}
                >
                  📊 Ver Análisis Completo
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setSurveyModalOpen(true)}
                >
                  📝 Completar Encuesta
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setAlertsModalOpen(true)}
                >
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
                  <div className="text-2xl font-bold text-blue-600">{candidateData.applications?.length || 0}</div>
                  <p className="text-sm text-slate-600">Postulaciones Activas</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(prediction?.probabilidad_exito || 85)}%
                  </div>
                  <p className="text-sm text-slate-600">Puntuación de Aptitud</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Date(candidateData.document?.fecha_carga).toLocaleDateString('es', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </div>
                  <p className="text-sm text-slate-600">Última Actualización</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modales */}
        <CVUploadModal open={cvModalOpen} onOpenChange={setCvModalOpen} />
        <AnalysisModal 
          open={analysisModalOpen} 
          onOpenChange={setAnalysisModalOpen}
          candidateData={candidateData}
        />
        <SurveyModal open={surveyModalOpen} onOpenChange={setSurveyModalOpen} />
        <AlertsModal open={alertsModalOpen} onOpenChange={setAlertsModalOpen} />
      </div>
    </Layout>
  );
};

export default CandidateDashboard;
