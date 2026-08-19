import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";

/**
 * ClearFin Ask usage funnel.
 *
 * Every browser gets a client id (stored in localStorage) and a lifetime
 * allowance of prompts:
 *   1-10  free
 *   11    an email address is required before answering
 *   12-20 answered, tied to that email
 *   21+   refused, with a prompt to contact info@clearfin.ca
 *
 * The allowance never resets. Message history is purged after 7 days by a
 * pg_cron job, but chat_sessions.prompt_count survives that purge so the cap
 * still holds.
 */

/** Overridable so the funnel can be tuned without a code change. */
function positiveInt(raw: string | undefined, fallback: number): number {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

export const FREE_PROMPTS = positiveInt(process.env.CHAT_FREE_PROMPTS, 10);
export const MAX_PROMPTS = positiveInt(process.env.CHAT_MAX_PROMPTS, 20);
export const CONTACT_EMAIL = "info@clearfin.ca";

const DEFAULT_DAILY_TOKEN_CAP = 300_000;

export interface SessionState {
  promptCount: number;
  email: string | null;
}

export type GateResult =
  | { allow: true; email: string | null }
  | { allow: false; reason: "email_required" | "limit_reached" | "unavailable"; message: string };

function dailyTokenCap(): number {
  const raw = Number(process.env.CHAT_DAILY_TOKEN_CAP);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_DAILY_TOKEN_CAP;
}

export function hashIp(ip: string): string {
  const salt = process.env.CHAT_IP_SALT ?? "clearfin-dev-salt";
  return createHash("sha256").update(`${ip}${salt}`).digest("hex").slice(0, 32);
}

export function clientIpFrom(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}

/** Deliberately permissive — we cannot verify ownership, only shape. */
export function isValidEmail(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
  );
}

export function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ── Development fallback ────────────────────────────────────────────────
// Without the service-role key nothing can be persisted. In production that
// means the funnel is unenforceable, so we refuse rather than quietly serve
// an uncapped assistant. Locally we count in memory so the flow is testable.
const memSessions = new Map<string, { promptCount: number; email: string | null }>();
let warnedNoService = false;

function noServiceClient(): boolean {
  if (!warnedNoService) {
    warnedNoService = true;
    console.warn(
      "SUPABASE_SERVICE_ROLE_KEY missing — ClearFin Ask cannot persist sessions. " +
        (process.env.NODE_ENV === "production"
          ? "Refusing requests in production."
          : "Counting in memory for local development.")
    );
  }
  return process.env.NODE_ENV === "production";
}

export async function getSession(clientId: string, ipHash: string): Promise<SessionState> {
  const supabase = serviceClient();
  if (!supabase) {
    const entry = memSessions.get(clientId) ?? { promptCount: 0, email: null };
    memSessions.set(clientId, entry);
    return entry;
  }

  const { data, error } = await supabase.rpc("chat_touch_session", {
    p_client_id: clientId,
    p_ip_hash: ipHash,
  });
  if (error) {
    console.error("chat_touch_session failed:", error.message);
    return { promptCount: 0, email: null };
  }
  const row = Array.isArray(data) ? data[0] : data;
  return {
    promptCount: row?.prompt_count ?? 0,
    email: row?.email ?? null,
  };
}

/** Decide whether this prompt may be answered. */
export async function checkGate(
  session: SessionState,
  suppliedEmail: unknown
): Promise<GateResult> {
  if (session.promptCount >= MAX_PROMPTS) {
    return {
      allow: false,
      reason: "limit_reached",
      message: `You've used all ${MAX_PROMPTS} questions. For anything more detailed, email ${CONTACT_EMAIL} and the team will set up a session with an expert.`,
    };
  }

  const email = session.email ?? (isValidEmail(suppliedEmail) ? suppliedEmail.trim() : null);

  if (session.promptCount >= FREE_PROMPTS && !email) {
    return {
      allow: false,
      reason: "email_required",
      message: `You've used your first ${FREE_PROMPTS} questions. Enter your email to continue — you get ${MAX_PROMPTS - FREE_PROMPTS} more.`,
    };
  }

  if (!serviceClient() && noServiceClient()) {
    return {
      allow: false,
      reason: "unavailable",
      message: "The assistant is temporarily unavailable. Please try again shortly.",
    };
  }

  return { allow: true, email };
}

/** Global spend ceiling, independent of any single visitor. */
export async function dailyCapExceeded(): Promise<boolean> {
  const supabase = serviceClient();
  if (!supabase) return false;
  const { data, error } = await supabase
    .from("chat_daily_usage")
    .select("tokens")
    .eq("day", new Date().toISOString().slice(0, 10))
    .maybeSingle();
  if (error || !data) return false;
  return (data.tokens ?? 0) >= dailyTokenCap();
}

export async function setEmail(clientId: string, email: string): Promise<void> {
  const supabase = serviceClient();
  if (!supabase) {
    const entry = memSessions.get(clientId);
    if (entry) entry.email = email;
    return;
  }
  const { error } = await supabase.rpc("chat_set_email", {
    p_client_id: clientId,
    p_email: email,
  });
  if (error) console.error("chat_set_email failed:", error.message);
}

export async function recordPrompt(clientId: string, tokens: number): Promise<void> {
  const supabase = serviceClient();
  if (!supabase) {
    const entry = memSessions.get(clientId);
    if (entry) entry.promptCount += 1;
    return;
  }
  const { error } = await supabase.rpc("chat_record_prompt", {
    p_client_id: clientId,
    p_tokens: Math.max(0, Math.round(tokens)),
  });
  if (error) console.error("chat_record_prompt failed:", error.message);
}

/** Store one side of the conversation. Purged after 7 days. */
export async function logMessage(
  clientId: string,
  email: string | null,
  role: "user" | "assistant",
  content: string
): Promise<void> {
  const supabase = serviceClient();
  if (!supabase || !content.trim()) return;
  const { error } = await supabase.from("chat_messages").insert({
    client_id: clientId,
    email,
    role,
    content: content.slice(0, 8000),
  });
  if (error) console.warn("chat_messages insert skipped:", error.message);
}
