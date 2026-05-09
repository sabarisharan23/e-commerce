import { NextResponse } from "next/server";
import { apiErrors, apiSuccess, parseJsonBody, withApiHandler } from "@/server";
import {
  createOrder,
  listUserOrders,
  type CreateOrderPayload,
} from "@/server/orders/order-service";
import { requireAuthUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withApiHandler(async (request) => {
  const requestedAuthId = request.nextUrl.searchParams.get("userAuthId") ?? "";
  const user = await requireAuthUser(request);
  const userAuthId = requestedAuthId || user.id;

  if (requestedAuthId && requestedAuthId !== user.id) {
    throw apiErrors.forbidden("You can only view orders for your own account.");
  }

  const orders = await listUserOrders(userAuthId);

  return apiSuccess(orders);
});

export const POST = withApiHandler(async (request) => {
  const body = await parseJsonBody<CreateOrderPayload>(request);
  const user = await requireAuthUser(request);
  const order = await createOrder(body, user.id);

  return NextResponse.json({ data: order, success: true }, { status: 201 });
});
