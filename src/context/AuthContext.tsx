import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { User } from "@/types";
import { db } from "@/data/db";

interface AuthContextValue {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "acadflow_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as User;
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = useCallback(async (email: string, password: string) => {
    try {
      const user = await db.users
        .where("email")
        .equals(email.trim().toLowerCase())
        .first();

      if (user && user.password === password) {
        const { password: _pw, ...userWithoutPassword } = user;
        void _pw;
        setCurrentUser(userWithoutPassword as User);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
        return { success: true };
      }
      return { success: false, error: "Invalid email or password." };
    } catch (err) {
      console.error("Login query failed:", err);
      return { success: false, error: "Invalid email or password." };
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
