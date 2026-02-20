import { apiRequest } from "@/lib/api";
import { Category, CategoryFormValues } from '../types/category.types';

export async function fetchCategories(): Promise<Category[]> {
  return apiRequest("categories", "GET");
}

export async function createCategory(data: CategoryFormValues): Promise<Category> {
  return apiRequest("categories", "POST", data);
}

export async function updateCategory(id: string, data: CategoryFormValues): Promise<Category> {
  return apiRequest(`categories/${id}`, "PATCH", data);
}

export async function deleteCategory(id: string): Promise<void> {
  return apiRequest(`categories/${id}`, "DELETE");
}

export const categoryService = {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
