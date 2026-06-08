import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import type { ColorFormValues } from '@/types/color.types';

interface ColorFormProps {
  initialValues?: ColorFormValues;
  onSubmit: (values: ColorFormValues) => Promise<void>;
  loading: boolean;
  submitLabel?: string;
  onClose?: () => void;
}

function normalizeHex(value: string) {
  const trimmed = value.trim();
  if (!trimmed.startsWith('#')) return `#${trimmed}`;
  return trimmed;
}

export function ColorForm({
  initialValues,
  onSubmit,
  loading,
  submitLabel = 'Save',
  onClose,
}: ColorFormProps) {
  const [values, setValues] = useState<ColorFormValues>({
    name: '',
    hexCode: '#000000',
    ...initialValues,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!values.name.trim()) errs.name = 'Name is required';
    if (!/^#[0-9A-Fa-f]{6}$/.test(values.hexCode)) {
      errs.hexCode = 'Use a valid hex code like #000000';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      name: values.name.trim(),
      hexCode: values.hexCode.toUpperCase(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="color-name">Name</Label>
        <Input
          id="color-name"
          placeholder="e.g. Navy Blue"
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
        <Label htmlFor="color-hex">Hex code</Label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={values.hexCode}
            onChange={(e) =>
              setValues((v) => ({ ...v, hexCode: e.target.value }))
            }
            className="size-11 cursor-pointer rounded-lg border border-white/10 bg-transparent"
            aria-label="Pick color"
          />
          <Input
            id="color-hex"
            placeholder="#000000"
            value={values.hexCode}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                hexCode: normalizeHex(e.target.value),
              }))
            }
            maxLength={7}
            required
          />
        </div>
        {errors.hexCode && (
          <p className="text-xs text-destructive">{errors.hexCode}</p>
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
