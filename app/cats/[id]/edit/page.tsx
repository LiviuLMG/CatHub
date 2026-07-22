"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditCatPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [color, setColor] = useState("");
  const [notes, setNotes] = useState("");
  const [healthStatus, setHealthStatus] = useState("healthy");

  useEffect(() => {
    async function loadCat() {
      const supabase = createClient();
      const { data: cat } = await supabase
        .from("cats")
        .select("*")
        .eq("id", params.id)
        .single();

      if (cat) {
        setName(cat.name);
        setBreed(cat.breed || "");
        setBirthday(cat.birthday || "");
        setGender(cat.gender || "");
        setWeightKg(cat.weight_kg?.toString() || "");
        setColor(cat.color || "");
        setNotes(cat.notes || "");
        setHealthStatus(cat.health_status);
        setExistingPhotoUrl(cat.photo_url);
      }
      setFetching(false);
    }
    loadCat();
  }, [params.id]);

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
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id);

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      toast.error("Couldn't save changes", { description: updateError.message });
      return;
    }

    toast.success("Changes saved!");
    router.push(`/cats/${params.id}`);
    router.refresh();
  }

  if (fetching) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </main>
    );
  }

  const displayPhoto = photoPreview || existingPhotoUrl;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href={`/cats/${params.id}`}
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to profile
      </Link>

      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Edit {name}
      </h1>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
        <div>
          <Label>Photo</Label>
          <div className="mt-2">
            {displayPhoto ? (
              <div className="relative aspect-square w-40 overflow-hidden rounded-2xl">
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
              <label className="flex aspect-square w-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                <Upload size={24} />
                <span className="text-xs font-medium">Upload photo</span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="breed">Breed</Label>
            <Input id="breed" value={breed} onChange={(e) => setBreed(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="birthday">Birthday</Label>
            <Input id="birthday" type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Gender</Label>
            <Select value={gender} onValueChange={(value) => setGender(value ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input id="weight" type="number" step="0.1" min="0" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="color">Color</Label>
            <Input id="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label>Health status</Label>
            <Select value={healthStatus} onValueChange={(value) => setHealthStatus(value ?? "")}>
              <SelectTrigger>
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

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
        </div>

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" size="lg" disabled={loading} className="gap-2">
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </main>
  );
}