"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
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

interface DeleteCatButtonProps {
  catId: string;
  photoUrl: string | null;
}

export function DeleteCatButton({ catId, photoUrl }: DeleteCatButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const supabase = createClient();

    if (photoUrl) {
      const path = photoUrl.split("/cat-photos/")[1];
      if (path) {
        await supabase.storage.from("cat-photos").remove([path]);
      }
    }

    await supabase.from("cats").delete().eq("id", catId);

    toast.success("Cat deleted, R.I.P. x_x");
    router.push("/cats");
    router.refresh();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
            <Trash2 size={16} />
            Delete
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this cat?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this cat&apos;s profile, including
            their photo. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}