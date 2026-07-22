import type { CatBreed } from "@/lib/cat-api";
import type { BreedAttribute, QuizOption } from "@/lib/quiz-questions";

export interface BreedMatch {
  breed: CatBreed;
  score: number;
  matchPercent: number;
}

export function computeMatches(
  breeds: CatBreed[],
  answers: QuizOption[]
): BreedMatch[] {
  const targets: Partial<Record<BreedAttribute, number[]>> = {};
  let wantsHypoallergenic = false;

  for (const answer of answers) {
    if (answer.hypoallergenic) wantsHypoallergenic = true;
    for (const [key, value] of Object.entries(answer.scores)) {
      const attr = key as BreedAttribute;
      if (!targets[attr]) targets[attr] = [];
      targets[attr]!.push(value as number);
    }
  }

  // media pentru fiecare atribut vizat
  const avgTargets: Partial<Record<BreedAttribute, number>> = {};
  for (const key in targets) {
    const attr = key as BreedAttribute;
    const values = targets[attr]!;
    avgTargets[attr] = values.reduce((a, b) => a + b, 0) / values.length;
  }

  const attrKeys = Object.keys(avgTargets) as BreedAttribute[];
  const maxDiffPerAttr = 4; // scala e 1-5, diferența maximă posibilă e 4
  const maxTotalDiff = attrKeys.length * maxDiffPerAttr || 1;

  const matches: BreedMatch[] = breeds.map((breed) => {
    let totalDiff = 0;

    for (const attr of attrKeys) {
      const breedValue = Number(breed[attr]) || 0;
      const target = avgTargets[attr]!;
      totalDiff += Math.abs(breedValue - target);
    }

    // penalizare dacă userul vrea hipoalergenic dar rasa nu e
    if (wantsHypoallergenic && !breed.hypoallergenic) {
      totalDiff += maxDiffPerAttr * 1.5;
    }

    const matchPercent = Math.max(
      0,
      Math.round((1 - totalDiff / (maxTotalDiff + (wantsHypoallergenic ? maxDiffPerAttr * 1.5 : 0))) * 100)
    );

    return { breed, score: totalDiff, matchPercent };
  });

  return matches.sort((a, b) => a.score - b.score);
}