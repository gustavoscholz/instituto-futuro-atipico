import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { RouteSeo } from "./components/RouteSeo";

const LandingPage = lazy(() => import("./App"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const PartnersPage = lazy(() => import("./pages/PartnersPage"));
const AdminApp = lazy(() => import("./pages/admin/AdminApp"));

function RouteEnvironment() {
  const location = useLocation();

  useEffect(() => {
    // The landing page owns its responsive overflow behavior. Content and
    // administration routes always use regular document scrolling.
    if (location.pathname !== "/") {
      document.body.style.overflow = "auto";
    }
  }, [location.pathname]);

  return null;
}

function RouteFallback() {
  return (
    <div
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        background: "#052f4a",
        color: "white",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <p>Carregando...</p>
    </div>
  );
}

export default function RootApp() {
  return (
    <BrowserRouter>
      <RouteEnvironment />
      <RouteSeo />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/eventos" element={<EventsPage />} />
          <Route path="/parceiros" element={<PartnersPage />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
