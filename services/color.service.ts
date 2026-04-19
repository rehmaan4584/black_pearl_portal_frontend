import { apiRequest } from "@/lib/api";
import type { Color } from "@/types/color.types";

export async function fetchColors(): Promise<Color[]> {
  return apiRequest("colors", "GET");
}

