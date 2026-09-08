export const MAX_MESSAGE_CHARS = 1000;
export const MAX_HISTORY_TURNS = 10;
export const MAX_CHAT_BODY_BYTES = 65_536;

interface Message { role: "user" | "assistant"; content: string }
export interface ChatRequest {
  messages: Message[];
  clientId: string;
  cardId?: string | null;
  email?: string;
}

/** Match the context already used by the server without shortening the visible conversation. */
export function chatHistoryForRequest(messages: Message[]): Message[] {
  return messages.slice(-MAX_HISTORY_TURNS).map(message => ({
    role: message.role,
    content: message.role === "assistant" ? message.content.slice(0, MAX_MESSAGE_CHARS) : message.content,
  }));
}

export function isChatRequest(body: unknown): body is ChatRequest {
  if (!body || typeof body !== "object" || Array.isArray(body)) return false;
  const value = body as Record<string, unknown>;
  if (Object.keys(value).some(key => !["messages", "clientId", "cardId", "email"].includes(key))) return false;
  if (typeof value.clientId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.clientId)) return false;
  if (value.cardId !== undefined && value.cardId !== null && (typeof value.cardId !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,99}$/.test(value.cardId))) return false;
  if (value.email !== undefined && (typeof value.email !== "string" || value.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.email.trim()))) return false;
  if (!Array.isArray(value.messages) || value.messages.length < 1 || value.messages.length > MAX_HISTORY_TURNS) return false;
  if (!value.messages.every(message => message && typeof message === "object" && !Array.isArray(message)
    && Object.keys(message).every(key => key === "role" || key === "content")
    && (message.role === "user" || message.role === "assistant")
    && typeof message.content === "string" && message.content.length <= MAX_MESSAGE_CHARS)) return false;
  const latest = value.messages[value.messages.length - 1];
  return latest.role === "user" && latest.content.trim().length > 0;
}
