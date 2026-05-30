export type ProductVariantForm = {
  /** Server variant id when editing; omit or 0 for new variants */
  id?: number;
  sizeId: string;
  colorId: string;
  price: number;
  stock: number;
  /** Image URLs (strings) pending upload */
  images: string[];
};

export type ProductFormData = {
  title: string;
  description: string;
  subCategoryId: string;
  gender: string;
  brand: string;
  variants: ProductVariantForm[];
};
