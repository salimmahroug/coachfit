import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/api";
import { User, Credentials, UserData, ProfileData } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: Credentials) => Promise<User>;
  register: (userData: UserData) => Promise<User>;
  logout: () => void;
  updateProfile: (profileData: ProfileData) => Promise<User>;
  clearError: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          // Vérifier que le token est toujours valide
          const response = await authService.getProfile();
          if (response.success) {
            setUser(response.user);
          } else {
            // Token invalide, nettoyer
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        } catch (error: unknown) {
          console.error("Erreur de vérification auth:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: Credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(credentials);

      if (response.success) {
        setUser(response.user);
        return response;
      } else {
        throw new Error(response.message || "Échec de la connexion");
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      setError(err.message || "Erreur de connexion");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: UserData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.register(userData);

      if (response.success) {
        setUser(response.user);
        return response;
      } else {
        throw new Error(response.message || "Échec de l'inscription");
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      setError(err.message || "Erreur d'inscription");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const clearError = () => {
    setError(null);
  };

  const updateProfile = async (profileData: ProfileData) => {
    try {
      // TODO: Implémenter l'API de mise à jour du profil si nécessaire
      const updatedUser = { ...user, ...profileData } as User;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error: unknown) {
      const err = error as { message?: string };
      setError(err.message || "Erreur de mise à jour");
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
