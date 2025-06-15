
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Filter, Upload, Brain, Star, MapPin, Briefcase, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Candidate {
  procesado_id: number;
  documento_id: number;
  nombre_archivo: string;
  data_extraida: any;
  habilidades_indexadas: string[];
  fecha_procesamiento: string;
  prediccion?: {
    probabilidad_exito: number;
    factores_clave: string[];
  };
}

const ResultsScreen = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [sortBy, setSortBy] = useState('score');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        
        // Obtener candidatos con sus datos procesados y predicciones
        const { data, error } = await supabase
          .from('datos_documentos_procesados')
          .select(`
            procesado_id,
            documento_id,
            data_extraida,
            habilidades_indexadas,
            fecha_procesamiento,
            documentos_cargados!inner (
              nombre_archivo,
              fecha_carga
            ),
            predicciones (
              probabilidad_exito,
              factores_clave
            )
          `);

        if (error) {
          console.error('Error fetching candidates:', error);
          return;
        }

        const candidatesData = data?.map(item => ({
          procesado_id: item.procesado_id,
          documento_id: item.documento_id,
          nombre_archivo: item.documentos_cargados.nombre_archivo,
          data_extraida: item.data_extraida,
          habilidades_indexadas: item.habilidades_indexadas || [],
          fecha_procesamiento: item.fecha_procesamiento,
          prediccion: item.predicciones[0] || null
        })) || [];

        setCandidates(candidatesData);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Obtener todas las habilidades únicas
  const allSkills = [...new Set(candidates.flatMap(c => c.habilidades_indexadas || []))];

  const filteredCandidates = candidates
    .filter(candidate => {
      const data = candidate.data_extraida;
      const searchLower = searchTerm.toLowerCase();
      
      const matchesSearch = 
        data?.nombre?.toLowerCase().includes(searchLower) ||
        data?.puesto_actual?.toLowerCase().includes(searchLower) ||
        data?.empresa_actual?.toLowerCase().includes(searchLower) ||
        candidate.habilidades_indexadas?.some((skill: string) => 
          skill.toLowerCase().includes(searchLower)
        );

      const matchesSkill = selectedSkill === 'all' || 
        candidate.habilidades_indexadas?.includes(selectedSkill);

      return matchesSearch && matchesSkill;
    })
    .sort((a, b) => {
      if (sortBy === 'score') {
        const scoreA = a.prediccion?.probabilidad_exito || 0;
        const scoreB = b.prediccion?.probabilidad_exito || 0;
        return scoreB - scoreA;
      }
      if (sortBy === 'name') {
        const nameA = a.data_extraida?.nombre || '';
        const nameB = b.data_extraida?.nombre || '';
        return nameA.localeCompare(nameB);
      }
      if (sortBy === 'experience') {
        const expA = a.data_extraida?.experiencia_anos || 0;
        const expB = b.data_extraida?.experiencia_anos || 0;
        return expB - expA;
      }
      return 0;
    });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 85) return <Star className="h-4 w-4 fill-current" />;
    return <Star className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-pulse" />
            <p className="text-slate-600">Cargando candidatos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-7 w-7 text-blue-600" />
              Análisis de Candidatos
            </CardTitle>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, posición o habilidades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por habilidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las habilidades</SelectItem>
                  {allSkills.map(skill => (
                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Puntuación de Aptitud</SelectItem>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="experience">Experiencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Mostrando {filteredCandidates.length} candidatos de {candidates.length} total
            </p>
          </CardContent>
        </Card>

        {filteredCandidates.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
                  <Users className="h-12 w-12 text-slate-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-800">
                    {candidates.length === 0 ? 'No hay candidatos registrados' : 'No hay candidatos que coincidan con tu búsqueda'}
                  </h3>
                  <p className="text-slate-600 max-w-md">
                    {candidates.length === 0 
                      ? 'Comienza subiendo CVs para analizar candidatos con inteligencia artificial y encontrar los mejores perfiles para tus vacantes.'
                      : 'Intenta ajustar los filtros de búsqueda para encontrar más candidatos.'
                    }
                  </p>
                </div>
                {candidates.length === 0 && (
                  <Link to="/upload">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Subir CVs
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCandidates.map((candidate) => (
              <Card key={candidate.procesado_id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {candidate.data_extraida?.nombre || 'Candidato'}
                        {candidate.prediccion && candidate.prediccion.probabilidad_exito >= 85 && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </CardTitle>
                      <div className="flex items-center text-slate-600 text-sm mt-1">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {candidate.data_extraida?.puesto_actual || 'Posición no especificada'}
                      </div>
                      {candidate.data_extraida?.ubicacion && (
                        <div className="flex items-center text-slate-500 text-sm mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {candidate.data_extraida.ubicacion}
                        </div>
                      )}
                    </div>
                    {candidate.prediccion && (
                      <div className={`px-3 py-2 rounded-lg text-center ${getScoreColor(candidate.prediccion.probabilidad_exito)}`}>
                        <div className="flex items-center gap-1">
                          {getScoreIcon(candidate.prediccion.probabilidad_exito)}
                          <span className="font-bold text-lg">{candidate.prediccion.probabilidad_exito.toFixed(0)}%</span>
                        </div>
                        <div className="text-xs">Aptitud</div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Información Clave</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-slate-500">Experiencia:</span>
                        <span className="ml-1 font-medium">{candidate.data_extraida?.experiencia_anos || 0} años</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Empresa:</span>
                        <span className="ml-1 font-medium">{candidate.data_extraida?.empresa_actual || 'N/A'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500">Educación:</span>
                        <span className="ml-1 font-medium">{candidate.data_extraida?.educacion || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Habilidades Técnicas</h4>
                    <div className="flex flex-wrap gap-1">
                      {candidate.habilidades_indexadas?.slice(0, 6).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.habilidades_indexadas?.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{candidate.habilidades_indexadas.length - 6}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {candidate.prediccion?.factores_clave && (
                    <div>
                      <h4 className="font-medium text-slate-700 mb-2">Factores Clave</h4>
                      <div className="space-y-1">
                        {candidate.prediccion.factores_clave.slice(0, 2).map((factor, index) => (
                          <div key={index} className="text-sm text-slate-600 flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                            {factor}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center text-xs text-slate-500">
                      <Clock className="h-3 w-3 mr-1" />
                      Procesado {new Date(candidate.fecha_procesamiento).toLocaleDateString('es-ES')}
                    </div>
                    <Link to={`/candidates/${candidate.procesado_id}`}>
                      <Button size="sm" variant="outline">
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredCandidates.length > 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <h3 className="font-semibold text-slate-800 mb-2">¿Quieres analizar más candidatos?</h3>
              <p className="text-slate-600 mb-4">Sube más CVs para expandir tu base de candidatos</p>
              <Link to="/upload">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Más CVs
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ResultsScreen;
