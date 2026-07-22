const BASE_URL = "https://api.thecatapi.com/v1";

export interface CatBreed {
  id: string;
  name: string;
  origin: string;
  temperament: string;
  description: string;
  life_span: string;
  weight: { imperial: string; metric: string };
  energy_level: number;
  affection_level: number;
  intelligence: number;
  child_friendly: number;
  dog_friendly: number;
  social_needs: number;
  shedding_level: number;
  hypoallergenic: number;
  indoor: number;
  hairless: number;
  wikipedia_url?: string;
  image?: {
    url: string;
  };
}

async function catApiFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "x-api-key": process.env.CAT_API_KEY!,
    },
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error(`TheCatAPI error: ${res.status}`);
  }

  return res.json();
}

async function fetchBreedImage(breedId: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/images/search?breed_ids=${breedId}&limit=1`,
      {
        headers: { "x-api-key": process.env.CAT_API_KEY! },
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data[0]?.url ?? null;
  } catch {
    return null;
  }
}

export async function getAllBreeds(): Promise<CatBreed[]> {
  const breeds = await catApiFetch<CatBreed[]>("/breeds");

  // Pentru rasele fără imagine embedded, cerem una separat, în paralel
  const breedsWithImages = await Promise.all(
    breeds.map(async (breed) => {
      if (breed.image?.url) return breed;
      const url = await fetchBreedImage(breed.id);
      return url ? { ...breed, image: { url } } : breed;
    })
  );

  return breedsWithImages;
}

export async function getBreedById(id: string): Promise<CatBreed> {
  const breed = await catApiFetch<CatBreed>(`/breeds/${id}`);
  if (!breed.image?.url) {
    const url = await fetchBreedImage(breed.id);
    if (url) breed.image = { url };
  }
  return breed;
}

export function getBreedImageUrl(breed: CatBreed): string | null {
  return breed.image?.url ?? null;
}


export function parseWeightRange(breed: CatBreed): { min: number; max: number } | null {
  const raw = breed.weight?.metric;
  if (!raw) return null;

  const parts = raw.split("-").map((p) => parseFloat(p.trim()));
  if (parts.length !== 2 || parts.some((n) => isNaN(n))) return null;

  return { min: parts[0], max: parts[1] };
}

export function findBreedByName(
  breeds: CatBreed[],
  name: string | null
): CatBreed | null {
  if (!name) return null;
  const normalized = name.trim().toLowerCase();
  return breeds.find((b) => b.name.toLowerCase() === normalized) ?? null;
}