import { OrderDetailPage } from "@/components/pages/dashboard/orders/order-detail-page";
import { getDashboardOrderDetail } from "@/server";

export const dynamic = "force-dynamic";

export default async function OrderDetailRoute({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const detail = await getDashboardOrderDetail(orderId);

  return <OrderDetailPage detail={detail} />;
}
