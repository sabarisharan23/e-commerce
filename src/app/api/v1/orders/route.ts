import { NextResponse } from "next/server";
import { apiSuccess, parseJsonBody, withApiHandler } from "@/server";
import {
  createOrder,
  listUserOrders,
  type CreateOrderPayload,
} from "@/server/orders/order-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = withApiHandler(async (request) => {
  const userAuthId = request.nextUrl.searchParams.get("userAuthId") ?? "";
  const orders = await listUserOrders(userAuthId);

  return apiSuccess(orders);
});

export const POST = withApiHandler(async (request) => {
  const body = await parseJsonBody<CreateOrderPayload>(request);
  const order = await createOrder(body);

  return NextResponse.json({ data: order, success: true }, { status: 201 });
});
