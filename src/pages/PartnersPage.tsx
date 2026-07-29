import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BadgePercent, MapPin, Search, UsersRound } from "lucide-react";
import { PageFeedback, Pagination, PublicPageShell } from "../components/PublicPageShell";
import { contentImageUrl, listPublishedPartners } from "../services/content";
import {
  partnerCategoryLabels,
  type PartnerCategory,
  type PartnerRecord,
} from "../types/content";

const PAGE_SIZE = 12;

export default function PartnersPage() {
  const [partners, setPartners] = useState<PartnerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PartnerCategory | "">("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    listPublishedPartners()
      .then(setPartners)
      .catch((nextError: Error) => setError(nextError.message))
      .finally(() => setLoading(false));
  }, []);

  const states = useMemo(
    () => [...new Set(partners.map((partner) => partner.state).filter(Boolean))].sort(),
    [partners],
  );
  const cities = useMemo(
    () =>
      [
        ...new Set(
          partners
            .filter((partner) => !state || partner.state === state)
            .map((partner) => partner.city)
            .filter(Boolean),
        ),
      ].sort(),
    [partners, state],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    return partners.filter((partner) => {
      const text =
        `${partner.name} ${partner.specialty} ${partner.summary} ${partner.description} ${partner.city} ${partner.state}`.toLocaleLowerCase(
          "pt-BR",
        );
      return (
        (!normalizedQuery || text.includes(normalizedQuery)) &&
        (!category || partner.category === category) &&
        (!state || partner.state === state) &&
        (!city || partner.city === city)
      );
    });
  }, [category, city, partners, query, state]);

  useEffect(() => setPage(1), [category, city, query, state]);
  useEffect(() => {
    if (city && !cities.includes(city)) setCity("");
  }, [cities, city]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visiblePartners = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PublicPageShell
      eyebrow="REDE DE CONFIANÇA"
      title="Apoio especializado para cada etapa."
      description="Conheça profissionais, institutos e estabelecimentos alinhados ao cuidado de famílias atípicas."
    >
      <section className="content-tools partner-tools" aria-label="Filtros de parceiros">
        <label className="content-search">
          <Search aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar nome, especialidade ou cidade"
          />
        </label>
        <select value={category} onChange={(event) => setCategory(event.target.value as PartnerCategory | "")}>
          <option value="">Todas as categorias</option>
          {Object.entries(partnerCategoryLabels).map(([value, label]) => (
            <option value={value} key={value}>
              {label}
            </option>
          ))}
        </select>
        <select value={state} onChange={(event) => setState(event.target.value)}>
          <option value="">Todos os estados</option>
          {states.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
        <select value={city} onChange={(event) => setCity(event.target.value)}>
          <option value="">Todas as cidades</option>
          {cities.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
      </section>

      {loading ? (
        <PageFeedback type="loading">Carregando parceiros...</PageFeedback>
      ) : error ? (
        <PageFeedback type="error">{error}</PageFeedback>
      ) : visiblePartners.length === 0 ? (
        <PageFeedback type="empty">
          Ainda não há parceiros publicados para estes filtros.
        </PageFeedback>
      ) : (
        <>
          <section className="partner-grid" aria-label="Parceiros publicados">
            {visiblePartners.map((partner) => {
              const image = contentImageUrl(partner.image_path);
              return (
                <article className="partner-card" key={partner.id}>
                  <div className="partner-card-media">
                    {image ? (
                      <img src={image} alt={partner.image_alt || partner.name} />
                    ) : (
                      <UsersRound aria-hidden="true" />
                    )}
                    {partner.category === "estabelecimento_desconto" && (
                      <span>
                        <BadgePercent aria-hidden="true" /> Benefício IFA
                      </span>
                    )}
                  </div>
                  <div className="partner-card-body">
                    <p>{partnerCategoryLabels[partner.category]}</p>
                    <h2>{partner.name}</h2>
                    {partner.specialty && <strong>{partner.specialty}</strong>}
                    <span>{partner.summary || partner.description}</span>
                    <div className="partner-card-place">
                      <MapPin aria-hidden="true" />
                      {[partner.city, partner.state].filter(Boolean).join(" · ")}
                    </div>
                    {partner.discount_details && (
                      <div className="partner-benefit">{partner.discount_details}</div>
                    )}
                    <a href={partner.external_url} target="_blank" rel="noreferrer">
                      Conhecer parceiro <ArrowUpRight aria-hidden="true" />
                    </a>
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
