import { apiSuccess, withApiHandler } from "@/server";
import { requireAuthUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withApiHandler(async (request) => {
  const user = await requireAuthUser(request);

  return apiSuccess(user);
});
