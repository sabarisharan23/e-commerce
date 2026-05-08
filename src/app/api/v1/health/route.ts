import { apiSuccess, serverEnv, withApiHandler } from "@/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withApiHandler(async () => {
  return apiSuccess({
    app: serverEnv.appName,
    environment: serverEnv.appEnv,
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: serverEnv.apiVersion,
  });
});
