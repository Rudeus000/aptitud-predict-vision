import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Survey {
  encuesta_id: number;
  titulo: string;
  descripcion: string;
  tipo_encuesta: string;
  preguntas: any[];
  activa: boolean;
  fecha_creacion: string;
}

const SurveyManager = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newSurvey, setNewSurvey] = useState({
    titulo: '',
    descripcion: '',
    tipo_encuesta: 'habilidades_blandas',
    preguntas: []
  });

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      const { data, error } = await supabase
        .from('encuestas')
        .select('*')
        .order('fecha_creacion', { ascending: false });

      if (error) throw error;
      setSurveys(data || []);
    } catch (error) {
      console.error('Error loading surveys:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las encuestas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSurvey = async () => {
    try {
      const { error } = await supabase
        .from('encuestas')
        .insert([{
          ...newSurvey,
          preguntas: newSurvey.preguntas,
          activa: true
        }]);

      if (error) throw error;

      toast({
        title: "Encuesta creada",
        description: "La encuesta se ha creado exitosamente",
      });

      setCreateModalOpen(false);
      setNewSurvey({
        titulo: '',
        descripcion: '',
        tipo_encuesta: 'habilidades_blandas',
        preguntas: []
      });
      loadSurveys();
    } catch (error) {
      console.error('Error creating survey:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la encuesta",
        variant: "destructive"
      });
    }
  };

  const toggleSurveyStatus = async (surveyId: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('encuestas')
        .update({ activa: !currentStatus })
        .eq('encuesta_id', surveyId);

      if (error) throw error;

      toast({
        title: "Estado actualizado",
        description: `La encuesta se ha ${!currentStatus ? 'activado' : 'desactivado'}`,
      });

      loadSurveys();
    } catch (error) {
      console.error('Error updating survey status:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la encuesta",
        variant: "destructive"
      });
    }
  };

  const addQuestion = () => {
    setNewSurvey(prev => ({
      ...prev,
      preguntas: [
        ...prev.preguntas,
        {
          id: `question_${Date.now()}`,
          question: '',
          options: ['', '', '', '']
        }
      ]
    }));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    setNewSurvey(prev => ({
      ...prev,
      preguntas: prev.preguntas.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    setNewSurvey(prev => ({
      ...prev,
      preguntas: prev.preguntas.map((q, i) => 
        i === questionIndex 
          ? { ...q, options: q.options.map((opt, j) => j === optionIndex ? value : opt) }
          : q
      )
    }));
  };

  const removeQuestion = (index: number) => {
    setNewSurvey(prev => ({
      ...prev,
      preguntas: prev.preguntas.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando encuestas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Encuestas</h1>
        <Button onClick={() => setCreateModalOpen(true)}>
          Crear Nueva Encuesta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {surveys.map((survey) => (
          <Card key={survey.encuesta_id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{survey.titulo}</CardTitle>
                <div className={`px-2 py-1 rounded text-xs ${
                  survey.activa 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {survey.activa ? 'Activa' : 'Inactiva'}
                </div>
              </div>
              <CardDescription>{survey.descripcion}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">
                  <strong>Tipo:</strong> {survey.tipo_encuesta}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Preguntas:</strong> {survey.preguntas.length}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Creada:</strong> {new Date(survey.fecha_creacion).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSurveyStatus(survey.encuesta_id, survey.activa)}
                >
                  {survey.activa ? 'Desactivar' : 'Activar'}
                </Button>
                <Button variant="outline" size="sm">
                  Ver Respuestas
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal para crear encuesta */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nueva Encuesta</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={newSurvey.titulo}
                  onChange={(e) => setNewSurvey(prev => ({ ...prev, titulo: e.target.value }))}
                  placeholder="Título de la encuesta"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Encuesta</Label>
                <select
                  id="tipo"
                  value={newSurvey.tipo_encuesta}
                  onChange={(e) => setNewSurvey(prev => ({ ...prev, tipo_encuesta: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="habilidades_blandas">Habilidades Blandas</option>
                  <option value="evaluacion_tecnica">Evaluación Técnica</option>
                  <option value="perfil_profesional">Perfil Profesional</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={newSurvey.descripcion}
                onChange={(e) => setNewSurvey(prev => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Descripción de la encuesta"
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Preguntas</Label>
                <Button type="button" onClick={addQuestion} variant="outline" size="sm">
                  Agregar Pregunta
                </Button>
              </div>

              {newSurvey.preguntas.map((question, qIndex) => (
                <Card key={qIndex} className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-2">
                        <Label>Pregunta {qIndex + 1}</Label>
                        <Input
                          value={question.question}
                          onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                          placeholder="Escribe la pregunta aquí"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Opciones de respuesta</Label>
                      {question.options.map((option, oIndex) => (
                        <Input
                          key={oIndex}
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          placeholder={`Opción ${oIndex + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateSurvey} disabled={!newSurvey.titulo || newSurvey.preguntas.length === 0}>
                Crear Encuesta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SurveyManager; 