import { useEffect, useMemo, useState } from "react";
import { CalendarDays, FileEdit, Handshake, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { listAdminEvents, listAdminPartners } from "../../services/content";
import type { EventRecord, PartnerRecord } from "../../types/content";

export default function AdminDashboardPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [partners, setPartners] = useState<PartnerRecord[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([listAdminEvents(), listAdminPartners()])
      .then(([nextEvents, nextPartners]) => {
        setEvents(nextEvents);
        setPartners(nextPartners);
      })
      .catch((nextError: Error) => setError(nextError.message));
  }, []);

  const counters = useMemo(
    () => ({
      published:
        events.filter((item) => item.status === "published").length +
        partners.filter((item) => item.status === "published").length,
      drafts:
        events.filter((item) => item.status === "draft").length +
        partners.filter((item) => item.status === "draft").length,
    }),
    [events, partners],
  );

  return (
    <>
      <header className="admin-page-header">
        <div>
          <p>VISÃO GERAL</p>
          <h1>Conteúdo do Instituto</h1>
          <span>Acompanhe publicações e mantenha as páginas atualizadas.</span>
        </div>
      </header>
      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      <section className="admin-metrics">
        <article>
          <CalendarDays />
          <div>
            <span>Eventos</span>
            <strong>{events.length}</strong>
          </div>
        </article>
        <article>
          <Handshake />
          <div>
            <span>Parceiros</span>
            <strong>{partners.length}</strong>
          </div>
        </article>
        <article>
          <Send />
          <div>
            <span>Publicados</span>
            <strong>{counters.published}</strong>
          </div>
        </article>
        <article>
          <FileEdit />
          <div>
            <span>Rascunhos</span>
            <strong>{counters.drafts}</strong>
          </div>
        </article>
      </section>
      <section className="admin-quick-links">
        <Link to="/admin/eventos">
          <CalendarDays />
          <div>
            <strong>Gerenciar eventos</strong>
            <span>Cadastre datas, locais, imagens e links externos.</span>
          </div>
        </Link>
        <Link to="/admin/parceiros">
          <Handshake />
          <div>
            <strong>Gerenciar parceiros</strong>
            <span>Organize a rede por categoria, estado e cidade.</span>
          </div>
        </Link>
      </section>
    </>
  );
}
