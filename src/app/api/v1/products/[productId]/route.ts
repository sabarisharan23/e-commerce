import {
  apiNoContent,
  apiSuccess,
  parseJsonBody,
  withApiHandler,
  type ApiRouteContext,
} from "@/server";
import {
  deleteProduct,
  getProduct,
  updateProduct,
  type UpdateProductPayload,
} from "@/server/products/product-service";

type ProductRouteParams = {
  productId: string;
};

async function getProductId(context: ApiRouteContext<ProductRouteParams>) {
  const params = await context.params;

  return params?.productId ?? "";
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withApiHandler<ProductRouteParams>(async (_request, context) => {
  const product = await getProduct(await getProductId(context));

  return apiSuccess(product);
});

const updateProductHandler = withApiHandler<ProductRouteParams>(async (request, context) => {
  const body = await parseJsonBody<UpdateProductPayload>(request);
  const product = await updateProduct(await getProductId(context), body);

  return apiSuccess(product);
});

export const PATCH = updateProductHandler;
export const PUT = updateProductHandler;

export const DELETE = withApiHandler<ProductRouteParams>(async (_request, context) => {
  await deleteProduct(await getProductId(context));

  return apiNoContent();
});
