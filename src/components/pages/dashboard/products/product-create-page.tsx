"use client";

import { useRouter } from "next/navigation";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import { ProductEditorDialog } from "./components/product-editor-dialog";

export function DashboardProductCreatePage() {
  const router = useRouter();

  function closeEditor() {
    router.push("/dashboard/products");
  }

  function handleProductSaved() {
    router.push("/dashboard/products");
  }

  return (
    <DashboardShell mobileTitle="Add Product">
      <DashboardPanel>
        <p className="text-base font-medium text-[#71829a]">Preparing product form...</p>
      </DashboardPanel>
      <ProductEditorDialog
        mode="create"
        onClose={closeEditor}
        onSaved={handleProductSaved}
        open
      />
    </DashboardShell>
  );
}
