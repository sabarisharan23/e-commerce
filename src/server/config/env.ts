export type AppEnv = "development" | "test" | "production";

type ServerEnv = {
  appEnv: AppEnv;
  appName: string;
  apiVersion: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
};

function normalizeAppEnv(value: string | undefined): AppEnv {
  if (value === "production" || value === "test") {
    return value;
  }

  return "development";
}

function readEnv(name: string, fallback: string): string {
  return process.env[name]?.trim() || fallback;
}

export const serverEnv: ServerEnv = Object.freeze({
  appEnv: normalizeAppEnv(process.env.NODE_ENV),
  appName: readEnv("APP_NAME", "Ecommerce"),
  apiVersion: readEnv("API_VERSION", "v1"),
  isDevelopment: normalizeAppEnv(process.env.NODE_ENV) === "development",
  isProduction: normalizeAppEnv(process.env.NODE_ENV) === "production",
  isTest: normalizeAppEnv(process.env.NODE_ENV) === "test",
});

export function getRequiredServerEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  return value;
}
