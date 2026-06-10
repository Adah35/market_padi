import { sessionStore } from "../../services/sessionStore";
import { authService } from "../../services/authService";
import { sendWhatsApp } from "../../services/twilioService";
import { isConfirmation } from "../../services/geminiService";
import { t, type Language } from "../../i18n/messages";

const LANGUAGE_MAP: Record<string, Language> = {
  "1": "english",
  "2": "pidgin",
  "3": "hausa",
  "4": "yoruba",
  "5": "igbo",
};

const LANGUAGE_PROMPT =
  `Choose your language:\n\n1️⃣ English\n2️⃣ Pidgin\n3️⃣ Hausa\n4️⃣ Yoruba\n5️⃣ Igbo\n\nReply with a number.`;

// Returns true if the message was consumed by the registration flow
export async function handleRegistration(
  phone: string,
  from: string,
  body: string
): Promise<boolean> {
  const session = sessionStore.get(phone);
  if (!session) return false;

  // Step 1a — we suggested a name from their WhatsApp profile, waiting for confirm/override
  if (session.step === "confirming_name") {
    const confirmed = await isConfirmation(body);
    const name = confirmed ? session.suggestedName! : body;

    sessionStore.set(phone, { step: "awaiting_language", name });
    await sendWhatsApp(from, `Got it, *${name}*! 🌍 ${LANGUAGE_PROMPT}`);
    return true;
  }

  // Step 1b — no profile name was available, we asked them to type their name
  if (session.step === "awaiting_name") {
    sessionStore.set(phone, { step: "awaiting_language", name: body });
    await sendWhatsApp(from, `Nice to meet you, *${body}*! 🌍 ${LANGUAGE_PROMPT}`);
    return true;
  }

  // Step 2 — language selection
  if (session.step === "awaiting_language") {
    const language = LANGUAGE_MAP[body];
    if (!language) {
      await sendWhatsApp(from, "Please reply with a number between 1 and 5.");
      return true;
    }

    await authService.registerTrader({
      phoneNumber: phone,
      fullName: session.name!,
      language,
    });

    sessionStore.clear(phone);
    await sendWhatsApp(from, t(language).accountReady(session.name!));
    return true;
  }

  return false;
}

// Called when an unknown number sends their first message
export function startRegistration(phone: string, from: string, profileName?: string) {
  const welcome = "Welcome to Àjọ! 👋\n\nI help you track sales, manage stock, and run your Adashi group — all on WhatsApp.\n\n";

  if (profileName) {
    sessionStore.set(phone, { step: "confirming_name", suggestedName: profileName });
    return sendWhatsApp(
      from,
      `${welcome}I can see your name is *${profileName}*. Is that correct?\n\nReply *yes* to confirm, or type your preferred name.`
    );
  }

  sessionStore.set(phone, { step: "awaiting_name" });
  return sendWhatsApp(from, `${welcome}What is your name?`);
}
