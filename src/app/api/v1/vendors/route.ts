import { apiSuccess, parseJsonBody, withApiHandler } from "@/server";
import {
  createVendor,
  listVendors,
  type CreateVendorPayload,
} from "@/server/vendors/vendor-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withApiHandler(async () => {
  const vendors = await listVendors();

  return apiSuccess(vendors);
});

export const POST = withApiHandler(async (request) => {
  const body = await parseJsonBody<CreateVendorPayload>(request);
  const vendor = await createVendor(body);

  return apiSuccess(vendor, { status: 201 });
});
