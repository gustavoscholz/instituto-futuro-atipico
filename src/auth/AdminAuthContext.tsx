import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type AdminAuthValue = {
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const verifyAdmin = useCallback(async (nextSession: Session | null) => {
    setSession(nextSession);
    if (!supabase || !nextSession) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.rpc("ifa_is_admin");
    setIsAdmin(!error && data === true);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => verifyAdmin(data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void verifyAdmin(nextSession);
    });

    return () => subscription.unsubscribe();
  }, [verifyAdmin]);

  const value = useMemo<AdminAuthValue>(
    () => ({
      session,
      isAdmin,
      loading,
      signIn: async (email, password) => {
        if (!supabase) throw new Error("O Supabase ainda não foi configurado.");
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await verifyAdmin(data.session);
        if (!data.session) throw new Error("Não foi possível iniciar a sessão.");
      },
      signOut: async () => {
        if (supabase) await supabase.auth.signOut();
        setSession(null);
        setIsAdmin(false);
      },
    }),
    [isAdmin, loading, session, verifyAdmin],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const value = useContext(AdminAuthContext);
  if (!value) throw new Error("useAdminAuth deve ser usado dentro de AdminAuthProvider.");
  return value;
}
