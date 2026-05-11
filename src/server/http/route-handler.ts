import type { NextRequest } from "next/server";

import { ApiError, isApiError } from "./api-error";
import { apiFailure } from "./api-response";
import { serverLogger } from "../observability/logger";

export type RouteParams = Record<string, string | string[]>;

export type ApiRouteContext<TParams extends RouteParams = RouteParams> = {
  params?: Promise<TParams>;
};

export type ApiRouteHandler<TParams extends RouteParams = RouteParams> = (
  request: NextRequest,
  context: ApiRouteContext<TParams>,
) => Response | Promise<Response>;

type WrappedApiRoute<TParams extends RouteParams = RouteParams> = (
  request: NextRequest,
  context?: ApiRouteContext<TParams>,
) => Promise<Response>;

const internalServerErrorMessage =
  "Something went wrong while processing the request.";


export function withApiHandler<TParams extends RouteParams = RouteParams>(
  handler: ApiRouteHandler<TParams>,
): WrappedApiRoute<TParams> {
  return async (request, context = {}) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (isApiError(error)) {
        return apiFailure(
          {
            code: error.code,
            details: error.expose ? error.details : undefined,
            message: error.expose ? error.message : internalServerErrorMessage,
          },
          { status: error.statusCode },
        );
      }

      serverLogger.error("Unhandled API route error.", error);

      return apiFailure(
        {
          code: "INTERNAL_SERVER_ERROR",
          details:
            process.env.NODE_ENV === "production" || !(error instanceof Error)
              ? undefined
              : { stack: error.stack },
          message:
            process.env.NODE_ENV === "production" || !(error instanceof Error)
              ? internalServerErrorMessage
              : error.message,
        },
        { status: 500 },
      );
    }
  };
}

export async function parseJsonBody<TBody = unknown>(request: Request): Promise<TBody> {
  try {
    return (await request.json()) as TBody;
  } catch {
    throw new ApiError({
      code: "BAD_REQUEST",
      message: "Request body must be valid JSON.",
      statusCode: 400,
    });
  }
}
