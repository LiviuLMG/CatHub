import type { Cat, MedicalRecord } from "@/lib/types";

export interface ReminderEvent {
  id: string;
  date: Date;
  label: string;
  type: "birthday" | MedicalRecord["type"];
  catName: string;
  catId: string;
}

function stripTime(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function nextBirthdayOccurrence(birthday: string, from: Date): Date {
  const birth = new Date(birthday);
  const year = from.getFullYear();
  let next = new Date(year, birth.getMonth(), birth.getDate());
  if (next < from) {
    next = new Date(year + 1, birth.getMonth(), birth.getDate());
  }
  return next;
}

export function getUpcomingEvents(
  cats: Cat[],
  records: MedicalRecord[],
  daysAhead = 60
): ReminderEvent[] {
  const today = stripTime(new Date());
  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + daysAhead);

  const catMap = new Map(cats.map((cat) => [cat.id, cat]));
  const events: ReminderEvent[] = [];

  for (const cat of cats) {
    if (cat.birthday) {
      const next = nextBirthdayOccurrence(cat.birthday, today);
      if (next <= horizon) {
        events.push({
          id: `birthday-${cat.id}`,
          date: next,
          label: `${cat.name}'s birthday`,
          type: "birthday",
          catName: cat.name,
          catId: cat.id,
        });
      }
    }
  }

  for (const record of records) {
    if (record.next_due_date) {
      const date = stripTime(new Date(record.next_due_date));
      if (date <= horizon) {
        const cat = catMap.get(record.cat_id);
        events.push({
          id: `record-${record.id}`,
          date,
          label: record.title,
          type: record.type,
          catName: cat?.name || "Your cat",
          catId: record.cat_id,
        });
      }
    }
  }

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function daysUntil(date: Date): number {
  const today = stripTime(new Date());
  const target = stripTime(date);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export function formatRelativeDate(date: Date): string {
  const days = daysUntil(date);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) !== 1 ? "s" : ""} overdue`;
  return `In ${days} days`;
}


import { type CatBreed, findBreedByName, parseWeightRange } from "@/lib/cat-api";

const WEIGHT_TOLERANCE = 1.15; // 15% peste maxul rasei, ca să evităm fals-pozitive minore

export function computeHealthStatus(
  cat: Cat,
  records: MedicalRecord[],
  breeds: CatBreed[] = []
): Cat["health_status"] {
  const today = stripTime(new Date());
  const catRecords = records.filter(
    (r) => r.cat_id === cat.id && r.next_due_date
  );

  let hasOverdue = false;
  let hasSoon = false;

  for (const record of catRecords) {
    const due = stripTime(new Date(record.next_due_date!));
    const diff = Math.round((due.getTime() - today.getTime()) / 86400000);

    if (diff < 0) {
      hasOverdue = true;
    } else if (diff <= 14) {
      hasSoon = true;
    }
  }

  let isOverweight = false;
  if (cat.weight_kg && cat.breed && cat.breed !== "Other") {
    const breedData = findBreedByName(breeds, cat.breed);
    const range = breedData ? parseWeightRange(breedData) : null;
    if (range && cat.weight_kg > range.max * WEIGHT_TOLERANCE) {
      isOverweight = true;
    }
  }

  if (hasOverdue || isOverweight) return "needs_attention";
  if (hasSoon) return "monitoring";
  return cat.health_status;
}