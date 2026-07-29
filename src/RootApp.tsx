import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AdminAuthProvider } from "./auth/AdminAuthContext";

const LandingPage = lazy(() => import("./App"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const PartnersPage = lazy(() => import("./pages/PartnersPage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const AdminEventsPage = lazy(() => import("./pages/admin/AdminEventsPage"));
const AdminPartnersPage = lazy(() => import("./pages/admin/AdminPartnersPage"));
const AdminGuard = lazy(() => import("./pages/admin/AdminGuard"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));

function RouteEnvironment() {
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = location.pathname === "/" ? "hidden" : "auto";
    document.title =
      location.pathname === "/"
        ? "Instituto Futuro Atípico"
        : location.pathname.startsWith("/admin")
          ? "Painel IFA"
          : location.pathname === "/eventos"
            ? "Eventos | IFA"
            : "Parceiros | IFA";
  }, [location.pathname]);

  return null;
}

function RouteFallback() {
  return (
    <div className="admin-auth-screen">
      <span className="page-spinner" />
      <p>Carregando...</p>
    </div>
  );
}

export default function RootApp() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <RouteEnvironment />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/eventos" element={<EventsPage />} />
            <Route path="/parceiros" element={<PartnersPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<AdminGuard />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/eventos" element={<AdminEventsPage />} />
                <Route path="/admin/parceiros" element={<AdminPartnersPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
