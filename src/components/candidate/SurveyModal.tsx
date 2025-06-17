import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SurveyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SurveyModal = ({ open, onOpenChange }: SurveyModalProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [encuesta, setEncuesta] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEncuesta = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('encuestas')
        .select('*')
        .eq('activa', true)
        .single();
      if (error) {
        setEncuesta(null);
      } else {
        setEncuesta(data);
      }
      setLoading(false);
    };
    if (open) fetchEncuesta();
  }, [open]);

  const questions = encuesta?.preguntas || [];

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast({
        title: "Encuesta incompleta",
        description: "Por favor responde todas las preguntas.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // 1. Obtener el usuario autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      // 2. Obtener la encuesta activa (o usa 1 si solo tienes una)
      const { data: encuesta } = await supabase
        .from('encuestas')
        .select('*')
        .eq('activa', true)
        .single();

      // 3. Verificar si ya existe una respuesta para este usuario y encuesta
      const { data: respuestaExistente } = await supabase
        .from('respuestas_encuesta')
        .select('respuesta_id')
        .eq('encuesta_id', encuesta?.encuesta_id || 1)
        .eq('usuario_respuesta_id', user.id)
        .maybeSingle();

      if (respuestaExistente) {
        toast({
          title: "Ya has respondido esta encuesta",
          description: "Solo puedes responder una vez.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      // 4. Insertar la respuesta en la tabla
      const { error } = await supabase
        .from('respuestas_encuesta')
        .insert([{
          encuesta_id: encuesta?.encuesta_id || 1,
          usuario_respuesta_id: user.id,
          respuestas: answers
        }]);

      if (error) throw error;

      toast({
        title: "Encuesta completada",
        description: "Gracias por tu feedback. Esto nos ayuda a mejorar tu experiencia.",
      });

      onOpenChange(false);
      setAnswers({});
    } catch (error) {
      toast({
        title: "Error al enviar",
        description: "Hubo un problema al enviar tu encuesta. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>📝 Encuesta de Perfil Profesional</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="text-center py-8">Cargando encuesta...</div>
        ) : !encuesta ? (
          <div className="text-center py-8 text-red-500">No hay encuestas disponibles en este momento.</div>
        ) : (
          <div className="space-y-6">
            {questions.map((q: any, index: number) => (
              <Card key={q.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {index + 1}. {q.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={answers[q.id] || ''}
                    onValueChange={(value) => setAnswers(prev => ({ ...prev, [q.id]: value }))}
                  >
                    {q.options.map((option: string, optIndex: number) => (
                      <div key={optIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${q.id}-${optIndex}`} />
                        <Label htmlFor={`${q.id}-${optIndex}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}
            <div className="flex space-x-2">
              <Button 
                onClick={handleSubmit} 
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? 'Enviando...' : 'Completar Encuesta'}
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SurveyModal;
