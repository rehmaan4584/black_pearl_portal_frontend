'use client';

import { useEffect, useState } from 'react';
import { Plus, Ruler } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SizeForm } from '@/components/SizeForm';
import { sizeService } from '@/services/size.service';
import type { Size, SizeFormValues } from '@/types/size.types';

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function SizesPage() {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editSize, setEditSize] = useState<Size | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const data = await sizeService.fetchSizes();
      setSizes(data.sort((a, b) => a.displayOrder - b.displayOrder));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load sizes'));
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setEditSize(null);
    setShowForm(true);
  }

  function handleEdit(size: Size) {
    setEditSize(size);
    setShowForm(true);
  }

  async function handleFormSubmit(values: SizeFormValues) {
    setFormLoading(true);
    try {
      if (editSize) {
        await sizeService.updateSize(editSize.id, values);
        toast.success('Size updated');
      } else {
        await sizeService.createSize(values);
        toast.success('Size created');
      }
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to save size'));
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: number) {
    setDeleteId(id);
    setDeleteLoading(true);
    try {
      await sizeService.deleteSize(id);
      toast.success('Size deleted');
      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete size'));
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Sizes
        </h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 size-4" />
          Add Size
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="space-y-2 p-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : sizes.length === 0 ? (
          <div className="rounded-2xl border border-white/5 p-16 text-center glass">
            <Ruler className="mx-auto mb-6 size-16 text-teal-100/10" />
            <p className="text-lg font-medium italic tracking-wide text-teal-100/60">
              No sizes found.
            </p>
          </div>
        ) : (
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Display order</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map((size) => (
                  <tr key={size.id} className="border-b">
                    <td className="px-3 py-2 font-medium">{size.name}</td>
                    <td className="px-3 py-2">{size.displayOrder}</td>
                    <td className="flex gap-2 px-3 py-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(size)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(size.id)}
                        disabled={deleteLoading && deleteId === size.id}
                      >
                        {deleteLoading && deleteId === size.id
                          ? 'Deleting...'
                          : 'Delete'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-background">
            <h2 className="mb-4 text-lg font-bold">
              {editSize ? 'Edit size' : 'Add size'}
            </h2>
            <SizeForm
              initialValues={editSize || undefined}
              onSubmit={handleFormSubmit}
              loading={formLoading}
              submitLabel={editSize ? 'Update' : 'Create'}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
