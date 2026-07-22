"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw, Cat as CatIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { quizQuestions, type QuizOption } from "@/lib/quiz-questions";
import { computeMatches } from "@/lib/quiz-scoring";
import { getBreedImageUrl, type CatBreed } from "@/lib/cat-api";

interface QuizFlowProps {
  breeds: CatBreed[];
}

export function QuizFlow({ breeds }: QuizFlowProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizOption[]>([]);
  const [showResults, setShowResults] = useState(false);

  const isLastQuestion = step === quizQuestions.length - 1;

  function selectOption(option: QuizOption) {
    const newAnswers = [...answers.slice(0, step), option];
    setAnswers(newAnswers);

    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setStep((s) => s + 1);
    }
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  function restart() {
    setStep(0);
    setAnswers([]);
    setShowResults(false);
  }

  if (showResults) {
    const matches = computeMatches(breeds, answers);
    const [top, ...runnerUps] = matches;
    const topImage = getBreedImageUrl(top.breed);

    return (
      <div className="flex flex-col items-center text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Your best match
        </p>

        <div className="mt-6 w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
          <div className="relative aspect-square w-full bg-muted">
            {topImage ? (
              <Image
                src={topImage}
                alt={top.breed.name}
                fill
                sizes="384px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <CatIcon size={48} className="text-muted-foreground/40" />
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="mx-auto mb-2 w-fit rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
              {top.matchPercent}% match
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {top.breed.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {top.breed.origin}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {top.breed.description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href={`/breeds/${top.breed.id}`} />}
          >
            View full profile
          </Button>
          <Button size="lg" variant="outline" onClick={restart} className="gap-2">
            <RotateCcw size={16} />
            Retake quiz
          </Button>
        </div>

        {runnerUps.length > 0 && (
          <div className="mt-16 w-full">
            <h3 className="text-lg font-semibold text-foreground">
              Other good matches
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {runnerUps.slice(0, 2).map(({ breed, matchPercent }) => {
                const imageUrl = getBreedImageUrl(breed);
                return (
                  <Link
                    key={breed.id}
                    href={`/breeds/${breed.id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-shadow hover:shadow-md"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={breed.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <CatIcon size={20} className="text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {breed.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {matchPercent}% match
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentQuestion = quizQuestions[step];

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-10">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs font-medium text-muted-foreground">
          Question {step + 1} of {quizQuestions.length}
        </p>
      </div>

      <div key={step} className="animate-step-in-forward">
        <h2 className="text-center text-2xl font-bold text-foreground">
          {currentQuestion.question}
        </h2>

        <div className="mx-auto mt-8 grid max-w-lg gap-3 sm:grid-cols-2">
          {currentQuestion.options.map((option) => (
            <button
              key={option.label}
              onClick={() => selectOption(option)}
              className="rounded-2xl border border-border bg-card p-6 text-center font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {step > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>
      )}
    </div>
  );
}