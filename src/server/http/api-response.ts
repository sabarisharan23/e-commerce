import { NextResponse } from "next/server";

export type ApiResponseMeta = Record<string, unknown>;

export type ApiSuccessResponse<TData> = {
  success: true;
  data: TData;
  meta?: ApiResponseMeta;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;

type JsonResponseInit = ResponseInit & {
  meta?: ApiResponseMeta;
};

export function apiSuccess<TData>(data: TData, init: JsonResponseInit = {}) {
  const { meta, ...responseInit } = init;
  const body: ApiSuccessResponse<TData> = meta
    ? { data, meta, success: true }
    : { data, success: true };

  return NextResponse.json(body, responseInit);
}

export function apiFailure(error: ApiErrorResponse["error"], init: ResponseInit = {}) {
  return NextResponse.json(
    {
      error,
      success: false,
    } satisfies ApiErrorResponse,
    init,
  );
}

export function apiNoContent() {
  return new Response(null, { status: 204 });
}
