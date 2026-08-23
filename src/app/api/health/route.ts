import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Configuration health check.
 *
 * Reports only whether each variable is PRESENT — never its value, never a
 * prefix, never a length that could narrow a guess. Safe to call publicly.
 *
 * Exists because "I added the key but it still doesn't work" is otherwise
 * impossible to diagnose from outside Vercel: environment variables only
 * apply to deployments created after they are saved, so a running deployment
 * can be missing a variable that looks correctly set in the dashboard.
 */
export function GET() {
  const present = (name: string) => Boolean(process.env[name]?.trim());

  const required = {
    OPENAI_API_KEY: present("OPENAI_API_KEY"),
    SUPABASE_SERVICE_ROLE_KEY: present("SUPABASE_SERVICE_ROLE_KEY"),
    NEXT_PUBLIC_SUPABASE_URL: present("NEXT_PUBLIC_SUPABASE_URL"),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: present("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };

  const optional = {
    CHAT_IP_SALT: present("CHAT_IP_SALT"),
    CHAT_DAILY_TOKEN_CAP: present("CHAT_DAILY_TOKEN_CAP"),
    CHAT_FREE_PROMPTS: present("CHAT_FREE_PROMPTS"),
    CHAT_MAX_PROMPTS: present("CHAT_MAX_PROMPTS"),
  };

  const missing = Object.entries(required)
    .filter(([, ok]) => !ok)
    .map(([name]) => name);

  return NextResponse.json(
    {
      assistantReady: missing.length === 0,
      missing,
      required,
      optional,
      // Confirms which build is answering, so a stale deployment is obvious.
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
      deployedAt: process.env.VERCEL_DEPLOYMENT_ID ? "vercel" : "local",
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
