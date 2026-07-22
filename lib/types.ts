export interface Cat {
  id: string;
  owner_id: string;
  name: string;
  breed: string | null;
  birthday: string | null;
  gender: "male" | "female" | null;
  weight_kg: number | null;
  color: string | null;
  microchip_id: string | null;
  photo_url: string | null;
  health_status: "healthy" | "monitoring" | "needs_attention";
  notes: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface MedicalRecord {
  id: string;
  cat_id: string;
  owner_id: string;
  type: "vaccination" | "deworming" | "vet_visit" | "treatment" | "surgery" | "other";
  title: string;
  event_date: string;
  next_due_date: string | null;
  vet_name: string | null;
  notes: string | null;
  created_at: string;
}