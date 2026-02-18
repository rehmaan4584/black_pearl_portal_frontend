"use client";
import { useRouter } from "next/navigation";
import { useProductForm } from "@/hooks/useProductForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { Controller } from "react-hook-form";
import { Trash2, Plus, Upload } from "lucide-react";

interface ProductFormProps {
  productId?: number;
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();

  const {
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
  } = useProductForm(productId);
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


                  {/* Category & SubCategory */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subCategoryId">
                        Subcategory <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="subCategoryId"
                        control={control}
                        rules={{ required: "Subcategory is required" }}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value ? String(field.value) : undefined}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                            <SelectContent>
                              {/* TODO: Map subcategories fetched from backend */}
                              {/* Example: */}
                              {/* subCategories.map((sub) => (
                                <SelectItem key={sub.id} value={String(sub.id)}>{sub.name}</SelectItem>
                              )) */}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.subCategoryId && (
                        <p className="text-sm text-red-500">
                          {errors.subCategoryId.message}
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
                              name={`variants.${index}.sizeId`}
                              control={control}
                              rules={{ required: "Size is required" }}
                              render={({ field }) => (
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value ? String(field.value) : undefined}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Size" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {/* TODO: Map sizes fetched from backend */}
                                    {/* Example: */}
                                    {/* sizes.map((size) => (
                                      <SelectItem key={size.id} value={String(size.id)}>{size.name}</SelectItem>
                                    )) */}
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
                              name={`variants.${index}.colorId`}
                              control={control}
                              rules={{ required: "Color is required" }}
                              render={({ field }) => (
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value ? String(field.value) : undefined}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Color" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {/* TODO: Map colors fetched from backend */}
                                    {/* Example: */}
                                    {/* colors.map((color) => (
                                      <SelectItem key={color.id} value={String(color.id)}>
                                        <span style={{ background: color.hexCode, display: 'inline-block', width: 16, height: 16, borderRadius: '50%', marginRight: 8 }} />
                                        {color.name}
                                      </SelectItem>
                                    )) */}
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
                                      (
                                        file: File | string,
                                        imgIndex: number,
                                      ) => {
                                        // Handle both File and string URL
                                        const imageUrl =
                                          file instanceof File
                                            ? URL.createObjectURL(file)
                                            : file;

                                        return (
                                          <div
                                            key={imgIndex}
                                            className="relative group"
                                          >
                                            <img
                                              src={imageUrl}
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
                                                    (
                                                      _: File | string,
                                                      i: number,
                                                    ) => i !== imgIndex,
                                                  );
                                                  onChange(newFiles);
                                                }}
                                              >
                                                <Trash2 className="w-4 h-4" />
                                              </Button>
                                            </div>
                                            <p className="text-xs text-center mt-1 truncate">
                                              {file instanceof File
                                                ? file.name
                                                : "Existing image"}
                                            </p>
                                          </div>
                                        );
                                      },
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
                        sizeId: 0,
                        colorId: 0,
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
                {!formValues.subCategoryId && <li>Select subcategory</li>}
                {!formValues.gender && <li>Select gender</li>}
                {formValues.variants?.some((v) => !v.sizeId) && (
                  <li>Select size for all variants</li>
                )}
                {formValues.variants?.some((v) => !v.colorId) && (
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
