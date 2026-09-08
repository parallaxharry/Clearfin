import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { readBoundedJson, requestBodyFailure } from "@/lib/requestBody";

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await readBoundedJson(req, 4096); }
  catch (error) {
    const failure = requestBodyFailure(error);
    return NextResponse.json({ error: failure.error }, { status: failure.status });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)
    || Object.keys(body).some(key => key !== "email" && key !== "source")) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { email: rawEmail, source = "waitlist" } = body as { email?: unknown; source?: unknown };
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  if (!email || email.length > 254 || email.split("@")[0].length > 64 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (typeof source !== "string" || !source.trim() || source.trim().length > 100) {
    return NextResponse.json({ error: "Invalid request source." }, { status: 400 });
  }
  try {
    // Check env vars exist
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase env vars:", {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
      });
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from("waitlist_users")
      .insert({
        email,
        source: source.trim(),
      });

    if (error) {
      // Duplicate email → treat as success (silent dedup)
      if (error.code === "23505") {
        return NextResponse.json({ message: "Already on the list!", created: false }, { status: 200 });
      }
      console.error("Supabase waitlist error code:", error.code);
      return NextResponse.json({ error: "Failed to add to waitlist." }, { status: 500 });
    }

    return NextResponse.json({ message: "Added to waitlist.", created: true }, { status: 200 });
  } catch {
    console.error("Waitlist API unavailable");
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
