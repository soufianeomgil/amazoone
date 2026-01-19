// lib/phone/normalizeMA.ts
export function normalizeMoroccanPhone(input: string) {
  const raw = String(input).trim().replace(/\s|-/g, "");

  // already E.164
  if (raw.startsWith("+")) return raw;

  // 06xxxxxxxx or 07xxxxxxxx
  if (/^0[67]\d{8}$/.test(raw)) {
    return `+212${raw.slice(1)}`; // remove leading 0
  }

  // 6xxxxxxxx or 7xxxxxxxx
  if (/^[67]\d{8}$/.test(raw)) {
    return `+212${raw}`;
  }

  return null; // invalid
}

export function maskPhoneE164(phone: string) {
  // +2126XXXXXX123
  const last3 = phone.slice(-3);
  return `${phone.slice(0, 5)}******${last3}`;
}