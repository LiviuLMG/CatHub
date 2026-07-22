import { createClient } from "@/lib/supabase/server";
import { CalendarView } from "@/components/calendar-view";
import type { Cat, MedicalRecord } from "@/lib/types";

export default async function CalendarPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: cats } = await supabase
    .from("cats")
    .select("*")
    .eq("owner_id", user?.id);
  const { data: records } = await supabase.from("medical_records").select("*");

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        Calendar
      </h1>
      <p className="mt-2 text-muted-foreground">
        Birthdays, vaccinations and vet visits, all in one place.
      </p>

      <div className="mt-10">
        <CalendarView
          cats={(cats as Cat[]) || []}
          records={(records as MedicalRecord[]) || []}
        />
      </div>
    </main>
  );
}