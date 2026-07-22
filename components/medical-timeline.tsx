"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Syringe,
  Bug,
  Stethoscope,
  Pill,
  Scissors,
  FileText,
  Plus,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { MedicalRecord } from "@/lib/types";
import { toast } from "sonner";

const typeConfig: Record<
  MedicalRecord["type"],
  { label: string; icon: typeof Syringe; color: string }
> = {
  vaccination: { label: "Vaccination", icon: Syringe, color: "bg-primary/15 text-primary" },
  deworming: { label: "Deworming", icon: Bug, color: "bg-secondary/15 text-secondary" },
  vet_visit: { label: "Vet Visit", icon: Stethoscope, color: "bg-accent/15 text-accent" },
  treatment: { label: "Treatment", icon: Pill, color: "bg-success/15 text-success" },
  surgery: { label: "Surgery", icon: Scissors, color: "bg-destructive/15 text-destructive" },
  other: { label: "Other", icon: FileText, color: "bg-muted text-muted-foreground" },
};

interface MedicalTimelineProps {
  catId: string;
  records: MedicalRecord[];
}

export function MedicalTimeline({ catId, records }: MedicalTimelineProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);

  const [type, setType] = useState<MedicalRecord["type"]>("vaccination");
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [nextDueDate, setNextDueDate] = useState("");
  const [vetName, setVetName] = useState("");
  const [notes, setNotes] = useState("");

  function resetForm() {
    setType("vaccination");
    setTitle("");
    setEventDate("");
    setNextDueDate("");
    setVetName("");
    setNotes("");
    setEditingRecord(null);
  }

  function openAddDialog() {
    resetForm();
    setOpen(true);
  }

  function openEditDialog(record: MedicalRecord) {
    setEditingRecord(record);
    setType(record.type);
    setTitle(record.title);
    setEventDate(record.event_date);
    setNextDueDate(record.next_due_date || "");
    setVetName(record.vet_name || "");
    setNotes(record.notes || "");
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const payload = {
      type,
      title,
      event_date: eventDate,
      next_due_date: nextDueDate || null,
      vet_name: vetName || null,
      notes: notes || null,
    };

    if (editingRecord) {
      await supabase
        .from("medical_records")
        .update(payload)
        .eq("id", editingRecord.id);
    } else {
      await supabase.from("medical_records").insert({
        cat_id: catId,
        owner_id: user.id,
        ...payload,
      });
    }

    setLoading(false);
    setOpen(false);
    toast.success(editingRecord ? "Record updated" : "Record added");
    resetForm();
    router.refresh();
  }

  async function handleDelete(recordId: string) {
    const supabase = createClient();
    await supabase.from("medical_records").delete().eq("id", recordId);
    toast.success("Record deleted");
    router.refresh();
  }

  const sorted = [...records].sort(
    (a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Medical Timeline</h2>

        <Dialog open={open} onOpenChange={(v) => (v ? openAddDialog() : setOpen(false))}>
          <DialogTrigger
            render={
              <Button size="sm" className="gap-1.5">
                <Plus size={16} />
                Add record
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingRecord ? "Edit medical record" : "Add medical record"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as MedicalRecord["type"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeConfig).map(([value, config]) => (
                      <SelectItem key={value} value={value}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Rabies vaccine"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="eventDate">Date *</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="nextDueDate">Next due</Label>
                  <Input
                    id="nextDueDate"
                    type="date"
                    value={nextDueDate}
                    onChange={(e) => setNextDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="vetName">Vet / Clinic</Label>
                <Input
                  id="vetName"
                  value={vetName}
                  onChange={(e) => setVetName(e.target.value)}
                  placeholder="Dr. Ionescu, VetClinic"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={loading} className="mt-2 gap-2">
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Saving..." : editingRecord ? "Save changes" : "Save record"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {sorted.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border bg-card py-10 text-center">
          <p className="text-sm text-muted-foreground">
            No medical records yet. Add the first one to start the timeline.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-1">
          {sorted.map((record, i) => {
            const config = typeConfig[record.type];
            const Icon = config.icon;
            const isLast = i === sorted.length - 1;

            return (
              <div key={record.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.color}`}
                  >
                    <Icon size={16} />
                  </div>
                  {!isLast && <div className="w-px flex-1 bg-border" />}
                </div>

                <div className="flex-1 pb-6">
                  <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {record.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{config.label}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date(record.event_date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <button
                        onClick={() => openEditDialog(record)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Edit record"
                      >
                        <Pencil size={13} />
                      </button>

                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <button
                              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                              aria-label="Delete record"
                            >
                              <Trash2 size={13} />
                            </button>
                          }
                        />
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove &ldquo;{record.title}
                              &rdquo; from the medical timeline.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(record.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {record.vet_name && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {record.vet_name}
                    </p>
                  )}
                  {record.notes && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {record.notes}
                    </p>
                  )}
                  {record.next_due_date && (
                    <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">
                      Next due:{" "}
                      {new Date(record.next_due_date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}