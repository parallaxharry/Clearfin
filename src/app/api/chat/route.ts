import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { CHAT_MODEL, getSlimCatalogue, buildSystemPrompt } from "@/lib/chatContext";
import { CHAT_TOOLS, runChatTool } from "@/lib/chatTools";
import {
  checkLimits,
  recordUsage,
  logQuestion,
  hashIp,
  clientIpFrom,
} from "@/lib/chatRateLimit";

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

  let body: { messages?: IncomingMessage[]; cardId?: string | null };
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

  const ipHash = hashIp(clientIpFrom(req.headers));
  const decision = await checkLimits(ipHash);
  if (!decision.allowed) {
    return NextResponse.json({ error: decision.message }, { status: 429 });
  }

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
  const citedCards: string[] = [];

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (text: string) => controller.enqueue(encoder.encode(text));
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
            collectCardIds(result, citedCards);
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
        void recordUsage(ipHash, totalTokens);
        void logQuestion(latest.content, citedCards);
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

/** Pull card ids out of a tool result so we can log what was discussed. */
function collectCardIds(result: unknown, into: string[]): void {
  if (!result || typeof result !== "object") return;
  const r = result as { cards?: { id?: string }[]; results?: { id?: string }[] };
  for (const item of [...(r.cards ?? []), ...(r.results ?? [])]) {
    if (item?.id && !into.includes(item.id)) into.push(item.id);
  }
}
