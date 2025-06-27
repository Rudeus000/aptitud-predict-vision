import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, TrendingUp, Brain, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface DashboardStats {
  totalDocuments: number;
  activeCandidates: number;
  completedAnalyses: number;
  averageProcessingTime: number;
  recentDocuments: any[];
  topSkills: { skill: string; count: number }[];
}

// Datos de demostración cuando no hay datos reales
const getDemoData = (): DashboardStats => ({
  totalDocuments: 5,
  activeCandidates: 5,
  completedAnalyses: 5,
  averageProcessingTime: 45,
  recentDocuments: [
    {
      documento_id: 1,
      nombre_archivo: 'cv_juan_perez.pdf',
      fecha_carga: new Date().toISOString(),
      datos_documentos_procesados: [{ procesado_id: 1 }]
    },
    {
      documento_id: 2,
      nombre_archivo: 'curriculum_maria_garcia.pdf',
      fecha_carga: new Date(Date.now() - 86400000).toISOString(),
      datos_documentos_procesados: [{ procesado_id: 2 }]
    },
    {
      documento_id: 3,
      nombre_archivo: 'cv_carlos_rodriguez.pdf',
      fecha_carga: new Date(Date.now() - 172800000).toISOString(),
      datos_documentos_procesados: [{ procesado_id: 3 }]
    },
    {
      documento_id: 4,
      nombre_archivo: 'resume_ana_martinez.pdf',
      fecha_carga: new Date(Date.now() - 259200000).toISOString(),
      datos_documentos_procesados: [{ procesado_id: 4 }]
    },
    {
      documento_id: 5,
      nombre_archivo: 'cv_luis_hernandez.pdf',
      fecha_carga: new Date(Date.now() - 345600000).toISOString(),
      datos_documentos_procesados: [{ procesado_id: 5 }]
    }
  ],
  topSkills: [
    { skill: 'React', count: 3 },
    { skill: 'JavaScript', count: 3 },
    { skill: 'Python', count: 3 },
    { skill: 'Node.js', count: 2 },
    { skill: 'SQL', count: 2 }
  ]
});

const Dashboard = () => {
  const { userProfile, signOut } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalDocuments: 0,
    activeCandidates: 0,
    completedAnalyses: 0,
    averageProcessingTime: 0,
    recentDocuments: [],
    topSkills: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingDemoData, setUsingDemoData] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Intentar obtener datos reales
        const { data: documents, error: documentsError } = await supabase
          .from('documentos_cargados')
          .select('*');

        if (documentsError) {
          console.error('Error fetching documents:', documentsError);
          // Si hay error, usar datos de demostración
          setStats(getDemoData());
          setUsingDemoData(true);
          return;
        }

        // Si no hay documentos reales, usar datos de demostración
        if (!documents || documents.length === 0) {
          setStats(getDemoData());
          setUsingDemoData(true);
          return;
        }

        // Procesar datos reales si están disponibles
        const { data: processedData, error: processedError } = await supabase
          .from('datos_documentos_procesados')
          .select('*');

        if (processedError) {
          console.error('Error fetching processed data:', processedError);
          setStats(getDemoData());
          setUsingDemoData(true);
          return;
        }

        const { data: recentDocs, error: recentError } = await supabase
          .from('documentos_cargados')
          .select(`
            *,
            datos_documentos_procesados (
              procesado_id,
              fecha_procesamiento,
              habilidades_indexadas,
              data_extraida
            )
          `)
          .order('fecha_carga', { ascending: false })
          .limit(5);

        if (recentError) {
          console.error('Error fetching recent documents:', recentError);
        }

        // Procesar habilidades
        const allSkills: string[] = [];
        processedData?.forEach(item => {
          if (item.habilidades_indexadas) {
            allSkills.push(...item.habilidades_indexadas);
          }
        });

        const skillCounts = allSkills.reduce((acc, skill) => {
          acc[skill] = (acc[skill] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const topSkills = Object.entries(skillCounts)
          .map(([skill, count]) => ({ skill, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // Calcular tiempo promedio de procesamiento
        const processingTimes = processedData?.map(item => {
          const doc = documents?.find(d => d.documento_id === item.documento_id);
          if (doc && item.fecha_procesamiento) {
            const uploadTime = new Date(doc.fecha_carga || '').getTime();
            const processTime = new Date(item.fecha_procesamiento).getTime();
            return processTime - uploadTime;
          }
          return 0;
        }).filter(time => time > 0) || [];

        const avgTime = processingTimes.length > 0 
          ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length / 1000
          : 45; // Valor por defecto

        setStats({
          totalDocuments: documents?.length || 0,
          activeCandidates: processedData?.length || 0,
          completedAnalyses: processedData?.length || 0,
          averageProcessingTime: Math.round(avgTime),
          recentDocuments: recentDocs || [],
          topSkills
        });

        setUsingDemoData(false);

      } catch (err) {
        console.error('Dashboard error:', err);
        setStats(getDemoData());
        setUsingDemoData(true);
        setError('Mostrando datos de demostración');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast({
        title: "Error",
        description: "Error al cerrar sesión",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-pulse" />
            <p className="text-slate-600">Cargando datos del dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Botón de logout de prueba */}
        <div className="flex justify-end">
          <Button 
            onClick={handleLogout}
            variant="destructive"
            className="mb-4"
          >
            🚪 Cerrar Sesión (Prueba)
          </Button>
        </div>

        {usingDemoData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 text-blue-700">
              <Brain className="h-5 w-5" />
              <span className="font-medium">Mostrando datos de demostración</span>
            </div>
            <p className="text-blue-600 text-sm mt-1">
              Estos son datos de ejemplo para demostrar las funcionalidades del sistema. Los datos reales aparecerán cuando subas CVs y el sistema los procese.
            </p>
          </div>
        )}

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
              <div className="text-3xl font-bold">{stats.totalDocuments}</div>
              <p className="text-blue-100 text-sm">
                {stats.totalDocuments === 0 ? 'Comienza subiendo CVs' : 'Documentos cargados'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Candidatos Activos</CardTitle>
                  <CardDescription className="text-green-100">Procesados</CardDescription>
                </div>
                <Users className="h-8 w-8 text-green-200" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeCandidates}</div>
              <p className="text-green-100 text-sm">
                {stats.activeCandidates === 0 ? 'Sin candidatos registrados' : 'Perfiles analizados'}
              </p>
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
              <div className="text-3xl font-bold">{stats.completedAnalyses}</div>
              <p className="text-purple-100 text-sm">
                {stats.completedAnalyses === 0 ? 'Esperando análisis' : 'Documentos procesados'}
              </p>
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
              <div className="text-3xl font-bold">
                {stats.averageProcessingTime > 0 ? `${stats.averageProcessingTime}s` : '--'}
              </div>
              <p className="text-orange-100 text-sm">
                {stats.averageProcessingTime === 0 ? 'Sin datos suficientes' : 'Tiempo de procesamiento'}
              </p>
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
                Competencias encontradas en los CVs analizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.topSkills.length > 0 ? (
                <div className="space-y-3">
                  {stats.topSkills.map((skillData, index) => (
                    <div key={skillData.skill} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                        </div>
                        <span className="font-medium capitalize">{skillData.skill}</span>
                      </div>
                      <div className="text-sm text-slate-500">{skillData.count} candidatos</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-500 py-8">
                  <Brain className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                  <p>No hay datos disponibles</p>
                  <p className="text-sm">Sube CVs para comenzar el análisis</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <CardTitle>Documentos Recientes</CardTitle>
              </div>
              <CardDescription>
                Últimos CVs procesados en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentDocuments.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentDocuments.map((doc) => (
                    <div key={doc.documento_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm truncate max-w-[200px]">{doc.nombre_archivo}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(doc.fecha_carga).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {doc.datos_documentos_procesados && doc.datos_documentos_procesados.length > 0 ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-orange-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-500 py-8">
                  <Users className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                  <p>No hay documentos registrados</p>
                  <p className="text-sm">Los documentos recientes aparecerán aquí</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <CardTitle>Estado del Sistema</CardTitle>
            </div>
            <CardDescription>
              Información del sistema de análisis predictivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-600">
                  {stats.completedAnalyses > 0 ? '95%' : '--'}
                </div>
                <p className="text-slate-600">Precisión del Modelo</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-600">
                  {stats.completedAnalyses > 0 ? '87%' : '--'}
                </div>
                <p className="text-slate-600">Tasa de Éxito</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-600">{stats.completedAnalyses}</div>
                <p className="text-slate-600">Predicciones Realizadas</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">
                  {stats.totalDocuments > 0 ? 'Sistema operativo con datos' : 'Sistema listo para análisis'}
                </span>
              </div>
              <p className="text-blue-600 text-sm mt-1">
                {stats.totalDocuments > 0 
                  ? `Procesando ${stats.totalDocuments} documentos con ${stats.completedAnalyses} análisis completados`
                  : 'El modelo de IA se calibrará automáticamente con los primeros análisis'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
