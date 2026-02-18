"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ProductFormData } from "@/types/product.types";
import {
  getProduct,
  createProduct,
  updateProduct,
  createVariant,
} from "@/services/product.service";
import { uploadVariantImages } from "@/lib/uploadVariantImages";

export function useProductForm(productId?: number) {
  const router = useRouter();
  const isEditMode = !!productId;

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    defaultValues: {
      variants: [{ id: 0, sizeId: 0, colorId: 0, price: 0, images: [] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  useEffect(() => {
    if (!isEditMode) return;

    async function fetchData() {
      const product = await getProduct(productId!);

      reset({
        title: product.title,
        description: product.description,
        subCategoryId: product.subCategoryId,
        gender: product.gender,
        brand: product.brand,
        variants: product.variants.map((v: any) => ({
          id: v.id,
          sizeId: v.sizeId,
          colorId: v.colorId,
          price: v.price,
          images: v.images.map((img: any) => img.url),
        })),
      });
    }

    fetchData();
  }, [productId]);

  const formValues = watch();

  const isFormValid =
    formValues.title &&
    formValues.description &&
    formValues.subCategoryId &&
    formValues.gender &&
    formValues.variants?.length > 0 &&
    formValues.variants.every(
      (v) => v.sizeId && v.colorId && v.price > 0 && v.images?.length > 0,
    );

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEditMode) {
        await updateProduct(productId!, {
          title: data.title,
          description: data.description,
          subCategoryId: data.subCategoryId,
          gender: data.gender,
          brand: data.brand,
          variants: data.variants.map((v) => ({
            id: v.id,
            sizeId: v.sizeId,
            colorId: v.colorId,
            price: v.price,
            sku: `SKU-${v.sizeId}-${v.colorId}`,
          })),
        });

        const updatedProduct = await getProduct(productId!);

        for (let i = 0; i < data.variants.length; i++) {
          const updatedVariant = updatedProduct.variants[i];
          if (!updatedVariant?.id) continue;

          await uploadVariantImages(updatedVariant.id, data.variants[i].images);
        }
      } else {
        const product = await createProduct({
          title: data.title,
          description: data.description,
          subCategoryId: data.subCategoryId,
          gender: data.gender,
          brand: data.brand,
        });

        for (const variant of data.variants) {
          const createdVariant = await createVariant({
            productId: product.id,
            sizeId: variant.sizeId,
            colorId: variant.colorId,
            price: variant.price,
          });

          await uploadVariantImages(createdVariant.id, variant.images);
        }
      }

      router.push("/products");
    } catch (error) {
      console.error(error);
    }
  };

  return {
    register,
    handleSubmit,
    control,
    errors,
    fields,
    append,
    remove,
    onSubmit,
    isSubmitting,
    isFormValid,
    isEditMode, 
    formValues,
  };
}
