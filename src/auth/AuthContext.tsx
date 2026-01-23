import React, { createContext, useContext, useState, useEffect } from "react";
import { apiSecurity } from "../api/axios";

type User = {
  id: string;
  role: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: string) => {
    try {
      const res = await apiSecurity.post("/login", { email, password, role });

      const { access_token, refresh_token, userId } = res.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", userId);
      setUser({
      id: userId,
      role,
      email,
    });
    } catch (err: any) {
      console.error(err.response || err);
      throw new Error("Identifiants invalides");
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

   // RESTORE SESSION
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("user_id");

    if (token && role && id) {
      setUser({ id, role });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);