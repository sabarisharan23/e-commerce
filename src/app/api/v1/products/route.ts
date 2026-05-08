import { apiSuccess, parseJsonBody, withApiHandler } from "@/server";
import {
  createProduct,
  listProducts,
  type CreateProductPayload,
} from "@/server/products/product-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withApiHandler(async () => {
  const products = await listProducts();

  return apiSuccess(products);
});

export const POST = withApiHandler(async (request) => {
  const body = await parseJsonBody<CreateProductPayload>(request);
  const product = await createProduct(body);

  return apiSuccess(product, { status: 201 });
});
