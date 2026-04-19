"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Eye } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { Size } from "@/types/size.types";
import type { Color } from "@/types/color.types";
import { deleteProduct } from "@/services/product.service";

type Product = {
  id: number;
  title: string;
  type: string;
  gender: string;
  brand?: string;
  variants: {
    id: number;
    size: Size;
    color: Color;
    price: number;
    images: { url: string; isPrimary: boolean }[];
  }[];
};

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await apiRequest("products/get-all-withDetails");
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriceRange = (variants: Product["variants"]) => {
    const prices = variants.map((v) => v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `${min}` : `${min} - ${max}`;
  };

  const getPrimaryImage = (variants: Product["variants"]) => {
    for (const variant of variants) {
      const primary = variant.images.find((img) => img.isPrimary);
      if (primary) return primary.url;
    }
    return variants[0]?.images[0]?.url || "/placeholder.png";
  };

   const handleEdit = (productId: number) => {
    router.push(`/products/edit/${productId}`);
  };

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const openDeleteModal = (productId: number) => {
    setDeleteProductId(productId);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;

    try {
      setIsDeleting(true);
      await deleteProduct(deleteProductId);
      setProducts((prev) => prev.filter((p) => p.id !== deleteProductId));
      toast.success("Product deleted successfully");
      setIsDeleteOpen(false);
      setDeleteProductId(null);
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <Button onClick={() => router.push('/products/new')}>Add Product</Button>
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <Button onClick={() => router.push('/products/new')}>Add Product</Button>
        </div>
        <div className="p-8 text-center text-gray-500">No products found.</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => router.push('/products/new')}>Add Product</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="py-2 px-3 text-left">Product</TableHead>
            <TableHead className="py-2 px-3 text-left">Type</TableHead>
            <TableHead className="py-2 px-3 text-left">Gender</TableHead>
            <TableHead className="py-2 px-3 text-left">Price</TableHead>
            <TableHead className="py-2 px-3 text-left">Variants</TableHead>
            <TableHead className="py-2 px-3 text-left">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="py-2 px-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={getPrimaryImage(product.variants)}
                    alt={product.title}
                    width={48}
                    height={48}
                    className="rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">{product.title}</p>
                    {product.brand && (
                      <p className="text-sm text-muted-foreground">
                        {product.brand}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-2 px-3">
                <Badge variant="outline">{product.type}</Badge>
              </TableCell>
              <TableCell className="py-2 px-3">{product.gender}</TableCell>
              <TableCell className="py-2 px-3">{getPriceRange(product.variants)}</TableCell>
              <TableCell className="py-2 px-3">
                <Badge>{product.variants.length} variants</Badge>
              </TableCell>
              <TableCell className="py-2 px-3 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openModal(product)}>
                  View
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEdit(product.id)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => openDeleteModal(product.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.title}</DialogTitle>
            <DialogDescription>
              Product details and all available variants.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="flex gap-3 flex-wrap">
              <Badge variant="outline">{selectedProduct?.type}</Badge>
              <Badge variant="outline">{selectedProduct?.gender}</Badge>
              {selectedProduct?.brand && (
                <Badge variant="secondary">{selectedProduct.brand}</Badge>
              )}
            </div>

            {selectedProduct?.variants.map((variant) => (
              <div key={variant.id} className="border p-3 rounded space-y-2">
                <p className="font-medium">Variant #{variant.id}</p>
                <div className="flex gap-6 flex-wrap">
                  <div>
                    <p className="text-sm text-muted-foreground">Size</p>
                    <p>{variant.size?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Color</p>
                    <p>{variant.color?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p>{variant.price}</p>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {variant.images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <Image
                        src={img.url}
                        alt="variant-image"
                        width={100}
                        height={100}
                        className="rounded object-cover"
                      />
                      {img.isPrimary && (
                        <Badge className="absolute top-1 left-1 text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="text-right">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) {
            setDeleteProductId(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete product</DialogTitle>
            <DialogDescription>
              This will permanently delete this product and all of its variants
              and images. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
