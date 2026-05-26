export interface SubCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
}

export interface SubCategoryFormValues {
  name: string;
  slug: string;
  description?: string;
  categoryId: number;
}
