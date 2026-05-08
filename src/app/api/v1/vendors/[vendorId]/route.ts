import {
  apiNoContent,
  apiSuccess,
  parseJsonBody,
  withApiHandler,
  type ApiRouteContext,
} from "@/server";
import {
  deleteVendor,
  getVendor,
  updateVendor,
  type UpdateVendorPayload,
} from "@/server/vendors/vendor-service";

type VendorRouteParams = {
  vendorId: string;
};

async function getVendorId(context: ApiRouteContext<VendorRouteParams>) {
  const params = await context.params;

  return params?.vendorId ?? "";
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withApiHandler<VendorRouteParams>(async (_request, context) => {
  const vendor = await getVendor(await getVendorId(context));

  return apiSuccess(vendor);
});

const updateVendorHandler = withApiHandler<VendorRouteParams>(async (request, context) => {
  const body = await parseJsonBody<UpdateVendorPayload>(request);
  const vendor = await updateVendor(await getVendorId(context), body);

  return apiSuccess(vendor);
});

export const PATCH = updateVendorHandler;
export const PUT = updateVendorHandler;

export const DELETE = withApiHandler<VendorRouteParams>(async (_request, context) => {
  await deleteVendor(await getVendorId(context));

  return apiNoContent();
});
