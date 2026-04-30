import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required." }, { status: 400 });
    }

    // Lazy import to avoid build errors if @supabase/ssr isn't installed yet
    const { createServerClient } = await import("@supabase/ssr");
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    );

    const { error } = await supabase
      .from("waitlist_users")
      .insert({ email: email.toLowerCase().trim() });

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
