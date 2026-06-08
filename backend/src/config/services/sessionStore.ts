type RegistrationStep = "awaiting_name" | "awaiting_language";

interface Session {
  step: RegistrationStep;
  name?: string;
}


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
