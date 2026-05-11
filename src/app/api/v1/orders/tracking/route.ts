import { apiErrors, apiSuccess, getPublicOrderTracking, withApiHandler } from "@/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withApiHandler(async (request) => {
  const code = request.nextUrl.searchParams.get("code") ?? "";

  if (!code.trim()) {
    throw apiErrors.badRequest("Tracking code is required.");
  }

  const tracking = await getPublicOrderTracking(code);

  return apiSuccess(tracking);
});
