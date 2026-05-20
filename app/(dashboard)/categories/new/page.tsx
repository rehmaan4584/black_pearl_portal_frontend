"use client";
import { useState } from "react";
import { CategoryForm } from "../../../../components/CategoryForm";
import { categoryService } from "../../../../services/category.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewCategoryPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(values: any) {
    setLoading(true);
    try {
      await categoryService.createCategory(values);
      toast.success("Category created");
      router.push("/categories");
    } catch (e: any) {
      toast.error(e.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 min-h-[calc(100vh-64px)] flex flex-col items-center justify-start py-12">
      <div className="w-full max-w-2xl space-y-6">
        <Button 
          variant="outline" 
          onClick={() => router.back()} 
          className="group text-teal-100/80 hover:text-primary -ml-3 glass border-white/10 hover:bg-white/5"
        >
          <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to list
        </Button>

        <Card className="glass shadow-2xl overflow-hidden relative border-white/5">
          <div className="absolute -right-20 -top-20 size-64 bg-primary/5 blur-[100px] rounded-full" />
          <CardHeader className="space-y-1 relative z-10 pb-8">
            <CardTitle className="text-3xl font-extrabold tracking-tight text-white">Create Category</CardTitle>
            <CardDescription className="text-teal-100/60 font-medium">Define a new collection for your futuristic store catalog.</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <CategoryForm onSubmit={handleSubmit} loading={loading} submitLabel="Create Category" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
