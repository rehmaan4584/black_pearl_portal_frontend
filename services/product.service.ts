import { apiRequest } from "@/lib/api";

export async function getProduct(productId: number) {
  return apiRequest(`products/details/${productId}`, "GET");
}

export async function createProduct(data: any) {
  return apiRequest("products/create", "POST", data);
}

export async function updateProduct(productId: number, data: any) {
  return apiRequest(
    `products/update-product-with-variant/${productId}`,
    "PUT",
    data
  );
}

export async function createVariant(data: any) {
  return apiRequest("product-variant/create", "POST", data);
}

// Cascade delete endpoint: product + variants + images
export async function deleteProduct(productId: number) {
  return apiRequest(
    `products/delete-with-variants/${productId}`,
    "DELETE"
  );
}
