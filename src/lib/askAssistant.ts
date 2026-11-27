/** Window event the site-wide ChatWidget listens for. */
export const ASK_EVENT = "clearfin:ask";

/** Open the card assistant and send it a question (an empty one just opens it). */
export function askAssistant(question = "") {
  window.dispatchEvent(new CustomEvent<string>(ASK_EVENT, { detail: question }));
}
