import { apiUpload } from "@/lib/api";

export async function uploadVariantImages(
  variantId: number,
  images: (File | string)[]
) {
  for (let i = 0; i < images.length; i++) {
    const image = images[i];

    if (image instanceof File) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("productVariantId", variantId.toString());
      formData.append("isPrimary", i === 0 ? "true" : "false");
      formData.append("sortOrder", i.toString());

      await apiUpload("product-variant-image/create", formData);
    }
  }
}
