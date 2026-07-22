"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditCatForm } from "@/components/edit-cat-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Cat } from "@/lib/types";

interface EditCatDialogProps {
  cat: Cat;
}

export function EditCatDialog({ cat }: EditCatDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleSuccess() {
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="gap-2">
            <Pencil size={16} />
            Edit
          </Button>
        }
      />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit {cat.name}</DialogTitle>
        </DialogHeader>
        <EditCatForm cat={cat} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}