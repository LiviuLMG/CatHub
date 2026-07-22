"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Upload, X, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BreedCombobox } from "@/components/breed-combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddCatFormProps {
  onSuccess?: (catId: string) => void;
}

const STEPS = [
  { label: "Photo & Name" },
  { label: "Details" },
  { label: "Notes" },
];

export function AddCatForm({ onSuccess }: AddCatFormProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [color, setColor] = useState("");
  const [notes, setNotes] = useState("");

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function removePhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
  }

  function validateStep(currentStep: number): string | null {
    if (currentStep === 0) {
      if (!photoFile) return "Please upload a photo before continuing.";
      if (!name.trim()) return "Please enter a name before continuing.";
    }
    if (currentStep === 1) {
      if (!breed.trim()) return "Please enter a breed.";
      if (!birthday) return "Please select a birthday.";
      if (!gender) return "Please select a gender.";
      if (!weightKg) return "Please enter a weight.";
      if (!color.trim()) return "Please enter a color.";
    }
    return null;
  }

  function goNext() {
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setDirection("forward");
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setError(null);
    setDirection("back");
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (step < STEPS.length - 1) {
      goNext();
      return;
    }

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

    let photoUrl: string | null = null;

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

    const { data: newCat, error: insertError } = await supabase
      .from("cats")
      .insert({
        owner_id: user.id,
        name,
        breed,
        birthday,
        gender,
        weight_kg: Number(weightKg),
        color,
        notes: notes || null,
        photo_url: photoUrl,
      })
      .select()
      .single();

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      toast.error("Couldn't add cat", { description: insertError.message });
      return;
    }

    toast.success(`${name} was added to your cats! ˃⩊˂`);
    onSuccess?.(newCat.id);
  }

  const isLastStep = step === STEPS.length - 1;

  return (
    <div className="flex flex-col gap-6">
      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-center">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-300 ${i < step
                  ? "bg-success text-success-foreground"
                  : i === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                  }`}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className="mx-2 h-1 w-12 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: i < step ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-xs font-medium text-muted-foreground">
          Step {step + 1} of {STEPS.length} - {STEPS[step].label}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="-mx-1 overflow-hidden px-1 py-1">
          <div
            key={step}
            className={
              direction === "forward"
                ? "animate-step-in-forward"
                : "animate-step-in-back"
            }
          >
            {/* Step 1: Photo & Name */}
            {step === 0 && (
              <div className="flex flex-col gap-6">
                <div>
                  <Label>Photo *</Label>
                  <div className="mt-2">
                    {photoPreview ? (
                      <div className="relative aspect-square w-40 overflow-hidden rounded-2xl">
                        <Image src={photoPreview} alt="Preview" fill className="object-cover" />
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

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="add-name">Name *</Label>
                  <Input
                    id="add-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Luna"
                    autoFocus
                    className="h-11"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Breed *</Label>
                  <BreedCombobox value={breed} onChange={setBreed} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="add-birthday">Birthday *</Label>
                  <Input
                    id="add-birthday"
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Gender *</Label>
                  <Select
                    value={gender}
                    onValueChange={(value) => setGender(value ?? "")}
                  >

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
                  <Label htmlFor="add-weight">Weight (kg) *</Label>
                  <Input
                    id="add-weight"
                    type="number"
                    step="0.1"
                    min="0"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="4.2"
                    className="h-11"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label htmlFor="add-color">Color *</Label>
                  <Input
                    id="add-color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Grey"
                    className="h-11"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Notes */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-border bg-muted/50 p-4">
                  <p className="text-sm font-semibold text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">
                    {breed} · {weightKg} kg · {gender}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="add-notes">Notes (optional)</Label>
                  <Textarea
                    id="add-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Anything worth remembering about your cat..."
                    rows={4}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          {step > 0 && (
            <Button type="button" variant="outline" onClick={goBack} className="gap-2">
              <ArrowLeft size={16} />
              Back
            </Button>
          )}

          <Button type="submit" disabled={loading} className="flex-1 gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {!loading && isLastStep && "Add cat"}
            {!loading && !isLastStep && (
              <>
                Continue
                <ArrowRight size={16} />
              </>
            )}
            {loading && "Saving..."}
          </Button>
        </div>
      </form>
    </div>
  );
}