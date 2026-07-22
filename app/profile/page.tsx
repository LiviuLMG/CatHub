"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Upload, User, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        setEmail(user.email || "");
        setFullName(user.user_metadata?.full_name || "");
        setAvatarUrl(user.user_metadata?.avatar_url || null);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setError(null);
    setProfileSuccess(false);

    const supabase = createClient();
    let newAvatarUrl = avatarUrl;

    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile);

      if (uploadError) {
        setError(`Avatar upload failed: ${uploadError.message}`);
        setSavingProfile(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      newAvatarUrl = publicUrlData.publicUrl;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        avatar_url: newAvatarUrl,
      },
    });

    setSavingProfile(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setAvatarUrl(newAvatarUrl);
    setAvatarFile(null);
    setProfileSuccess(true);
    toast.success("Profile updated");
    router.refresh();
    setTimeout(() => setProfileSuccess(false), 3000);
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match.");
      return;
    }

    setSavingPassword(true);
    const supabase = createClient();

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setSavingPassword(false);

    if (updateError) {
      setPasswordError(updateError.message);
      return;
    }
    
    toast.success("Password updated");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordSuccess(true);
    setTimeout(() => setPasswordSuccess(false), 3000);
  }

  if (loading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </main>
    );
  }

  const displayAvatar = avatarPreview || avatarUrl;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Profile settings
      </h1>
      <p className="mt-2 text-muted-foreground">
        Manage your account information and security.
      </p>

      {/* Profile info */}
      <form
        onSubmit={handleProfileSubmit}
        className="mt-10 flex flex-col gap-6 rounded-3xl border border-border bg-card p-6"
      >
        <h2 className="text-lg font-semibold text-foreground">
          Account information
        </h2>

        <div className="flex items-center gap-5">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-muted">
            {displayAvatar ? (
              <Image src={displayAvatar} alt="Avatar" fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User size={28} className="text-muted-foreground/40" />
              </div>
            )}
          </div>

          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            <Upload size={15} />
            Change photo
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={email} disabled className="opacity-60" />
          <p className="text-xs text-muted-foreground">
            Contact support to change your email address.
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" disabled={savingProfile} className="w-fit gap-2">
          {savingProfile && <Loader2 size={16} className="animate-spin" />}
          {profileSuccess && !savingProfile && <Check size={16} />}
          {savingProfile ? "Saving..." : profileSuccess ? "Saved" : "Save changes"}
        </Button>
      </form>

      {/* Password */}
      <form
        onSubmit={handlePasswordSubmit}
        className="mt-8 flex flex-col gap-6 rounded-3xl border border-border bg-card p-6"
      >
        <h2 className="text-lg font-semibold text-foreground">
          Change password
        </h2>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="newPassword">New password</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {passwordError && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {passwordError}
          </p>
        )}

        <Button type="submit" disabled={savingPassword} className="w-fit gap-2">
          {savingPassword && <Loader2 size={16} className="animate-spin" />}
          {passwordSuccess && !savingPassword && <Check size={16} />}
          {savingPassword
            ? "Updating..."
            : passwordSuccess
              ? "Password updated"
              : "Update password"}
        </Button>
      </form>
    </main>
  );
}