import { randomInt } from "crypto";

export function generateOtpCode() {
  return randomInt(100000, 1000000).toString();
}
