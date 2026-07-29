import { supabase, supabaseConfigurationMessage } from "../lib/supabase";
import type {
  EventInput,
  EventRecord,
  PartnerInput,
  PartnerRecord,
} from "../types/content";

const requireClient = () => {
  if (!supabase) throw new Error(supabaseConfigurationMessage);
  return supabase;
};

const normalizeError = (error: { message?: string } | null, fallback: string) => {
  if (error) throw new Error(error.message || fallback);
};

export async function listPublishedEvents() {
  const client = requireClient();
  const { data, error } = await client
    .from("ifa_events")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("starts_at", { ascending: true });

  if (error) {
    throw new Error("Não foi possível carregar os eventos agora. Tente novamente em instantes.");
  }
  return (data ?? []) as EventRecord[];
}

export async function listPublishedPartners() {
  const client = requireClient();
  const { data, error } = await client
    .from("ifa_partners")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Não foi possível carregar os parceiros agora. Tente novamente em instantes.");
  }
  return (data ?? []) as PartnerRecord[];
}

export async function listAdminEvents() {
  const client = requireClient();
  const { data, error } = await client
    .from("ifa_events")
    .select("*")
    .order("updated_at", { ascending: false });
  normalizeError(error, "Não foi possível carregar os eventos.");
  return (data ?? []) as EventRecord[];
}

export async function listAdminPartners() {
  const client = requireClient();
  const { data, error } = await client
    .from("ifa_partners")
    .select("*")
    .order("updated_at", { ascending: false });
  normalizeError(error, "Não foi possível carregar os parceiros.");
  return (data ?? []) as PartnerRecord[];
}

export function contentImageUrl(path: string) {
  if (!path || !supabase) return "";
  return supabase.storage.from("ifa-content").getPublicUrl(path).data.publicUrl;
}

export async function uploadContentImage(
  kind: "events" | "partners",
  id: string,
  blob: Blob,
) {
  const client = requireClient();
  const path = `${kind}/${id}/${crypto.randomUUID()}.webp`;
  const { error } = await client.storage.from("ifa-content").upload(path, blob, {
    contentType: "image/webp",
    cacheControl: "3600",
    upsert: false,
  });
  normalizeError(error, "Não foi possível enviar a imagem.");
  return path;
}

export async function removeContentImage(path: string) {
  if (!path) return;
  const client = requireClient();
  const { error } = await client.storage.from("ifa-content").remove([path]);
  normalizeError(error, "Não foi possível remover a imagem anterior.");
}

export async function saveEvent(
  input: EventInput,
  options: { id?: string; image?: Blob; previousImagePath?: string } = {},
) {
  const client = requireClient();
  const id = options.id ?? crypto.randomUUID();
  let imagePath = input.image_path;

  if (options.image) {
    imagePath = await uploadContentImage("events", id, options.image);
  }

  const payload = { ...input, id, image_path: imagePath };
  const { data, error } = await client
    .from("ifa_events")
    .upsert(payload)
    .select()
    .single();
  normalizeError(error, "Não foi possível salvar o evento.");

  if (
    options.image &&
    options.previousImagePath &&
    options.previousImagePath !== imagePath
  ) {
    await removeContentImage(options.previousImagePath);
  }

  return data as EventRecord;
}

export async function savePartner(
  input: PartnerInput,
  options: { id?: string; image?: Blob; previousImagePath?: string } = {},
) {
  const client = requireClient();
  const id = options.id ?? crypto.randomUUID();
  let imagePath = input.image_path;

  if (options.image) {
    imagePath = await uploadContentImage("partners", id, options.image);
  }

  const payload = { ...input, id, image_path: imagePath };
  const { data, error } = await client
    .from("ifa_partners")
    .upsert(payload)
    .select()
    .single();
  normalizeError(error, "Não foi possível salvar o parceiro.");

  if (
    options.image &&
    options.previousImagePath &&
    options.previousImagePath !== imagePath
  ) {
    await removeContentImage(options.previousImagePath);
  }

  return data as PartnerRecord;
}

export async function deleteEvent(record: EventRecord) {
  const client = requireClient();
  const { error } = await client.from("ifa_events").delete().eq("id", record.id);
  normalizeError(error, "Não foi possível excluir o evento.");
  await removeContentImage(record.image_path);
}

export async function deletePartner(record: PartnerRecord) {
  const client = requireClient();
  const { error } = await client.from("ifa_partners").delete().eq("id", record.id);
  normalizeError(error, "Não foi possível excluir o parceiro.");
  await removeContentImage(record.image_path);
}
