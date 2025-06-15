
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Filter, Upload } from 'lucide-react';

const ResultsScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [sortBy, setSortBy] = useState('score');

  // Empty array - no mock candidates
  const candidates: any[] = [];

  const filteredCandidates = candidates
    .filter(candidate => 
      candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills?.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'score') return (b.score || 0) - (a.score || 0);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'experience') return parseInt(b.experience || '0') - parseInt(a.experience || '0');
      return 0;
    });

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
                  <SelectItem value="liderazgo">Liderazgo</SelectItem>
                  <SelectItem value="teamwork">Trabajo en equipo</SelectItem>
                  <SelectItem value="communication">Comunicación</SelectItem>
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

        {/* Empty state */}
        <Card>
          <CardContent className="text-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
                <Users className="h-12 w-12 text-slate-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-800">
                  No hay candidatos registrados
                </h3>
                <p className="text-slate-600 max-w-md">
                  Comienza subiendo CVs para analizar candidatos con inteligencia artificial y encontrar los mejores perfiles para tus vacantes.
                </p>
              </div>
              <Link to="/upload">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Subir CVs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ResultsScreen;
