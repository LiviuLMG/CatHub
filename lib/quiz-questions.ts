import type { CatBreed } from "@/lib/cat-api";

export type BreedAttribute =
  | "energy_level"
  | "affection_level"
  | "intelligence"
  | "child_friendly"
  | "dog_friendly"
  | "social_needs"
  | "shedding_level";

export interface QuizOption {
  label: string;
  scores: Partial<Record<BreedAttribute, number>>;
  hypoallergenic?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "home",
    question: "What's your living situation?",
    options: [
      { label: "Small apartment", scores: { energy_level: 2, social_needs: 4 } },
      { label: "House with a yard", scores: { energy_level: 4, social_needs: 3 } },
    ],
  },
  {
    id: "kids",
    question: "Do you have kids at home?",
    options: [
      { label: "Yes", scores: { child_friendly: 5 } },
      { label: "No", scores: { child_friendly: 2 } },
    ],
  },
  {
    id: "dogs",
    question: "Do you have (or plan to have) a dog?",
    options: [
      { label: "Yes", scores: { dog_friendly: 5 } },
      { label: "No", scores: { dog_friendly: 2 } },
    ],
  },
  {
    id: "schedule",
    question: "How much time do you spend at home?",
    options: [
      {
        label: "I'm home most of the day",
        scores: { social_needs: 4, affection_level: 4 },
      },
      {
        label: "I'm often away (work, travel)",
        scores: { social_needs: 2, affection_level: 2, energy_level: 2 },
      },
    ],
  },
  {
    id: "allergies",
    question: "Does anyone in your home have cat allergies?",
    options: [
      { label: "Yes", scores: {}, hypoallergenic: true },
      { label: "No", scores: {} },
    ],
  },
  {
    id: "experience",
    question: "How experienced are you with cats?",
    options: [
      {
        label: "First-time owner",
        scores: { energy_level: 2, intelligence: 2 },
      },
      {
        label: "Experienced cat owner",
        scores: { energy_level: 4, intelligence: 4 },
      },
    ],
  },
  {
    id: "vibe",
    question: "What vibe are you looking for?",
    options: [
      {
        label: "Calm & cuddly lap cat",
        scores: { energy_level: 1, affection_level: 5 },
      },
      {
        label: "Playful & energetic",
        scores: { energy_level: 5, affection_level: 3 },
      },
    ],
  },
];