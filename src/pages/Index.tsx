
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthScreen from "@/components/auth/AuthScreen";

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    if (user.role === 'candidato') {
      return <Navigate to="/candidate/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthScreen />;
};

export default Index;
