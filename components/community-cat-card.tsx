import { Cat as CatIcon } from "lucide-react";
import { TiltLink } from "@/components/tilt-link";
import type { Cat } from "@/lib/types";

interface CommunityCatCardProps {
  cat: Cat;
  ownerName: string;
}

export function CommunityCatCard({ cat, ownerName }: CommunityCatCardProps) {
  return (
    <TiltLink
      href={`/cats/${cat.id}`}
      className="group overflow-hidden rounded-3xl bg-card shadow-sm transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {cat.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cat.photo_url}
            alt={cat.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <CatIcon size={40} className="text-muted-foreground/40" />
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-foreground">{cat.name}</h3>
        <p className="text-sm text-muted-foreground">
          {cat.breed || "Mixed breed"}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Owned by <span className="font-medium text-foreground">{ownerName}</span>
        </p>
      </div>
    </TiltLink>
  );
}