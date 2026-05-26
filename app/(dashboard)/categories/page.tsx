"use client";
import { useEffect, useState } from 'react';
import { FolderTree, Plus } from "lucide-react";
import { categoryService } from '../../../services/category.service';
import { Category } from '../../../types/category.types';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Skeleton } from '../../../components/ui/skeleton';
import { CategoryForm } from '../../../components/CategoryForm';
import { SubCategoryForm } from '../../../components/SubCategoryForm';
import {
  createSubCategory,
  deleteSubCategory,
} from '../../../services/sub-category.service';
import type { SubCategoryFormValues } from '../../../types/sub-category.types';
import type { CategoryFormValues } from '../../../types/category.types';
import { toast } from 'sonner';

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSubCategoryForm, setShowSubCategoryForm] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const data = await categoryService.fetchCategories();
      setCategories(data);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load categories'));
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setEditCategory(null);
    setShowForm(true);
  }

  function handleAddSubCategory(categoryId: number) {
    setSelectedCategoryId(categoryId);
    setShowSubCategoryForm(true);
  }

  function handleEdit(category: Category) {
    setEditCategory(category);
    setShowForm(true);
  }

  async function handleFormSubmit(values: CategoryFormValues) {
    setFormLoading(true);
    try {
      if (editCategory) {
        await categoryService.updateCategory(editCategory.id, values);
        toast.success('Category updated');
      } else {
        await categoryService.createCategory(values);
        toast.success('Category created');
      }
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to save category'));
    } finally {
      setFormLoading(false);
    }
  }

  async function handleSubCategorySubmit(values: SubCategoryFormValues) {
    setFormLoading(true);
    try {
      await createSubCategory(values);
      toast.success('Subcategory created');
      setShowSubCategoryForm(false);
      setSelectedCategoryId(undefined);
      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to save subcategory'));
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: number) {
    setDeleteId(id);
    setDeleteLoading(true);
    try {
      await categoryService.deleteCategory(id);
      toast.success('Category deleted');
      fetchData();
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to delete category');
      if (message.includes('subcategories')) {
        toast.error('Cannot delete: category has subcategories');
      } else {
        toast.error(message);
      }
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  }

  async function handleDeleteSubCategory(id: number) {
    setDeleteId(id);
    setDeleteLoading(true);
    try {
      await deleteSubCategory(id);
      toast.success('Subcategory deleted');
      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete subcategory'));
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Categories</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 size-4" />
          Add Category
        </Button>
      </div>
      <Card>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-16 text-center glass rounded-2xl border border-white/5">
                <FolderTree className="size-16 text-teal-100/10 mx-auto mb-6" />
                <p className="text-teal-100/60 italic text-lg font-medium tracking-wide">No categories found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-3 text-left">Name</th>
                <th className="py-2 px-3 text-left">Slug</th>
                <th className="py-2 px-3 text-left">Description</th>
                <th className="py-2 px-3 text-left">Subcategories</th>
                <th className="py-2 px-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b">
                  <td className="py-2 px-3">{cat.name}</td>
                  <td className="py-2 px-3">{cat.slug}</td>
                  <td className="py-2 px-3">{cat.description}</td>
                  <td className="py-2 px-3">
                    <div className="space-y-2">
                      {cat.subCategories && cat.subCategories.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {cat.subCategories.map((sub) => (
                            <span
                              key={sub.id}
                              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs"
                            >
                              {sub.name}
                              <button
                                type="button"
                                className="text-destructive"
                                disabled={deleteLoading && deleteId === sub.id}
                                onClick={() => handleDeleteSubCategory(sub.id)}
                              >
                                x
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-teal-100/40">No subcategories</p>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddSubCategory(cat.id)}
                      >
                        Add subcategory
                      </Button>
                    </div>
                  </td>
                  <td className="py-2 px-3 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(cat)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(cat.id)}
                      disabled={deleteLoading && deleteId === cat.id}
                    >
                      {deleteLoading && deleteId === cat.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <CategoryForm
              initialValues={editCategory || undefined}
              onSubmit={handleFormSubmit}
              loading={formLoading}
              submitLabel={editCategory ? 'Update' : 'Create'}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
      {showSubCategoryForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md dark:bg-background">
            <SubCategoryForm
              categories={categories}
              defaultCategoryId={selectedCategoryId}
              onSubmit={handleSubCategorySubmit}
              loading={formLoading}
              submitLabel="Create"
              onClose={() => {
                setShowSubCategoryForm(false);
                setSelectedCategoryId(undefined);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
