import { NextResponse } from "next/server";
import { getAllBreeds } from "@/lib/cat-api";

export async function GET() {
  try {
    const breeds = await getAllBreeds();
    return NextResponse.json(breeds);
  } catch {
    return NextResponse.json(
      { error: "Failed to load breeds" },
      { status: 500 }
    );
  }
}