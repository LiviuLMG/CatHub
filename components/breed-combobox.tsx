"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Check, ChevronDown } from "lucide-react";
import { useBreedOptions } from "@/hooks/use-breed-options";

interface BreedComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function BreedCombobox({
  value,
  onChange,
  placeholder = "Select breed",
}: BreedComboboxProps) {
  const { breeds, loading } = useBreedOptions();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const filtered = breeds.filter((b) =>
    b.toLowerCase().includes(query.toLowerCase())
  );

  function handleSelect(breedName: string) {
    onChange(breedName);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-full items-center justify-between rounded-lg border border-border bg-background px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search size={14} className="shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search breeds..."
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="max-h-60 overflow-y-auto p-1">
            {loading && (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                Loading breeds...
              </p>
            )}

            {!loading && filtered.length === 0 && (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                No breeds found.
              </p>
            )}

            {!loading &&
              filtered.map((breed) => (
                <button
                  key={breed}
                  type="button"
                  onClick={() => handleSelect(breed)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
                >
                  {breed}
                  {value === breed && <Check size={14} className="text-primary" />}
                </button>
              ))}

            <button
              type="button"
              onClick={() => handleSelect("Other")}
              className="flex w-full items-center justify-between rounded-lg border-t border-border px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Other
              {value === "Other" && <Check size={14} className="text-primary" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}