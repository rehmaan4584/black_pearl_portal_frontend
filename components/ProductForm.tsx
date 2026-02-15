"use client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Trash2, Plus, Upload } from "lucide-react";
import { apiRequest, apiUpload } from "@/lib/api";

type ProductFormData = {
  // Product fields
  title: string;
  description: string;
  type: string;
  gender: string;
  brand?: string;

  // Variants array
  variants: {
    id: number;
    size: string;
    color: string;
    price: number;
    images: File[];
  }[];
};

interface ProductFormProps {
  productId?: number; // Optional prop
}

export default function ProductForm({ productId }: ProductFormProps) {
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
      variants: [{ size: "", color: "", price: 0, images: [] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  // Add this useEffect after your existing useForm setup
  useEffect(() => {
    if (isEditMode) {
      fetchProductData();
    }
  }, [productId]);

  const fetchProductData = async () => {
    try {
      const product = await apiRequest(`products/details/${productId}`, "GET");

      // Form ko pre-fill karo
      reset({
        title: product.title,
        description: product.description,
        type: product.type,
        gender: product.gender,
        brand: product.brand,
        variants: product.variants.map((v: any) => ({
          id: v.id, // Important: ID save karo
          size: v.size,
          color: v.color,
          price: v.price,
          images: v.images.map((img: any) => img.url),
        })),
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Failed to load product data");
    }
  };

  // Check if form is valid for submission
  const formValues = watch();
  const isFormValid =
    formValues.title &&
    formValues.description &&
    formValues.type &&
    formValues.gender &&
    formValues.variants?.length > 0 &&
    formValues.variants.every(
      (v) => v.size && v.color && v.price > 0 && v.images?.length > 0,
    );

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEditMode) {
        // ========================================
        // EDIT MODE - Update existing product
        // ========================================

        // Step 1: Update Product
        await apiRequest(
          `products/update-product-with-variant/${productId}`,
          "PUT",
          {
            title: data.title,
            description: data.description,
            type: data.type,
            gender: data.gender,
            brand: data.brand,
          },
        );

        // Step 2: Update/Create Variants with Images
        for (const variant of data.variants) {
          if (variant.id) {
            // Update existing variant
            await apiRequest(`product-variant/update/${variant.id}`, "PUT", {
              size: variant.size,
              color: variant.color,
              price: variant.price,
            });

            // Handle images for existing variant
            // Option 1: Delete old images and upload new ones
            // await apiRequest(`product-variant-image/delete-by-variant/${variant.id}`, "DELETE");

            // Upload new/updated images
            for (let i = 0; i < variant.images.length; i++) {
              const image = variant.images[i];

              // Check if it's a new File (not existing URL string)
              if (image instanceof File) {
                const formData = new FormData();
                formData.append("file", image);
                formData.append("productVariantId", variant.id.toString());
                formData.append("isPrimary", i === 0 ? "true" : "false");
                formData.append("sortOrder", i.toString());

                await apiUpload("product-variant-image/create", formData);
              }
              // If it's a string (existing URL), skip upload
            }
          } else {
            // Create new variant
            const createdVariant = await apiRequest(
              "product-variant/create",
              "POST",
              {
                productId: productId,
                size: variant.size,
                color: variant.color,
                price: variant.price,
              },
            );

            // Upload images for new variant
            for (let i = 0; i < variant.images.length; i++) {
              const formData = new FormData();
              formData.append("file", variant.images[i] as File);
              formData.append("productVariantId", createdVariant.id.toString());
              formData.append("isPrimary", i === 0 ? "true" : "false");
              formData.append("sortOrder", i.toString());

              await apiUpload("product-variant-image/create", formData);
            }
          }
        }

        alert("Product updated successfully!");
        router.push("/products");
      } else {
        // ========================================
        // CREATE MODE - Create new product
        // ========================================

        // Step 1: Create Product
        const product = await apiRequest("products/create", "POST", {
          title: data.title,
          description: data.description,
          type: data.type,
          gender: data.gender,
          brand: data.brand,
        });

        // Step 2: Create Variants with Images
        for (const variant of data.variants) {
          // Create Variant
          const createdVariant = await apiRequest(
            "product-variant/create",
            "POST",
            {
              productId: product.id,
              size: variant.size,
              color: variant.color,
              price: variant.price,
            },
          );

          // Upload Images
          for (let i = 0; i < variant.images.length; i++) {
            const formData = new FormData();
            formData.append("file", variant.images[i] as File);
            formData.append("productVariantId", createdVariant.id.toString());
            formData.append("isPrimary", i === 0 ? "true" : "false");
            formData.append("sortOrder", i.toString());

            await apiUpload("product-variant-image/create", formData);
          }
        }

        alert("Product created successfully!");
        router.push("/products");
      }
    } catch (error: any) {
      console.error("Error:", error);
      alert(
        `Failed to ${isEditMode ? "update" : "create"} product: ${error.message}`,
      );
    }
  };
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">
            Create a new product with variants and images
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
            </TabsList>

            {/* Tab 1: Basic Info */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                  <CardDescription>
                    Enter the basic details of your product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter product title"
                      {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Enter product description"
                      rows={4}
                      {...register("description", {
                        required: "Description is required",
                      })}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Type & Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">
                        Type <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="type"
                        control={control}
                        rules={{ required: "Type is required" }}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="JEANS">Jeans</SelectItem>
                              <SelectItem value="KNICKERS">Knickers</SelectItem>
                              <SelectItem value="SHIRTS">Shirts</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.type && (
                        <p className="text-sm text-red-500">
                          {errors.type.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">
                        Gender <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="gender"
                        control={control}
                        rules={{ required: "Gender is required" }}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MEN">Men</SelectItem>
                              <SelectItem value="WOMEN">Women</SelectItem>
                              <SelectItem value="UNISEX">Unisex</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.gender && (
                        <p className="text-sm text-red-500">
                          {errors.gender.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Brand (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand (Optional)</Label>
                    <Input
                      id="brand"
                      placeholder="Enter brand name"
                      {...register("brand")}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Variants */}
            <TabsContent value="variants">
              <Card>
                <CardHeader>
                  <CardTitle>Product Variants</CardTitle>
                  <CardDescription>
                    Add different sizes, colors, and prices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="border-2">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">
                            Variant {index + 1}
                          </CardTitle>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Size */}
                          <div className="space-y-2">
                            <Label>
                              Size <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                              name={`variants.${index}.size`}
                              control={control}
                              rules={{ required: "Size is required" }}
                              render={({ field }) => (
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Size" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="XS">XS</SelectItem>
                                    <SelectItem value="S">S</SelectItem>
                                    <SelectItem value="M">M</SelectItem>
                                    <SelectItem value="L">L</SelectItem>
                                    <SelectItem value="XL">XL</SelectItem>
                                    <SelectItem value="XXL">XXL</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>

                          {/* Color */}
                          <div className="space-y-2">
                            <Label>
                              Color <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                              name={`variants.${index}.color`}
                              control={control}
                              rules={{ required: "Color is required" }}
                              render={({ field }) => (
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Color" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="BLACK">Black</SelectItem>
                                    <SelectItem value="WHITE">White</SelectItem>
                                    <SelectItem value="RED">Red</SelectItem>
                                    <SelectItem value="BLUE">Blue</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>

                          {/* Price */}
                          <div className="space-y-2">
                            <Label>
                              Price <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              type="number"
                              placeholder="0"
                              {...register(`variants.${index}.price`, {
                                required: "Price is required",
                                valueAsNumber: true,
                                min: {
                                  value: 1,
                                  message: "Price must be greater than 0",
                                },
                              })}
                            />
                          </div>
                        </div>

                        {/* Image Upload with Preview */}
                        <div className="space-y-2">
                          <Label>
                            Images <span className="text-red-500">*</span>
                          </Label>
                          <Controller
                            name={`variants.${index}.images`}
                            control={control}
                            rules={{
                              validate: (value) =>
                                (value && value.length > 0) ||
                                "At least one image is required",
                            }}
                            render={({ field: { value, onChange } }) => (
                              <div className="space-y-3">
                                {/* Upload Area */}
                                <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer">
                                  <Input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    id={`images-${index}`}
                                    onChange={(e) => {
                                      const newFiles = Array.from(
                                        e.target.files || [],
                                      );
                                      onChange([...(value || []), ...newFiles]);
                                    }}
                                  />
                                  <label
                                    htmlFor={`images-${index}`}
                                    className="cursor-pointer flex flex-col items-center"
                                  >
                                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                      Click to upload images
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {value?.length > 0
                                        ? `${value.length} file(s) selected`
                                        : "No files selected"}
                                    </p>
                                  </label>
                                </div>

                                {/* Image Preview Grid */}
                                {value && value.length > 0 && (
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {value.map(
                                      (file: File, imgIndex: number) => (
                                        <div
                                          key={imgIndex}
                                          className="relative group"
                                        >
                                          <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${imgIndex + 1}`}
                                            className="w-full h-24 object-cover rounded border"
                                          />
                                          {imgIndex === 0 && (
                                            <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1 rounded">
                                              Primary
                                            </span>
                                          )}
                                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                                            <Button
                                              type="button"
                                              size="sm"
                                              variant="destructive"
                                              onClick={() => {
                                                const newFiles = value.filter(
                                                  (_: File, i: number) =>
                                                    i !== imgIndex,
                                                );
                                                onChange(newFiles);
                                              }}
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </Button>
                                          </div>
                                          <p className="text-xs text-center mt-1 truncate">
                                            {file.name}
                                          </p>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      append({
                        id: 0,
                        size: "",
                        color: "",
                        price: 0,
                        images: [],
                      })
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Variant
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/products")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid || isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Update Product"
                  : "Create Product"}
            </Button>
          </div>

          {/* Validation Summary (Optional) */}
          {!isFormValid && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 mb-2">
                Please complete the following to create product:
              </p>
              <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
                {!formValues.title && <li>Add product title</li>}
                {!formValues.description && <li>Add product description</li>}
                {!formValues.type && <li>Select product type</li>}
                {!formValues.gender && <li>Select gender</li>}
                {formValues.variants?.some((v) => !v.size) && (
                  <li>Select size for all variants</li>
                )}
                {formValues.variants?.some((v) => !v.color) && (
                  <li>Select color for all variants</li>
                )}
                {formValues.variants?.some((v) => !v.price || v.price <= 0) && (
                  <li>Add valid price for all variants</li>
                )}
                {formValues.variants?.some(
                  (v) => !v.images || v.images.length === 0,
                ) && <li>Upload at least one image for each variant</li>}
              </ul>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
