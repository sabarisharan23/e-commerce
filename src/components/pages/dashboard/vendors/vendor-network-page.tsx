"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import {
  vendorCategoryOptions,
  vendorGrowthReport,
  vendorQuickActions,
  vendorStatusOptions,
  vendorsPageContent,
  type VendorGridCard,
  type VendorMetric,
  type VendorStatus,
  type VendorTableRow,
} from "./vendors-data";
import {
  VendorOnboardingDialog,
  type VendorRecord,
} from "./components/vendor-onboarding-dialog";

type ViewMode = "list" | "grid";

type ApiListVendorsResponse =
  | {
      data: VendorRecord[];
      success: true;
    }
  | {
      error: {
        message: string;
      };
      success: false;
    };

function GridViewIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="6" height="6" rx="1.2" />
      <rect x="14" y="4" width="6" height="6" rx="1.2" />
      <rect x="4" y="14" width="6" height="6" rx="1.2" />
      <rect x="14" y="14" width="6" height="6" rx="1.2" />
    </svg>
  );
}

function ListViewIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h12M8 12h12M8 18h12" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" />
      <path d="M7 12h10" />
      <path d="M10 17h4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 18c1.2-2.6 3.2-3.9 6-3.9 2.9 0 4.9 1.3 6.1 3.9" />
      <circle cx="17" cy="9" r="2.2" />
      <path d="M16 14.5c2 .2 3.5 1.1 4.5 2.8" />
    </svg>
  );
}

function BadgeCheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 9.6 5.2 6.4 5.4 5.2 8.4 3 12l2.2 3.6 1.2 3 3.2.2L12 21l2.4-2.2 3.2-.2 1.2-3L21 12l-2.2-3.6-1.2-3-3.2-.2L12 3Z" />
      <path d="m9.2 12.3 1.9 1.9 3.7-4" />
    </svg>
  );
}

function ClockBagIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 8h10l1 11H6L7 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
      <circle cx="18" cy="6" r="3" />
      <path d="M18 4.7v1.5l1 1" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 16 5-5 4 4 7-7" />
      <path d="M15 8h5v5" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 20 4.2-1 9-9a2 2 0 0 0-2.8-2.8l-9 9L4 20Z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" />
      <path d="M10 11v6M14 11v6" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

function AddUserIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 18c1.2-2.6 3.2-3.9 6-3.9 2.9 0 4.9 1.3 6.1 3.9" />
      <path d="M18 8v6M15 11h6" />
    </svg>
  );
}

function metricIcon(metricId: string) {
  if (metricId === "total") return <UsersIcon />;
  if (metricId === "active") return <BadgeCheckIcon />;
  if (metricId === "pending") return <ClockBagIcon />;
  return <TrendIcon />;
}

function statusText(status: VendorStatus) {
  if (status === "active") return "Active";
  if (status === "inactive") return "Inactive";
  if (status === "under-audit") return "Under Audit";
  return "Fresh Onboard";
}

function statusColor(status: VendorStatus) {
  if (status === "active") return "text-[#14b252]";
  if (status === "inactive") return "text-[#9db0c8]";
  if (status === "under-audit") return "text-[#f2a21a]";
  return "text-[#477640]";
}

function initialsFromName(name: string) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "VN";
}

function vendorRecordStatus(status: string): VendorStatus {
  if (status === "ACTIVE") return "active";
  if (status === "INACTIVE") return "inactive";
  if (status === "UNDER_AUDIT") return "under-audit";
  return "fresh-onboard";
}

function vendorRecordSlug(vendor: VendorRecord) {
  return vendor.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || vendor.id;
}

function vendorRecordToTableRow(vendor: VendorRecord): VendorTableRow {
  return {
    category: "Nature Foods",
    id: vendor.id,
    initials: initialsFromName(vendor.name),
    name: vendor.name,
    salesDelta: "New vendor",
    slug: vendorRecordSlug(vendor),
    status: vendorRecordStatus(vendor.status),
    stockCount: "0 units",
    totalSales: "Rs. 0.00",
    vendorCode: vendor.vendorCode,
  };
}

function vendorRecordToGridCard(vendor: VendorRecord): VendorGridCard {
  return {
    accentFrom: "#477640",
    accentTo: "#9a7a35",
    category: "Nature Foods",
    id: vendor.id,
    initials: initialsFromName(vendor.name),
    joined: new Date(vendor.createdAt).toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    }),
    name: vendor.name,
    productsCount: "0",
    rating: "New",
    slug: vendorRecordSlug(vendor),
    status: vendorRecordStatus(vendor.status),
  };
}

function matchesVendorFilters<T extends { category: string; name: string; status: VendorStatus; vendorCode?: string }>(
  item: T,
  query: string,
  category: string,
  status: string,
) {
  const normalizedQuery = query.trim().toLowerCase();
  const queryOk =
    normalizedQuery.length === 0 ||
    item.name.toLowerCase().includes(normalizedQuery) ||
    (item.vendorCode?.toLowerCase().includes(normalizedQuery) ?? false);
  const categoryOk = category === "All Categories" || item.category === category;
  const statusOk =
    status === "All Status" ||
    statusText(item.status).toLowerCase() === status.toLowerCase();

  return queryOk && categoryOk && statusOk;
}

async function getApiErrorMessage(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as ApiListVendorsResponse;

    if (!payload.success) {
      return payload.error.message;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

function VendorMetricCard({ metric }: { metric: VendorMetric }) {
  const toneClass =
    metric.tone === "purple"
      ? "bg-[#efebff] text-[#5d54db]"
      : metric.tone === "green"
        ? "bg-[#ddfae5] text-[#16b364]"
        : metric.tone === "amber"
          ? "bg-[#fff3d9] text-[#e08a00]"
          : "bg-[#dfe6ff] text-[#5b67e9]";

  return (
    <article className="rounded-[1.8rem] border border-[#e8edf4] bg-white px-6 py-5 shadow-[0_18px_40px_rgba(20,31,56,0.04)]">
      <div className="flex items-start gap-4">
        <div className={`inline-flex rounded-2xl p-4 ${toneClass}`}>{metricIcon(metric.id)}</div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">{metric.label}</p>
          <p className="mt-2 text-[2.5rem] font-semibold tracking-tight text-[#17213d]">{metric.value}</p>
        </div>
      </div>
    </article>
  );
}

function VendorListTable({
  deletingVendorId,
  onDelete,
  onEdit,
  rows,
}: {
  deletingVendorId: string;
  onDelete: (vendorId: string) => void;
  onEdit: (vendorId: string) => void;
  rows: VendorTableRow[];
}) {
  return (
    <DashboardPanel className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#f4f6fb] text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#8e9cb0]">
              <th className="rounded-l-2xl px-6 py-4">Vendor Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Total Sales</th>
              <th className="px-6 py-4">Stock Count</th>
              <th className="px-6 py-4">Status</th>
              <th className="rounded-r-2xl px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-14 text-center text-base font-medium text-[#71829a]">
                  No vendors found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
              <tr key={row.id}>
                <td className="border-b border-[#edf1f6] px-6 py-5">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0f4fa] text-lg font-semibold text-[#5a6f52]">
                      {row.initials}
                    </span>
                    <div>
                      <p className="text-[1.08rem] font-semibold text-[#17213d]">{row.name}</p>
                      <p className="text-sm text-[#8b98ac]">ID: {row.vendorCode}</p>
                    </div>
                  </div>
                </td>
                <td className="border-b border-[#edf1f6] px-6 py-5">
                  <span className="inline-flex rounded-xl bg-[#eef3f8] px-3 py-1 text-sm font-semibold text-[#64748b]">
                    {row.category}
                  </span>
                </td>
                <td className="border-b border-[#edf1f6] px-6 py-5">
                  <p className="text-[1.08rem] font-semibold text-[#17213d]">{row.totalSales}</p>
                  <p className={`text-sm font-medium ${row.salesDelta.startsWith("-") ? "text-[#ef4444]" : "text-[#16a34a]"}`}>
                    {row.salesDelta}
                  </p>
                </td>
                <td className={`border-b border-[#edf1f6] px-6 py-5 text-[1.08rem] ${row.stockCount.toLowerCase().includes("low") ? "text-[#ef4444]" : "text-[#475569]"}`}>
                  {row.stockCount}
                </td>
                <td className="border-b border-[#edf1f6] px-6 py-5">
                  <div className={`flex items-center gap-2 text-[1.02rem] font-semibold uppercase tracking-[0.06em] ${statusColor(row.status)}`}>
                    <span className={`h-2.5 w-2.5 rounded-full ${row.status === "active" ? "bg-[#14b252]" : row.status === "inactive" ? "bg-[#cbd5e1]" : row.status === "under-audit" ? "bg-[#f2a21a]" : "bg-[#477640]"}`} />
                    <span>{statusText(row.status)}</span>
                  </div>
                </td>
                <td className="border-b border-[#edf1f6] px-6 py-5">
                  <div className="flex items-center justify-end gap-4 text-[#94a3b8]">
                    <Link
                      href={`/dashboard/vendors/${row.slug}`}
                      className="transition-colors hover:text-[#477640]"
                      aria-label={`View ${row.name}`}
                    >
                      <EyeIcon />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onEdit(row.id)}
                      className="transition-colors hover:text-[#477640]"
                      aria-label={`Edit ${row.name}`}
                    >
                      <EditIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(row.id)}
                      disabled={deletingVendorId === row.id}
                      className="transition-colors hover:text-[#dc2626] disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Delete ${row.name}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-[#edf1f6] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-[#64748b]">
          Showing <span className="font-semibold text-[#17213d]">{rows.length}</span>{" "}
          vendors
        </p>
        <div className="hidden">
          <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white text-[#94a3b8]">‹</button>
          <button type="button" className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#477640] bg-[#477640] px-3 text-sm font-semibold text-white">1</button>
          <button type="button" className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white px-3 text-sm font-semibold text-[#334155]">2</button>
          <button type="button" className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white px-3 text-sm font-semibold text-[#334155]">3</button>
          <span className="px-1 text-[#94a3b8]">...</span>
          <button type="button" className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white px-3 text-sm font-semibold text-[#334155]">128</button>
          <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white text-[#94a3b8]">›</button>
        </div>
      </div>
    </DashboardPanel>
  );
}

function VendorGridCard({
  card,
  deletingVendorId,
  onDelete,
  onEdit,
}: {
  card: VendorGridCard;
  deletingVendorId: string;
  onDelete: (vendorId: string) => void;
  onEdit: (vendorId: string) => void;
}) {
  return (
    <article className="rounded-[1.8rem] border border-[#e8edf4] bg-white shadow-[0_18px_40px_rgba(20,31,56,0.04)] transition-transform hover:-translate-y-0.5">
      <div
        className="relative h-24 rounded-t-[1.8rem]"
        style={{
          background: `linear-gradient(135deg, ${card.accentFrom}, ${card.accentTo})`,
        }}
      >
        {card.badge ? (
          <span className="absolute right-4 top-4 rounded-lg bg-white/18 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white">
            {card.badge}
          </span>
        ) : null}
      </div>

      <div className="px-6 pb-6">
        <div className="-mt-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-white bg-[#24354c] text-lg font-semibold text-white shadow-[0_12px_28px_rgba(20,31,56,0.18)]">
          {card.initials}
        </div>
        <Link
          href={`/dashboard/vendors/${card.slug}`}
          className="mt-5 block text-[1.5rem] font-semibold tracking-tight text-[#17213d] transition-colors hover:text-[#477640]"
        >
          {card.name}
        </Link>
        <p className="mt-1 text-[1.02rem] text-[#71829a]">{card.category}</p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#eef3f8] px-3 py-1 text-sm font-semibold text-[#477640]">
          <span>★</span>
          <span>{card.rating}</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6 border-t border-[#edf1f6] pt-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Products</p>
            <p className="mt-2 text-[1.7rem] font-semibold tracking-tight text-[#17213d]">{card.productsCount}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">Joined</p>
            <p className="mt-2 text-[1.7rem] font-semibold tracking-tight text-[#17213d]">{card.joined}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[#edf1f6] pt-5">
          <div className={`flex items-center gap-2 text-sm font-medium ${statusColor(card.status)}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${card.status === "active" ? "bg-[#14b252]" : card.status === "under-audit" ? "bg-[#f2a21a]" : card.status === "fresh-onboard" ? "bg-[#477640]" : "bg-[#cbd5e1]"}`} />
            <span>{statusText(card.status)}</span>
          </div>
          <div className="flex items-center gap-3 text-[#94a3b8]">
            <Link
              href={`/dashboard/vendors/${card.slug}`}
              className="transition-colors hover:text-[#477640]"
              aria-label={`View ${card.name}`}
            >
              <EyeIcon />
            </Link>
            <button
              type="button"
              onClick={() => onEdit(card.id)}
              className="transition-colors hover:text-[#477640]"
              aria-label={`Edit ${card.name}`}
            >
              <EditIcon />
            </button>
            <button
              type="button"
              onClick={() => onDelete(card.id)}
              disabled={deletingVendorId === card.id}
              className="transition-colors hover:text-[#dc2626] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Delete ${card.name}`}
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function VendorNetworkPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [query, setQuery] = useState("");
  const [vendors, setVendors] = useState<VendorRecord[]>([]);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingVendor, setEditingVendor] = useState<VendorRecord | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [deletingVendorId, setDeletingVendorId] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadVendors() {
      setIsLoading(true);
      setPageError("");

      try {
        const response = await fetch("/api/v1/vendors", {
          cache: "no-store",
        });
        const payload = (await response.json()) as ApiListVendorsResponse;

        if (!response.ok || !payload.success) {
          throw new Error(
            payload.success ? "Unable to load vendors." : payload.error.message,
          );
        }

        if (isMounted) {
          setVendors(payload.data);
        }
      } catch (error) {
        if (isMounted) {
          setPageError(
            error instanceof Error
              ? error.message
              : "Unable to load vendors. Please try again.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadVendors();

    return () => {
      isMounted = false;
    };
  }, []);

  const liveVendorMetrics = useMemo<VendorMetric[]>(
    () => [
      { id: "total", label: "Total Vendors", value: String(vendors.length), tone: "purple" },
      {
        id: "active",
        label: "Active Now",
        value: String(vendors.filter((vendor) => vendor.status === "ACTIVE").length),
        tone: "green",
      },
      {
        id: "pending",
        label: "Fresh Onboard",
        value: String(vendors.filter((vendor) => vendor.status === "FRESH_ONBOARD").length),
        tone: "amber",
      },
      {
        id: "rating",
        label: "Under Audit",
        value: String(vendors.filter((vendor) => vendor.status === "UNDER_AUDIT").length),
        tone: "blue",
      },
    ],
    [vendors],
  );

  const tableRows = useMemo(
    () => vendors.map((vendor) => vendorRecordToTableRow(vendor)),
    [vendors],
  );

  const gridCards = useMemo(
    () => vendors.map((vendor) => vendorRecordToGridCard(vendor)),
    [vendors],
  );

  const filteredTableRows = useMemo(
    () =>
      tableRows.filter((row) =>
        matchesVendorFilters(row, query, category, status),
      ),
    [category, query, status, tableRows],
  );

  const filteredGridCards = useMemo(
    () =>
      gridCards.filter((card) =>
        matchesVendorFilters(card, query, category, status),
      ),
    [category, query, status, gridCards],
  );

  function openCreateDialog() {
    setDialogMode("create");
    setEditingVendor(null);
    setIsOnboardingOpen(true);
  }

  function openEditDialog(vendorId: string) {
    const vendor = vendors.find((item) => item.id === vendorId);

    if (!vendor) {
      return;
    }

    setDialogMode("edit");
    setEditingVendor(vendor);
    setIsOnboardingOpen(true);
  }

  function closeVendorDialog() {
    setIsOnboardingOpen(false);
    setEditingVendor(null);
  }

  function handleVendorSaved(vendor: VendorRecord, mode: "create" | "edit") {
    setVendors((current) => {
      if (mode === "create") {
        return [vendor, ...current];
      }

      return current.map((item) => (item.id === vendor.id ? vendor : item));
    });
    setNotice(
      mode === "create"
        ? `${vendor.name} was added successfully.`
        : `${vendor.name} was updated successfully.`,
    );
  }

  async function handleVendorDelete(vendorId: string) {
    const vendor = vendors.find((item) => item.id === vendorId);

    if (!vendor || !window.confirm(`Delete ${vendor.name}?`)) {
      return;
    }

    setDeletingVendorId(vendorId);
    setPageError("");

    try {
      const response = await fetch(`/api/v1/vendors/${vendorId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          await getApiErrorMessage(response, "Unable to delete vendor."),
        );
      }

      setVendors((current) => current.filter((item) => item.id !== vendorId));
      setNotice(`${vendor.name} was deleted successfully.`);
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Unable to delete vendor. Please try again.",
      );
    } finally {
      setDeletingVendorId("");
    }
  }

  return (
    <DashboardShell mobileTitle="Vendors">
      <div className="space-y-8">
        <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-[2.8rem] font-semibold tracking-tight text-[#17213d]">
              {vendorsPageContent.heading}
            </h1>
            <p className="mt-2 text-[1.05rem] text-[#71829a]">
              {vendorsPageContent.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex rounded-2xl border border-[#dbe3ee] bg-white p-1 shadow-[0_10px_24px_rgba(20,31,56,0.05)]">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#eef4eb] text-[#477640]"
                    : "text-[#64748b] hover:bg-[#f5f8fc]"
                }`}
              >
                <GridViewIcon />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                  viewMode === "list"
                    ? "bg-[#eef4eb] text-[#477640]"
                    : "text-[#64748b] hover:bg-[#f5f8fc]"
                }`}
              >
                <ListViewIcon />
              </button>
            </div>

            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dbe3ee] bg-white px-5 text-base font-semibold text-[#334155]"
            >
              <FilterIcon />
              <span>Filters</span>
            </button>

            <button
              type="button"
              onClick={openCreateDialog}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#477640] px-5 text-base font-semibold text-white"
            >
              <AddUserIcon />
              <span>Add Vendor</span>
            </button>
          </div>
        </section>

        {notice ? (
          <div className="rounded-2xl border border-[#c9ead0] bg-[#f0fff4] px-5 py-4 text-base font-semibold text-[#276238]">
            {notice}
          </div>
        ) : null}

        {pageError ? (
          <div className="rounded-2xl border border-[#fecaca] bg-[#fff1f2] px-5 py-4 text-base font-semibold text-[#b91c1c]">
            {pageError}
          </div>
        ) : null}

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {liveVendorMetrics.map((metric) => (
            <VendorMetricCard key={metric.id} metric={metric} />
          ))}
        </section>

        {viewMode === "list" ? (
          <>
            <DashboardPanel>
              <div className="grid gap-4 lg:grid-cols-[160px_160px_minmax(0,1fr)]">
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="h-12 rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none"
                >
                  {vendorCategoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="h-12 rounded-2xl border border-[#e3eaf2] bg-[#f7f8fc] px-4 text-base text-[#24304a] outline-none"
                >
                  {vendorStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <label className="flex h-12 items-center gap-3 rounded-2xl bg-[#f5f7fc] px-4 text-[#94a3b8]">
                  <SearchIcon />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by name or ID..."
                    className="w-full bg-transparent text-base text-[#24304a] outline-none placeholder:text-[#94a3b8]"
                  />
                </label>
              </div>
            </DashboardPanel>

            {isLoading ? (
              <DashboardPanel>
                <p className="text-base font-medium text-[#71829a]">Loading vendors...</p>
              </DashboardPanel>
            ) : (
              <VendorListTable
                rows={filteredTableRows}
                deletingVendorId={deletingVendorId}
                onDelete={handleVendorDelete}
                onEdit={openEditDialog}
              />
            )}

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_320px]">
              <DashboardPanel className="bg-[#477640] text-white">
                <h2 className="text-[2.4rem] font-semibold tracking-tight">
                  {vendorGrowthReport.title}
                </h2>
                <p className="mt-6 max-w-[520px] text-[1.2rem] leading-9 text-[#e4efe1]">
                  {vendorGrowthReport.description}
                </p>
                <button
                  type="button"
                  className="mt-10 inline-flex h-12 items-center justify-center rounded-2xl bg-white px-8 text-base font-semibold text-[#477640]"
                >
                  View Analytics
                </button>
              </DashboardPanel>

              <DashboardPanel>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9aa6ba]">
                  Quick Actions
                </p>
                <div className="mt-8 space-y-6">
                  {vendorQuickActions.map((action) => (
                    <div key={action}>
                      <p className="text-[1.15rem] font-semibold text-[#17213d]">{action}</p>
                      {action === "Generate tax reports" ? (
                        <p className="mt-1 text-sm text-[#94a3b8]">
                          Last automated check: 14 mins ago
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </DashboardPanel>
            </section>
          </>
        ) : (
          <>
            <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {filteredGridCards.map((card) => (
                <VendorGridCard
                  key={card.id}
                  card={card}
                  deletingVendorId={deletingVendorId}
                  onDelete={handleVendorDelete}
                  onEdit={openEditDialog}
                />
              ))}
              <button
                type="button"
                onClick={openCreateDialog}
                className="flex min-h-[356px] flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-[#d7e1ef] bg-[#fbfcff] px-8 text-center shadow-[0_18px_40px_rgba(20,31,56,0.03)] transition-colors hover:border-[#477640]"
              >
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-4xl text-[#9fb0c8] shadow-[0_14px_30px_rgba(20,31,56,0.08)]">
                  +
                </span>
                <h3 className="mt-8 text-[2rem] font-semibold tracking-tight text-[#6c7b95]">
                  Add New Partner
                </h3>
                <p className="mt-4 max-w-[220px] text-[1.02rem] leading-8 text-[#9aa6ba]">
                  Start a new vendor relationship and expand your catalog.
                </p>
              </button>
            </section>

            <DashboardPanel>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-[#64748b]">
                  Showing <span className="font-semibold text-[#17213d]">{filteredGridCards.length}</span>{" "}
                  vendors
                </p>
                <div className="hidden">
                  <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white text-[#94a3b8]">‹</button>
                  <button type="button" className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#477640] bg-[#477640] px-3 text-sm font-semibold text-white">1</button>
                  <button type="button" className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white px-3 text-sm font-semibold text-[#334155]">2</button>
                  <button type="button" className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white px-3 text-sm font-semibold text-[#334155]">3</button>
                  <span className="px-1 text-[#94a3b8]">...</span>
                  <button type="button" className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white px-3 text-sm font-semibold text-[#334155]">128</button>
                  <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white text-[#94a3b8]">›</button>
                </div>
              </div>
            </DashboardPanel>
          </>
        )}
      </div>

      {isOnboardingOpen ? (
        <VendorOnboardingDialog
          key={`${dialogMode}-${editingVendor?.id ?? "new"}`}
          open={isOnboardingOpen}
          mode={dialogMode}
          vendor={editingVendor}
          onClose={closeVendorDialog}
          onSaved={handleVendorSaved}
        />
      ) : null}
    </DashboardShell>
  );
}
