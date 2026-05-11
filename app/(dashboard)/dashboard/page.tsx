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
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Welcome back
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          Manage your catalog, variants, and categories from this portal.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-border/80 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Package className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Products</CardTitle>
              <CardDescription>
                Add items, variants, pricing, and images.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use the sidebar or header action on the products list to create a
              new product.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FolderTree className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Categories
              </CardTitle>
              <CardDescription>
                Organize the storefront with categories and subcategories.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Keep naming and slugs consistent for a cleaner public catalog.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed border-border/80 bg-muted/20">
        <CardHeader className="flex flex-row items-start gap-3">
          <Sparkles className="mt-0.5 size-5 shrink-0 text-primary/80" />
          <div>
            <CardTitle className="text-base font-semibold">Tips</CardTitle>
            <CardDescription>
              Upload a primary image per variant and verify inventory before
              publishing.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
