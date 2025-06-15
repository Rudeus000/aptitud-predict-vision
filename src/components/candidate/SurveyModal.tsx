
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface SurveyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SurveyModal = ({ open, onOpenChange }: SurveyModalProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const questions = [
    {
      id: 'satisfaction',
      question: '¿Qué tan satisfecho estás con tu experiencia laboral actual?',
      options: ['Muy satisfecho', 'Satisfecho', 'Neutral', 'Insatisfecho', 'Muy insatisfecho']
    },
    {
      id: 'growth',
      question: '¿Sientes que tienes oportunidades de crecimiento profesional?',
      options: ['Definitivamente sí', 'Probablemente sí', 'No estoy seguro', 'Probablemente no', 'Definitivamente no']
    },
    {
      id: 'skills',
      question: '¿Con qué frecuencia actualizas tus habilidades técnicas?',
      options: ['Constantemente', 'Mensualmente', 'Trimestralmente', 'Anualmente', 'Raramente']
    }
  ];

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
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
        
        <div className="space-y-6">
          {questions.map((q, index) => (
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
                  {q.options.map((option, optIndex) => (
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
      </DialogContent>
    </Dialog>
  );
};

export default SurveyModal;
