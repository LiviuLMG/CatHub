"use client";

import { Cat } from "lucide-react";
import { useAuthModal } from "@/components/auth-modal-provider";
import { LoginForm } from "@/components/login-form";
import { RegisterForm } from "@/components/register-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AuthModal() {
  const { mode, close, openLogin, openRegister } = useAuthModal();

  const isOpen = mode !== null;

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && close()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Cat size={24} />
          </div>
          <DialogTitle className="text-2xl font-bold">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {mode === "login"
              ? "Log in to care for your cat."
              : "Start caring for your cat the smart way."}
          </p>
        </DialogHeader>

        <div className="mt-2">
          {mode === "login" ? (
            <LoginForm onSuccess={close} />
          ) : (
            <RegisterForm />
          )}
        </div>

        <p className="mt-2 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={openRegister}
                className="font-medium text-primary hover:underline"
              >
                Create one
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={openLogin}
                className="font-medium text-primary hover:underline"
              >
                Log in
              </button>
            </>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
}