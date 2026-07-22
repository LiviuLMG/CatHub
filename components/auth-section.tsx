"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, Cat as CatIcon, LayoutDashboard, CalendarDays } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useAuthModal } from "@/components/auth-modal-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export function AuthSection() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { openLogin, openRegister } = useAuthModal();

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <div className="hidden items-center gap-3 md:flex">
        <Button variant="ghost" onClick={openLogin}>
          Log in
        </Button>
        <Button onClick={openRegister}>Get Started</Button>
      </div>
    );
  }

  const displayName = user.full_name || user.email.split("@")[0];
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <div className="hidden md:flex">
      <DropdownMenu>

        <DropdownMenuTrigger
          render={
            <button className="flex items-center gap-3 rounded-full px-3 py-1.5 transition-all hover:bg-muted">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={displayName}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary-foreground">
                    {initials}
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-foreground">
                {displayName}
              </span>
            </button>
          }
        />

        <DropdownMenuContent align="end" className="w-64">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary">
              {user.avatar_url ? (
                <Image src={user.avatar_url} alt={displayName} fill sizes="40px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary-foreground">
                  {initials}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem render={<Link href="/profile" />}>
            <User size={16} />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem render={<Link href="/dashboard" />}>
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </DropdownMenuItem>

          <DropdownMenuItem render={<Link href="/cats" />}>
            <CatIcon size={16} />
            <span>My Cats</span>
          </DropdownMenuItem>

          <DropdownMenuItem render={<Link href="/calendar" />}>
            <CalendarDays size={16} />
            <span>Calendar</span>
          </DropdownMenuItem>

          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Log out</span>
          </DropdownMenuItem>

        </DropdownMenuContent>

      </DropdownMenu>
    </div>
  );
}