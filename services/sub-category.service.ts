import { apiRequest } from "@/lib/api";
import { SubCategory, SubCategoryFormValues } from "@/types/sub-category.types";

export async function fetchSubCategories(
  categoryId?: number,
): Promise<SubCategory[]> {
  const query = categoryId ? `?categoryId=${categoryId}` : "";
  return apiRequest(`sub-categories${query}`, "GET");
}

export async function createSubCategory(
  data: SubCategoryFormValues,
): Promise<SubCategory> {
  return apiRequest("sub-categories", "POST", data);
}

export async function updateSubCategory(
  id: number,
  data: SubCategoryFormValues,
): Promise<SubCategory> {
  return apiRequest(`sub-categories/${id}`, "PATCH", data);
}

export async function deleteSubCategory(id: number): Promise<void> {
  return apiRequest(`sub-categories/${id}`, "DELETE");
}

