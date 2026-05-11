import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const devAuthStorePath = path.join(process.cwd(), ".data", "dev-auth-users.json");

export type DevAuthUserRecord = {
  id: string;
  authId: string;
  email: string;
  passwordHash: string | null;
  name: string;
  phone: string | null;
  membership: string;
  communicationPreference: string | null;
  addressLabel: string | null;
  addressLines: unknown;
  avatarInitials: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

async function ensureStoreDirectory() {
  await mkdir(path.dirname(devAuthStorePath), { recursive: true });
}

async function readStoreFile() {
  try {
    return await readFile(devAuthStorePath, "utf8");
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return "[]";
    }

    throw error;
  }
}

export async function readDevAuthUsers(): Promise<DevAuthUserRecord[]> {
  const raw = await readStoreFile();

  try {
    const parsed = JSON.parse(raw) as DevAuthUserRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeDevAuthUsers(users: DevAuthUserRecord[]) {
  await ensureStoreDirectory();
  await writeFile(devAuthStorePath, JSON.stringify(users, null, 2), "utf8");
}
