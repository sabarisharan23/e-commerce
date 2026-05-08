import { apiSuccess, parseJsonBody, withApiHandler } from "@/server";
import {
  validateOffer,
  type OfferValidationPayload,
} from "@/server/offers/offer-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const POST = withApiHandler(async (request) => {
  const body = await parseJsonBody<OfferValidationPayload>(request);
  const result = await validateOffer(body);

  return apiSuccess(result);
});
