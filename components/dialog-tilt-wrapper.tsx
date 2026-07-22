"use client";

import { useDialogFloat } from "@/hooks/use-dialog-float";

interface DialogTiltWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogTiltWrapper({ children, className }: DialogTiltWrapperProps) {
  const { ref, style } = useDialogFloat<HTMLDivElement>();

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}