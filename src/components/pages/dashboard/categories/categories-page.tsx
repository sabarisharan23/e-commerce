"use client";

import { useMemo, useState } from "react";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import {
  categoriesPageContent,
  categoryParentOptions,
  categoryRecords,
  tagRecords,
  type ProductCategoryItem,
  type ProductTagItem,
} from "./categories-data";

type TabKey = "categories" | "tags";

function EditIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4 20 4.2-1 9-9a2 2 0 0 0-2.8-2.8l-9 9L4 20Z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M7 7v12h10V7" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16" />
      <path d="M7 12h10" />
      <path d="M10 17h4" />
    </svg>
  );
}

function EmptyTagIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-12 w-12 stroke-[#d4dbe7]"
      fill="none"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13V7a2 2 0 0 0-2-2h-6l-8 8 7 7 8-8V7" />
      <circle cx="15" cy="9" r="1" fill="#d4dbe7" stroke="none" />
      <path d="m9 8 7 7" />
    </svg>
  );
}

function TablePagination() {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white text-[#64748b]"
      >
        ‹
      </button>
      <button
        type="button"
        className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#477640] bg-[#477640] px-3 text-sm font-semibold text-white"
      >
        1
      </button>
      <button
        type="button"
        className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white px-3 text-sm font-semibold text-[#334155]"
      >
        2
      </button>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe3ee] bg-white text-[#64748b]"
      >
        ›
      </button>
    </div>
  );
}

export function DashboardCategoriesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("categories");
  const [categories, setCategories] = useState<ProductCategoryItem[]>(categoryRecords);
  const [tags, setTags] = useState<ProductTagItem[]>(tagRecords);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [tagSearch, setTagSearch] = useState("");
  const [bulkAction, setBulkAction] = useState("bulk");
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    parent: "None",
    description: "",
  });
  const [tagForm, setTagForm] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const filteredTags = useMemo(() => {
    const query = tagSearch.trim().toLowerCase();
    if (!query) {
      return tags;
    }

    return tags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(query) ||
        tag.slug.toLowerCase().includes(query) ||
        tag.description.toLowerCase().includes(query),
    );
  }, [tagSearch, tags]);

  const selectedTag = tags.find((tag) => tag.id === selectedTagId) ?? null;

  const addCategory = () => {
    if (!categoryForm.name.trim() || !categoryForm.slug.trim()) {
      return;
    }

    const nextCategory: ProductCategoryItem = {
      id: categoryForm.slug.trim().toLowerCase(),
      name: categoryForm.name.trim(),
      slug: categoryForm.slug.trim(),
      description: categoryForm.description.trim() || "Newly created category.",
      count: 0,
      parent: categoryForm.parent,
    };

    setCategories((current) => [nextCategory, ...current]);
    setCategoryForm({
      name: "",
      slug: "",
      parent: "None",
      description: "",
    });
  };

  const addTag = () => {
    if (!tagForm.name.trim() || !tagForm.slug.trim()) {
      return;
    }

    const nextTag: ProductTagItem = {
      id: tagForm.slug.trim().toLowerCase(),
      name: tagForm.name.trim(),
      slug: tagForm.slug.trim(),
      description: tagForm.description.trim() || "New product tag.",
    };

    setTags((current) => [nextTag, ...current]);
    setTagForm({
      name: "",
      slug: "",
      description: "",
    });
  };

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const applyBulkAction = () => {
    if (bulkAction !== "delete" || selectedCategoryIds.length === 0) {
      return;
    }

    setCategories((current) =>
      current.filter((item) => !selectedCategoryIds.includes(item.id)),
    );
    setSelectedCategoryIds([]);
    setBulkAction("bulk");
  };

  return (
    <DashboardShell mobileTitle="Categories">
      <div className="space-y-8">
        <section>
          <h1 className="text-[2.6rem] font-semibold tracking-tight text-[#17213d]">
            {categoriesPageContent.heading}
          </h1>
          <p className="mt-2 text-[1.02rem] text-[#71829a]">
            {categoriesPageContent.description}
          </p>
        </section>

        <div className="flex items-center gap-8 border-b border-[#dbe3ee]">
          {(["categories", "tags"] as TabKey[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 pb-3 text-base font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? "border-[#477640] text-[#477640]"
                  : "border-transparent text-[#64748b]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "categories" ? (
          <section className="grid gap-6 xl:grid-cols-[minmax(300px,0.78fr)_minmax(0,1.62fr)]">
            <DashboardPanel>
              <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">
                Add New Category
              </h2>

              <div className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-base font-medium text-[#17213d]">Name</span>
                  <input
                    value={categoryForm.name}
                    onChange={(event) =>
                      setCategoryForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="e.g. Electronics"
                    className="h-12 w-full rounded-2xl border border-[#dbe3ee] px-4 text-base text-[#24304a] outline-none"
                  />
                  <span className="mt-2 block text-sm text-[#94a3b8]">
                    The name is how it appears on your site.
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-base font-medium text-[#17213d]">Slug</span>
                  <input
                    value={categoryForm.slug}
                    onChange={(event) =>
                      setCategoryForm((current) => ({
                        ...current,
                        slug: event.target.value,
                      }))
                    }
                    placeholder="electronics"
                    className="h-12 w-full rounded-2xl border border-[#dbe3ee] px-4 text-base text-[#24304a] outline-none"
                  />
                  <span className="mt-2 block text-sm text-[#94a3b8]">
                    The &quot;slug&quot; is the URL-friendly version of the name.
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-base font-medium text-[#17213d]">
                    Parent Category
                  </span>
                  <select
                    value={categoryForm.parent}
                    onChange={(event) =>
                      setCategoryForm((current) => ({
                        ...current,
                        parent: event.target.value,
                      }))
                    }
                    className="h-12 w-full rounded-2xl border border-[#dbe3ee] px-4 text-base text-[#24304a] outline-none"
                  >
                    {categoryParentOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-base font-medium text-[#17213d]">
                    Description
                  </span>
                  <textarea
                    value={categoryForm.description}
                    onChange={(event) =>
                      setCategoryForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Brief description of the category..."
                    className="min-h-[128px] w-full rounded-2xl border border-[#dbe3ee] px-4 py-3 text-base text-[#24304a] outline-none"
                  />
                </label>

                <button
                  type="button"
                  onClick={addCategory}
                  className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#477640] px-6 text-base font-semibold text-white transition-colors hover:bg-[#3d6637]"
                >
                  Add New Category
                </button>
              </div>
            </DashboardPanel>

            <DashboardPanel className="overflow-hidden">
              <div className="flex flex-col gap-4 border-b border-[#edf1f6] pb-5 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">
                  Existing Categories
                </h2>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <select
                    value={bulkAction}
                    onChange={(event) => setBulkAction(event.target.value)}
                    className="h-11 rounded-2xl border border-[#477640] bg-white px-4 text-sm font-medium text-[#477640] outline-none"
                  >
                    <option value="bulk">Bulk Actions</option>
                    <option value="delete">Delete Selected</option>
                  </select>
                  <button
                    type="button"
                    onClick={applyBulkAction}
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#477640] px-5 text-sm font-semibold text-white"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="hidden overflow-x-auto lg:block">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-[#f4f6fb] text-left text-sm font-semibold text-[#7b8aa2]">
                      <th className="rounded-l-2xl px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCategoryIds.length === categories.length && categories.length > 0}
                          onChange={() =>
                            setSelectedCategoryIds(
                              selectedCategoryIds.length === categories.length
                                ? []
                                : categories.map((item) => item.id),
                            )
                          }
                          className="h-5 w-5 rounded-md border-[#cdd7e4]"
                        />
                      </th>
                      <th className="px-4 py-4">Name</th>
                      <th className="px-4 py-4">Description</th>
                      <th className="px-4 py-4">Slug</th>
                      <th className="px-4 py-4">Count</th>
                      <th className="rounded-r-2xl px-4 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((item) => (
                      <tr key={item.id}>
                        <td className="border-b border-[#edf1f6] px-4 py-5">
                          <input
                            type="checkbox"
                            checked={selectedCategoryIds.includes(item.id)}
                            onChange={() => toggleCategory(item.id)}
                            className="h-5 w-5 rounded-md border-[#cdd7e4]"
                          />
                        </td>
                        <td className="border-b border-[#edf1f6] px-4 py-5 text-[1.02rem] font-semibold text-[#17213d]">
                          {item.name}
                        </td>
                        <td className="border-b border-[#edf1f6] px-4 py-5 text-[1.02rem] text-[#64748b]">
                          <span className="line-clamp-2 max-w-[220px]">{item.description}</span>
                        </td>
                        <td className="border-b border-[#edf1f6] px-4 py-5 text-[1.02rem] text-[#475569]">
                          {item.slug}
                        </td>
                        <td className="border-b border-[#edf1f6] px-4 py-5 text-[1.02rem] text-[#17213d]">
                          {item.count}
                        </td>
                        <td className="border-b border-[#edf1f6] px-4 py-5">
                          <div className="flex items-center justify-end gap-3 text-[#94a3b8]">
                            <button type="button" className="transition-colors hover:text-[#477640]">
                              <EditIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setCategories((current) =>
                                  current.filter((entry) => entry.id !== item.id),
                                )
                              }
                              className="transition-colors hover:text-[#e24646]"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 lg:hidden">
                {categories.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-[1.5rem] border border-[#e8edf4] bg-[#fbfcff] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-[#17213d]">{item.name}</p>
                        <p className="mt-1 text-sm text-[#64748b]">{item.slug}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedCategoryIds.includes(item.id)}
                        onChange={() => toggleCategory(item.id)}
                        className="mt-1 h-5 w-5 rounded-md border-[#cdd7e4]"
                      />
                    </div>
                    <p className="mt-3 text-sm text-[#64748b]">{item.description}</p>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="font-medium text-[#94a3b8]">{item.count} items</span>
                      <div className="flex items-center gap-3 text-[#94a3b8]">
                        <button type="button">
                          <EditIcon />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCategories((current) =>
                              current.filter((entry) => entry.id !== item.id),
                            )
                          }
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-4 border-t border-[#edf1f6] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-[#64748b]">
                  Showing 1 to {categories.length} of {categories.length} categories
                </p>
                <TablePagination />
              </div>
            </DashboardPanel>
          </section>
        ) : (
          <section className="grid gap-6 xl:grid-cols-[minmax(300px,0.78fr)_minmax(0,1.62fr)]">
            <DashboardPanel>
              <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">
                Add New Tag
              </h2>

              <div className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-base font-medium text-[#477640]">Name</span>
                  <input
                    value={tagForm.name}
                    onChange={(event) =>
                      setTagForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="e.g. Summer Collection"
                    className="h-12 w-full rounded-2xl border border-[#dbe3ee] px-4 text-base text-[#24304a] outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-base font-medium text-[#477640]">Slug</span>
                  <input
                    value={tagForm.slug}
                    onChange={(event) =>
                      setTagForm((current) => ({
                        ...current,
                        slug: event.target.value,
                      }))
                    }
                    placeholder="summer-collection"
                    className="h-12 w-full rounded-2xl border border-[#dbe3ee] px-4 text-base text-[#24304a] outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-base font-medium text-[#477640]">
                    Description
                  </span>
                  <textarea
                    value={tagForm.description}
                    onChange={(event) =>
                      setTagForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Tag description..."
                    className="min-h-[110px] w-full rounded-2xl border border-[#dbe3ee] px-4 py-3 text-base text-[#24304a] outline-none"
                  />
                </label>

                <button
                  type="button"
                  onClick={addTag}
                  className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#477640] px-6 text-base font-semibold text-white transition-colors hover:bg-[#3d6637]"
                >
                  Add New Tag
                </button>
              </div>
            </DashboardPanel>

            <DashboardPanel>
              <div className="flex flex-col gap-4 border-b border-[#edf1f6] pb-5 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">
                  Manage Tags
                </h2>
                <label className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[#dbe3ee] bg-[#f8fafc] px-4 text-[#94a3b8]">
                  <FilterIcon />
                  <input
                    value={tagSearch}
                    onChange={(event) => setTagSearch(event.target.value)}
                    placeholder="Filter tags..."
                    className="w-full bg-transparent text-sm text-[#24304a] outline-none placeholder:text-[#94a3b8]"
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {filteredTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() =>
                      setSelectedTagId((current) => (current === tag.id ? null : tag.id))
                    }
                    className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      selectedTagId === tag.id
                        ? "border-[#477640] bg-[#eef4eb] text-[#477640]"
                        : "border-[#d5ddd1] bg-[#edf3ea] text-[#5f7a55]"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-[1.6rem] border border-dashed border-[#dbe3ee] px-6 py-10">
                {selectedTag ? (
                  <div className="space-y-3 text-center">
                    <p className="text-xl font-semibold text-[#17213d]">{selectedTag.name}</p>
                    <p className="text-sm font-medium uppercase tracking-[0.08em] text-[#94a3b8]">
                      {selectedTag.slug}
                    </p>
                    <p className="mx-auto max-w-[420px] text-sm text-[#64748b]">
                      {selectedTag.description}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <EmptyTagIcon />
                    <p className="mt-4 text-[1.15rem] font-medium text-[#64748b]">
                      No tags selected for bulk editing
                    </p>
                    <p className="mt-2 max-w-[420px] text-sm text-[#94a3b8]">
                      Click on a tag or search to begin managing your taxonomy.
                    </p>
                  </div>
                )}
              </div>
            </DashboardPanel>
          </section>
        )}
      </div>
    </DashboardShell>
  );
}
