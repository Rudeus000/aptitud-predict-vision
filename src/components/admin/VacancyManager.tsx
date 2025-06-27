import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface Vacancy {
  vacante_id?: number;
  titulo: string;
  descripcion: string;
  requisitos: string;
  activa: boolean;
  fecha_creacion?: string;
}

const VacancyManager = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newVacancy, setNewVacancy] = useState({
    titulo: '',
    descripcion: '',
    requisitos: '',
    activa: true
  });

  // Simulación de carga de vacantes (puedes conectar a tu backend aquí)
  const loadVacancies = async () => {
    setLoading(true);
    // Aquí iría la llamada real al backend
    setTimeout(() => setLoading(false), 500);
  };

  const handleCreateVacancy = async () => {
    setLoading(true);
    try {
      // Aquí deberías hacer la petición real al backend
      // Por ahora simulamos éxito
      setTimeout(() => {
        setVacancies(prev => [
          { ...newVacancy, vacante_id: Date.now(), fecha_creacion: new Date().toISOString() },
          ...prev
        ]);
        toast({
          title: 'Vacante creada',
          description: 'La vacante se ha creado exitosamente',
        });
        setCreateModalOpen(false);
        setNewVacancy({ titulo: '', descripcion: '', requisitos: '', activa: true });
        setLoading(false);
      }, 800);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear la vacante',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Vacantes</h1>
        <Button onClick={() => setCreateModalOpen(true)}>
          Crear Nueva Vacante
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vacancies.map((vacancy) => (
          <Card key={vacancy.vacante_id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{vacancy.titulo}</CardTitle>
                <div className={`px-2 py-1 rounded text-xs ${vacancy.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{vacancy.activa ? 'Activa' : 'Inactiva'}</div>
              </div>
              <CardDescription>{vacancy.descripcion}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                <span className="font-semibold text-slate-700">Requisitos:</span>
                <div className="text-slate-600 text-sm whitespace-pre-line">{vacancy.requisitos}</div>
              </div>
              <div className="text-xs text-slate-400">Creada: {vacancy.fecha_creacion ? new Date(vacancy.fecha_creacion).toLocaleString() : ''}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nueva Vacante</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={newVacancy.titulo}
                  onChange={(e) => setNewVacancy(prev => ({ ...prev, titulo: e.target.value }))}
                  placeholder="Título de la vacante"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <select
                  id="estado"
                  value={newVacancy.activa ? 'activa' : 'inactiva'}
                  onChange={(e) => setNewVacancy(prev => ({ ...prev, activa: e.target.value === 'activa' }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="activa">Activa</option>
                  <option value="inactiva">Inactiva</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={newVacancy.descripcion}
                onChange={(e) => setNewVacancy(prev => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Descripción de la vacante"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requisitos">Requisitos</Label>
              <Textarea
                id="requisitos"
                value={newVacancy.requisitos}
                onChange={(e) => setNewVacancy(prev => ({ ...prev, requisitos: e.target.value }))}
                placeholder="Lista los requisitos principales"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateVacancy} disabled={!newVacancy.titulo || !newVacancy.descripcion || !newVacancy.requisitos || loading}>
                {loading ? 'Creando...' : 'Crear Vacante'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VacancyManager; 