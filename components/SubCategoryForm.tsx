import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import type { Category } from "@/types/category.types";
import type {
  SubCategory,
  SubCategoryFormValues,
} from "@/types/sub-category.types";

interface SubCategoryFormProps {
  categories: Category[];
  initialValues?: SubCategory;
  defaultCategoryId?: number;
  loading: boolean;
  submitLabel?: string;
  onClose: () => void;
  onSubmit: (values: SubCategoryFormValues) => Promise<void>;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function SubCategoryForm({
  categories,
  initialValues,
  defaultCategoryId,
  loading,
  submitLabel = "Save",
  onClose,
  onSubmit,
}: SubCategoryFormProps) {
  const [values, setValues] = useState<SubCategoryFormValues>({
    name: initialValues?.name ?? "",
    slug: initialValues?.slug ?? "",
    description: initialValues?.description ?? "",
    categoryId:
      initialValues?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!values.name.trim()) nextErrors.name = "Name is required";
    if (!values.slug.trim()) nextErrors.slug = "Slug is required";
    if (!values.categoryId) nextErrors.categoryId = "Category is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    await onSubmit({
      name: values.name.trim(),
      slug: values.slug.trim(),
      description: values.description?.trim() || "",
      categoryId: Number(values.categoryId),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="sub-category-name">Name</Label>
        <Input
          id="sub-category-name"
          value={values.name}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              name: event.target.value,
              slug: initialValues ? current.slug : slugify(event.target.value),
            }))
          }
          placeholder="e.g. Jeans"
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sub-category-slug">Slug</Label>
        <Input
          id="sub-category-slug"
          value={values.slug}
          onChange={(event) =>
            setValues((current) => ({ ...current, slug: event.target.value }))
          }
          placeholder="jeans"
        />
        {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sub-category-parent">Parent category</Label>
        <select
          id="sub-category-parent"
          value={values.categoryId}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              categoryId: Number(event.target.value),
            }))
          }
          className="h-12 w-full rounded-md border border-white/10 bg-background px-3 text-sm text-white"
        >
          <option value={0}>Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-xs text-destructive">{errors.categoryId}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sub-category-description">Description</Label>
        <Textarea
          id="sub-category-description"
          value={values.description}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          placeholder="Describe this subcategory..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
