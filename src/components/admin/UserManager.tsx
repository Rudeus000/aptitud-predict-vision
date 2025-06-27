import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface User {
  usuario_id: string;
  nombre_usuario: string;
  nombre_completo_perfil: string;
  rol: 'empleador' | 'candidato' | 'administrador';
  fecha_creacion: string;
  ultimo_login: string;
}

const UserManager = () => {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    username: '',
    full_name: '',
    role: 'empleador' as 'empleador' | 'administrador'
  });

  useEffect(() => {
    // Solo administradores pueden acceder a esta funcionalidad
    if (userProfile?.rol !== 'administrador') {
      toast({
        title: "Acceso denegado",
        description: "Solo los administradores pueden gestionar usuarios",
        variant: "destructive"
      });
      return;
    }
    
    loadUsers();
  }, [userProfile]);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('fecha_creacion', { ascending: false });

      if (error) throw error;
      
      // Hacer cast correcto de los datos
      const typedUsers: User[] = (data || []).map(user => ({
        ...user,
        rol: user.rol as 'empleador' | 'candidato' | 'administrador'
      }));
      
      setUsers(typedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        email_confirm: true,
        user_metadata: {
          username: newUser.username,
          role: newUser.role,
          full_name: newUser.full_name
        }
      });

      if (authError) throw authError;

      toast({
        title: "Usuario creado",
        description: `Se ha creado exitosamente la cuenta de ${newUser.role}`,
      });

      setCreateModalOpen(false);
      setNewUser({
        email: '',
        password: '',
        username: '',
        full_name: '',
        role: 'empleador'
      });
      loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el usuario",
        variant: "destructive"
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'administrador': return 'bg-red-100 text-red-800';
      case 'empleador': return 'bg-blue-100 text-blue-800';
      case 'candidato': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'administrador': return 'Administrador';
      case 'empleador': return 'Empleador';
      case 'candidato': return 'Candidato';
      default: return role;
    }
  };

  if (userProfile?.rol !== 'administrador') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">🚫</div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Acceso Denegado</h2>
          <p className="text-slate-600">Solo los administradores pueden acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <Button onClick={() => setCreateModalOpen(true)}>
          Crear Nuevo Usuario
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.usuario_id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{user.nombre_usuario}</CardTitle>
                <div className={`px-2 py-1 rounded text-xs ${getRoleColor(user.rol)}`}>
                  {getRoleLabel(user.rol)}
                </div>
              </div>
              <CardDescription>{user.nombre_completo_perfil}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">
                  <strong>ID:</strong> {user.usuario_id.slice(0, 8)}...
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Creado:</strong> {new Date(user.fecha_creacion).toLocaleDateString()}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Último login:</strong> {user.ultimo_login ? new Date(user.ultimo_login).toLocaleDateString() : 'Nunca'}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Ver Detalles
                </Button>
                {user.rol !== 'administrador' && (
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal para crear usuario */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                placeholder="usuario@empresa.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input
                id="username"
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                placeholder="usuario"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre Completo</Label>
              <Input
                id="full_name"
                type="text"
                value={newUser.full_name}
                onChange={(e) => setNewUser(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Nombre Completo"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Tipo de Usuario</Label>
              <Select value={newUser.role} onValueChange={(value: 'empleador' | 'administrador') => setNewUser(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empleador">Empleador</SelectItem>
                  <SelectItem value="administrador">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-700">
                <strong>⚠️ Importante:</strong> El usuario recibirá un email para confirmar su cuenta.
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateUser} 
                disabled={!newUser.email || !newUser.password || !newUser.username || !newUser.full_name}
              >
                Crear Usuario
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManager; 