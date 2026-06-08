import { apiRequest } from '@/lib/api';
import type { Color, ColorFormValues } from '@/types/color.types';

export async function fetchColors(): Promise<Color[]> {
  return apiRequest('colors', 'GET');
}

export async function createColor(data: ColorFormValues): Promise<Color> {
  return apiRequest('colors', 'POST', data);
}

export async function updateColor(
  id: number,
  data: ColorFormValues,
): Promise<Color> {
  return apiRequest(`colors/${id}`, 'PATCH', data);
}

export async function deleteColor(id: number): Promise<void> {
  return apiRequest(`colors/${id}`, 'DELETE');
}

export const colorService = {
  fetchColors,
  createColor,
  updateColor,
  deleteColor,
};
