"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, Cat as CatIcon, LayoutDashboard, CalendarDays } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/components/auth-modal-provider";

interface AuthSectionMobileProps {
  onClose: () => void;
}

export function AuthSectionMobile({ onClose }: AuthSectionMobileProps) {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { openLogin, openRegister } = useAuthModal();

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <div className="mt-4 flex flex-col gap-3">
        <Button
          variant="outline"
          onClick={() => {
            onClose();
            openLogin();
          }}
        >
          Log in
        </Button>
        <Button
          onClick={() => {
            onClose();
            openRegister();
          }}
        >
          Get Started
        </Button>
      </div>
    );
  }

  const displayName = user.full_name || user.email.split("@")[0];

  async function handleLogout() {
    await logout();
    onClose();
    router.push("/");
  }

  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">{displayName}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
      <Link
        href="/profile"
        onClick={onClose}
        className="flex items-center gap-2 text-base font-medium text-foreground hover:text-primary"
      >
        <User size={16} />
        <span>Profile</span>
      </Link>

      <Link
        href="/dashboard"
        onClick={onClose}
        className="flex items-center gap-2 text-base font-medium text-foreground hover:text-primary"
      >
        <LayoutDashboard size={16} />
        <span>Dashboard</span>
      </Link>

      <Link
        href="/cats"
        onClick={onClose}
        className="flex items-center gap-2 text-base font-medium text-foreground hover:text-primary"
      >
        <CatIcon size={16} />
        <span>My Cats</span>
      </Link>

      <Link
        href="/calendar"
        onClick={onClose}
        className="flex items-center gap-2 text-base font-medium text-foreground hover:text-primary"
      >
        <CalendarDays size={16} />
        <span>Calendar</span>
      </Link>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-base font-medium text-foreground hover:text-primary"
      >
        <LogOut size={16} />
        <span>Log out</span>
      </button>
    </div>
  );
}