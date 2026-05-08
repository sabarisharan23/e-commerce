import { apiSuccess, parseJsonBody, withApiHandler } from "@/server";
import {
  createOffer,
  listOffers,
  type OfferPayload,
} from "@/server/offers/offer-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withApiHandler(async () => {
  const offers = await listOffers();

  return apiSuccess(offers);
});

export const POST = withApiHandler(async (request) => {
  const body = await parseJsonBody<OfferPayload>(request);
  const offer = await createOffer(body);

  return apiSuccess(offer, { status: 201 });
});
