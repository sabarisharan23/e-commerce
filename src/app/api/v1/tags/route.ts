import { apiSuccess, parseJsonBody, withApiHandler } from "@/server";
import {
  createTag,
  listTags,
  type CreateTagPayload,
} from "@/server/catalog/taxonomy-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withApiHandler(async () => {
  const tags = await listTags();

  return apiSuccess(tags);
});

export const POST = withApiHandler(async (request) => {
  const body = await parseJsonBody<CreateTagPayload>(request);
  const tag = await createTag(body);

  return apiSuccess(tag, { status: 201 });
});
