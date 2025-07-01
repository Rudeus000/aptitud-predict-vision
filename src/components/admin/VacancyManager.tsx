import { useState, useEffect } from 'react';
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
  estado: string;
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);

  // Cargar vacantes reales desde el backend
  const loadVacancies = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/vacantes');
      const data = await res.json();
      setVacancies(data);
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudieron cargar las vacantes', variant: 'destructive' });
      setVacancies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVacancies();
  }, []);

  const handleCreateVacancy = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/vacantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: newVacancy.titulo,
          descripcion: newVacancy.descripcion,
          modalidad: 'Remoto',
          ubicacion: '',
          estado: newVacancy.activa ? 'activa' : 'inactiva',
          requisitos: newVacancy.requisitos
        })
      });
      if (!res.ok) throw new Error('Error al crear vacante');
      toast({ title: 'Vacante creada', description: 'La vacante se ha creado exitosamente' });
      setCreateModalOpen(false);
      setNewVacancy({ titulo: '', descripcion: '', requisitos: '', activa: true });
      await loadVacancies();
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo crear la vacante', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar vacante
  const handleDeleteVacancy = async (vacante_id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta vacante?')) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/vacantes/${vacante_id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar vacante');
      toast({ title: 'Vacante eliminada', description: 'La vacante ha sido eliminada' });
      await loadVacancies();
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar la vacante', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal de edición
  const handleEditVacancy = (vacancy: Vacancy) => {
    setEditingVacancy(vacancy);
    setEditModalOpen(true);
  };

  // Guardar cambios de edición
  const handleUpdateVacancy = async () => {
    if (!editingVacancy) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/vacantes/${editingVacancy.vacante_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: editingVacancy.titulo,
          descripcion: editingVacancy.descripcion,
          modalidad: 'Remoto',
          ubicacion: '',
          estado: editingVacancy.activa ? 'activa' : 'inactiva',
          requisitos: editingVacancy.requisitos
        })
      });
      if (!res.ok) throw new Error('Error al actualizar vacante');
      toast({ title: 'Vacante actualizada', description: 'La vacante ha sido actualizada' });
      setEditModalOpen(false);
      setEditingVacancy(null);
      await loadVacancies();
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo actualizar la vacante', variant: 'destructive' });
    } finally {
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
                <div className={`px-2 py-1 rounded text-xs ${vacancy.estado === 'activa' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{vacancy.estado === 'activa' ? 'Activa' : 'Inactiva'}</div>
              </div>
              <CardDescription>{vacancy.descripcion}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                <span className="font-semibold text-slate-700">Requisitos:</span>
                <div className="text-slate-600 text-sm whitespace-pre-line">{vacancy.requisitos}</div>
              </div>
              <div className="text-xs text-slate-400">Creada: {vacancy.fecha_creacion ? new Date(vacancy.fecha_creacion).toLocaleString() : ''}</div>
              <div className="flex space-x-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => handleEditVacancy(vacancy)}>Editar</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteVacancy(vacancy.vacante_id!)}>Eliminar</Button>
              </div>
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

      {/* Modal de edición */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Vacante</DialogTitle>
          </DialogHeader>
          {editingVacancy && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo-edit">Título</Label>
                  <Input
                    id="titulo-edit"
                    value={editingVacancy.titulo}
                    onChange={(e) => setEditingVacancy(prev => prev ? { ...prev, titulo: e.target.value } : prev)}
                    placeholder="Título de la vacante"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado-edit">Estado</Label>
                  <select
                    id="estado-edit"
                    value={editingVacancy.activa ? 'activa' : 'inactiva'}
                    onChange={(e) => setEditingVacancy(prev => prev ? { ...prev, activa: e.target.value === 'activa' } : prev)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="activa">Activa</option>
                    <option value="inactiva">Inactiva</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion-edit">Descripción</Label>
                <Textarea
                  id="descripcion-edit"
                  value={editingVacancy.descripcion}
                  onChange={(e) => setEditingVacancy(prev => prev ? { ...prev, descripcion: e.target.value } : prev)}
                  placeholder="Descripción de la vacante"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requisitos-edit">Requisitos</Label>
                <Textarea
                  id="requisitos-edit"
                  value={editingVacancy.requisitos}
                  onChange={(e) => setEditingVacancy(prev => prev ? { ...prev, requisitos: e.target.value } : prev)}
                  placeholder="Lista los requisitos principales"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateVacancy} disabled={!editingVacancy.titulo || !editingVacancy.descripcion || !editingVacancy.requisitos || loading}>
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VacancyManager; 