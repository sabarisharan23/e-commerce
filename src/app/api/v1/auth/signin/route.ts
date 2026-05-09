import {
  apiSuccess,
  parseJsonBody,
  signInUser,
  type SignInPayload,
  withApiHandler,
} from "@/server";
import { setAuthSessionCookie } from "@/server/auth/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const POST = withApiHandler(async (request) => {
  const user = await signInUser(await parseJsonBody<SignInPayload>(request));
  const response = apiSuccess(user);

  setAuthSessionCookie(response, user.id);

  return response;
});
