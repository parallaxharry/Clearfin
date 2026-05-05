import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source } = body as { email?: string; source?: string };

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required." }, { status: 400 });
    }

    const { createServerClient } = await import("@supabase/ssr");
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    );

    const { error } = await supabase
      .from("waitlist_users")
      .insert({
        email: email.toLowerCase().trim(),
        source: source ?? "waitlist",
      });

    if (error) {
      // Duplicate email → treat as success (silent dedup)
      if (error.code === "23505") {
        return NextResponse.json({ message: "Already on the list!" }, { status: 200 });
      }
      console.error("Supabase waitlist error:", error);
      return NextResponse.json({ error: "Failed to add to waitlist." }, { status: 500 });
    }

    return NextResponse.json({ message: "Added to waitlist." }, { status: 200 });
  } catch (err) {
    console.error("Waitlist API error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
