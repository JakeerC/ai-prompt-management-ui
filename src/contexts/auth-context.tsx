"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import type { UserRole } from "@/types/auth";
import { hasMinRole } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole;
  loading: boolean;
  signOut: () => Promise<void>;
  hasRole: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: "VIEWER",
  loading: true,
  signOut: async () => {},
  hasRole: () => false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole>("VIEWER");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const extractRole = useCallback((user: User | null): UserRole => {
    if (!user) return "VIEWER";
    const appRole = user.app_metadata?.role || user.user_metadata?.role;
    if (appRole && ["ADMIN", "REVIEWER", "AUTHOR", "VIEWER"].includes(appRole.toUpperCase())) {
      return appRole.toUpperCase() as UserRole;
    }
    return "VIEWER";
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setRole(extractRole(session?.user ?? null));
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setRole(extractRole(session?.user ?? null));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase, extractRole]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const checkRole = useCallback(
    (requiredRole: UserRole) => hasMinRole(role, requiredRole),
    [role]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        loading,
        signOut,
        hasRole: checkRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
