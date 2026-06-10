type RegistrationStep = "awaiting_name" | "confirming_name" | "awaiting_language";

interface Session {
  step: RegistrationStep;
  name?: string;
  suggestedName?: string; // WhatsApp ProfileName pre-filled from Twilio
}

// In-memory store keyed by phone number.
// Good enough for a hackathon — swap for Redis in production.
const sessions = new Map<string, Session>();

export const sessionStore = {
  get(phone: string): Session | undefined {
    return sessions.get(phone);
  },
  set(phone: string, session: Session): void {
    sessions.set(phone, session);
  },
  clear(phone: string): void {
    sessions.delete(phone);
  },
};
