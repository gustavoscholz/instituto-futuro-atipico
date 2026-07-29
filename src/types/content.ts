export type ContentStatus = "draft" | "published";

export type PartnerCategory =
  | "medico"
  | "instituto"
  | "estabelecimento_desconto";

export type EventRecord = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  starts_at: string | null;
  ends_at: string | null;
  venue: string;
  city: string;
  state: string;
  external_url: string;
  image_path: string;
  image_alt: string;
  featured: boolean;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type PartnerRecord = {
  id: string;
  slug: string;
  name: string;
  category: PartnerCategory;
  specialty: string;
  summary: string;
  description: string;
  city: string;
  state: string;
  address: string;
  external_url: string;
  discount_details: string;
  image_path: string;
  image_alt: string;
  featured: boolean;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type EventInput = Omit<EventRecord, "id" | "created_at" | "updated_at">;
export type PartnerInput = Omit<PartnerRecord, "id" | "created_at" | "updated_at">;

export const partnerCategoryLabels: Record<PartnerCategory, string> = {
  medico: "Médico",
  instituto: "Instituto",
  estabelecimento_desconto: "Estabelecimento com desconto",
};
