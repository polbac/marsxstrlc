import { timingSafeEqual } from "crypto";

import bcrypt from "bcryptjs";

export async function verifyAdminPassword(password: string) {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const plain = process.env.ADMIN_PASSWORD;

  if (hash) {
    return bcrypt.compare(password, hash);
  }

  if (!plain) {
    throw new Error("ADMIN_PASSWORD or ADMIN_PASSWORD_HASH must be set");
  }

  const input = Buffer.from(password);
  const expected = Buffer.from(plain);

  if (input.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(input, expected);
}
