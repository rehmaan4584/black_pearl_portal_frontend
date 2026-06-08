import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import type { SizeFormValues } from '@/types/size.types';

interface SizeFormProps {
  initialValues?: SizeFormValues;
  onSubmit: (values: SizeFormValues) => Promise<void>;
  loading: boolean;
  submitLabel?: string;
  onClose?: () => void;
}

export function SizeForm({
  initialValues,
  onSubmit,
  loading,
  submitLabel = 'Save',
  onClose,
}: SizeFormProps) {
  const [values, setValues] = useState<SizeFormValues>({
    name: '',
    displayOrder: 1,
    ...initialValues,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!values.name.trim()) errs.name = 'Name is required';
    if (!Number.isInteger(values.displayOrder) || values.displayOrder < 1) {
      errs.displayOrder = 'Display order must be at least 1';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      name: values.name.trim(),
      displayOrder: values.displayOrder,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="size-name">Name</Label>
        <Input
          id="size-name"
          placeholder="e.g. M"
          value={values.name}
          onChange={(e) =>
            setValues((v) => ({ ...v, name: e.target.value }))
          }
          maxLength={50}
          required
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="size-order">Display order</Label>
        <Input
          id="size-order"
          type="number"
          min={1}
          value={values.displayOrder}
          onChange={(e) =>
            setValues((v) => ({
              ...v,
              displayOrder: Number(e.target.value),
            }))
          }
          required
        />
        {errors.displayOrder && (
          <p className="text-xs text-destructive">{errors.displayOrder}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
