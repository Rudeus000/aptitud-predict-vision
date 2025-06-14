
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const ResultsScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [sortBy, setSortBy] = useState('score');

  const mockCandidates = [
    {
      id: '1',
      name: 'Ana García Martínez',
      email: 'ana.garcia@email.com',
      position: 'Desarrolladora Full Stack Senior',
      experience: '8 años',
      score: 94,
      skills: ['Liderazgo', 'React', 'Node.js', 'Trabajo en equipo'],
      softSkills: ['Comunicación efectiva', 'Resolución de problemas', 'Adaptabilidad'],
      education: 'Ing. en Sistemas - Universidad Nacional',
      prediction: 'Excelente ajuste para roles de liderazgo técnico'
    },
    {
      id: '2',
      name: 'Carlos Mendoza López',
      email: 'carlos.mendoza@email.com',
      position: 'Analista de Datos Senior',
      experience: '6 años',
      score: 89,
      skills: ['Python', 'SQL', 'Machine Learning', 'Análisis crítico'],
      softSkills: ['Pensamiento analítico', 'Atención al detalle', 'Colaboración'],
      education: 'Maestría en Ciencia de Datos - ITESM',
      prediction: 'Alto potencial para proyectos de inteligencia de negocios'
    },
    {
      id: '3',
      name: 'María Elena López',
      email: 'maria.lopez@email.com',
      position: 'Gerente de Proyecto Digital',
      experience: '10 años',
      score: 92,
      skills: ['Gestión de proyectos', 'Scrum', 'Leadership', 'Estrategia'],
      softSkills: ['Liderazgo', 'Comunicación', 'Toma de decisiones'],
      education: 'MBA - Administración de Empresas',
      prediction: 'Candidata ideal para roles gerenciales de alto nivel'
    },
    {
      id: '4',
      name: 'Roberto Silva Vega',
      email: 'roberto.silva@email.com',
      position: 'Diseñador UX/UI Senior',
      experience: '7 años',
      score: 87,
      skills: ['Figma', 'Adobe Creative', 'User Research', 'Prototipado'],
      softSkills: ['Creatividad', 'Empatía', 'Comunicación visual'],
      education: 'Licenciatura en Diseño Gráfico',
      prediction: 'Excelente para mejorar experiencia de usuario en productos'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredCandidates = mockCandidates
    .filter(candidate => 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'experience') return parseInt(b.experience) - parseInt(a.experience);
      return 0;
    });

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Análisis de Candidatos</CardTitle>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <Input
                placeholder="Buscar por nombre, posición o habilidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger className="w-48">
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
              Mostrando {filteredCandidates.length} candidatos de {mockCandidates.length} total
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">{candidate.name}</h3>
                        <p className="text-slate-600">{candidate.position}</p>
                        <p className="text-sm text-slate-500">{candidate.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-slate-700 mb-2">Información General</h4>
                        <p className="text-sm text-slate-600">Experiencia: {candidate.experience}</p>
                        <p className="text-sm text-slate-600">Educación: {candidate.education}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-700 mb-2">Habilidades Blandas</h4>
                        <div className="flex flex-wrap gap-1">
                          {candidate.softSkills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-slate-700 mb-2">Habilidades Técnicas</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <h4 className="font-semibold text-blue-800 mb-1">Predicción de IA</h4>
                      <p className="text-sm text-blue-700">{candidate.prediction}</p>
                    </div>
                  </div>

                  <div className="text-right ml-6">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(candidate.score)}`}>
                      {candidate.score}% Aptitud
                    </div>
                    <div className="mt-4 space-y-2">
                      <Link to={`/candidates/${candidate.id}`}>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                          Ver Detalles
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full">
                        Contactar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                No se encontraron candidatos
              </h3>
              <p className="text-slate-600">
                Intenta ajustar tus filtros o términos de búsqueda
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ResultsScreen;
