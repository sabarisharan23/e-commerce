"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/shared";
import { CartBreadcrumbs } from "./components/cart-breadcrumbs";
import { CartItemsTable } from "./components/cart-items-table";
import { CouponPanel } from "./components/coupon-panel";
import { EmptyCartState } from "./components/empty-cart-state";
import { FreeDeliveryProgress } from "./components/free-delivery-progress";
import { OrderSummaryCard } from "./components/order-summary-card";
import { SubscriptionCard } from "./components/subscription-card";

const FREE_DELIVERY_THRESHOLD = 2750;
const STANDARD_DELIVERY_FEE = 50;
const TAX_RATE = 0.18;

export function CartPage() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const [discount, setDiscount] = useState(0);

  const deliveryFee = total >= FREE_DELIVERY_THRESHOLD || items.length === 0 ? 0 : STANDARD_DELIVERY_FEE;
  const tax = useMemo(
    () => Math.round((Math.max(total - discount, 0) * TAX_RATE) * 100) / 100,
    [discount, total],
  );

  return (
    <div className="w-full bg-white px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="space-y-8">
        <CartBreadcrumbs />

        {items.length === 0 ? (
          <EmptyCartState />
        ) : (
          <>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <h1 className="text-4xl font-semibold tracking-tight text-[#15203d] sm:text-[3.2rem]">
                Your Shopping Cart
              </h1>
              <button
                type="button"
                onClick={clearCart}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#edf2e8] px-5 text-sm font-semibold text-[#24401f] transition-colors hover:bg-[#dfe8d7]"
              >
                Clear Cart
              </button>
            </div>

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_384px]">
              <div className="space-y-6">
                <FreeDeliveryProgress
                  subtotal={total}
                  threshold={FREE_DELIVERY_THRESHOLD}
                />

                <CartItemsTable
                  items={items}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                />

                <CouponPanel subtotal={total} onDiscountChange={setDiscount} />
              </div>

              <div className="space-y-4">
                <OrderSummaryCard
                  subtotal={total}
                  deliveryFee={deliveryFee}
                  tax={tax}
                  discount={discount}
                />
                <SubscriptionCard />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
