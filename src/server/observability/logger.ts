import { serverEnv } from "../config/env";

type LogLevel = "info" | "warn" | "error";

function normalizeLogValue(value: unknown) {
  if (value instanceof Error) {
    return {
      message: value.message,
      name: value.name,
      stack: serverEnv.isProduction ? undefined : value.stack,
    };
  }

  return value;
}

function writeLog(level: LogLevel, message: string, value?: unknown) {
  if (serverEnv.isTest) {
    return;
  }

  const payload = value === undefined ? undefined : normalizeLogValue(value);
  const logMessage = `[server:${level}] ${message}`;

  if (level === "error") {
    console.error(logMessage, payload);
    return;
  }

  if (level === "warn") {
    console.warn(logMessage, payload);
    return;
  }

  console.info(logMessage, payload);
}

export const serverLogger = {
  error(message: string, value?: unknown) {
    writeLog("error", message, value);
  },

  info(message: string, value?: unknown) {
    writeLog("info", message, value);
  },

  warn(message: string, value?: unknown) {
    writeLog("warn", message, value);
  },
};
