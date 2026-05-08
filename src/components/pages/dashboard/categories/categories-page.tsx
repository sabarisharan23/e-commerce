"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { DashboardPanel, DashboardShell } from "../dashboard-shell";
import { categoriesPageContent } from "./categories-data";

type TabKey = "categories" | "tags";

export type CategoryRecord = {
  count: number;
  createdAt: string;
  description: string;
  id: string;
  name: string;
  parentId: string | null;
  parentName: string | null;
  slug: string;
  updatedAt: string;
};

export type TagRecord = {
  count: number;
  createdAt: string;
  description: string;
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
};

type CategoryFormState = {
  description: string;
  name: string;
  parentId: string;
  slug: string;
};

type TagFormState = {
  description: string;
  name: string;
  slug: string;
};

type ApiListResponse<TData> =
  | {
      data: TData[];
      success: true;
    }
  | {
      error: {
        message: string;
      };
      success: false;
    };

type ApiEntityResponse<TData> =
  | {
      data: TData;
      success: true;
    }
  | {
      error: {
        details?: Record<string, string>;
        message: string;
      };
      success: false;
    };

const emptyCategoryForm: CategoryFormState = {
  description: "",
  name: "",
  parentId: "",
  slug: "",
};

const emptyTagForm: TagFormState = {
  description: "",
  name: "",
  slug: "",
};

function EditIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
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
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
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
      className="h-4 w-4 stroke-current"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
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
      className="h-12 w-12 stroke-[#d4dbe7]"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d="M20 13V7a2 2 0 0 0-2-2h-6l-8 8 7 7 8-8V7" />
      <circle cx="15" cy="9" r="1" fill="#d4dbe7" stroke="none" />
      <path d="m9 8 7 7" />
    </svg>
  );
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm font-medium text-[#dc2626]">{message}</p>;
}

async function getApiErrorMessage(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as ApiEntityResponse<unknown>;

    if (!payload.success) {
      return payload.error.message;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

export function DashboardCategoriesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("categories");
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [tags, setTags] = useState<TagRecord[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [tagSearch, setTagSearch] = useState("");
  const [bulkAction, setBulkAction] = useState("bulk");
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(emptyCategoryForm);
  const [tagForm, setTagForm] = useState<TagFormState>(emptyTagForm);
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [editingTag, setEditingTag] = useState<TagRecord | null>(null);
  const [categoryFieldErrors, setCategoryFieldErrors] = useState<Record<string, string>>({});
  const [tagFieldErrors, setTagFieldErrors] = useState<Record<string, string>>({});
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [isSavingTag, setIsSavingTag] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadTaxonomy() {
      setIsLoading(true);
      setPageError("");

      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          fetch("/api/v1/categories", { cache: "no-store" }),
          fetch("/api/v1/tags", { cache: "no-store" }),
        ]);
        const [categoriesPayload, tagsPayload] = await Promise.all([
          categoriesResponse.json() as Promise<ApiListResponse<CategoryRecord>>,
          tagsResponse.json() as Promise<ApiListResponse<TagRecord>>,
        ]);

        if (!categoriesResponse.ok || !categoriesPayload.success) {
          throw new Error(
            categoriesPayload.success
              ? "Unable to load categories."
              : categoriesPayload.error.message,
          );
        }

        if (!tagsResponse.ok || !tagsPayload.success) {
          throw new Error(
            tagsPayload.success ? "Unable to load tags." : tagsPayload.error.message,
          );
        }

        if (isMounted) {
          setCategories(categoriesPayload.data);
          setTags(tagsPayload.data);
        }
      } catch (error) {
        if (isMounted) {
          setPageError(
            error instanceof Error
              ? error.message
              : "Unable to load taxonomy. Please try again.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTaxonomy();

    return () => {
      isMounted = false;
    };
  }, []);

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
  const categorySubmitLabel = editingCategory ? "Update Category" : "Add New Category";
  const tagSubmitLabel = editingTag ? "Update Tag" : "Add New Tag";

  function updateCategoryField(field: keyof CategoryFormState, value: string) {
    setCategoryForm((current) => {
      const next = { ...current, [field]: value };

      if (field === "name" && !editingCategory) {
        next.slug = slugify(value);
      }

      return next;
    });
    setCategoryFieldErrors((current) => ({ ...current, [field]: "" }));
    setPageError("");
  }

  function updateTagField(field: keyof TagFormState, value: string) {
    setTagForm((current) => {
      const next = { ...current, [field]: value };

      if (field === "name" && !editingTag) {
        next.slug = slugify(value);
      }

      return next;
    });
    setTagFieldErrors((current) => ({ ...current, [field]: "" }));
    setPageError("");
  }

  function resetCategoryForm() {
    setCategoryForm(emptyCategoryForm);
    setCategoryFieldErrors({});
    setEditingCategory(null);
  }

  function resetTagForm() {
    setTagForm(emptyTagForm);
    setTagFieldErrors({});
    setEditingTag(null);
  }

  async function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingCategory(true);
    setCategoryFieldErrors({});
    setPageError("");

    try {
      const categoryBeingEdited = editingCategory;
      const isEdit = Boolean(categoryBeingEdited);
      const response = await fetch(
        categoryBeingEdited
          ? `/api/v1/categories/${categoryBeingEdited.id}`
          : "/api/v1/categories",
        {
          body: JSON.stringify({
            description: categoryForm.description,
            name: categoryForm.name,
            parentId: categoryForm.parentId || null,
            slug: categoryForm.slug,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: isEdit ? "PATCH" : "POST",
        },
      );
      const payload = (await response.json()) as ApiEntityResponse<CategoryRecord>;

      if (!response.ok || !payload.success) {
        if (!payload.success && payload.error.details) {
          setCategoryFieldErrors(payload.error.details);
        }

        throw new Error(
          payload.success ? "Unable to save category." : payload.error.message,
        );
      }

      setCategories((current) => {
        if (isEdit) {
          return current.map((category) =>
            category.id === payload.data.id ? payload.data : category,
          );
        }

        return [payload.data, ...current].sort((a, b) => a.name.localeCompare(b.name));
      });
      setNotice(
        isEdit
          ? `${payload.data.name} was updated successfully.`
          : `${payload.data.name} was added successfully.`,
      );
      resetCategoryForm();
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Unable to save category. Please try again.",
      );
    } finally {
      setIsSavingCategory(false);
    }
  }

  async function saveTag(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingTag(true);
    setTagFieldErrors({});
    setPageError("");

    try {
      const tagBeingEdited = editingTag;
      const isEdit = Boolean(tagBeingEdited);
      const response = await fetch(
        tagBeingEdited ? `/api/v1/tags/${tagBeingEdited.id}` : "/api/v1/tags",
        {
          body: JSON.stringify({
            description: tagForm.description,
            name: tagForm.name,
            slug: tagForm.slug,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: isEdit ? "PATCH" : "POST",
        },
      );
      const payload = (await response.json()) as ApiEntityResponse<TagRecord>;

      if (!response.ok || !payload.success) {
        if (!payload.success && payload.error.details) {
          setTagFieldErrors(payload.error.details);
        }

        throw new Error(payload.success ? "Unable to save tag." : payload.error.message);
      }

      setTags((current) => {
        if (isEdit) {
          return current.map((tag) => (tag.id === payload.data.id ? payload.data : tag));
        }

        return [payload.data, ...current].sort((a, b) => a.name.localeCompare(b.name));
      });
      setNotice(
        isEdit
          ? `${payload.data.name} was updated successfully.`
          : `${payload.data.name} was added successfully.`,
      );
      resetTagForm();
    } catch (error) {
      setPageError(
        error instanceof Error ? error.message : "Unable to save tag. Please try again.",
      );
    } finally {
      setIsSavingTag(false);
    }
  }

  function editCategory(category: CategoryRecord) {
    setEditingCategory(category);
    setCategoryForm({
      description: category.description,
      name: category.name,
      parentId: category.parentId ?? "",
      slug: category.slug,
    });
    setActiveTab("categories");
    setCategoryFieldErrors({});
  }

  function editTag(tag: TagRecord) {
    setEditingTag(tag);
    setTagForm({
      description: tag.description,
      name: tag.name,
      slug: tag.slug,
    });
    setSelectedTagId(tag.id);
    setActiveTab("tags");
    setTagFieldErrors({});
  }

  async function deleteCategory(categoryId: string) {
    const category = categories.find((item) => item.id === categoryId);

    if (!category || !window.confirm(`Delete ${category.name}?`)) {
      return;
    }

    setDeletingId(categoryId);
    setPageError("");

    try {
      const response = await fetch(`/api/v1/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await getApiErrorMessage(response, "Unable to delete category."));
      }

      setCategories((current) => current.filter((item) => item.id !== categoryId));
      setSelectedCategoryIds((current) => current.filter((id) => id !== categoryId));
      setNotice(`${category.name} was deleted successfully.`);

      if (editingCategory?.id === categoryId) {
        resetCategoryForm();
      }
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Unable to delete category. Please try again.",
      );
    } finally {
      setDeletingId("");
    }
  }

  async function deleteTag(tagId: string) {
    const tag = tags.find((item) => item.id === tagId);

    if (!tag || !window.confirm(`Delete ${tag.name}?`)) {
      return;
    }

    setDeletingId(tagId);
    setPageError("");

    try {
      const response = await fetch(`/api/v1/tags/${tagId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await getApiErrorMessage(response, "Unable to delete tag."));
      }

      setTags((current) => current.filter((item) => item.id !== tagId));
      setNotice(`${tag.name} was deleted successfully.`);

      if (selectedTagId === tagId) {
        setSelectedTagId(null);
      }

      if (editingTag?.id === tagId) {
        resetTagForm();
      }
    } catch (error) {
      setPageError(
        error instanceof Error ? error.message : "Unable to delete tag. Please try again.",
      );
    } finally {
      setDeletingId("");
    }
  }

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const applyBulkAction = async () => {
    if (bulkAction !== "delete" || selectedCategoryIds.length === 0) {
      return;
    }

    for (const categoryId of selectedCategoryIds) {
      const response = await fetch(`/api/v1/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setPageError(await getApiErrorMessage(response, "Unable to delete selected categories."));
        return;
      }
    }

    setCategories((current) =>
      current.filter((item) => !selectedCategoryIds.includes(item.id)),
    );
    setSelectedCategoryIds([]);
    setBulkAction("bulk");
    setNotice("Selected categories were deleted successfully.");
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
              className={`border-b-2 pb-3 text-base font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? "border-[#477640] text-[#477640]"
                  : "border-transparent text-[#64748b]"
              }`}
              key={tab}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>

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

        {isLoading ? (
          <DashboardPanel>
            <p className="text-base font-medium text-[#71829a]">Loading taxonomy...</p>
          </DashboardPanel>
        ) : activeTab === "categories" ? (
          <section className="grid gap-6 xl:grid-cols-[minmax(300px,0.78fr)_minmax(0,1.62fr)]">
            <DashboardPanel>
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
                {editingCategory ? (
                  <button
                    className="rounded-xl border border-[#dbe3ee] px-3 py-2 text-sm font-semibold text-[#64748b]"
                    onClick={resetCategoryForm}
                    type="button"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>

              <form className="mt-8 space-y-5" onSubmit={saveCategory}>
                <label className="block">
                  <span className="mb-2 block text-base font-medium text-[#17213d]">Name</span>
                  <input
                    className="h-12 w-full rounded-2xl border border-[#dbe3ee] px-4 text-base text-[#24304a] outline-none"
                    onChange={(event) => updateCategoryField("name", event.target.value)}
                    placeholder="e.g. Millet Flour"
                    required
                    value={categoryForm.name}
                  />
                  <FieldError message={categoryFieldErrors.name} />
                </label>

                <label className="block">
                  <span className="mb-2 block text-base font-medium text-[#17213d]">Slug</span>
                  <input
                    className="h-12 w-full rounded-2xl border border-[#dbe3ee] px-4 text-base text-[#24304a] outline-none"
                    onChange={(event) => updateCategoryField("slug", event.target.value)}
                    placeholder="millet-flour"
                    required
                    value={categoryForm.slug}
                  />
                  <FieldError message={categoryFieldErrors.slug} />
                </label>

                <label className="block">
                  <span className="mb-2 block text-base font-medium text-[#17213d]">
                    Parent Category
                  </span>
                  <select
                    className="h-12 w-full rounded-2xl border border-[#dbe3ee] px-4 text-base text-[#24304a] outline-none"
                    onChange={(event) => updateCategoryField("parentId", event.target.value)}
                    value={categoryForm.parentId}
                  >
                    <option value="">None</option>
                    {categories
                      .filter((category) => category.id !== editingCategory?.id)
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                  <FieldError message={categoryFieldErrors.parentId} />
                </label>

                <label className="block">
                  <span className="mb-2 block text-base font-medium text-[#17213d]">
                    Description
                  </span>
                  <textarea
                    className="min-h-[128px] w-full rounded-2xl border border-[#dbe3ee] px-4 py-3 text-base text-[#24304a] outline-none"
                    onChange={(event) =>
                      updateCategoryField("description", event.target.value)
                    }
                    placeholder="Brief description of the category..."
                    value={categoryForm.description}
                  />
                  <FieldError message={categoryFieldErrors.description} />
                </label>

                <button
                  className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#477640] px-6 text-base font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-65"
                  disabled={isSavingCategory}
                  type="submit"
                >
                  {isSavingCategory ? "Saving..." : categorySubmitLabel}
                </button>
              </form>
            </DashboardPanel>

            <DashboardPanel className="overflow-hidden">
              <div className="flex flex-col gap-4 border-b border-[#edf1f6] pb-5 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">
                  Existing Categories
                </h2>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <select
                    className="h-11 rounded-2xl border border-[#477640] bg-white px-4 text-sm font-medium text-[#477640] outline-none"
                    onChange={(event) => setBulkAction(event.target.value)}
                    value={bulkAction}
                  >
                    <option value="bulk">Bulk Actions</option>
                    <option value="delete">Delete Selected</option>
                  </select>
                  <button
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#477640] px-5 text-sm font-semibold text-white"
                    onClick={applyBulkAction}
                    type="button"
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
                          checked={
                            selectedCategoryIds.length === categories.length &&
                            categories.length > 0
                          }
                          className="h-5 w-5 rounded-md border-[#cdd7e4]"
                          onChange={() =>
                            setSelectedCategoryIds(
                              selectedCategoryIds.length === categories.length
                                ? []
                                : categories.map((item) => item.id),
                            )
                          }
                          type="checkbox"
                        />
                      </th>
                      <th className="px-4 py-4">Name</th>
                      <th className="px-4 py-4">Description</th>
                      <th className="px-4 py-4">Parent</th>
                      <th className="px-4 py-4">Slug</th>
                      <th className="px-4 py-4">Count</th>
                      <th className="rounded-r-2xl px-4 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr>
                        <td
                          className="px-6 py-14 text-center text-base font-medium text-[#71829a]"
                          colSpan={7}
                        >
                          No categories found.
                        </td>
                      </tr>
                    ) : (
                      categories.map((item) => (
                        <tr key={item.id}>
                          <td className="border-b border-[#edf1f6] px-4 py-5">
                            <input
                              checked={selectedCategoryIds.includes(item.id)}
                              className="h-5 w-5 rounded-md border-[#cdd7e4]"
                              onChange={() => toggleCategory(item.id)}
                              type="checkbox"
                            />
                          </td>
                          <td className="border-b border-[#edf1f6] px-4 py-5 text-[1.02rem] font-semibold text-[#17213d]">
                            {item.name}
                          </td>
                          <td className="border-b border-[#edf1f6] px-4 py-5 text-[1.02rem] text-[#64748b]">
                            <span className="line-clamp-2 max-w-[220px]">
                              {item.description}
                            </span>
                          </td>
                          <td className="border-b border-[#edf1f6] px-4 py-5 text-[1.02rem] text-[#475569]">
                            {item.parentName ?? "None"}
                          </td>
                          <td className="border-b border-[#edf1f6] px-4 py-5 text-[1.02rem] text-[#475569]">
                            {item.slug}
                          </td>
                          <td className="border-b border-[#edf1f6] px-4 py-5 text-[1.02rem] text-[#17213d]">
                            {item.count}
                          </td>
                          <td className="border-b border-[#edf1f6] px-4 py-5">
                            <div className="flex items-center justify-end gap-3 text-[#94a3b8]">
                              <button
                                className="transition-colors hover:text-[#477640]"
                                onClick={() => editCategory(item)}
                                type="button"
                              >
                                <EditIcon />
                              </button>
                              <button
                                className="transition-colors hover:text-[#e24646] disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={deletingId === item.id}
                                onClick={() => deleteCategory(item.id)}
                                type="button"
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

              <div className="grid gap-4 lg:hidden">
                {categories.map((item) => (
                  <article
                    className="rounded-[1.5rem] border border-[#e8edf4] bg-[#fbfcff] p-4"
                    key={item.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-[#17213d]">{item.name}</p>
                        <p className="mt-1 text-sm text-[#64748b]">{item.slug}</p>
                      </div>
                      <input
                        checked={selectedCategoryIds.includes(item.id)}
                        className="mt-1 h-5 w-5 rounded-md border-[#cdd7e4]"
                        onChange={() => toggleCategory(item.id)}
                        type="checkbox"
                      />
                    </div>
                    <p className="mt-3 text-sm text-[#64748b]">{item.description}</p>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="font-medium text-[#94a3b8]">
                        {item.count} products
                      </span>
                      <div className="flex items-center gap-3 text-[#94a3b8]">
                        <button onClick={() => editCategory(item)} type="button">
                          <EditIcon />
                        </button>
                        <button onClick={() => deleteCategory(item.id)} type="button">
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-4 border-t border-[#edf1f6] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-[#64748b]">
                  Showing {categories.length} categories
                </p>
              </div>
            </DashboardPanel>
          </section>
        ) : (
          <section className="grid gap-6 xl:grid-cols-[minmax(300px,0.78fr)_minmax(0,1.62fr)]">
            <DashboardPanel>
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">
                  {editingTag ? "Edit Tag" : "Add New Tag"}
                </h2>
                {editingTag ? (
                  <button
                    className="rounded-xl border border-[#dbe3ee] px-3 py-2 text-sm font-semibold text-[#64748b]"
                    onClick={resetTagForm}
                    type="button"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>

              <form className="mt-8 space-y-5" onSubmit={saveTag}>
                <label className="block">
                  <span className="mb-2 block text-base font-medium text-[#477640]">Name</span>
                  <input
                    className="h-12 w-full rounded-2xl border border-[#dbe3ee] px-4 text-base text-[#24304a] outline-none"
                    onChange={(event) => updateTagField("name", event.target.value)}
                    placeholder="e.g. Organic"
                    required
                    value={tagForm.name}
                  />
                  <FieldError message={tagFieldErrors.name} />
                </label>

                <label className="block">
                  <span className="mb-2 block text-base font-medium text-[#477640]">Slug</span>
                  <input
                    className="h-12 w-full rounded-2xl border border-[#dbe3ee] px-4 text-base text-[#24304a] outline-none"
                    onChange={(event) => updateTagField("slug", event.target.value)}
                    placeholder="organic"
                    required
                    value={tagForm.slug}
                  />
                  <FieldError message={tagFieldErrors.slug} />
                </label>

                <label className="block">
                  <span className="mb-2 block text-base font-medium text-[#477640]">
                    Description
                  </span>
                  <textarea
                    className="min-h-[110px] w-full rounded-2xl border border-[#dbe3ee] px-4 py-3 text-base text-[#24304a] outline-none"
                    onChange={(event) => updateTagField("description", event.target.value)}
                    placeholder="Tag description..."
                    value={tagForm.description}
                  />
                  <FieldError message={tagFieldErrors.description} />
                </label>

                <button
                  className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#477640] px-6 text-base font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-65"
                  disabled={isSavingTag}
                  type="submit"
                >
                  {isSavingTag ? "Saving..." : tagSubmitLabel}
                </button>
              </form>
            </DashboardPanel>

            <DashboardPanel>
              <div className="flex flex-col gap-4 border-b border-[#edf1f6] pb-5 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-[2rem] font-semibold tracking-tight text-[#17213d]">
                  Manage Tags
                </h2>
                <label className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[#dbe3ee] bg-[#f8fafc] px-4 text-[#94a3b8]">
                  <FilterIcon />
                  <input
                    className="w-full bg-transparent text-sm text-[#24304a] outline-none placeholder:text-[#94a3b8]"
                    onChange={(event) => setTagSearch(event.target.value)}
                    placeholder="Filter tags..."
                    value={tagSearch}
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {filteredTags.map((tag) => (
                  <button
                    className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      selectedTagId === tag.id
                        ? "border-[#477640] bg-[#eef4eb] text-[#477640]"
                        : "border-[#d5ddd1] bg-[#edf3ea] text-[#5f7a55]"
                    }`}
                    key={tag.id}
                    onClick={() =>
                      setSelectedTagId((current) => (current === tag.id ? null : tag.id))
                    }
                    type="button"
                  >
                    {tag.name} ({tag.count})
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-[1.6rem] border border-dashed border-[#dbe3ee] px-6 py-10">
                {selectedTag ? (
                  <div className="space-y-4 text-center">
                    <p className="text-xl font-semibold text-[#17213d]">{selectedTag.name}</p>
                    <p className="text-sm font-medium uppercase tracking-[0.08em] text-[#94a3b8]">
                      {selectedTag.slug}
                    </p>
                    <p className="mx-auto max-w-[420px] text-sm text-[#64748b]">
                      {selectedTag.description}
                    </p>
                    <p className="text-sm font-semibold text-[#477640]">
                      {selectedTag.count} linked products
                    </p>
                    <div className="flex justify-center gap-3 text-[#94a3b8]">
                      <button
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe3ee] hover:text-[#477640]"
                        onClick={() => editTag(selectedTag)}
                        type="button"
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dbe3ee] hover:text-[#e24646]"
                        disabled={deletingId === selectedTag.id}
                        onClick={() => deleteTag(selectedTag.id)}
                        type="button"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <EmptyTagIcon />
                    <p className="mt-4 text-[1.15rem] font-medium text-[#64748b]">
                      No tag selected
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
