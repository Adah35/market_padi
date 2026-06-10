import twilio from "twilio";
import { config } from "../config/index";

const client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

export async function sendWhatsApp(to: string, body: string): Promise<void> {
  const val = await client.messages.create({
    from: config.TWILIO_WHATSAPP_NUMBER,
    to: to.startsWith("whatsapp:") ? to : `whatsapp:${to}`,
    body,
  });
  console.log("[Twilio] Message sent:", val);
}

export { client as twilioClient };
