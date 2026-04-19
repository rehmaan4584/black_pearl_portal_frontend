import { apiRequest } from "@/lib/api";
import { SubCategory } from "@/types/sub-category.types";

// Backend now requires a numeric categoryId query param and
// validates it as a numeric string.
export async function fetchSubCategories(
  categoryId: number,
): Promise<SubCategory[]> {
  const query = `?categoryId=${categoryId}`;
  return apiRequest(`sub-categories${query}`, "GET");
}

