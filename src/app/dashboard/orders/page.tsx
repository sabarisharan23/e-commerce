import { OrderDashboardPage } from "@/components/pages/dashboard/orders/order-dashboard-page";
import { getDashboardOrderOverview } from "@/server";

export const dynamic = "force-dynamic";

export default async function OrdersDashboardRoute() {
  const overview = await getDashboardOrderOverview();

  return <OrderDashboardPage overview={overview} />;
}
