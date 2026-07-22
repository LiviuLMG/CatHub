"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AddCatForm } from "@/components/add-cat-form";

export default function AddCatPage() {
  const router = useRouter();

  function handleSuccess(catId: string) {
    router.push(`/cats/${catId}`);
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/cats"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to my cats
      </Link>

      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Add a new cat
      </h1>
      <p className="mt-2 text-muted-foreground">
        Fill in your cat&apos;s details to start tracking their care.
      </p>

      <div className="mt-10">
        <AddCatForm onSuccess={handleSuccess} />
      </div>
    </main>
  );
}