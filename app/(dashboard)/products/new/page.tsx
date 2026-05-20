"use client";
import ProductForm from "@/components/ProductForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddProduct(){
  const router = useRouter();
  return (
    <div className="p-6 py-12 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-6">
        <Button 
          variant="outline" 
          onClick={() => router.back()} 
          className="group text-teal-100/80 hover:text-primary -ml-3 glass border-white/10 hover:bg-white/5"
        >
          <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to list
        </Button>
        <ProductForm />
      </div>
    </div>
  );
} 