"use client";

import { useParams } from "next/navigation";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const productId = Number(params.id);

  return <ProductForm productId={productId} />;
}