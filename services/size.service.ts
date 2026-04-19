import { apiRequest } from "@/lib/api";
import type { Size } from "@/types/size.types";

export async function fetchSizes(): Promise<Size[]> {
  return apiRequest("sizes", "GET");
}

