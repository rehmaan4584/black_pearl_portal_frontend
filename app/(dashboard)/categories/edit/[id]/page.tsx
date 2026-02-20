"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CategoryForm } from '../../../../../components/CategoryForm';
import { categoryService } from '../../../../../services/category.service';
import { Category } from '../../../../../types/category.types';
import { toast } from 'sonner';

export default function EditCategoryPage() {
  const { id } = useParams() as { id: string };
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchCategory() {
      setLoading(true);
      try {
        const cats = await categoryService.fetchCategories();
        const found = cats.find((c) => c.id === id);
        if (!found) throw new Error('Category not found');
        setCategory(found);
      } catch (e: any) {
        toast.error(e.message || 'Failed to load category');
        router.push('/portal/categories');
      } finally {
        setLoading(false);
      }
    }
    fetchCategory();
  }, [id, router]);

  async function handleSubmit(values: any) {
    setFormLoading(true);
    try {
      await categoryService.updateCategory(id, values);
      toast.success('Category updated');
      router.push('/portal/categories');
    } catch (e: any) {
      toast.error(e.message || 'Failed to update category');
    } finally {
      setFormLoading(false);
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;
  if (!category) return null;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
      <CategoryForm initialValues={category} onSubmit={handleSubmit} loading={formLoading} submitLabel="Update" />
    </div>
  );
}
