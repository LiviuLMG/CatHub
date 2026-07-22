import { getAllBreeds } from "@/lib/cat-api";
import { Hero } from "@/components/hero";
import { Stats } from "@/components/stats";
import { Features } from "@/components/features";
import { BreedLibrary } from "@/components/breed-library";
import { Pricing } from "@/components/pricing";
import { Newsletter } from "@/components/newsletter";
import { Reveal } from "@/components/reveal";

export default async function Home() {
  const breeds = await getAllBreeds();

  return (
    <main className="relative">
      <Hero />
      <Reveal>
        <Stats />
      </Reveal>
      <Reveal>
        <Features />
      </Reveal>
      <Reveal>
        <BreedLibrary breeds={breeds} />
      </Reveal>
      <Reveal>
        <Pricing />
      </Reveal>
      <Reveal>
        <Newsletter />
      </Reveal>
    </main>
  );
}