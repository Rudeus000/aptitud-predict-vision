
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {user?.role === 'candidato' ? 'Portal del Candidato' : 'Consola de Reclutamiento'}
          </h2>
          <p className="text-slate-600">
            {user?.role === 'candidato' 
              ? 'Gestiona tu perfil y postulaciones' 
              : 'Análisis inteligente de candidatos con IA'}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.nombre_usuario.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="hidden md:block">{user?.nombre_usuario}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => console.log('Perfil')}>
              Mi Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Configuración')}>
              Configuración
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="text-red-600">
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
