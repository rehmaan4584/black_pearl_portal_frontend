import type { SubCategory } from "./sub-category.types";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  subCategories?: SubCategory[];
}

export interface CategoryFormValues {
  name: string;
  slug: string;
  description?: string;
}
