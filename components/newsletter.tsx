import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-15">
      <div className="relative overflow-hidden rounded-3xl px-8 py-16 text-center md:px-16">
        <Image
          src="/newsletter-bg.png"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-card/85" />

        <div className="relative mx-auto max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Stay in the loop
          </h2>
          <p className="mt-4 text-muted-foreground">
            Get cat care tips, breed spotlights and product updates
            straight to your inbox once a week.
          </p>
          <form className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder="you@example.com"
              required
              className="h-13 border border-border bg-background/40 text-foreground placeholder:text-muted-foreground"
            />
            <Button
              type="submit"
              size="lg"
              variant="secondary"
              className="shrink-0"
            >
              Subscribe
            </Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            No spam, unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}