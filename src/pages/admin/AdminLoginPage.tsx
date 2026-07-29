import { useState, type FormEvent } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../auth/AdminAuthContext";
import { isSupabaseConfigured } from "../../lib/supabase";

export default function AdminLoginPage() {
  const { signIn, session, isAdmin, loading } = useAdminAuth();
  const [email, setEmail] = useState("aguiadigitalbr@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!loading && session && isAdmin) return <Navigate to="/admin" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(email, password);
      const destination =
        (location.state as { from?: string } | null)?.from ?? "/admin";
      navigate(destination, { replace: true });
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Não foi possível entrar.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <section>
        <img src="/assets/LOGO IFA COLORIDA COMPLETA.png" alt="Instituto Futuro Atípico" />
        <p>PAINEL ADMINISTRATIVO</p>
        <h1>Gerencie eventos e parceiros.</h1>
        <span>Conteúdo publicado com controle de acesso e revisão antes de ir ao ar.</span>

        {!isSupabaseConfigured && (
          <div className="admin-alert">
            Configure o arquivo <code>.env.local</code> antes de entrar.
          </div>
        )}
        {error && <div className="admin-alert admin-alert-error">{error}</div>}

        <form onSubmit={submit}>
          <label>
            E-mail
            <div>
              <Mail />
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </label>
          <label>
            Senha
            <div>
              <LockKeyhole />
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
          </label>
          <button type="submit" disabled={submitting || !isSupabaseConfigured}>
            {submitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </div>
  );
}
