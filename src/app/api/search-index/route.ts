import { NextResponse } from "next/server";
import { getRichSearchIndex } from "@/lib/cardDetail";

// ISR like the rest of the site: the palette's rich index refreshes from
// card_catalog every ~5 min without a redeploy.
export const revalidate = 300;

export async function GET() {
  const index = await getRichSearchIndex();
  return NextResponse.json(index);
}
