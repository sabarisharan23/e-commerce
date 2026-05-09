import {
  apiSuccess,
  getDashboardUserProfile,
  withApiHandler,
  type ApiRouteContext,
} from "@/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withApiHandler(
  async (_request, context: ApiRouteContext<{ userId: string }>) => {
    const params = await context.params;
    const profile = await getDashboardUserProfile(params?.userId ?? "");

    return apiSuccess(profile);
  },
);
