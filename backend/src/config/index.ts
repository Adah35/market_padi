export const config = {
  JWT_ACCESS_TOKEN: process.env.JWT as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  DASHBOARD_BASE_URL: process.env.DASHBOARD_BASE_URL ?? "http://localhost:5173",
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID as string,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN as string,
  TWILIO_WHATSAPP_NUMBER: process.env.TWILIO_WHATSAPP_NUMBER ?? "whatsapp:+14155238886",
};