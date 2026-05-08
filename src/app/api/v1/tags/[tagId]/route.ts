import {
  apiNoContent,
  apiSuccess,
  parseJsonBody,
  withApiHandler,
  type ApiRouteContext,
} from "@/server";
import {
  deleteTag,
  getTag,
  updateTag,
  type UpdateTagPayload,
} from "@/server/catalog/taxonomy-service";

type TagRouteParams = {
  tagId: string;
};

async function getTagId(context: ApiRouteContext<TagRouteParams>) {
  const params = await context.params;

  return params?.tagId ?? "";
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withApiHandler<TagRouteParams>(async (_request, context) => {
  const tag = await getTag(await getTagId(context));

  return apiSuccess(tag);
});

const updateTagHandler = withApiHandler<TagRouteParams>(async (request, context) => {
  const body = await parseJsonBody<UpdateTagPayload>(request);
  const tag = await updateTag(await getTagId(context), body);

  return apiSuccess(tag);
});

export const PATCH = updateTagHandler;
export const PUT = updateTagHandler;

export const DELETE = withApiHandler<TagRouteParams>(async (_request, context) => {
  await deleteTag(await getTagId(context));

  return apiNoContent();
});
