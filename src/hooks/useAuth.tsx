import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  usuario_id: string;
  nombre_usuario: string;
  rol: 'empleador' | 'candidato' | 'administrador';
  nombre_completo_perfil?: string;
  fecha_creacion?: string;
  ultimo_login?: string;
  metadata_usuario?: any;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, userData?: { username?: string; role?: string; full_name?: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile when user signs in
          setTimeout(async () => {
            await fetchUserProfile(session.user.id);
            await updateLastLogin(session.user.id);
          }, 0);
        } else {
          setUserProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
        updateLastLogin(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('usuario_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      // Type cast the rol property to ensure it matches our interface
      const profileData: UserProfile = {
        ...data,
        rol: data.rol as 'empleador' | 'candidato' | 'administrador'
      };

      setUserProfile(profileData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const updateLastLogin = async (userId: string) => {
    try {
      await supabase
        .from('usuarios')
        .update({ ultimo_login: new Date().toISOString() })
        .eq('usuario_id', userId);
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  };

  const signUp = async (email: string, password: string, userData?: { username?: string; role?: string; full_name?: string }) => {
    try {
      console.log('Iniciando registro con datos:', { email, userData });
      
      // Validación básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { error: { message: 'Formato de email inválido' } };
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData?.username || email.split('@')[0],
            role: userData?.role || 'candidato',
            full_name: userData?.full_name || email
          }
        }
      });

      if (error) {
        console.error('Error en signUp:', error);
        
        // Manejar errores específicos de Supabase
        if (error.message.includes('invalid')) {
          return { error: { message: 'El email proporcionado no es válido. Verifica que la URL del sitio en Supabase esté configurada correctamente.' } };
        }
        
        if (error.message.includes('already registered')) {
          return { error: { message: 'Este email ya está registrado en el sistema.' } };
        }
        
        return { error };
      }

      console.log('Registro exitoso:', data);
      
      // El trigger automático crea el perfil automáticamente
      // No necesitamos hacer nada más aquí
      if (data.user) {
        console.log('✅ Usuario registrado exitosamente');
        console.log('📧 Email:', data.user.email);
        console.log('🆔 ID:', data.user.id);
        console.log('📝 El perfil se creará automáticamente');
      }

      return { error: null };
    } catch (error) {
      console.error('Error inesperado en signUp:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setUserProfile(null);
      setSession(null);
      
      // Limpiar cualquier dato local adicional
      localStorage.removeItem('currentUser');
      sessionStorage.clear();
      
      // Redirigir al usuario a la página de login usando window.location
      // para asegurar una redirección completa
      window.location.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // Aún así, limpiar el estado local y redirigir
      setUser(null);
      setUserProfile(null);
      setSession(null);
      localStorage.removeItem('currentUser');
      sessionStorage.clear();
      window.location.replace('/');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      session, 
      isLoading, 
      signUp, 
      signIn, 
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
