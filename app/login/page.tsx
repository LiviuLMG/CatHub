import Link from "next/link";
import { Cat } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-16">
      <Card className="w-full max-w-md rounded-3xl border-border p-2">
        <CardHeader className="items-center gap-2 pb-2 pt-6 text-center">
          <h1 className="mt-2 text-2xl font-bold text-foreground">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Log in to care for your cat.
          </p>
        </CardHeader>

        <CardContent className="pb-8 pt-4">
          <LoginForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}