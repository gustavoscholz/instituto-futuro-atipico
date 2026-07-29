import { zodResolver } from "@hookform/resolvers/zod";
import { BadgePercent, Edit3, Plus, Search, Star, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ImageCropField } from "../../components/ImageCropField";
import {
  contentImageUrl,
  deletePartner,
  listAdminPartners,
  savePartner,
} from "../../services/content";
import {
  partnerCategoryLabels,
  type PartnerInput,
  type PartnerRecord,
} from "../../types/content";

const partnerSchema = z.object({
  name: z.string().min(3, "Informe o nome."),
  category: z.enum(["medico", "instituto", "estabelecimento_desconto"]),
  specialty: z.string(),
  summary: z.string().max(220, "Use no máximo 220 caracteres."),
  description: z.string().min(10, "Informe uma descrição."),
  city: z.string(),
  state: z.string().max(2, "Use a sigla da UF.").or(z.literal("")),
  address: z.string(),
  external_url: z.string().url("Informe uma URL válida.").or(z.literal("")),
  discount_details: z.string(),
  image_alt: z.string(),
  featured: z.boolean(),
  status: z.enum(["draft", "published"]),
});

type PartnerForm = z.infer<typeof partnerSchema>;

const emptyPartner: PartnerForm = {
  name: "",
  category: "medico",
  specialty: "",
  summary: "",
  description: "",
  city: "",
  state: "",
  address: "",
  external_url: "",
  discount_details: "",
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

export default function AdminPartnersPage() {
  const [records, setRecords] = useState<PartnerRecord[]>([]);
  const [editing, setEditing] = useState<PartnerRecord | null>(null);
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
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<PartnerForm>({
    resolver: zodResolver(partnerSchema),
    defaultValues: emptyPartner,
  });
  const selectedCategory = watch("category");

  const load = async () => {
    setLoading(true);
    try {
      setRecords(await listAdminPartners());
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
      `${record.name} ${record.specialty} ${record.city} ${record.status}`
        .toLocaleLowerCase("pt-BR")
        .includes(normalized),
    );
  }, [query, records]);

  const openNew = () => {
    setEditing(null);
    setImage(null);
    reset(emptyPartner);
    setEditorOpen(true);
    setNotice("");
    setError("");
  };

  const openEdit = (record: PartnerRecord) => {
    setEditing(record);
    setImage(null);
    reset({
      name: record.name,
      category: record.category,
      specialty: record.specialty,
      summary: record.summary,
      description: record.description,
      city: record.city,
      state: record.state,
      address: record.address,
      external_url: record.external_url,
      discount_details: record.discount_details,
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

  const submit = async (values: PartnerForm) => {
    setError("");
    const hasImage = Boolean(image || editing?.image_path);
    if (
      values.status === "published" &&
      (!values.name ||
        !values.city ||
        !values.state ||
        !values.description ||
        !values.external_url ||
        !hasImage)
    ) {
      setError("Para publicar, informe nome, categoria, cidade, UF, descrição, link e imagem.");
      return;
    }

    const input: PartnerInput = {
      slug: editing?.slug || `${slugify(values.name)}-${Date.now().toString(36)}`,
      name: values.name.trim(),
      category: values.category,
      specialty: values.specialty.trim(),
      summary: values.summary.trim(),
      description: values.description.trim(),
      city: values.city.trim(),
      state: values.state.trim().toUpperCase(),
      address: values.address.trim(),
      external_url: values.external_url.trim(),
      discount_details: values.discount_details.trim(),
      image_path: editing?.image_path ?? "",
      image_alt: values.image_alt.trim(),
      featured: values.featured,
      status: values.status,
    };

    try {
      await savePartner(input, {
        id: editing?.id,
        image: image ?? undefined,
        previousImagePath: editing?.image_path,
      });
      setNotice(editing ? "Parceiro atualizado." : "Parceiro criado.");
      setEditorOpen(false);
      setEditing(null);
      setImage(null);
      reset(emptyPartner);
      await load();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Não foi possível salvar.");
    }
  };

  return (
    <>
      <header className="admin-page-header">
        <div>
          <p>REDE DE CONFIANÇA</p>
          <h1>Parceiros</h1>
          <span>Organize profissionais, institutos e benefícios apresentados às famílias.</span>
        </div>
        <button className="admin-button" type="button" onClick={openNew}>
          <Plus /> Novo parceiro
        </button>
      </header>

      {notice && <div className="admin-alert admin-alert-success">{notice}</div>}
      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      <div className="admin-table-tools">
        <label>
          <Search />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar parceiros" />
        </label>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Parceiro</th>
              <th>Categoria</th>
              <th>Local</th>
              <th>Status</th>
              <th aria-label="Ações" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5}>Carregando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5}>Nenhum parceiro encontrado.</td></tr>
            ) : (
              filtered.map((record) => (
                <tr key={record.id}>
                  <td>
                    <div className="admin-record-title">
                      {record.featured && <Star />}
                      <div>
                        <strong>{record.name}</strong>
                        <span>{record.specialty || record.summary || "Sem especialidade"}</span>
                      </div>
                    </div>
                  </td>
                  <td>{partnerCategoryLabels[record.category]}</td>
                  <td>{[record.city, record.state].filter(Boolean).join(" / ") || "A confirmar"}</td>
                  <td><span className={`admin-status admin-status-${record.status}`}>{record.status === "published" ? "Publicado" : "Rascunho"}</span></td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" title="Editar" onClick={() => openEdit(record)}><Edit3 /></button>
                      <button
                        type="button"
                        title="Excluir"
                        onClick={async () => {
                          if (!window.confirm(`Excluir o parceiro "${record.name}"?`)) return;
                          try {
                            await deletePartner(record);
                            setNotice("Parceiro excluído.");
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
          <section className="admin-editor" role="dialog" aria-modal="true" aria-label="Editor de parceiro">
            <header>
              <div>
                <p>{editing ? "EDITAR PARCEIRO" : "NOVO PARCEIRO"}</p>
                <h2>{editing?.name || "Cadastrar parceiro"}</h2>
              </div>
              <button type="button" className="admin-icon-button" onClick={closeEditor}><X /></button>
            </header>
            <form onSubmit={handleSubmit(submit)}>
              <div className="admin-editor-grid">
                <div className="admin-form-fields">
                  <label className="admin-field admin-field-wide">
                    Nome
                    <input {...register("name")} />
                    {errors.name && <small>{errors.name.message}</small>}
                  </label>
                  <label className="admin-field">
                    Categoria
                    <select {...register("category")}>
                      {Object.entries(partnerCategoryLabels).map(([value, label]) => (
                        <option value={value} key={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="admin-field">
                    Especialidade
                    <input {...register("specialty")} />
                  </label>
                  <label className="admin-field admin-field-wide">
                    Resumo
                    <textarea rows={2} {...register("summary")} />
                    {errors.summary && <small>{errors.summary.message}</small>}
                  </label>
                  <label className="admin-field admin-field-wide">
                    Descrição
                    <textarea rows={6} {...register("description")} />
                    {errors.description && <small>{errors.description.message}</small>}
                  </label>
                  <label className="admin-field">
                    Cidade
                    <input {...register("city")} />
                  </label>
                  <label className="admin-field">
                    UF
                    <input maxLength={2} {...register("state")} />
                  </label>
                  <label className="admin-field admin-field-wide">
                    Endereço (opcional)
                    <input {...register("address")} />
                  </label>
                  <label className="admin-field admin-field-wide">
                    Link externo
                    <input type="url" {...register("external_url")} />
                    {errors.external_url && <small>{errors.external_url.message}</small>}
                  </label>
                  {selectedCategory === "estabelecimento_desconto" && (
                    <label className="admin-field admin-field-wide">
                      Benefício ou desconto
                      <div className="admin-input-icon">
                        <BadgePercent />
                        <input {...register("discount_details")} />
                      </div>
                    </label>
                  )}
                  <label className="admin-field admin-field-wide">
                    Texto alternativo da imagem
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
                    <input type="checkbox" {...register("featured")} /> Destacar parceiro
                  </label>
                </div>
                <ImageCropField
                  initialUrl={editing?.image_path ? contentImageUrl(editing.image_path) : ""}
                  onChange={setImage}
                />
              </div>
              <footer>
                <button className="admin-button admin-button-secondary" type="button" onClick={closeEditor}>Cancelar</button>
                <button className="admin-button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Salvando..." : "Salvar parceiro"}</button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
