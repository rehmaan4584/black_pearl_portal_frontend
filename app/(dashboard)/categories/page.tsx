"use client";
import { useEffect, useState } from 'react';
import { categoryService } from '../../../services/category.service';
import { Category } from '../../../types/category.types';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Skeleton } from '../../../components/ui/skeleton';
import { CategoryForm } from '../../../components/CategoryForm';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const data = await categoryService.fetchCategories();
      setCategories(data);
    } catch (e: any) {
      toast.error(e.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setEditCategory(null);
    setShowForm(true);
  }

  function handleEdit(category: Category) {
    setEditCategory(category);
    setShowForm(true);
  }

  async function handleFormSubmit(values: any) {
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
    } catch (e: any) {
      toast.error(e.message || 'Failed to save category');
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleteId(id);
    setDeleteLoading(true);
    try {
      await categoryService.deleteCategory(id);
      toast.success('Category deleted');
      fetchData();
    } catch (e: any) {
      if (e.message?.includes('subcategories')) {
        toast.error('Cannot delete: category has subcategories');
      } else {
        toast.error(e.message || 'Failed to delete category');
      }
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={handleAdd}>Add Category</Button>
      </div>
      <Card>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No categories found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-3 text-left">Name</th>
                <th className="py-2 px-3 text-left">Slug</th>
                <th className="py-2 px-3 text-left">Description</th>
                <th className="py-2 px-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b">
                  <td className="py-2 px-3">{cat.name}</td>
                  <td className="py-2 px-3">{cat.slug}</td>
                  <td className="py-2 px-3">{cat.description}</td>
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
    </div>
  );
}
