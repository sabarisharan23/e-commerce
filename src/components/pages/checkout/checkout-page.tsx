"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { formatPrice } from "@/components/pages/cart/components/cart-shared";
import { useAuth, useCart, type ProductDetails } from "@/components/shared";
import {
  getMissingStoredProductIds,
  hydrateCartItems,
  type HydratedCartItem,
} from "@/components/shared/storefront-product-hydration";

const FREE_DELIVERY_THRESHOLD = 2750;
const STANDARD_DELIVERY_FEE = 50;
const TAX_RATE = 0.18;

const stateOptions = [
  "Tamil Nadu",
  "Kerala",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana",
  "Maharashtra",
  "Delhi",
];

type PaymentMethod = "card" | "wallet" | "cod";

type CheckoutPageProps = {
  products: ProductDetails[];
};

type OrderSnapshot = {
  id: string;
  items: HydratedCartItem[];
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
};

type CreateOrderResponse =
  | {
      data: {
        deliveryFee: number;
        discount: number;
        orderNumber: string;
        subtotal: number;
        tax: number;
        total: number;
      };
      success: true;
    }
  | { error: { message: string }; success: false };

type OfferValidationResponse =
  | {
      data: {
        code: string;
        discount: number;
      };
      success: true;
    }
  | { error: { message: string }; success: false };

const paymentMethodLabels: Record<PaymentMethod, string> = {
  card: "Card",
  wallet: "Wallet",
  cod: "Cash on Delivery",
};

function CardIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3 10h18" />
      <path d="M7 15h4" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19v14H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
      <path d="M4 8h15" />
      <path d="M16 13h3" />
    </svg>
  );
}

function CashIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6.5 9.5v.01" />
      <path d="M17.5 14.5v.01" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.4 2.4 4.8-4.9" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 17H5V6h11v11h-2" />
      <path d="M16 9h3l2 2v6h-2" />
      <circle cx="7.5" cy="18" r="1.5" />
      <circle cx="17.5" cy="18" r="1.5" />
    </svg>
  );
}

function CheckoutBreadcrumbs() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-sm font-medium text-[#7d8493]"
    >
      <Link href="/" className="transition-colors hover:text-[#4f7d49]">
        Home
      </Link>
      <span>&gt;</span>
      <Link href="/cart" className="transition-colors hover:text-[#4f7d49]">
        Cart
      </Link>
      <span>&gt;</span>
      <span className="text-[#554ee8]">Checkout</span>
    </nav>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  inputMode,
  required = true,
}: {
  label: string;
  placeholder: string;
  type?: string;
  inputMode?: "email" | "numeric" | "tel" | "text";
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[0.82rem] font-semibold text-[#20232d]">{label}</span>
      <input
        type={type}
        inputMode={inputMode}
        required={required}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-lg border border-[#e6e9ee] bg-white px-3 text-sm font-medium text-[#1f2430] outline-none transition-colors placeholder:text-[#a0a7b4] focus:border-[#554ee8] focus:ring-2 focus:ring-[#554ee8]/15"
      />
    </label>
  );
}

function SelectField({
  label,
  children,
  required = true,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[0.82rem] font-semibold text-[#20232d]">{label}</span>
      <select
        required={required}
        defaultValue=""
        className="mt-2 h-11 w-full rounded-lg border border-[#e6e9ee] bg-white px-3 text-sm font-medium text-[#1f2430] outline-none transition-colors focus:border-[#554ee8] focus:ring-2 focus:ring-[#554ee8]/15"
      >
        {children}
      </select>
    </label>
  );
}

function PaymentOption({
  label,
  value,
  selected,
  onSelect,
  children,
}: {
  label: string;
  value: PaymentMethod;
  selected: boolean;
  onSelect: (value: PaymentMethod) => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(value)}
      className={`flex h-20 flex-col items-center justify-center gap-2 rounded-lg border bg-white text-sm font-semibold transition-all ${
        selected
          ? "border-[#554ee8] text-[#554ee8] shadow-[0_10px_24px_rgba(85,78,232,0.12)]"
          : "border-[#e6e9ee] text-[#647084] hover:border-[#cbd2de] hover:text-[#20232d]"
      }`}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

function CheckoutSummary({
  items,
  subtotal,
  deliveryFee,
  discount,
  tax,
  total,
  error,
  offerMessage,
  isPlacingOrder,
}: {
  items: HydratedCartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  total: number;
  error: string | null;
  offerMessage: string | null;
  isPlacingOrder: boolean;
}) {
  return (
    <aside className="rounded-lg border border-[#e5e8ee] bg-white p-5 shadow-sm lg:sticky lg:top-6">
      <h2 className="text-lg font-semibold tracking-tight text-[#20232d]">
        Order Summary
      </h2>

      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#e8ebf0] bg-[#f7f8fa]">
              <Image
                src={item.imageSrc}
                alt={item.name}
                fill
                sizes="56px"
                className="object-contain p-1.5"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-1 text-sm font-semibold text-[#20232d]">
                {item.name}
              </h3>
              <p className="mt-1 text-xs font-medium text-[#7c8494]">
                Qty {item.quantity}
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold text-[#20232d]">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3 border-t border-[#eceff3] pt-5 text-sm text-[#687386]">
        <div className="flex items-center justify-between gap-4">
          <span>Subtotal</span>
          <span className="font-semibold text-[#20232d]">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Shipping</span>
          <span className="font-semibold text-[#20232d]">
            {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
          </span>
        </div>
        {discount > 0 ? (
          <div className="flex items-center justify-between gap-4">
            <span>Discount</span>
            <span className="font-semibold text-[#3f7039]">
              - {formatPrice(discount)}
            </span>
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-4">
          <span>Tax</span>
          <span className="font-semibold text-[#20232d]">{formatPrice(tax)}</span>
        </div>
      </div>

      {offerMessage ? (
        <p className="mt-3 rounded-lg bg-[#f8fafc] px-3 py-2 text-xs font-semibold text-[#60708a]">
          {offerMessage}
        </p>
      ) : null}

      <div className="mt-5 flex items-center justify-between border-t border-[#eceff3] pt-5">
        <span className="text-base font-semibold text-[#20232d]">Total</span>
        <span className="text-xl font-bold tracking-tight text-[#20232d]">
          {formatPrice(total)}
        </span>
      </div>

      <button
        type="submit"
        disabled={isPlacingOrder}
        className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#554ee8] px-5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(85,78,232,0.22)] transition-colors hover:bg-[#4740cf] focus:outline-none focus:ring-2 focus:ring-[#554ee8]/35 disabled:cursor-not-allowed disabled:bg-[#9a97e9] disabled:shadow-none"
      >
        {isPlacingOrder ? "Placing Order..." : "Place Order"}
      </button>

      {error ? (
        <p className="mt-3 rounded-lg bg-[#fff1f2] px-3 py-2 text-sm font-semibold text-[#be3a45]">
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-[#7c8494]">
        <span className="inline-flex items-center gap-1.5">
          <LockIcon />
          Secure payment
        </span>
        <span className="inline-flex items-center gap-1.5">
          <TruckIcon />
          Fast delivery
        </span>
      </div>
    </aside>
  );
}

function EmptyCheckoutState() {
  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-[#e5e8ee] bg-white px-6 py-12 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf4ea] text-[#4f7d49]">
        <TruckIcon />
      </div>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[#20232d]">
        Your cart is empty
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6d7788]">
        Add your favorite Theni Store products before heading to checkout.
      </p>
      <Link
        href="/products"
        className="mt-7 inline-flex h-12 items-center justify-center rounded-lg bg-[#4f7d49] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#41693c]"
      >
        Shop Products
      </Link>
    </div>
  );
}

function OrderConfirmation({ order }: { order: OrderSnapshot }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#17213d]/45 px-4 py-6 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-placed-title"
        className="mx-auto my-6 max-w-3xl overflow-hidden rounded-lg border border-[#e5e8ee] bg-white text-center shadow-[0_24px_70px_rgba(23,33,61,0.24)]"
      >
        <div className="px-6 py-10 sm:px-10 sm:py-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#edf4ea] text-[#3f7039]">
            <CheckIcon />
          </div>
          <h1
            id="order-placed-title"
            className="mt-7 text-3xl font-semibold tracking-tight text-[#17213d] sm:text-4xl"
          >
            Your order is placed!
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#60708a]">
            Your order has been confirmed and is being processed. We have sent
            the order details to your email address.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-[#e7ebf1] bg-[#f8f8fb] p-5 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                Order Number
              </p>
              <p className="mt-3 text-base font-bold text-[#17213d]">{order.id}</p>
            </div>
            <div className="rounded-lg border border-[#e7ebf1] bg-[#f8f8fb] p-5 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                Order Total
              </p>
              <p className="mt-3 text-base font-bold text-[#17213d]">
                {formatPrice(order.total)}
              </p>
            </div>
            <div className="rounded-lg border border-[#e7ebf1] bg-[#f8f8fb] p-5 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                Payment Method
              </p>
              <p className="mt-3 text-base font-bold text-[#17213d]">
                {paymentMethodLabels[order.paymentMethod]}
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/info/order-tracking"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[#3f7039] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#356130]"
            >
              Track Order
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[#f0f3f7] px-7 text-sm font-semibold text-[#20232d] transition-colors hover:bg-[#e7ebf1]"
            >
              Back to Home
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#e7ebf1] bg-[#f2f4f8] px-6 py-6 text-sm font-semibold text-[#3f7039] sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p className="text-left text-[#60708a]">
            Need assistance? Our support team is available 24/7.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/info/contact-support" className="hover:text-[#315b2d]">
              Contact Support
            </Link>
            <Link href="/info/faqs" className="hover:text-[#315b2d]">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheckoutPage({ products }: CheckoutPageProps) {
  const { items, removeItems, clearCart } = useCart();
  const { isReady, user } = useAuth();
  const searchParams = useSearchParams();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [completedOrder, setCompletedOrder] = useState<OrderSnapshot | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [appliedOffer, setAppliedOffer] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [offerMessage, setOfferMessage] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const requestedOfferCode =
    searchParams.get("offerCode")?.trim().toUpperCase() ?? "";
  const hydratedItems = useMemo(
    () => hydrateCartItems(items, products),
    [items, products],
  );
  const missingProductIds = useMemo(
    () => getMissingStoredProductIds(items, products),
    [items, products],
  );
  const subtotal = useMemo(
    () =>
      hydratedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
    [hydratedItems],
  );
  const deliveryFee =
    subtotal >= FREE_DELIVERY_THRESHOLD || hydratedItems.length === 0
      ? 0
      : STANDARD_DELIVERY_FEE;
  const discount = appliedOffer?.discount ?? 0;
  const tax = useMemo(
    () => Math.round(Math.max(subtotal - discount, 0) * TAX_RATE * 100) / 100,
    [discount, subtotal],
  );
  const total = Math.max(subtotal - discount + deliveryFee + tax, 0);

  useEffect(() => {
    if (missingProductIds.length > 0) {
      removeItems(missingProductIds);
    }
  }, [missingProductIds, removeItems]);

  useEffect(() => {
    if (!requestedOfferCode || subtotal <= 0 || hydratedItems.length === 0) {
      return;
    }

    let active = true;

    fetch("/api/v1/offers/validate", {
      body: JSON.stringify({ code: requestedOfferCode, subtotal }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then(async (response) => {
        const body = (await response.json()) as OfferValidationResponse;

        if (!response.ok || !body.success) {
          throw new Error(
            body.success ? "Coupon could not be applied." : body.error.message,
          );
        }

        if (active) {
          setAppliedOffer({
            code: body.data.code,
            discount: body.data.discount,
          });
          setOfferMessage(`Coupon ${body.data.code} applied.`);
        }
      })
      .catch((error) => {
        if (active) {
          setAppliedOffer(null);
          setOfferMessage(
            error instanceof Error ? error.message : "Coupon could not be applied.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [hydratedItems.length, requestedOfferCode, subtotal]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCheckoutError(null);

    if (hydratedItems.length === 0) {
      return;
    }

    if (!isReady) {
      setCheckoutError("Checking your account session. Please try again in a moment.");
      return;
    }

    if (!user) {
      setCheckoutError("Please sign in before placing your order.");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const response = await fetch("/api/v1/orders", {
        body: JSON.stringify({
          deliveryFee,
          items: hydratedItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
          offerCode: appliedOffer?.code,
          tax,
          user: {
            addressLabel: user.addressLabel,
            addressLines: user.addressLines,
            authId: user.id,
            avatarInitials: user.avatarInitials,
            communicationPreference: user.communicationPreference,
            email: user.email,
            membership: user.membership,
            name: user.name,
            phone: user.phone,
          },
        }),
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const body = (await response.json()) as CreateOrderResponse;

      if (!response.ok || !body.success) {
        throw new Error(body.success ? "Checkout failed." : body.error.message);
      }

      setCompletedOrder({
        id: body.data.orderNumber,
        items: hydratedItems,
        paymentMethod,
        subtotal: body.data.subtotal,
        deliveryFee: body.data.deliveryFee,
        tax: body.data.tax,
        total: body.data.total,
      });
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Checkout failed. Please try again.",
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="w-full bg-[#f6f7f9] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <CheckoutBreadcrumbs />

        {completedOrder ? (
          <OrderConfirmation order={completedOrder} />
        ) : hydratedItems.length === 0 ? (
          <EmptyCheckoutState />
        ) : (
          <>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#554ee8]">
                  Secure Checkout
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#20232d] sm:text-4xl">
                  Billing & Payment
                </h1>
              </div>
              <Link
                href="/cart"
                className="inline-flex h-10 items-center justify-center self-start rounded-lg border border-[#d9dee8] px-4 text-sm font-semibold text-[#20232d] transition-colors hover:border-[#bfc7d5] hover:bg-white sm:self-auto"
              >
                Edit Cart
              </Link>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_370px] lg:items-start"
            >
              <div className="space-y-6">
                <section className="rounded-lg border border-[#e5e8ee] bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-semibold tracking-tight text-[#20232d]">
                    Billing Address
                  </h2>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field label="Name" placeholder="First & Last Name" />
                    </div>
                    <Field
                      label="Phone"
                      placeholder="Mobile number"
                      inputMode="tel"
                    />
                    <Field
                      label="Email"
                      placeholder="Email address"
                      type="email"
                      inputMode="email"
                    />
                    <div className="sm:col-span-2">
                      <Field label="Address 1" placeholder="42, Theni Main St" />
                    </div>
                    <div className="sm:col-span-2">
                      <Field
                        label="Address 2"
                        placeholder="Apartment, suite, etc."
                        required={false}
                      />
                    </div>
                    <Field label="City" placeholder="City" />
                    <SelectField label="State">
                      <option value="" disabled>
                        Select state
                      </option>
                      {stateOptions.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </SelectField>
                    <Field label="Zip" placeholder="Zip code" inputMode="numeric" />
                  </div>
                </section>

                <section className="rounded-lg border border-[#e5e8ee] bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-semibold tracking-tight text-[#20232d]">
                    Payment Method
                  </h2>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <PaymentOption
                      label="Card"
                      value="card"
                      selected={paymentMethod === "card"}
                      onSelect={setPaymentMethod}
                    >
                      <CardIcon />
                    </PaymentOption>
                    <PaymentOption
                      label="Wallet"
                      value="wallet"
                      selected={paymentMethod === "wallet"}
                      onSelect={setPaymentMethod}
                    >
                      <WalletIcon />
                    </PaymentOption>
                    <PaymentOption
                      label="COD"
                      value="cod"
                      selected={paymentMethod === "cod"}
                      onSelect={setPaymentMethod}
                    >
                      <CashIcon />
                    </PaymentOption>
                  </div>

                  {paymentMethod === "card" ? (
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Field label="Name on Card" placeholder="First & Last Name" />
                      </div>
                      <div className="sm:col-span-2">
                        <Field
                          label="Card Number"
                          placeholder="0000 0000 0000 0000"
                          inputMode="numeric"
                        />
                      </div>
                      <SelectField label="Expiry">
                        <option value="" disabled>
                          MM
                        </option>
                        {Array.from({ length: 12 }, (_, index) => {
                          const month = (index + 1).toString().padStart(2, "0");

                          return (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          );
                        })}
                      </SelectField>
                      <SelectField label="Year">
                        <option value="" disabled>
                          YYYY
                        </option>
                        {Array.from({ length: 8 }, (_, index) => {
                          const year = 2026 + index;

                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </SelectField>
                      <Field label="CVV" placeholder="CVV" inputMode="numeric" />
                    </div>
                  ) : null}

                  {paymentMethod === "wallet" ? (
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <SelectField label="Wallet">
                        <option value="" disabled>
                          Select wallet
                        </option>
                        <option value="upi">UPI</option>
                        <option value="phonepe">PhonePe</option>
                        <option value="paytm">Paytm</option>
                        <option value="gpay">Google Pay</option>
                      </SelectField>
                      <Field
                        label="Wallet ID"
                        placeholder="UPI ID or mobile number"
                        inputMode="text"
                      />
                    </div>
                  ) : null}

                  {paymentMethod === "cod" ? (
                    <div className="mt-5 rounded-lg border border-[#e5e8ee] bg-[#f8fafc] p-4">
                      <p className="text-sm font-semibold text-[#20232d]">
                        Cash on delivery selected
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#6d7788]">
                        Pay when your order arrives at the billing address.
                      </p>
                    </div>
                  ) : null}
                </section>
              </div>

              <CheckoutSummary
                items={hydratedItems}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                discount={discount}
                tax={tax}
                total={total}
                error={checkoutError}
                offerMessage={offerMessage}
                isPlacingOrder={isPlacingOrder}
              />
            </form>
          </>
        )}
      </div>
    </div>
  );
}
