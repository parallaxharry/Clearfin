/** Application input bounds, not a replacement for edge limits or rate limiting. */
export class RequestBodyError extends Error {
  constructor(public readonly status: 400 | 408 | 413 | 415, message: string) {
    super(message);
  }
}

export async function readBoundedJson(request: Request, maxBytes: number, timeoutMs = 10_000): Promise<unknown> {
  const reject = (status: 400 | 413 | 415, message: string): never => {
    void request.body?.cancel().catch(() => {});
    throw new RequestBodyError(status, message);
  };
  if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
    reject(415, "Please send a JSON request.");
  }
  const length = request.headers.get("content-length");
  if (length !== null) {
    if (!/^\d+$/.test(length)) reject(400, "Invalid request.");
    if (Number(length) > maxBytes) reject(413, "Request too large.");
  }
  if (!request.body) throw new RequestBodyError(400, "Invalid request.");
  const reader = request.body.getReader();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, rejectTimeout) => {
    timer = setTimeout(() => rejectTimeout(new RequestBodyError(408, "Request timed out. Please try again.")), timeoutMs);
  });
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await Promise.race([reader.read(), deadline]);
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) throw new RequestBodyError(413, "Request too large.");
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch (error) {
    // Do not wait for a stalled sender to acknowledge cancellation.
    void reader.cancel().catch(() => {});
    if (error instanceof RequestBodyError) throw error;
    throw new RequestBodyError(400, "Invalid request.");
  } finally {
    clearTimeout(timer);
    reader.releaseLock();
  }
}

export function requestBodyFailure(error: unknown) {
  return error instanceof RequestBodyError
    ? { status: error.status, error: error.message }
    : { status: 400, error: "Invalid request." };
}
