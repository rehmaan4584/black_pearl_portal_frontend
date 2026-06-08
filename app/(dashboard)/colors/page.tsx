'use client';

import { useEffect, useState } from 'react';
import { Palette, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ColorForm } from '@/components/ColorForm';
import { colorService } from '@/services/color.service';
import type { Color, ColorFormValues } from '@/types/color.types';

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function ColorsPage() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editColor, setEditColor] = useState<Color | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const data = await colorService.fetchColors();
      setColors(data);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load colors'));
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setEditColor(null);
    setShowForm(true);
  }

  function handleEdit(color: Color) {
    setEditColor(color);
    setShowForm(true);
  }

  async function handleFormSubmit(values: ColorFormValues) {
    setFormLoading(true);
    try {
      if (editColor) {
        await colorService.updateColor(editColor.id, values);
        toast.success('Color updated');
      } else {
        await colorService.createColor(values);
        toast.success('Color created');
      }
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to save color'));
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: number) {
    setDeleteId(id);
    setDeleteLoading(true);
    try {
      await colorService.deleteColor(id);
      toast.success('Color deleted');
      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete color'));
    } finally {
      setDeleteId(null);
      setDeleteLoading(false);
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Colors
        </h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 size-4" />
          Add Color
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="space-y-2 p-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : colors.length === 0 ? (
          <div className="rounded-2xl border border-white/5 p-16 text-center glass">
            <Palette className="mx-auto mb-6 size-16 text-teal-100/10" />
            <p className="text-lg font-medium italic tracking-wide text-teal-100/60">
              No colors found.
            </p>
          </div>
        ) : (
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-3 py-2 text-left">Swatch</th>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Hex</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {colors.map((color) => (
                  <tr key={color.id} className="border-b">
                    <td className="px-3 py-2">
                      <span
                        className="inline-block size-8 rounded-full border border-white/10"
                        style={{ backgroundColor: color.hexCode }}
                        aria-hidden
                      />
                    </td>
                    <td className="px-3 py-2 font-medium">{color.name}</td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {color.hexCode}
                    </td>
                    <td className="flex gap-2 px-3 py-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(color)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(color.id)}
                        disabled={deleteLoading && deleteId === color.id}
                      >
                        {deleteLoading && deleteId === color.id
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
              {editColor ? 'Edit color' : 'Add color'}
            </h2>
            <ColorForm
              initialValues={editColor || undefined}
              onSubmit={handleFormSubmit}
              loading={formLoading}
              submitLabel={editColor ? 'Update' : 'Create'}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
