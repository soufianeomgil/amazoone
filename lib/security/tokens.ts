import crypto from "crypto";

export function generateResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  return {
    rawToken,      // send to user
    hashedToken,   // store in DB
    expiresAt: new Date(Date.now() + 1000 * 60 * 15), // 15 min
  };
}


export function generateOTP(length = 6): string {
  const max = 10 ** length;
  return crypto.randomInt(0, max).toString().padStart(length, "0");
}
