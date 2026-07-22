"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddCatForm } from "@/components/add-cat-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AddCatDialogProps {
  triggerLabel?: string;
  triggerClassName?: string;
}

export function AddCatDialog({
  triggerLabel = "Add Cat",
  triggerClassName,
}: AddCatDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleSuccess(catId: string) {
    setOpen(false);
    router.push(`/cats/${catId}`);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="lg" className={`gap-2 ${triggerClassName ?? ""}`}>
            <Plus size={18} />
            {triggerLabel}
          </Button>
        }
      />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add a new cat</DialogTitle>
        </DialogHeader>

        <AddCatForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}