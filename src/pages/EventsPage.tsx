import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CalendarDays, MapPin, Search } from "lucide-react";
import { PageFeedback, Pagination, PublicPageShell } from "../components/PublicPageShell";
import { contentImageUrl, listPublishedEvents } from "../services/content";
import type { EventRecord } from "../types/content";

const PAGE_SIZE = 9;

const eventDate = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

const eventTimestamp = (event: EventRecord) => {
  if (!event.starts_at) return null;
  const timestamp = new Date(event.starts_at).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

const compareEvents = (left: EventRecord, right: EventRecord) => {
  const leftTimestamp = eventTimestamp(left);
  const rightTimestamp = eventTimestamp(right);

  if (leftTimestamp === null && rightTimestamp !== null) return 1;
  if (leftTimestamp !== null && rightTimestamp === null) return -1;
  if (left.featured !== right.featured) return left.featured ? -1 : 1;
  if (leftTimestamp !== null && rightTimestamp !== null) {
    return leftTimestamp - rightTimestamp;
  }
  return left.title.localeCompare(right.title, "pt-BR");
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState<"upcoming" | "past" | "all">("upcoming");
  const [page, setPage] = useState(1);

  useEffect(() => {
    listPublishedEvents()
      .then(setEvents)
      .catch((nextError: Error) => setError(nextError.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const now = Date.now();
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    return events
      .filter((event) => {
        const startsAt = eventTimestamp(event);
        const periodMatches =
          period === "all" ||
          (period === "upcoming"
            ? startsAt === null || startsAt >= now
            : startsAt !== null && startsAt < now);
        const text = `${event.title} ${event.summary} ${event.description} ${event.city} ${event.state}`.toLocaleLowerCase(
          "pt-BR",
        );
        return periodMatches && (!normalizedQuery || text.includes(normalizedQuery));
      })
      .sort(compareEvents);
  }, [events, period, query]);

  useEffect(() => setPage(1), [period, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visibleEvents = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PublicPageShell
      eyebrow="AGENDA IFA"
      title="Encontros que informam, acolhem e conectam."
      description="Consulte palestras, encontros e ações voltadas para famílias atípicas."
    >
      <section className="content-tools" aria-label="Filtros de eventos">
        <label className="content-search">
          <Search aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar eventos, cidades ou temas"
          />
        </label>
        <div className="content-segments" aria-label="Período">
          {[
            ["upcoming", "Próximos"],
            ["past", "Anteriores"],
            ["all", "Todos"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={period === value ? "is-active" : ""}
              onClick={() => setPeriod(value as typeof period)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <PageFeedback type="loading">Carregando eventos...</PageFeedback>
      ) : error ? (
        <PageFeedback type="error">{error}</PageFeedback>
      ) : visibleEvents.length === 0 ? (
        <PageFeedback type="empty">
          Ainda não há eventos publicados para este filtro. Novas datas serão divulgadas aqui.
        </PageFeedback>
      ) : (
        <>
          <section className="event-grid" aria-label="Eventos publicados">
            {visibleEvents.map((event) => {
              const image = contentImageUrl(event.image_path);
              return (
                <article className="event-card" key={event.id}>
                  <div className="event-card-media">
                    {image ? (
                      <img src={image} alt={event.image_alt || event.title} />
                    ) : (
                      <CalendarDays aria-hidden="true" />
                    )}
                    {event.featured && <span>Destaque</span>}
                  </div>
                  <div className="event-card-body">
                    <p className="event-card-date">
                      {event.starts_at
                        ? eventDate.format(new Date(event.starts_at))
                        : "Data a confirmar"}
                    </p>
                    <h2>{event.title}</h2>
                    <p>{event.summary || event.description || "Mais informações em breve."}</p>
                    <div className="event-card-place">
                      <MapPin aria-hidden="true" />
                      <span>
                        {[event.venue, event.city, event.state].filter(Boolean).join(" · ") ||
                          "Local a confirmar"}
                      </span>
                    </div>
                    {event.external_url ? (
                      <a
                        className="event-card-cta"
                        href={event.external_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ver evento <ArrowUpRight aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="event-card-cta event-card-cta-disabled" aria-disabled="true">
                        Mais informações em breve
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
        </>
      )}
    </PublicPageShell>
  );
}
