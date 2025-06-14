
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

      setUserProfile(data);
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            username: userData?.username || email.split('@')[0],
            role: userData?.role || 'candidato',
            full_name: userData?.full_name || email
          }
        }
      });

      return { error };
    } catch (error) {
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
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Legacy support - map userProfile to the old user format
  const legacyUser = userProfile ? {
    id: userProfile.usuario_id,
    nombre_usuario: userProfile.nombre_usuario,
    email: user?.email || '',
    role: userProfile.rol
  } : null;

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      session, 
      isLoading, 
      signUp, 
      signIn, 
      signOut,
      // Legacy support
      login: async ({ username, password }: { username: string; password: string }) => {
        const { error } = await signIn(username, password);
        return !error;
      },
      logout: signOut,
      user: legacyUser
    } as any}>
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
