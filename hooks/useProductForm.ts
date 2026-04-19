'use client';

import { useEffect, useState } from "react";
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
import { fetchSubCategories } from "@/services/sub-category.service";
import { fetchSizes } from "@/services/size.service";
import { fetchColors } from "@/services/color.service";
import type { SubCategory } from "@/types/sub-category.types";
import type { Size } from "@/types/size.types";
import type { Color } from "@/types/color.types";

export function useProductForm(productId?: number) {
  const router = useRouter();
  const isEditMode = !!productId;

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    defaultValues: {
      title: "",
      description: "",
      subCategoryId: "",
      gender: "",
      brand: "",
      variants: [{ id: 0, sizeId: "", colorId: "", price: 0, images: [] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  useEffect(() => {
    async function loadMeta() {
      try {
        const [subCats, sizesData, colorsData] = await Promise.all([
          // TODO: replace 1 with selected categoryId when category selection is added
          fetchSubCategories(1),
          fetchSizes(),
          fetchColors(),
        ]);
        setSubCategories(subCats);
        setSizes(sizesData);
        setColors(colorsData);
      } catch (error) {
        console.error("Failed to load product metadata", error);
      }
    }

    loadMeta();
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    async function fetchData() {
      const product = await getProduct(productId!);

      reset({
        title: product.title,
        description: product.description,
        subCategoryId: String(product.subCategoryId),
        gender: product.gender,
        brand: product.brand,
        variants: product.variants.map((v: any) => ({
          id: v.id,
          sizeId: String(v.sizeId),
          colorId: String(v.colorId),
          price: v.price,
          images: v.images.map((img: any) => img.url),
        })),
      });
    }

    fetchData();
  }, [isEditMode, productId, reset]);

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
          subCategoryId: Number(data.subCategoryId),
          gender: data.gender,
          brand: data.brand,
          variants: data.variants.map((v) => ({
            id: v.id,
            sizeId: Number(v.sizeId),
            colorId: Number(v.colorId),
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
          subCategoryId: Number(data.subCategoryId),
          gender: data.gender,
          brand: data.brand,
        });

        for (const variant of data.variants) {
          const createdVariant = await createVariant({
            productId: product.id,
            sizeId: Number(variant.sizeId),
            colorId: Number(variant.colorId),
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
    subCategories,
    sizes,
    colors,
  };
}
