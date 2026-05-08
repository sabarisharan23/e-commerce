import {
  apiNoContent,
  apiSuccess,
  parseJsonBody,
  withApiHandler,
  type ApiRouteContext,
} from "@/server";
import {
  deleteOffer,
  updateOffer,
  type OfferPayload,
} from "@/server/offers/offer-service";

type OfferRouteParams = {
  offerId: string;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getOfferId(context: ApiRouteContext<OfferRouteParams>) {
  const params = await context.params;

  return params?.offerId ?? "";
}

export const PATCH = withApiHandler<OfferRouteParams>(async (request, context) => {
  const offerId = await getOfferId(context);
  const body = await parseJsonBody<OfferPayload>(request);
  const offer = await updateOffer(offerId, body);

  return apiSuccess(offer);
});

export const DELETE = withApiHandler<OfferRouteParams>(async (_request, context) => {
  const offerId = await getOfferId(context);

  await deleteOffer(offerId);

  return apiNoContent();
});
