"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleSwitch } from "@/components/toggle-switch";
import { Textarea } from "@/components/ui/textarea";
import { BreedCombobox } from "@/components/breed-combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Cat } from "@/lib/types";

interface EditCatFormProps {
  cat: Cat;
  onSuccess?: () => void;
}

export function EditCatForm({ cat, onSuccess }: EditCatFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(cat.photo_url);

  const [name, setName] = useState(cat.name);
  const [breed, setBreed] = useState(cat.breed || "");
  const [birthday, setBirthday] = useState(cat.birthday || "");
  const [gender, setGender] = useState(cat.gender || "");
  const [weightKg, setWeightKg] = useState(cat.weight_kg?.toString() || "");
  const [color, setColor] = useState(cat.color || "");
  const [notes, setNotes] = useState(cat.notes || "");
  const [healthStatus, setHealthStatus] = useState(cat.health_status);
  const [isPublic, setIsPublic] = useState(cat.is_public);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function removePhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    setExistingPhotoUrl(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    let photoUrl = existingPhotoUrl;

    if (photoFile) {
      const fileExt = photoFile.name.split(".").pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("cat-photos")
        .upload(filePath, photoFile);

      if (uploadError) {
        setError(`Photo upload failed: ${uploadError.message}`);
        toast.error("Photo upload failed", { description: uploadError.message });
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("cat-photos")
        .getPublicUrl(filePath);

      photoUrl = publicUrlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("cats")
      .update({
        name,
        breed: breed || null,
        birthday: birthday || null,
        gender: gender || null,
        weight_kg: weightKg ? Number(weightKg) : null,
        color: color || null,
        notes: notes || null,
        health_status: healthStatus,
        photo_url: photoUrl,
        is_public: isPublic,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cat.id);

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      toast.error("Couldn't save changes", { description: updateError.message });
      return;
    }

    toast.success("Changes saved!");
    onSuccess?.();
  }

  const displayPhoto = photoPreview || existingPhotoUrl;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <Label>Photo</Label>
        <div className="mt-2">
          {displayPhoto ? (
            <div className="relative aspect-square w-32 overflow-hidden rounded-2xl">
              <Image src={displayPhoto} alt="Preview" fill className="object-cover" />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex aspect-square w-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              <Upload size={20} />
              <span className="text-xs font-medium">Upload</span>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-name">Name *</Label>
          <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} className="h-11" required />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Breed</Label>
          <BreedCombobox value={breed} onChange={setBreed} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-birthday">Birthday</Label>
          <Input id="edit-birthday" type="date" value={birthday} className="h-11" onChange={(e) => setBirthday(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Gender</Label>
          <Select value={gender} onValueChange={(v) => setGender(v || "")}>
            <SelectTrigger size="lg" className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-weight">Weight (kg)</Label>
          <Input
            id="edit-weight"
            type="number"
            step="0.1"
            min="0"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="h-11"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-color">Color</Label>
          <Input id="edit-color" className="h-11" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Health status</Label>
          <Select value={healthStatus} onValueChange={(v) => setHealthStatus(v as Cat["health_status"])}>
            <SelectTrigger size="lg" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="healthy">Healthy</SelectItem>
              <SelectItem value="monitoring">Monitoring</SelectItem>
              <SelectItem value="needs_attention">Needs attention</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>


      <div className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 p-4">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {isPublic ? "Public profile" : "Private profile"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isPublic
              ? "Visible to everyone on the Community page."
              : "Only visible to you."}
          </p>
        </div>
        <ToggleSwitch checked={isPublic} onChange={setIsPublic} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="edit-notes">Notes</Label>
        <Textarea id="edit-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <Button type="submit" size="lg" disabled={loading} className="gap-2">
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}