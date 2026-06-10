import { sendWhatsApp } from "../../services/twilioService";
import { authService } from "../../services/authService";
import { recordTransaction, getTodaySummary } from "../../services/transactionService";
import { getStock, addStock } from "../../services/inventoryService";
import {
  parseTransactionFromText,
  parseTransactionFromAudio,
  detectIntent,
  answerMarketQuery,
  calculate,
} from "../../services/geminiService";
import { config } from "../../config";
import { t } from "../../i18n/messages";

interface TraderContext {
  trader_id: string;
  language: string;
  fullName: string;
  phone: string;
}

export async function routeMessage(
  from: string, // whatsapp:+234...
  body: string,
  mediaUrl: string | undefined,
  mediaType: string | undefined,
  trader: TraderContext
): Promise<void> {
  if (mediaUrl) {
    await handleVoiceNote(from, mediaUrl, mediaType ?? "audio/ogg", trader);
    return;
  }

  const lower = body.toLowerCase();


  if (lower.includes("dashboard") || lower.includes("stats") || lower.includes("link")) {
    await handleDashboardLink(from, trader.trader_id, trader.language);
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
      await handleDashboardLink(from, trader.trader_id, trader.language);
      break;
    case "market_query":
      await handleMarketQuery(from, body, trader.language);
      break;
    case "calculate":
      await handleCalculate(from, body, trader.language);
      break;
    case "adashi":
      await sendWhatsApp(from, t(trader.language).adashiSoon);
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
  const m = t(trader.language);
  await sendWhatsApp(from, m.voiceProcessing);

  try {
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
      await sendWhatsApp(from, m.voiceNotUnderstood);
      return;
    }

    await saveAndConfirmTransaction(from, parsed, "voice", trader);
  } catch (err) {
    console.error("[voice] error:", err);
    await sendWhatsApp(from, m.voiceError);
  }
}

async function handleTextTransaction(from: string, body: string, trader: TraderContext) {
  const parsed = await parseTransactionFromText(body, trader.language);
  if (!parsed) {
    await sendWhatsApp(from, t(trader.language).txNotFound);
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

  const m = t(trader.language);

  let msg = m.txRecorded({
    type: parsed.transactionType,
    qty: parsed.quantity,
    item: parsed.itemName,
    price: parsed.unitPrice.toLocaleString(),
    total: parsed.total.toLocaleString(),
  });

  if (parsed.transactionType === "sale") {
    msg += m.todayTotalSalesLine(dailyTotal.toLocaleString());
  }

  await sendWhatsApp(from, msg);
}

async function handleTodaySummary(from: string, traderId: string, language: string) {
  const { total, count } = await getTodaySummary(traderId);
  const m = t(language);

  const msg =
    count === 0
      ? m.noSalesToday
      : m.todaySummary({ total: total.toLocaleString(), count });

  await sendWhatsApp(from, msg);
}

async function handleCheckStock(from: string, traderId: string, language: string) {
  const items = await getStock(traderId);
  const m = t(language);

  if (items.length === 0) {
    await sendWhatsApp(from, m.noInventory);
    return;
  }

  const lines = items.map((item) => {
    const icon = item.status === "out" ? "🔴" : item.status === "low" ? "🟡" : "🟢";
    return `${icon} ${item.itemName}: ${item.quantity} ${m.stockUnit}`;
  });

  await sendWhatsApp(from, m.stockReport(lines.join("\n")));
}

async function handleRestockFromText(from: string, body: string, trader: TraderContext) {
  const m = t(trader.language);
  // Re-use transaction parser — expense type = restock
  const parsed = await parseTransactionFromText(body, trader.language);
  if (!parsed || parsed.transactionType !== "expense") {
    await sendWhatsApp(from, m.restockNotUnderstood);
    return;
  }

  await addStock(trader.trader_id, parsed.itemName, parsed.quantity);
  await saveAndConfirmTransaction(from, parsed, "manual", trader);
  await sendWhatsApp(from, m.stockUpdated({ qty: parsed.quantity, item: parsed.itemName }));
}

async function handleDashboardLink(from: string, traderId: string, language: string) {
  const { dashboard_url } = await authService.generateDashboardLink(traderId);
  await sendWhatsApp(from, t(language).dashboardLink(dashboard_url));
}

async function handleMarketQuery(from: string, query: string, language: string) {
  await sendWhatsApp(from, t(language).checkingPrices);
  const answer = await answerMarketQuery(query, language);
  await sendWhatsApp(from, answer);
}

async function handleCalculate(from: string, expression: string, language: string) {
  const result = await calculate(expression, language);
  await sendWhatsApp(from, `🧮 ${result}`);
}

async function sendHelpMenu(from: string, language: string) {
  await sendWhatsApp(from, t(language).helpMenu);
}
