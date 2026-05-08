import {
  apiNoContent,
  apiSuccess,
  parseJsonBody,
  withApiHandler,
  type ApiRouteContext,
} from "@/server";
import {
  deleteCategory,
  getCategory,
  updateCategory,
  type UpdateCategoryPayload,
} from "@/server/catalog/taxonomy-service";

type CategoryRouteParams = {
  categoryId: string;
};

async function getCategoryId(context: ApiRouteContext<CategoryRouteParams>) {
  const params = await context.params;

  return params?.categoryId ?? "";
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withApiHandler<CategoryRouteParams>(async (_request, context) => {
  const category = await getCategory(await getCategoryId(context));

  return apiSuccess(category);
});

const updateCategoryHandler = withApiHandler<CategoryRouteParams>(async (request, context) => {
  const body = await parseJsonBody<UpdateCategoryPayload>(request);
  const category = await updateCategory(await getCategoryId(context), body);

  return apiSuccess(category);
});

export const PATCH = updateCategoryHandler;
export const PUT = updateCategoryHandler;

export const DELETE = withApiHandler<CategoryRouteParams>(async (_request, context) => {
  await deleteCategory(await getCategoryId(context));

  return apiNoContent();
});
