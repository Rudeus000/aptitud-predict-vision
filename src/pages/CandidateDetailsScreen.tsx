
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

const CandidateDetailsScreen = () => {
  const { id } = useParams();

  // Mock data - en producción vendría de la API
  const candidate = {
    id: id,
    name: 'Ana García Martínez',
    email: 'ana.garcia@email.com',
    phone: '+52 555 123 4567',
    position: 'Desarrolladora Full Stack Senior',
    experience: '8 años',
    score: 94,
    education: 'Ing. en Sistemas - Universidad Nacional',
    skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL'],
    softSkills: [
      { name: 'Liderazgo', level: 92 },
      { name: 'Comunicación', level: 89 },
      { name: 'Trabajo en equipo', level: 95 },
      { name: 'Adaptabilidad', level: 87 },
      { name: 'Resolución de problemas', level: 91 },
      { name: 'Pensamiento crítico', level: 88 }
    ],
    workExperience: [
      {
        company: 'TechCorp Solutions',
        position: 'Lead Developer',
        period: '2020 - Presente',
        description: 'Liderazgo de equipo de 6 desarrolladores, arquitectura de microservicios, implementación de CI/CD.'
      },
      {
        company: 'Digital Innovations SA',
        position: 'Full Stack Developer',
        period: '2018 - 2020',
        description: 'Desarrollo de aplicaciones web escalables, APIs RESTful, optimización de bases de datos.'
      },
      {
        company: 'StartupXYZ',
        position: 'Frontend Developer',
        period: '2016 - 2018',
        description: 'Desarrollo de interfaces de usuario responsivas, integración con APIs, testing automatizado.'
      }
    ],
    prediction: {
      probability: 94,
      factors: [
        'Experiencia sólida en liderazgo técnico',
        'Excelentes habilidades de comunicación',
        'Historial probado en proyectos complejos',
        'Adaptabilidad demostrada en diferentes tecnologías',
        'Fuerte orientación a resultados'
      ],
      recommendations: [
        'Ideal para roles de arquitectura de software',
        'Candidata perfecta para liderar equipos técnicos',
        'Capacidad para mentoría de desarrolladores junior'
      ]
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-600';
    if (score >= 80) return 'from-blue-500 to-indigo-600';
    if (score >= 70) return 'from-orange-500 to-yellow-600';
    return 'from-red-500 to-pink-600';
  };

  const getSkillLevelColor = (level: number) => {
    if (level >= 90) return 'bg-green-500';
    if (level >= 80) return 'bg-blue-500';
    if (level >= 70) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/results">
            <Button variant="ghost" className="mb-4">
              ← Volver a candidatos
            </Button>
          </Link>
        </div>

        {/* Header del candidato */}
        <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-0">
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">{candidate.name}</h1>
                  <p className="text-xl text-slate-600 mt-1">{candidate.position}</p>
                  <div className="flex items-center space-x-4 mt-2 text-slate-500">
                    <span>📧 {candidate.email}</span>
                    <span>📱 {candidate.phone}</span>
                    <span>🎓 {candidate.experience} de experiencia</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${getScoreColor(candidate.score)} flex items-center justify-center text-white mb-2`}>
                  <div>
                    <div className="text-2xl font-bold">{candidate.score}%</div>
                    <div className="text-xs">Aptitud</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    Contactar
                  </Button>
                  <Button variant="outline" className="w-full">
                    Descargar CV
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Análisis Predictivo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🤖</span>
                  <span>Análisis Predictivo de IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Probabilidad de Éxito: {candidate.prediction.probability}%
                  </h4>
                  <div className="w-full bg-green-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${candidate.prediction.probability}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Factores Clave del Análisis:</h4>
                  <ul className="space-y-2">
                    {candidate.prediction.factors.map((factor, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-slate-700">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Recomendaciones:</h4>
                  <ul className="space-y-2">
                    {candidate.prediction.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">💡</span>
                        <span className="text-slate-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Experiencia Laboral */}
            <Card>
              <CardHeader>
                <CardTitle>Experiencia Laboral</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {candidate.workExperience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800">{exp.position}</h4>
                        <p className="text-blue-600 font-medium">{exp.company}</p>
                        <p className="text-sm text-slate-500 mb-2">{exp.period}</p>
                        <p className="text-slate-700">{exp.description}</p>
                      </div>
                    </div>
                    {index < candidate.workExperience.length - 1 && (
                      <Separator className="my-6" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Columna lateral */}
          <div className="space-y-6">
            {/* Habilidades Blandas */}
            <Card>
              <CardHeader>
                <CardTitle>Habilidades Blandas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.softSkills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-slate-500">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${getSkillLevelColor(skill.level)}`}
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Habilidades Técnicas */}
            <Card>
              <CardHeader>
                <CardTitle>Habilidades Técnicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Información Educativa */}
            <Card>
              <CardHeader>
                <CardTitle>Educación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium text-slate-800">{candidate.education}</p>
                  <p className="text-sm text-slate-600">Graduación: 2016</p>
                  <p className="text-sm text-slate-600">Promedio: 9.2/10</p>
                </div>
              </CardContent>
            </Card>

            {/* Acciones rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  📅 Programar Entrevista
                </Button>
                <Button className="w-full" variant="outline">
                  📊 Comparar con otros
                </Button>
                <Button className="w-full" variant="outline">
                  📝 Añadir notas
                </Button>
                <Button className="w-full" variant="outline">
                  📤 Compartir perfil
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CandidateDetailsScreen;
