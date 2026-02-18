
export type ProductFormData = {
  title: string;
  description: string;
  subCategoryId: number;
  gender: string;
  brand?: string;
  variants: {
    id: number;
    sizeId: number;
    colorId: number;
    price: number;
    images: (File | string)[];
  }[];
};
