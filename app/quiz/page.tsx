import { getAllBreeds } from "@/lib/cat-api";
import { QuizFlow } from "@/components/quiz-flow";

export default async function QuizPage() {
  const breeds = await getAllBreeds();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Find Your Cat
        </p>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          What breed matches your lifestyle?
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
          Answer a few quick questions and we&apos;ll match you with a breed
          that fits your home and habits.
        </p>
      </div>

      <QuizFlow breeds={breeds} />
    </main>
  );
}