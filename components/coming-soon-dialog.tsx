"use client";

import { useState } from "react";
import { LostCatIllustration } from "@/components/lost-cat-illustration";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface ComingSoonDialogProps {
  children: React.ReactNode;
}

export function ComingSoonDialog({ children }: ComingSoonDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{children}</div>

      <DialogContent className="sm:max-w-sm">
        <DialogTitle className="sr-only">Coming soon</DialogTitle>
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <LostCatIllustration size={140} />
          <h3 className="text-lg font-bold text-foreground">
            This feature isn&apos;t out of the bag yet
          </h3>
          <p className="text-sm text-muted-foreground">
            We&apos;re still polishing this one. Check back soon!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}