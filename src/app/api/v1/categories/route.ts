import { apiSuccess, parseJsonBody, withApiHandler } from "@/server";
import {
  createCategory,
  listCategories,
  type CreateCategoryPayload,
} from "@/server/catalog/taxonomy-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withApiHandler(async () => {
  const categories = await listCategories();

  return apiSuccess(categories);
});

export const POST = withApiHandler(async (request) => {
  const body = await parseJsonBody<CreateCategoryPayload>(request);
  const category = await createCategory(body);

  return apiSuccess(category, { status: 201 });
});
