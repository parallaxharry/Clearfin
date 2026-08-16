import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";

/**
 * Spend protection for the public chat endpoint.
 *
 * Two independent limits: messages per visitor per day, and a global daily
 * token ceiling that disables the assistant rather than draining the account.
 *
 * Prefers a Supabase table so limits hold across serverless instances. Until
 * that table exists it falls back to per-instance memory, which is weaker but
 * still bounds a single runaway client. The global token cap is the backstop.
 */

const MESSAGES_PER_IP_PER_DAY = 20;
const DEFAULT_DAILY_TOKEN_CAP = 300_000;

function dailyTokenCap(): number {
  const raw = Number(process.env.CHAT_DAILY_TOKEN_CAP);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_DAILY_TOKEN_CAP;
}

/** UTC day key, e.g. "2026-08-15". Limits reset at UTC midnight. */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Hashed so the raw address is never stored. Note this reduces exposure but is
 * not anonymisation — a hashed IP still distinguishes visitors, so treat it as
 * personal data and cover it in the privacy policy.
 */
export function hashIp(ip: string): string {
  const salt = process.env.CHAT_IP_SALT ?? "clearfin-dev-salt";
  return createHash("sha256").update(`${ip}${salt}`).digest("hex").slice(0, 32);
}

export function clientIpFrom(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ---- in-memory fallback -------------------------------------------------
const memMessages = new Map<string, { day: string; count: number }>();
const memTokens = { day: today(), total: 0 };
let warnedNoTable = false;

export interface LimitDecision {
  allowed: boolean;
  /** Present when not allowed — safe to show the user verbatim. */
  message?: string;
}

export async function checkLimits(ipHash: string): Promise<LimitDecision> {
  const day = today();
  const cap = dailyTokenCap();
  const supabase = serviceClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("chat_usage")
      .select("ip_hash,messages,tokens")
      .eq("day", day);

    if (!error && data) {
      const rows = data as Array<{ ip_hash: string; messages: number; tokens: number }>;
      const totalTokens = rows.reduce((sum, r) => sum + (r.tokens ?? 0), 0);
      if (totalTokens >= cap) return { allowed: false, message: overCapMessage() };

      const mine = rows.find((r) => r.ip_hash === ipHash);
      if (mine && mine.messages >= MESSAGES_PER_IP_PER_DAY) {
        return { allowed: false, message: perIpMessage() };
      }
      return { allowed: true };
    }

    if (error && !warnedNoTable) {
      warnedNoTable = true;
      console.warn(
        "chat_usage table unavailable, falling back to in-memory rate limiting:",
        error.message
      );
    }
  }

  // Fallback path.
  if (memTokens.day !== day) {
    memTokens.day = day;
    memTokens.total = 0;
    memMessages.clear();
  }
  if (memTokens.total >= cap) return { allowed: false, message: overCapMessage() };

  const entry = memMessages.get(ipHash);
  if (entry && entry.day === day && entry.count >= MESSAGES_PER_IP_PER_DAY) {
    return { allowed: false, message: perIpMessage() };
  }
  return { allowed: true };
}

export async function recordUsage(ipHash: string, tokens: number): Promise<void> {
  const day = today();
  const supabase = serviceClient();

  if (supabase) {
    const { error } = await supabase.rpc("bump_chat_usage", {
      p_day: day,
      p_ip_hash: ipHash,
      p_tokens: Math.max(0, Math.round(tokens)),
    });
    if (!error) return;
    if (!warnedNoTable) {
      warnedNoTable = true;
      console.warn("bump_chat_usage unavailable, counting in memory:", error.message);
    }
  }

  if (memTokens.day !== day) {
    memTokens.day = day;
    memTokens.total = 0;
    memMessages.clear();
  }
  memTokens.total += Math.max(0, Math.round(tokens));
  const entry = memMessages.get(ipHash);
  memMessages.set(
    ipHash,
    entry && entry.day === day ? { day, count: entry.count + 1 } : { day, count: 1 }
  );
}

/** Anonymous question log — no IP, no session, no assistant text. */
export async function logQuestion(question: string, cardIds: string[]): Promise<void> {
  const supabase = serviceClient();
  if (!supabase) return;
  const { error } = await supabase.from("chat_questions").insert({
    question: question.slice(0, 500),
    card_ids: cardIds.slice(0, 10),
  });
  if (error) console.warn("chat_questions insert skipped:", error.message);
}

function perIpMessage(): string {
  return `You've reached the daily limit of ${MESSAGES_PER_IP_PER_DAY} questions. It resets at midnight UTC. In the meantime the calculator and card pages have everything I'd tell you.`;
}

function overCapMessage(): string {
  return "The assistant is taking a short break for today. You can still use the calculator and compare tool, which have the same data behind them.";
}
