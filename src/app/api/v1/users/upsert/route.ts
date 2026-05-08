import { apiSuccess, parseJsonBody, withApiHandler } from "@/server";
import { upsertUser, type UserPayload } from "@/server/users/user-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const POST = withApiHandler(async (request) => {
  const body = await parseJsonBody<UserPayload>(request);
  const user = await upsertUser(body);

  return apiSuccess(user);
});
