import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { cardId } = await req.json();

    if (!cardId || typeof cardId !== "string") {
      return NextResponse.json({ error: "Valid cardId required." }, { status: 400 });
    }

    const { createServerClient } = await import("@supabase/ssr");
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    );

    const { error } = await supabase
      .from("card_clicks")
      .insert({ card_id: cardId });

    if (error) {
      console.error("Supabase card_clicks error:", error);
      // Don't block the user — clicks are analytics only
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("track-click error:", err);
    // Silent — analytics should never break UX
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}
