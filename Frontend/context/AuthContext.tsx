// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

interface AuthContextType {
  userId: string | null;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  isAuthenticated: false,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUserId(decoded.id);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userId, isAuthenticated: !!userId, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
