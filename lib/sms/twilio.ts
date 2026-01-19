// lib/sms/twilio.ts
import twilio from "twilio";

const sid = process.env.TWILIO_ACCOUNT_SID!;
const token = process.env.TWILIO_AUTH_TOKEN!;
const from = process.env.TWILIO_FROM!;

const client = twilio(sid, token);

export async function sendSMS(to: string, body: string) {
  return client.messages.create({ to, from, body });
}


// SMS CODE : D5ZN9NUQFPT7FX93TD8JG4P9