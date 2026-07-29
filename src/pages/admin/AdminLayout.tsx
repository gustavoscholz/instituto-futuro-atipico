import { CalendarDays, ExternalLink, Handshake, LayoutDashboard, LogOut } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../auth/AdminAuthContext";

export default function AdminLayout() {
  const { signOut, session } = useAdminAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <img src="/assets/LOGO IFA COLORIDA COMPLETA FUNDO ESCURO.png" alt="Instituto Futuro Atípico" />
        <nav>
          <NavLink to="/admin" end>
            <LayoutDashboard /> Resumo
          </NavLink>
          <NavLink to="/admin/eventos">
            <CalendarDays /> Eventos
          </NavLink>
          <NavLink to="/admin/parceiros">
            <Handshake /> Parceiros
          </NavLink>
          <NavLink to="/" target="_blank">
            <ExternalLink /> Abrir site
          </NavLink>
        </nav>
        <div className="admin-sidebar-account">
          <span>{session?.user.email}</span>
          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate("/admin/login", { replace: true });
            }}
          >
            <LogOut /> Sair
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
