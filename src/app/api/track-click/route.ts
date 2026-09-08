import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // A consent assertion from our client, not authentication or an abuse control.
  if (req.headers.get("x-clearfin-analytics-consent") !== "granted") {
    return NextResponse.json({ ok: false, error: "Analytics consent required." }, { status: 403 });
  }
  let body: unknown;
  try {
    const raw = await req.text();
    if (raw.length > 1024) return NextResponse.json({ ok: false, error: "Body too large." }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)
    || Object.keys(body).length !== 1 || !("cardId" in body)
    || typeof body.cardId !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,99}$/.test(body.cardId)) {
    return NextResponse.json({ ok: false, error: "Valid cardId required." }, { status: 400 });
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("[ClearFin tracking] click: storage_unconfigured");
    return NextResponse.json({ ok: false, error: "Tracking unavailable." }, { status: 503 });
  }
  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error } = await supabase.from("card_clicks").insert({ card_id: body.cardId });
    if (error) throw new Error("storage_failed");
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    // Fixed diagnostic: never log request bodies, database payloads or secrets.
    console.error("[ClearFin tracking] click: storage_failed");
    return NextResponse.json({ ok: false, error: "Tracking unavailable." }, { status: 500 });
  }
}
