import { Router, Request, Response } from "express";
import twilio from "twilio";
import { config } from "../config";
import { authService } from "../config/services/authService";
import { sendWhatsApp } from "../config/services/twilioService";
import { sessionStore } from "../config/services/sessionStore";

export const twilioWebhookRouter = Router();

function validateTwilioSignature(req: Request, res: Response, next: () => void) {
  const signature = req.headers["x-twilio-signature"] as string;
  const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

  const valid = twilio.validateRequest(
    config.TWILIO_AUTH_TOKEN,
    signature,
    url,
    req.body as Record<string, string>
  );

  if (!valid && process.env.NODE_ENV === "production") {
    res.status(403).send("Forbidden");
    return;
  }
  next();
}

const LANGUAGE_MAP: Record<string, "english" | "pidgin" | "hausa" | "yoruba" | "igbo"> = {
  "1": "english",
  "2": "pidgin",
  "3": "hausa",
  "4": "yoruba",
  "5": "igbo",
};

const LANG_GREETINGS: Record<string, string> = {
  english: "You're all set",
  pidgin: "You don set",
  hausa: "An kafa ku",
  yoruba: "O ti ṣetan",
  igbo: "Ị dị njikere",
};

twilioWebhookRouter.post(
  "/whatsapp",
  validateTwilioSignature,
  async (req: Request, res: Response) => {
    // Twilio sends form data
    const from: string = req.body.From ?? ""; 
    const body: string = (req.body.Body ?? "").trim();
    const phone = from.replace("whatsapp:", "");

    res.status(200).send();

    try {
      const session = sessionStore.get(phone);

      if (session) {
        if (session.step === "awaiting_name") {
          sessionStore.set(phone, { step: "awaiting_language", name: body });
          await sendWhatsApp(
            from,
            `Nice to meet you, ${body}! 🌍 Choose your language:\n\n1️⃣ English\n2️⃣ Pidgin\n3️⃣ Hausa\n4️⃣ Yoruba\n5️⃣ Igbo\n\nReply with a number.`
          );
          return;
        }

        if (session.step === "awaiting_language") {
          const language = LANGUAGE_MAP[body];
          if (!language) {
            await sendWhatsApp(from, "Please reply with a number between 1 and 5.");
            return;
          }

          const { trader_id, dashboardToken } = await authService.registerTrader({
            phoneNumber: phone,
            fullName: session.name!,
            language,
          });

          sessionStore.clear(phone);

          const greeting = LANG_GREETINGS[language];
          await sendWhatsApp(
            from,
            `${greeting}, ${session.name}! 🎉 Your account is ready.\n\nTry saying a sale — e.g. "I sold 5 bags of rice at ₦3,500 each."\n\nOr reply *dashboard* to see your stats.`
          );
          return;
        }
      }

      const check = await authService.checkTrader(phone);

      if (!check.exists) {
        sessionStore.set(phone, { step: "awaiting_name" });
        await sendWhatsApp(
          from,
          "Welcome to Marketpadi! 👋\n\nI help you track sales, manage stock, and run your Adashi group — all on WhatsApp.\n\nWhat is your name?"
        );
        return;
      }

      const lower = body.toLowerCase();

      if (
        lower.includes("dashboard") ||
        lower.includes("stats") ||
        lower.includes("link") ||
        lower.includes("show")
      ) {
        const { dashboard_url } = await authService.generateDashboardLink(
          check.trader_id as string
        );
        await sendWhatsApp(
          from,
          `Here is your dashboard link — tap to open 👇\n\n${dashboard_url}\n\n_Link expires in 24 hours. Reply *dashboard* anytime to get a fresh one._`
        );
        return;
      }

      await sendWhatsApp(
        from,
        "Got it! 👍\n\nHere's what you can do:\n• Reply *dashboard* — see your sales & stats\n• Send a voice note — record a sale\n• Say *how much I make today* — daily summary\n• Say *check my stock* — inventory levels"
      );
    } catch (err) {
      console.error("[webhook] error:", err);
    }
  }
);
