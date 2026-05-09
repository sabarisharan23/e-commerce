import {
  apiSuccess,
  parseJsonBody,
  signUpUser,
  type SignUpPayload,
  withApiHandler,
} from "@/server";
import { setAuthSessionCookie } from "@/server/auth/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const POST = withApiHandler(async (request) => {
  const user = await signUpUser(await parseJsonBody<SignUpPayload>(request));
  const response = apiSuccess(user, { status: 201 });

  setAuthSessionCookie(response, user.id);

  return response;
});
