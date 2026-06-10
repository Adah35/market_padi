import { sendWhatsApp } from "./twilioService";

interface OTPEntry {
  otp: string;
  expiresAt: number;
  attempts: number;
}

const store = new Map<string, OTPEntry>();
const MAX_ATTEMPTS = 5;
const OTP_TTL_MS = 5 * 60 * 1000;

function generate(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtp(phoneNumber: string): Promise<void> {
  const otp = generate();
  store.set(phoneNumber, {
    otp,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });

  const message = `Your Àjọ login code is: *${otp}*\n\nThis code expires in 5 minutes. Do not share it.`;
  await sendWhatsApp(`whatsapp:${phoneNumber}`, message);
}

export function verifyOtp(phoneNumber: string, otp: string): boolean {
  const entry = store.get(phoneNumber);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    store.delete(phoneNumber);
    return false;
  }
  entry.attempts += 1;
  if (entry.attempts > MAX_ATTEMPTS) {
    store.delete(phoneNumber);
    return false;
  }
  if (entry.otp !== otp) return false;
  store.delete(phoneNumber);
  return true;
}
