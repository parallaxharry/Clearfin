import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { CHAT_MODEL, getSlimCatalogue, buildSystemPrompt } from "@/lib/chatContext";
import { CHAT_TOOLS, runChatTool } from "@/lib/chatTools";
import {
  getSession,
  checkGate,
  dailyCapExceeded,
  setEmail,
  recordPrompt,
  logMessage,
  isValidEmail,
  isUuid,
  hashIp,
  clientIpFrom,
  MAX_PROMPTS,
  FREE_PROMPTS,
  CONTACT_EMAIL,
} from "@/lib/chatSession";

export const runtime = "nodejs";
/** Never cache a conversation. */
export const dynamic = "force-dynamic";

const MAX_MESSAGE_CHARS = 1000;
const MAX_HISTORY_TURNS = 10;
const REQUEST_TIMEOUT_MS = 45_000;

/**
 * Status updates are inlined in the text stream, wrapped in RS (0x1E) so the
 * client can pull them out. Card answers never contain that control character.
 */
const RS = "\x1E";

const TOOL_STATUS: Record<string, string> = {
  get_card_details: "Looking up the card details",
  rank_cards: "Running your numbers",
};

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "The assistant isn't configured yet." },
      { status: 503 }
    );
  }

  let body: {
    messages?: IncomingMessage[];
    cardId?: string | null;
    clientId?: string;
    email?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const history = Array.isArray(body.messages) ? body.messages : [];
  const latest = history[history.length - 1];
  if (!latest || latest.role !== "user" || typeof latest.content !== "string") {
    return NextResponse.json({ error: "No question supplied." }, { status: 400 });
  }
  if (latest.content.trim().length === 0) {
    return NextResponse.json({ error: "No question supplied." }, { status: 400 });
  }
  if (latest.content.length > MAX_MESSAGE_CHARS) {
    return NextResponse.json(
      { error: `Please keep questions under ${MAX_MESSAGE_CHARS} characters.` },
      { status: 400 }
    );
  }

  if (!isUuid(body.clientId)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const clientId = body.clientId;

  const ipHash = hashIp(clientIpFrom(req.headers));
  const session = await getSession(clientId, ipHash);

  // Global spend ceiling, checked before anything visitor-specific.
  if (await dailyCapExceeded()) {
    return NextResponse.json(
      {
        error:
          "The assistant is taking a short break for today. The calculator and compare tool run on the same data.",
      },
      { status: 429 }
    );
  }

  const gate = await checkGate(session, body.email);
  if (!gate.allow) {
    // 428 tells the widget to show the email form; 429 is a hard stop.
    const status = gate.reason === "email_required" ? 428 : 429;
    return NextResponse.json(
      {
        error: gate.message,
        reason: gate.reason,
        promptsUsed: session.promptCount,
        maxPrompts: MAX_PROMPTS,
        freePrompts: FREE_PROMPTS,
        contactEmail: CONTACT_EMAIL,
      },
      { status }
    );
  }

  // First time an address arrives, attach it to the session and backfill it
  // onto the prompts this visitor already sent.
  if (!session.email && isValidEmail(body.email)) {
    await setEmail(clientId, body.email.trim());
  }
  const sessionEmail = gate.email;

  void logMessage(clientId, sessionEmail, "user", latest.content);

  const catalogue = await getSlimCatalogue();
  const cardId =
    typeof body.cardId === "string" && catalogue.some((c) => c.id === body.cardId)
      ? body.cardId
      : null;

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: buildSystemPrompt(catalogue, cardId) },
    ...history
      .slice(-MAX_HISTORY_TURNS)
      .filter((m) => (m.role === "user" || m.role === "assistant") && m.content?.trim())
      .map((m) => ({
        role: m.role,
        content: m.content.slice(0, MAX_MESSAGE_CHARS),
      })) as ChatCompletionMessageParam[],
  ];

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const encoder = new TextEncoder();
  let totalTokens = 0;

  let answerText = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (text: string) => {
        // Status markers are UI-only; keep them out of the stored transcript.
        if (!text.startsWith(RS)) answerText += text;
        controller.enqueue(encoder.encode(text));
      };
      const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);

      try {
        // Pass 1 — the model either answers directly or asks for tools.
        const first = await client.chat.completions.create(
          {
            model: CHAT_MODEL,
            messages,
            tools: CHAT_TOOLS,
            stream: true,
            stream_options: { include_usage: true },
          },
          { signal: timeout }
        );

        const toolCalls: { id: string; name: string; args: string }[] = [];

        for await (const chunk of first) {
          if (chunk.usage) totalTokens += chunk.usage.total_tokens ?? 0;
          const delta = chunk.choices[0]?.delta;
          if (!delta) continue;

          if (delta.content) send(delta.content);

          for (const tc of delta.tool_calls ?? []) {
            const slot = (toolCalls[tc.index] ??= { id: "", name: "", args: "" });
            if (tc.id) slot.id = tc.id;
            if (tc.function?.name) slot.name = tc.function.name;
            if (tc.function?.arguments) slot.args += tc.function.arguments;
          }
        }

        const calls = toolCalls.filter((t) => t?.name);
        if (calls.length > 0) {
          // Lookups take several seconds — say what's happening rather than
          // leaving the user watching a silent spinner.
          const label = TOOL_STATUS[calls[0].name] ?? "Checking the card data";
          send(`${RS}${label}${RS}`);

          messages.push({
            role: "assistant",
            content: null,
            tool_calls: calls.map((t) => ({
              id: t.id,
              type: "function" as const,
              function: { name: t.name, arguments: t.args || "{}" },
            })),
          });

          for (const call of calls) {
            const result = await runChatTool(call.name, call.args);
            messages.push({
              role: "tool",
              tool_call_id: call.id,
              content: JSON.stringify(result),
            });
          }

          // Pass 2 — write the answer using the tool results.
          const second = await client.chat.completions.create(
            {
              model: CHAT_MODEL,
              messages,
              stream: true,
              stream_options: { include_usage: true },
            },
            { signal: timeout }
          );

          for await (const chunk of second) {
            if (chunk.usage) totalTokens += chunk.usage.total_tokens ?? 0;
            const text = chunk.choices[0]?.delta?.content;
            if (text) send(text);
          }
        }
      } catch (err) {
        console.error("chat route error:", err instanceof Error ? err.message : err);
        send(
          "\n\nSorry — I couldn't finish that one. You can try again, or use the calculator and compare tool, which run on the same data."
        );
      } finally {
        controller.close();
        // Accounting must not block the response.
        void recordPrompt(clientId, totalTokens);
        void logMessage(clientId, sessionEmail, "assistant", answerText);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

