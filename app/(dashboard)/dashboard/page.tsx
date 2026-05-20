import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, FolderTree, Sparkles } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 py-8 px-4 sm:px-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl bg-linear-to-r from-white to-primary bg-clip-text text-transparent">
          Welcome back
        </h2>
        <p className="text-teal-100/60 text-base sm:text-lg max-w-2xl font-medium">
          Your command center for catalog management. Control variants, categories, and inventory with precision.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Card className="group relative overflow-hidden border-white/5 transition-all hover:border-primary/30">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center gap-5 space-y-0 pb-2 relative z-10">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/20 text-primary cyan-glow group-hover:scale-110 transition-transform">
              <Package className="size-7" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white group-hover:text-primary transition-colors">Products</CardTitle>
              <CardDescription className="text-teal-100/60 font-medium">
                Manage items, variants, and pricing.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 pt-4">
            <p className="text-sm text-teal-100/40 leading-relaxed font-medium">
              Maintain a high-quality catalog by adding descriptive tags and high-resolution variant images.
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-white/5 transition-all hover:border-primary/30">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center gap-5 space-y-0 pb-2 relative z-10">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/20 text-primary cyan-glow group-hover:scale-110 transition-transform">
              <FolderTree className="size-7" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                Categories
              </CardTitle>
              <CardDescription className="text-teal-100/60 font-medium">
                Organize your digital shelves.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 pt-4">
            <p className="text-sm text-teal-100/40 leading-relaxed font-medium">
              Streamline the customer journey with intuitive navigation and logical category grouping.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20 bg-primary/5 relative overflow-hidden backdrop-blur-3xl">
        <div className="absolute -right-20 -top-20 size-64 bg-primary/10 blur-[100px] rounded-full" />
        <CardHeader className="flex flex-row items-start gap-4">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Sparkles className="size-6 text-primary animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-white">Pro Tip</CardTitle>
            <CardDescription className="text-teal-100/80 text-sm italic font-medium">
              "A visual catalog converts 40% better. Ensure every variant has at least one high-quality visual representation."
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
