'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Topbar } from '@/components/layout/topbar';
import { adminService } from '@/services/adminService';
import type { CategoryItem } from '@/types/admin';
import { LoadingState, ErrorState, PageShell } from '@/components/ui/AsyncStates';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const list = await adminService.listCategories();
      setCategories(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!name.trim()) {
      setFormError('Category name is required.');
      return;
    }
    setSaving(true);
    try {
      await adminService.createCategory({
        name: name.trim(),
        slug: slug.trim() || undefined,
        is_active: true,
      });
      setName('');
      setSlug('');
      setFormSuccess('Category created.');
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (category: CategoryItem) => {
    const id = category.id || category.category_id;
    if (!id) return;
    try {
      await adminService.updateCategory(id, {
        name: category.name,
        slug: category.slug,
        icon_url: category.icon_url,
        is_active: !category.is_active,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
    }
  };

  const handleDelete = async (category: CategoryItem) => {
    const id = category.id || category.category_id;
    if (!id) return;
    if (!window.confirm(`Delete category "${category.name}"? Events using it will keep running but lose this label.`)) {
      return;
    }
    setDeletingId(id);
    try {
      await adminService.deleteCategory(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Topbar title="Categories" />
      <PageShell>
        <div className="flex items-center justify-between gap-4 mb-8 w-full max-w-[1100px] select-none">
          <h2 className="text-xl md:text-[22px] font-bold text-neutral-900 tracking-tight">
            Event Categories
          </h2>
        </div>

        <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
          <form
            onSubmit={handleCreate}
            className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-sm flex flex-col gap-4 h-fit"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#6312E1] text-white flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-neutral-900">Create category</h3>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-neutral-500">Name</label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slug || slug === slugify(name)) {
                    setSlug(slugify(e.target.value));
                  }
                }}
                placeholder="e.g. Nightclub"
                className="h-12 px-4 rounded-xl border border-neutral-200 font-semibold text-neutral-900 focus:outline-none focus:border-[#6312E1]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-neutral-500">Slug (optional)</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="nightclub"
                className="h-12 px-4 rounded-xl border border-neutral-200 font-semibold text-neutral-900 focus:outline-none focus:border-[#6312E1]"
              />
            </div>

            {formError && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{formError}</div>
            )}
            {formSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold">
                {formSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="h-12 rounded-xl bg-[#6312E1] text-white font-bold hover:bg-[#520cbd] disabled:opacity-60"
            >
              {saving ? 'Creating…' : 'Create category'}
            </button>
          </form>

          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8">
                <LoadingState />
              </div>
            ) : error ? (
              <div className="p-8">
                <ErrorState message={error} onRetry={load} />
              </div>
            ) : categories.length === 0 ? (
              <div className="p-10 text-center text-neutral-500 font-medium">
                No categories yet. Create the first one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-neutral-100 text-neutral-500 text-xs uppercase tracking-wide">
                      <th className="px-6 py-4 font-bold">Name</th>
                      <th className="px-6 py-4 font-bold">Slug</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => {
                      const id = category.id || category.category_id || category.slug || category.name;
                      return (
                        <tr key={id} className="border-b border-neutral-50 last:border-0">
                          <td className="px-6 py-4 font-bold text-neutral-900">{category.name}</td>
                          <td className="px-6 py-4 text-neutral-600 font-medium">
                            {category.slug || '—'}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                                category.is_active
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-neutral-100 text-neutral-500'
                              }`}
                            >
                              {category.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => void handleToggleActive(category)}
                                className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-neutral-50"
                                title={category.is_active ? 'Deactivate' : 'Activate'}
                              >
                                {category.is_active ? (
                                  <ToggleRight className="w-4 h-4 text-[#6312E1]" />
                                ) : (
                                  <ToggleLeft className="w-4 h-4" />
                                )}
                                {category.is_active ? 'Disable' : 'Enable'}
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleDelete(category)}
                                disabled={deletingId === (category.id || category.category_id)}
                                className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-red-100 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </PageShell>
    </>
  );
}
