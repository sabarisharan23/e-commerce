import { apiSuccess, parseJsonBody, withApiHandler } from "@/server";
import {
  createSeasonalCampaign,
  listSeasonalCampaigns,
  type SeasonalCampaignPayload,
} from "@/server/offers/offer-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withApiHandler(async () => {
  const campaigns = await listSeasonalCampaigns();

  return apiSuccess(campaigns);
});

export const POST = withApiHandler(async (request) => {
  const body = await parseJsonBody<SeasonalCampaignPayload>(request);
  const campaign = await createSeasonalCampaign(body);

  return apiSuccess(campaign, { status: 201 });
});
