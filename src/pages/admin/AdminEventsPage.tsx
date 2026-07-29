import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, Plus, Search, Star, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ImageCropField } from "../../components/ImageCropField";
import {
  contentImageUrl,
  deleteEvent,
  listAdminEvents,
  saveEvent,
} from "../../services/content";
import type { EventInput, EventRecord } from "../../types/content";

const eventSchema = z.object({
  title: z.string().trim().min(3, "Informe o título."),
  summary: z.string().max(220, "Use no máximo 220 caracteres."),
  description: z.string(),
  starts_at: z.string(),
  ends_at: z.string(),
  venue: z.string(),
  city: z.string(),
  state: z.string().max(2, "Use a sigla da UF.").or(z.literal("")),
  external_url: z.string().url("Informe uma URL válida.").or(z.literal("")),
  image_alt: z.string(),
  featured: z.boolean(),
  status: z.enum(["draft", "published"]),
});

type EventForm = z.infer<typeof eventSchema>;

const emptyEvent: EventForm = {
  title: "",
  summary: "",
  description: "",
  starts_at: "",
  ends_at: "",
  venue: "",
  city: "",
  state: "",
  external_url: "",
  image_alt: "",
  featured: false,
  status: "draft",
};

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const toLocalDateTime = (value: string | null) =>
  value ? new Date(value).toISOString().slice(0, 16) : "";

export default function AdminEventsPage() {
  const [records, setRecords] = useState<EventRecord[]>([]);
  const [editing, setEditing] = useState<EventRecord | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [image, setImage] = useState<Blob | null>(null);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<EventForm>({ resolver: zodResolver(eventSchema), defaultValues: emptyEvent });

  const load = async () => {
    setLoading(true);
    try {
      setRecords(await listAdminEvents());
      setError("");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Falha ao carregar.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    const guard = (event: BeforeUnloadEvent) => {
      if (editorOpen && isDirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [editorOpen, isDirty]);

  const filtered = useMemo(() => {
    const normalized = query.toLocaleLowerCase("pt-BR");
    return records.filter((record) =>
      `${record.title} ${record.city} ${record.status}`.toLocaleLowerCase("pt-BR").includes(normalized),
    );
  }, [query, records]);

  const openNew = () => {
    setEditing(null);
    setImage(null);
    reset(emptyEvent);
    setEditorOpen(true);
    setNotice("");
    setError("");
  };

  const openEdit = (record: EventRecord) => {
    setEditing(record);
    setImage(null);
    reset({
      title: record.title,
      summary: record.summary,
      description: record.description,
      starts_at: toLocalDateTime(record.starts_at),
      ends_at: toLocalDateTime(record.ends_at),
      venue: record.venue,
      city: record.city,
      state: record.state,
      external_url: record.external_url,
      image_alt: record.image_alt,
      featured: record.featured,
      status: record.status,
    });
    setEditorOpen(true);
    setNotice("");
    setError("");
  };

  const closeEditor = () => {
    if (isDirty && !window.confirm("Descartar as alterações não salvas?")) return;
    setEditorOpen(false);
    setEditing(null);
    setImage(null);
  };

  const submit = async (values: EventForm) => {
    setError("");

    const input: EventInput = {
      slug: editing?.slug || `${slugify(values.title)}-${Date.now().toString(36)}`,
      title: values.title.trim(),
      summary: values.summary.trim(),
      description: values.description.trim(),
      starts_at: values.starts_at ? new Date(values.starts_at).toISOString() : null,
      ends_at: values.ends_at ? new Date(values.ends_at).toISOString() : null,
      venue: values.venue.trim(),
      city: values.city.trim(),
      state: values.state.trim().toUpperCase(),
      external_url: values.external_url.trim(),
      image_path: editing?.image_path ?? "",
      image_alt: values.image_alt.trim(),
      featured: values.featured,
      status: values.status,
    };

    try {
      await saveEvent(input, {
        id: editing?.id,
        image: image ?? undefined,
        previousImagePath: editing?.image_path,
      });
      setNotice(editing ? "Evento atualizado." : "Evento criado.");
      setEditorOpen(false);
      setEditing(null);
      setImage(null);
      reset(emptyEvent);
      await load();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Não foi possível salvar.");
    }
  };

  return (
    <>
      <header className="admin-page-header">
        <div>
          <p>AGENDA</p>
          <h1>Eventos</h1>
          <span>Cadastre encontros e publique mesmo que alguns detalhes ainda estejam a confirmar.</span>
        </div>
        <button className="admin-button" type="button" onClick={openNew}>
          <Plus /> Novo evento
        </button>
      </header>

      {notice && <div className="admin-alert admin-alert-success">{notice}</div>}
      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      <div className="admin-table-tools">
        <label>
          <Search />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar eventos" />
        </label>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Evento</th>
              <th>Data</th>
              <th>Local</th>
              <th>Status</th>
              <th aria-label="Ações" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5}>Carregando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5}>Nenhum evento encontrado.</td></tr>
            ) : (
              filtered.map((record) => (
                <tr key={record.id}>
                  <td>
                    <div className="admin-record-title">
                      {record.featured && <Star />}
                      <div>
                        <strong>{record.title}</strong>
                        <span>{record.summary || "Sem resumo"}</span>
                      </div>
                    </div>
                  </td>
                  <td>{record.starts_at ? new Date(record.starts_at).toLocaleDateString("pt-BR") : "A confirmar"}</td>
                  <td>{[record.city, record.state].filter(Boolean).join(" / ") || "A confirmar"}</td>
                  <td><span className={`admin-status admin-status-${record.status}`}>{record.status === "published" ? "Publicado" : "Rascunho"}</span></td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" title="Editar" onClick={() => openEdit(record)}><Edit3 /></button>
                      <button
                        type="button"
                        title="Excluir"
                        onClick={async () => {
                          if (!window.confirm(`Excluir o evento "${record.title}"?`)) return;
                          try {
                            await deleteEvent(record);
                            setNotice("Evento excluído.");
                            await load();
                          } catch (nextError) {
                            setError(nextError instanceof Error ? nextError.message : "Falha ao excluir.");
                          }
                        }}
                      ><Trash2 /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editorOpen && (
        <div className="admin-editor-backdrop" role="presentation">
          <section className="admin-editor" role="dialog" aria-modal="true" aria-label="Editor de evento">
            <header>
              <div>
                <p>{editing ? "EDITAR EVENTO" : "NOVO EVENTO"}</p>
                <h2>{editing?.title || "Cadastrar evento"}</h2>
              </div>
              <button type="button" className="admin-icon-button" onClick={closeEditor}><X /></button>
            </header>
            <form onSubmit={handleSubmit(submit)}>
              <div className="admin-editor-grid">
                <div className="admin-form-fields">
                  <label className="admin-field admin-field-wide">
                    Título (obrigatório)
                    <input {...register("title")} />
                    {errors.title && <small>{errors.title.message}</small>}
                  </label>
                  <label className="admin-field admin-field-wide">
                    Resumo (opcional)
                    <textarea rows={2} {...register("summary")} />
                    {errors.summary && <small>{errors.summary.message}</small>}
                  </label>
                  <label className="admin-field admin-field-wide">
                    Descrição (opcional)
                    <textarea rows={7} {...register("description")} />
                    {errors.description && <small>{errors.description.message}</small>}
                  </label>
                  <label className="admin-field">
                    Início (opcional)
                    <input type="datetime-local" {...register("starts_at")} />
                  </label>
                  <label className="admin-field">
                    Término (opcional)
                    <input type="datetime-local" {...register("ends_at")} />
                  </label>
                  <label className="admin-field">
                    Local (opcional)
                    <input {...register("venue")} />
                  </label>
                  <label className="admin-field">
                    Cidade (opcional)
                    <input {...register("city")} />
                  </label>
                  <label className="admin-field">
                    UF (opcional)
                    <input maxLength={2} {...register("state")} />
                  </label>
                  <label className="admin-field admin-field-wide">
                    Link externo (opcional)
                    <input type="url" {...register("external_url")} />
                    {errors.external_url && <small>{errors.external_url.message}</small>}
                  </label>
                  <label className="admin-field admin-field-wide">
                    Texto alternativo da imagem (opcional)
                    <input {...register("image_alt")} />
                  </label>
                  <label className="admin-field">
                    Status
                    <select {...register("status")}>
                      <option value="draft">Rascunho</option>
                      <option value="published">Publicado</option>
                    </select>
                  </label>
                  <label className="admin-checkbox">
                    <input type="checkbox" {...register("featured")} /> Destacar evento
                  </label>
                </div>
                <div className="admin-optional-media">
                  <span>Imagem (opcional)</span>
                  <ImageCropField
                    initialUrl={editing?.image_path ? contentImageUrl(editing.image_path) : ""}
                    onChange={setImage}
                  />
                </div>
              </div>
              <footer>
                <button className="admin-button admin-button-secondary" type="button" onClick={closeEditor}>Cancelar</button>
                <button className="admin-button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Salvando..." : "Salvar evento"}</button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
