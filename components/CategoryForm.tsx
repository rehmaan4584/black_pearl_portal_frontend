import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { categoryService } from '../services/category.service';
import { CategoryFormValues } from '../types/category.types';

interface CategoryFormProps {
  initialValues?: CategoryFormValues;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  loading: boolean;
  submitLabel?: string;
  onClose?: () => void;
}

export function CategoryForm({ initialValues, onSubmit, loading, submitLabel = 'Save', onClose }: CategoryFormProps) {
  const [values, setValues] = useState<CategoryFormValues>({
    name: '',
    slug: '',
    description: '',
    ...initialValues,
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  useEffect(() => {
    if (values.name && (!initialValues || values.name !== initialValues.name)) {
      setValues((v) => ({ ...v, slug: slugify(v.name) }));
    }
    // eslint-disable-next-line
  }, [values.name]);

  function slugify(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function validate(): boolean {
    const errs: { [k: string]: string } = {};
    if (!values.name) errs.name = 'Name is required';
    else if (values.name.length > 100) errs.name = 'Max 100 characters';
    if (!values.slug) errs.slug = 'Slug is required';
    else if (values.slug.length > 100) errs.slug = 'Max 100 characters';
    else if (!/^[a-z0-9-]+$/.test(values.slug)) errs.slug = 'Alphanumeric and hyphens only';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      name: values.name.trim(),
      slug: values.slug.trim(),
      description: values.description?.trim() || '',
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          maxLength={100}
          required
        />
        {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={values.slug}
          onChange={(e) => setValues((v) => ({ ...v, slug: e.target.value }))}
          maxLength={100}
          required
        />
        {errors.slug && <div className="text-red-500 text-xs mt-1">{errors.slug}</div>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          maxLength={255}
        />
      </div>
      <div className="flex gap-2 justify-end">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
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
