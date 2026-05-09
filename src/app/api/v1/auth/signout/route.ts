import { apiSuccess, withApiHandler } from "@/server";
import { clearAuthSessionCookie } from "@/server/auth/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const POST = withApiHandler(async () => {
  const response = apiSuccess({ signedOut: true });

  clearAuthSessionCookie(response);

  return response;
});
