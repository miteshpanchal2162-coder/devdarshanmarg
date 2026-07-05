import { createHash, timingSafeEqual } from "crypto";

export function hashOtp(otp: string): string {
  return createHash("sha256").update(otp).digest("hex");
}

export function verifyOtpHash(storedHash: string, submittedOtp: string): boolean {
  const submittedHash = hashOtp(submittedOtp);
  const storedBuffer = Buffer.from(storedHash, "utf8");
  const submittedBuffer = Buffer.from(submittedHash, "utf8");

  if (storedBuffer.length !== submittedBuffer.length) {
    return false;
  }

  return timingSafeEqual(storedBuffer, submittedBuffer);
}
