export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
}

export interface CategoryFormValues {
  name: string;
  slug: string;
  description?: string;
}
