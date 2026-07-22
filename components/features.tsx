import {
  HeartPulse,
  Syringe,
  Search,
  Calendar,
  FileText,
  GitCompare,
} from "lucide-react";
import { Reveal } from "@/components/reveal";

const features = [
  {
    icon: HeartPulse,
    title: "Health Tracking",
    description:
      "Monitor weight, symptoms and wellbeing over time with clear, visual timelines.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Syringe,
    title: "Vaccination Reminders",
    description:
      "Never miss a vaccine or deworming date again, automatic reminders for every cat.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: FileText,
    title: "Medical Records",
    description:
      "Keep a complete history of vet visits, treatments and surgeries like a digital health passport for your cat.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Search,
    title: "Breed Explorer",
    description:
      "Discover detailed profiles for 50+ breeds: temperament, care needs and more.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Calendar,
    title: "Smart Calendar",
    description:
      "All vet visits, medication and birthdays in one beautifully organized calendar.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
   {
    icon: GitCompare,
    title: "Breed Comparison",
    description:
      "Compare two breeds side by side: temperament, energy, grooming needs and more, at a glance.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Everything your cat needs, in one place
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          From daily care to medical history, CatHub brings every part of
          your cat&apos;s life together.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 80}>
            <div className="group h-full rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}
              >
                <feature.icon className={feature.color} size={24} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}