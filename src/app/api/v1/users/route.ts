import { apiSuccess, listDashboardUsers, withApiHandler } from "@/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withApiHandler(async () => {
  const users = await listDashboardUsers();

  return apiSuccess(users);
});
