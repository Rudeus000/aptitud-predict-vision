
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AlertsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AlertsModal = ({ open, onOpenChange }: AlertsModalProps) => {
  const [alerts, setAlerts] = useState({
    newOpportunities: true,
    applicationUpdates: true,
    interviewReminders: true,
    profileRecommendations: false,
    weeklyReport: false
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const alertConfig = [
    {
      key: 'newOpportunities',
      title: 'Nuevas Oportunidades',
      description: 'Recibe notificaciones cuando haya nuevas vacantes que coincidan con tu perfil'
    },
    {
      key: 'applicationUpdates',
      title: 'Actualizaciones de Postulaciones',
      description: 'Notificaciones sobre cambios en el estado de tus aplicaciones'
    },
    {
      key: 'interviewReminders',
      title: 'Recordatorios de Entrevistas',
      description: 'Recordatorios automáticos antes de tus entrevistas programadas'
    },
    {
      key: 'profileRecommendations',
      title: 'Recomendaciones de Perfil',
      description: 'Sugerencias de IA para mejorar tu perfil profesional'
    },
    {
      key: 'weeklyReport',
      title: 'Reporte Semanal',
      description: 'Resumen semanal de tu actividad y progreso'
    }
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configuración guardada",
        description: "Tus preferencias de notificaciones han sido actualizadas.",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "Hubo un problema al guardar tu configuración. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>🔔 Configurar Alertas y Notificaciones</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {alertConfig.map((alert) => (
            <Card key={alert.key}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">{alert.title}</Label>
                    <p className="text-sm text-slate-600">{alert.description}</p>
                  </div>
                  <Switch
                    checked={alerts[alert.key as keyof typeof alerts]}
                    onCheckedChange={(checked) => 
                      setAlerts(prev => ({ ...prev, [alert.key]: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex space-x-2 pt-4">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="flex-1"
            >
              {saving ? 'Guardando...' : 'Guardar Configuración'}
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

export default AlertsModal;
