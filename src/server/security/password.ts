import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCallback);
const keyLength = 64;
const saltLength = 16;
const passwordHashVersion = "scrypt";

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(saltLength).toString("hex");
  const derivedKey = (await scrypt(password, salt, keyLength)) as Buffer;

  return `${passwordHashVersion}:${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  const [version, salt, storedKey] = passwordHash.split(":");

  if (version !== passwordHashVersion || !salt || !storedKey) {
    return false;
  }

  const storedKeyBuffer = Buffer.from(storedKey, "hex");
  const derivedKey = (await scrypt(password, salt, storedKeyBuffer.length)) as Buffer;

  return timingSafeEqual(storedKeyBuffer, derivedKey);
}
 