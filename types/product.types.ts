export type ProductFormData = {
  title: string;
  description: string;
  type: string;
  gender: string;
  brand?: string;
  variants: {
    id: number;
    size: string;
    color: string;
    price: number;
    images: (File | string)[];
  }[];
};
