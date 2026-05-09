import { OrderManagementPage } from "@/components/pages/dashboard/orders/order-management-page";
import { getDashboardOrderOverview } from "@/server";

export const dynamic = "force-dynamic";

export default async function OrdersManagementRoute() {
  const overview = await getDashboardOrderOverview();

  return (
    <OrderManagementPage metrics={overview.metrics} rows={overview.managementRows} />
  );
}
