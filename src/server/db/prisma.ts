import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { getRequiredServerEnv, serverEnv } from "../config/env";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: getRequiredServerEnv("DATABASE_URL"),
    }),
    log: serverEnv.isDevelopment ? ["error", "warn"] : ["error"],
  });

if (!serverEnv.isProduction) {
  globalForPrisma.prisma = prisma;
}
