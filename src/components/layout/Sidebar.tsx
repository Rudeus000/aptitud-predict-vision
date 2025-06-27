import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Upload, 
  Users, 
  Lightbulb, 
  FileText, 
  ChevronLeft, 
  ChevronRight,
  Brain,
  Briefcase
} from 'lucide-react';

const Sidebar = () => {
  const { userProfile } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getMenuItems = () => {
    if (userProfile?.rol === 'candidato') {
      return [
        { name: 'Dashboard', path: '/candidate/dashboard', icon: BarChart3 },
        { name: 'Subir CV', path: '/candidate/upload', icon: FileText },
      ];
    }
    
    // Para administradores y empleadores
    const items = [
      { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
      { name: 'Subir CVs', path: '/upload', icon: Upload },
      { name: 'Candidatos', path: '/results', icon: Users },
      { name: 'Recomendaciones', path: '/recommendations', icon: Lightbulb },
    ];
    if (userProfile?.rol === 'administrador' || userProfile?.rol === 'empleador') {
      items.splice(1, 0, { name: 'Vacantes', path: '/admin/vacantes', icon: Briefcase });
    }
    return items;
  };

  return (
    <div className={cn(
      "bg-white shadow-xl border-r border-slate-200 transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-slate-200 relative">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-slate-800">Aptitud</h1>
              <p className="text-xs text-slate-500">Analytica</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute right-2 top-4 w-6 h-6 p-0 hover:bg-slate-100"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {getMenuItems().map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-blue-50",
                location.pathname === item.path ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600" : "text-slate-600"
              )}
            >
              <IconComponent className="h-5 w-5" />
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className={cn(
          "flex items-center space-x-3 px-3 py-2",
          isCollapsed ? "justify-center" : ""
        )}>
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {userProfile?.nombre_usuario?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                {userProfile?.nombre_usuario || 'Usuario'}
              </p>
              <p className="text-xs text-slate-500 capitalize">
                {userProfile?.rol || 'Usuario'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
