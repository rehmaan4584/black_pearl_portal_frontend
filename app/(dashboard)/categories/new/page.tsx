"use client";
import { useState } from 'react';
import { CategoryForm } from '../../../../components/CategoryForm';
import { categoryService } from '../../../../services/category.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function NewCategoryPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(values: any) {
    setLoading(true);
    try {
      await categoryService.createCategory(values);
      toast.success('Category created');
      router.push('/portal/categories');
    } catch (e: any) {
      toast.error(e.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Category</h1>
      <CategoryForm onSubmit={handleSubmit} loading={loading} submitLabel="Create" />
    </div>
  );
}
