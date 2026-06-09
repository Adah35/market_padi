import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../index";

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const flash = () => genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export type ParsedTransaction = {
  itemName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  transactionType: "sale" | "expense";
};

export type Intent =
  | "record_transaction"
  | "check_today_sales"
  | "check_stock"
  | "restock"
  | "dashboard_link"
  | "market_query"
  | "calculate"
  | "adashi"
  | "help";

// ── Transaction parsing from text ──────────────────────────────────────────

export async function parseTransactionFromText(
  text: string,
  language: string
): Promise<ParsedTransaction | null> {
  const prompt = `You are a bookkeeping assistant for Nigerian market traders.
Extract the transaction from this message and return ONLY valid JSON with no extra text or markdown.

Message (language: ${language}): "${text}"

Return exactly this JSON:
{
  "itemName": "name of item",
  "quantity": <number>,
  "unitPrice": <number>,
  "total": <number>,
  "transactionType": "sale" or "expense"
}

Rules:
- "sale" = trader sold something to a customer
- "expense" = trader bought/spent (restock, supplies, transport, etc.)
- If total is not stated, calculate it as quantity * unitPrice
- If you cannot find a clear transaction, return: { "error": "no_transaction" }`;

  try {
    const result = await flash().generateContent(prompt);
    const raw = result.response.text().trim().replace(/^```json|```$/g, "").trim();
    const parsed = JSON.parse(raw);
    if (parsed.error) return null;
    return parsed as ParsedTransaction;
  } catch {
    return null;
  }
}


export async function parseTransactionFromAudio(
  audioBase64: string,
  mimeType: string,
  language: string
): Promise<ParsedTransaction | null> {
  const prompt = `You are a bookkeeping assistant for Nigerian market traders.
The trader sent a voice note (language: ${language}).
Listen carefully and extract the transaction they described.
Return ONLY valid JSON with no extra text or markdown:

{
  "itemName": "name of item",
  "quantity": <number>,
  "unitPrice": <number>,
  "total": <number>,
  "transactionType": "sale" or "expense"
}

If you cannot find a clear transaction, return: { "error": "no_transaction" }`;

  try {
    const result = await flash().generateContent([
      { inlineData: { data: audioBase64, mimeType } },
      prompt,
    ]);
    const raw = result.response.text().trim().replace(/^```json|```$/g, "").trim();
    const parsed = JSON.parse(raw);
    if (parsed.error) return null;
    return parsed as ParsedTransaction;
  } catch {
    return null;
  }
}

// ── Intent detection for unknown messages ─────────────────────────────────

export async function detectIntent(
  text: string,
  language: string
): Promise<Intent> {
  const prompt = `You are classifying a WhatsApp message from a Nigerian market trader.
Message (language: ${language}): "${text}"

Return ONLY one of these exact strings — no explanation, no punctuation:
record_transaction
check_today_sales
check_stock
restock
dashboard_link
market_query
calculate
adashi
help

Rules:
- record_transaction: selling or recording an expense
- check_today_sales: asking about today's earnings or sales total
- check_stock: asking about current inventory levels
- restock: adding new stock / buying more items
- dashboard_link: wants the dashboard URL or a link to see stats
- market_query: asking current price of something in the market
- calculate: asking to do math (e.g. "3 bags at 4200 each")
- adashi: anything about savings group, adashi, ajo, isusu
- help: anything else or unclear`;

  try {
    const result = await flash().generateContent(prompt);
    const intent = result.response.text().trim() as Intent;
    const valid: Intent[] = [
      "record_transaction", "check_today_sales", "check_stock",
      "restock", "dashboard_link", "market_query", "calculate", "adashi", "help",
    ];
    return valid.includes(intent) ? intent : "help";
  } catch {
    return "help";
  }
}

// ── Market intelligence ────────────────────────────────────────────────────

export async function answerMarketQuery(
  query: string,
  language: string
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    tools: [{ googleSearch: {} } as any],
  });

  const prompt = `You are a market price assistant for Nigerian traders.
Answer this question in ${language} in 2-3 short sentences.
Be specific — give actual price ranges in Naira if possible.
Question: "${query}"`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch {
    return "I could not find market price data right now. Please try again later.";
  }
}

// ── Confirmation detection ─────────────────────────────────────────────────
// Used during registration when we ask "Is your name X — is that correct?"
// Local patterns handle the obvious cases; Gemini only fires for ambiguous input.

const YES_RE = /^(yes|yh|yep|yeah|yea|y|ok|okay|correct|right|sure|true|confirmed|affirmative|that'?s? (right|correct)|it'?s? (correct|right)|ja|fine|perfect|exactly|sure thing|👍|✓|✅)$/i;
const NO_RE = /^(no|nope|nah|nah|not|wrong|incorrect|change|n|never|nada)$/i;

export async function isConfirmation(text: string): Promise<boolean> {
  const trimmed = text.trim();

  if (YES_RE.test(trimmed)) return true;
  if (NO_RE.test(trimmed)) return false;

  // Ambiguous — ask Gemini rather than guessing
  const prompt = `Reply with only the word "yes" or "no".
Is this message a confirmation or agreement? Message: "${trimmed}"`;
  try {
    const result = await flash().generateContent(prompt);
    return result.response.text().trim().toLowerCase().startsWith("yes");
  } catch {
    return false; // Treat ambiguous as "no — use whatever they typed as their name"
  }
}

// ── Voice calculator ───────────────────────────────────────────────────────

export async function calculate(expression: string, language: string): Promise<string> {
  const prompt = `A Nigerian market trader said: "${expression}"
Extract the calculation they want and compute the answer.
Reply in ${language} in one short sentence with the result in Naira (₦) if it's money.
Example: "3 bags at ₦4,200 each = ₦12,600"
Return ONLY the answer sentence, nothing else.`;

  try {
    const result = await flash().generateContent(prompt);
    return result.response.text().trim();
  } catch {
    return "I could not calculate that. Please try again.";
  }
}
