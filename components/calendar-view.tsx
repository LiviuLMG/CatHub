"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Cake,
  Syringe,
  Bug,
  Stethoscope,
  Pill,
  Scissors,
  FileText,
} from "lucide-react";
import { getUpcomingEvents, formatRelativeDate, type ReminderEvent } from "@/lib/reminders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Cat, MedicalRecord } from "@/lib/types";

const eventIcons: Record<ReminderEvent["type"], typeof Cake> = {
  birthday: Cake,
  vaccination: Syringe,
  deworming: Bug,
  vet_visit: Stethoscope,
  treatment: Pill,
  surgery: Scissors,
  other: FileText,
};

const eventColors: Record<ReminderEvent["type"], string> = {
  birthday: "bg-accent text-accent-foreground",
  vaccination: "bg-primary text-primary-foreground",
  deworming: "bg-secondary text-secondary-foreground",
  vet_visit: "bg-success text-success-foreground",
  treatment: "bg-success text-success-foreground",
  surgery: "bg-destructive text-destructive-foreground",
  other: "bg-muted text-muted-foreground",
};

const eventLabels: Record<ReminderEvent["type"], string> = {
  birthday: "Birthday",
  vaccination: "Vaccination",
  deworming: "Deworming",
  vet_visit: "Vet Visit",
  treatment: "Treatment",
  surgery: "Surgery",
  other: "Other",
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CalendarViewProps {
  cats: Cat[];
  records: MedicalRecord[];
}

export function CalendarView({ cats, records }: CalendarViewProps) {
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDayEvents, setSelectedDayEvents] = useState<ReminderEvent[] | null>(null);

  const allEvents = useMemo(() => {
    const events: ReminderEvent[] = [];

    for (const cat of cats) {
      if (cat.birthday) {
        const birth = new Date(cat.birthday);
        for (const yearOffset of [-1, 0, 1]) {
          const year = viewDate.getFullYear() + yearOffset;
          events.push({
            id: `birthday-${cat.id}-${year}`,
            date: new Date(year, birth.getMonth(), birth.getDate()),
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
        const cat = cats.find((c) => c.id === record.cat_id);
        events.push({
          id: `record-${record.id}`,
          date: new Date(record.next_due_date),
          label: record.title,
          type: record.type,
          catName: cat?.name || "Your cat",
          catId: record.cat_id,
        });
      }
    }

    return events;
  }, [cats, records, viewDate]);

  const upcoming = useMemo(
    () => getUpcomingEvents(cats, records, 90).slice(0, 8),
    [cats, records]
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function eventsOnDay(day: number) {
    return allEvents.filter(
      (e) =>
        e.date.getFullYear() === year &&
        e.date.getMonth() === month &&
        e.date.getDate() === day
    );
  }

  function goToMonth(offset: number) {
    setViewDate(new Date(year, month + offset, 1));
  }

  function goToToday() {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
  }

  function handleDayClick(day: number) {
    const events = eventsOnDay(day);
    if (events.length === 0) return;
    setSelectedDayEvents(events);
  }

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      {/* Month grid */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={goToToday}
              className="mr-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
            >
              Today
            </button>
            <button
              onClick={() => goToMonth(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => goToMonth(1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div key={`${year}-${month}`} className="animate-fade-month mt-6 grid grid-cols-7 gap-1.5">
          {WEEKDAYS.map((d) => (
            <div key={d} className="pb-2 text-center text-xs font-medium text-muted-foreground">
              {d}
            </div>
          ))}

          {cells.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />;
            const dayEvents = eventsOnDay(day);
            const hasEvents = dayEvents.length > 0;

            return (
              <div
                key={day}
                onClick={() => handleDayClick(day)}
                className={`flex min-h-20 flex-col gap-1 rounded-xl border p-1.5 transition-colors duration-200 ${isToday(day) ? "border-primary bg-primary/5" : "border-border"
                  } ${hasEvents ? "cursor-pointer hover:bg-muted" : "cursor-default"}`}
              >
                <span
                  className={`text-xs font-medium ${isToday(day) ? "text-primary" : "text-muted-foreground"
                    }`}
                >
                  {day}
                </span>
                <div className="flex flex-col gap-1">
                  {dayEvents.slice(0, 2).map((event) => {
                    const Icon = eventIcons[event.type];
                    return (
                      <div
                        key={event.id}
                        className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${eventColors[event.type]}`}
                      >
                        <Icon size={10} className="shrink-0" />
                        <span className="truncate">{event.catName}</span>
                      </div>
                    );
                  })}
                  {dayEvents.length > 2 && (
                    <span className="text-[10px] text-muted-foreground">
                      +{dayEvents.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming sidebar */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold text-foreground">
          Upcoming (next 90 days)
        </h2>

        {upcoming.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No upcoming events. You&apos;re all caught up!
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {upcoming.map((event) => {
              const Icon = eventIcons[event.type];
              return (
                <Link
                  key={event.id}
                  href={`/cats/${event.catId}`}
                  className="flex items-start gap-3 rounded-xl transition-colors hover:bg-muted"
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${eventColors[event.type]}`}
                  >
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0 flex-1 py-0.5">
                    <p className="truncate text-sm font-medium text-foreground">
                      {event.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.catName} · {formatRelativeDate(event.date)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Day details popup */}
      <Dialog
        open={selectedDayEvents !== null}
        onOpenChange={(open) => !open && setSelectedDayEvents(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {selectedDayEvents?.[0]?.date.toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            {selectedDayEvents?.map((event) => {
              const Icon = eventIcons[event.type];
              return (
                <Link
                  key={event.id}
                  href={`/cats/${event.catId}`}
                  onClick={() => setSelectedDayEvents(null)}
                  className="flex items-start gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted"
                >
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${eventColors[event.type]}`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {event.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.catName} · {eventLabels[event.type]}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}