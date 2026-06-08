import { sendWhatsApp } from "../../config/services/twilioService";
import { authService } from "../../config/services/authService";
import { recordTransaction, getTodaySummary } from "../../config/services/transactionService";
import { getStock, addStock } from "../../config/services/inventoryService";
import {
  parseTransactionFromText,
  parseTransactionFromAudio,
  detectIntent,
  answerMarketQuery,
  calculate,
} from "../../config/services/geminiService";
import { config } from "../../config";

interface TraderContext {
  trader_id: string;
  language: string;
  fullName: string;
  phone: string; // raw phone e.g. +2348012345678
}

// Entry point — called for every message from a registered trader
export async function routeMessage(
  from: string, // whatsapp:+234...
  body: string,
  mediaUrl: string | undefined,
  mediaType: string | undefined,
  trader: TraderContext
): Promise<void> {
  // Voice note — parse directly with Gemini (no separate STT step needed)
  if (mediaUrl) {
    await handleVoiceNote(from, mediaUrl, mediaType ?? "audio/ogg", trader);
    return;
  }

  const lower = body.toLowerCase();

  // Fast-path keyword matching before calling Gemini
  if (lower.includes("dashboard") || lower.includes("stats") || lower.includes("link")) {
    await handleDashboardLink(from, trader.trader_id);
    return;
  }

  if (
    lower.includes("how much") ||
    lower.includes("wetin i sell") ||
    lower.includes("today") ||
    lower.includes("summary") ||
    lower.includes("total")
  ) {
    await handleTodaySummary(from, trader.trader_id, trader.language);
    return;
  }

  if (
    (lower.includes("check") || lower.includes("how") || lower.includes("wetin")) &&
    (lower.includes("stock") || lower.includes("inventory") || lower.includes("remain") || lower.includes("still get"))
  ) {
    await handleCheckStock(from, trader.trader_id, trader.language);
    return;
  }

  if (lower.startsWith("calculate") || lower.startsWith("calc") || lower.includes("how much is")) {
    await handleCalculate(from, body, trader.language);
    return;
  }

  // Unknown — let Gemini classify intent
  const intent = await detectIntent(body, trader.language);

  switch (intent) {
    case "record_transaction":
      await handleTextTransaction(from, body, trader);
      break;
    case "check_today_sales":
      await handleTodaySummary(from, trader.trader_id, trader.language);
      break;
    case "check_stock":
      await handleCheckStock(from, trader.trader_id, trader.language);
      break;
    case "restock":
      await handleRestockFromText(from, body, trader);
      break;
    case "dashboard_link":
      await handleDashboardLink(from, trader.trader_id);
      break;
    case "market_query":
      await handleMarketQuery(from, body, trader.language);
      break;
    case "calculate":
      await handleCalculate(from, body, trader.language);
      break;
    case "adashi":
      await sendWhatsApp(from, "Adashi group feature is coming soon! 🔜 For now, reply *dashboard* to see your stats.");
      break;
    default:
      await sendHelpMenu(from, trader.language);
  }
}

// ── Handlers ───────────────────────────────────────────────────────────────

async function handleVoiceNote(
  from: string,
  mediaUrl: string,
  mimeType: string,
  trader: TraderContext
) {
  await sendWhatsApp(from, "🎙️ Got your voice note, processing...");

  try {
    // Download audio — Twilio media URLs need Basic Auth
    const response = await fetch(mediaUrl, {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${config.TWILIO_ACCOUNT_SID}:${config.TWILIO_AUTH_TOKEN}`).toString("base64"),
      },
    });

    if (!response.ok) throw new Error(`Media fetch failed: ${response.status}`);
    const buffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(buffer).toString("base64");

    const parsed = await parseTransactionFromAudio(audioBase64, mimeType, trader.language);
    if (!parsed) {
      await sendWhatsApp(from, "I couldn't understand that voice note. Please try saying it clearly, e.g. *'I sold 5 bags of rice at ₦3,500 each.'*");
      return;
    }

    await saveAndConfirmTransaction(from, parsed, "voice", trader);
  } catch (err) {
    console.error("[voice] error:", err);
    await sendWhatsApp(from, "Sorry, I had trouble processing that voice note. Please try again.");
  }
}

async function handleTextTransaction(from: string, body: string, trader: TraderContext) {
  const parsed = await parseTransactionFromText(body, trader.language);
  if (!parsed) {
    await sendWhatsApp(from, "I couldn't find a transaction in that message. Try: *'I sold 5 bags of rice at ₦3,500 each.'*");
    return;
  }
  await saveAndConfirmTransaction(from, parsed, "manual", trader);
}

async function saveAndConfirmTransaction(
  from: string,
  parsed: Awaited<ReturnType<typeof parseTransactionFromText>> & {},
  source: "voice" | "manual",
  trader: TraderContext
) {
  if (!parsed) return;
  const { transaction, dailyTotal, lowStockAlert } = await recordTransaction({
    traderId: trader.trader_id,
    traderPhone: trader.phone,
    itemName: parsed.itemName,
    quantity: parsed.quantity,
    unitPrice: parsed.unitPrice,
    totalAmount: parsed.total,
    transactionType: parsed.transactionType,
    source,
    languageUsed: trader.language,
  });

  const typeEmoji = parsed.transactionType === "sale" ? "💰" : "🛒";
  const verb = parsed.transactionType === "sale" ? "Sold" : "Bought";

  let msg = `✅ Recorded!\n\n${typeEmoji} ${verb}: ${parsed.quantity} ${parsed.itemName} @ ₦${parsed.unitPrice.toLocaleString()} = *₦${parsed.total.toLocaleString()}*`;

  if (parsed.transactionType === "sale") {
    msg += `\n\n📊 Today's total sales: *₦${dailyTotal.toLocaleString()}*`;
  }

  await sendWhatsApp(from, msg);
}

async function handleTodaySummary(from: string, traderId: string, language: string) {
  const { total, count } = await getTodaySummary(traderId);

  const msg =
    count === 0
      ? "No sales recorded today yet. Send a voice note or type a sale to get started!"
      : `📊 Today's summary:\n\n💰 Total sales: *₦${total.toLocaleString()}*\n📦 Transactions: *${count}*\n\nReply *dashboard* to see charts and details.`;

  await sendWhatsApp(from, msg);
}

async function handleCheckStock(from: string, traderId: string, language: string) {
  const items = await getStock(traderId);

  if (items.length === 0) {
    await sendWhatsApp(from, "You have no items in inventory yet. Say *'I bought 10 bags of rice'* to add stock.");
    return;
  }

  const lines = items.map((item) => {
    const icon = item.status === "out" ? "🔴" : item.status === "low" ? "🟡" : "🟢";
    return `${icon} ${item.itemName}: ${item.quantity} units`;
  });

  await sendWhatsApp(from, `📦 Your stock levels:\n\n${lines.join("\n")}\n\n🔴 Out  🟡 Low  🟢 OK`);
}

async function handleRestockFromText(from: string, body: string, trader: TraderContext) {
  // Re-use transaction parser — expense type = restock
  const parsed = await parseTransactionFromText(body, trader.language);
  if (!parsed || parsed.transactionType !== "expense") {
    await sendWhatsApp(from, "I couldn't understand the restock. Try: *'I bought 20 bags of rice at ₦3,000 each.'*");
    return;
  }

  await addStock(trader.trader_id, parsed.itemName, parsed.quantity);
  await saveAndConfirmTransaction(from, parsed, "manual", trader);
  await sendWhatsApp(from, `📦 Stock updated! Added ${parsed.quantity} ${parsed.itemName} to inventory.`);
}

async function handleDashboardLink(from: string, traderId: string) {
  const { dashboard_url } = await authService.generateDashboardLink(traderId);
  await sendWhatsApp(
    from,
    `Here is your dashboard link — tap to open 👇\n\n${dashboard_url}\n\n_Link expires in 24 hours. Reply *dashboard* anytime for a fresh one._`
  );
}

async function handleMarketQuery(from: string, query: string, language: string) {
  await sendWhatsApp(from, "🔍 Checking market prices...");
  const answer = await answerMarketQuery(query, language);
  await sendWhatsApp(from, answer);
}

async function handleCalculate(from: string, expression: string, language: string) {
  const result = await calculate(expression, language);
  await sendWhatsApp(from, `🧮 ${result}`);
}

async function sendHelpMenu(from: string, language: string) {
  await sendWhatsApp(
    from,
    `Here's what I can do for you:\n\n🎙️ *Voice note* — record a sale or expense\n💬 *Type a sale* — e.g. "I sold 5 tomatoes at ₦500"\n📊 *How much I make today?* — daily summary\n📦 *Check my stock* — inventory levels\n💹 *Tomato price in Lagos?* — market intelligence\n🧮 *Calculate 3 bags at ₦4,200* — quick math\n🔗 *Dashboard* — see your full stats\n\nReply with any of the above!`
  );
}
