import { apiRequest } from '@/lib/api';
import type { Size, SizeFormValues } from '@/types/size.types';

export async function fetchSizes(): Promise<Size[]> {
  return apiRequest('sizes', 'GET');
}

export async function createSize(data: SizeFormValues): Promise<Size> {
  return apiRequest('sizes', 'POST', data);
}

export async function updateSize(
  id: number,
  data: SizeFormValues,
): Promise<Size> {
  return apiRequest(`sizes/${id}`, 'PATCH', data);
}

export async function deleteSize(id: number): Promise<void> {
  return apiRequest(`sizes/${id}`, 'DELETE');
}

export const sizeService = {
  fetchSizes,
  createSize,
  updateSize,
  deleteSize,
};
