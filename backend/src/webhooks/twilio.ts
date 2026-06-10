import { Router, Request, Response } from "express";
import twilio from "twilio";
import { config } from "../config";
import { authService } from "../services/authService";
import { handleRegistration, startRegistration } from "./handlers/registration";
import { routeMessage } from "./handlers/messageRouter";

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

// POST /webhook/whatsapp
twilioWebhookRouter.post(
  "/whatsapp",
  validateTwilioSignature,
  async (req: Request, res: Response) => {
    const from: string = req.body.From ?? "";           // "whatsapp:+2348012345678"
    const body: string = (req.body.Body ?? "").trim();
    const mediaUrl: string | undefined = req.body.MediaUrl0;
    const mediaType: string | undefined = req.body.MediaContentType0;
    const phone = from.replace("whatsapp:", "");
    const name = req.body.ProfileName ?? "";

    // Always respond 200 immediately — Twilio will retry if we don't
    res.status(200).send();

    try {
      const wasRegistering = await handleRegistration(phone, from, body);
      if (wasRegistering) return;

      const check = await authService.checkTrader(phone);

      if (!check.exists) {
        await startRegistration(phone, from, name);
        return;
      }

      await routeMessage(from, body, mediaUrl, mediaType, {
        trader_id: check.trader_id as string,
        language: (check.language as string) ?? "english",
        fullName: "",
        phone,
      });
    } catch (err) {
      console.error("[webhook] unhandled error:", err);
    }
  }
);
