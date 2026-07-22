"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/components/auth-modal-provider";
import { ComingSoonDialog } from "./coming-soon-dialog";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/ forever",
    features: ["Up to 2 cats", "Basic health log", "Reminders", "Breed explorer"],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$6",
    period: "/ per month",
    features: [
      "Unlimited cats",
      "Weight & health trends",
      "Vaccination records",
      "Vet sharing",
      "Data export",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Family",
    price: "$12",
    period: "/ per month",
    features: [
      "Everything in Pro",
      "Up to 6 members",
      "Shared households",
      "Priority support",
    ],
    cta: "Choose Family",
    highlighted: false,
  },
];

export function Pricing() {
  const { openRegister } = useAuthModal();

  return (
    <section className="mx-auto max-w-7xl px-6 py-15">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        Pricing
      </p>
      <h2 className="mt-5 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
        Simple plans for every household
      </h2>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-3xl border bg-card p-8 ${plan.highlighted
                ? "border-primary shadow-xl md:-my-4 md:py-12"
                : "border-border"
              }`}
          >
            {plan.highlighted && (
              <span className="absolute -top-4 left-8 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">
                Most popular
              </span>
            )}

            <h3 className="text-lg font-semibold text-foreground">
              {plan.name}
            </h3>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">
                {plan.price}
              </span>
              <span className="text-sm text-muted-foreground">
                {plan.period}
              </span>
            </div>

            <ul className="mt-8 flex flex-col gap-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span className="text-sm text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <ComingSoonDialog>
              <Button
                size="lg"
                variant={plan.highlighted ? "default" : "outline"}
                className="mt-10 w-full rounded-full"
              >
                {plan.cta}
              </Button>
            </ComingSoonDialog>

          </div>
        ))}
      </div>
    </section>
  );
}