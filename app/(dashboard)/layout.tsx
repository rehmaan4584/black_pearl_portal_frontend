"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface AddButton {
  route: string;
  label: string;
}

function pageTitle(pathname: string | null): string {
  if (!pathname) return "Dashboard";
  if (pathname === "/dashboard") return "Dashboard";
  if (pathname.startsWith("/products/new")) return "New product";
  if (pathname.startsWith("/products/edit")) return "Edit product";
  if (pathname.startsWith("/products")) return "Products";
  if (pathname.includes("/categories/new")) return "New category";
  if (pathname.includes("/categories/edit")) return "Edit category";
  if (pathname.startsWith("/categories")) return "Categories";
  if (pathname.startsWith("/orders")) return "Orders";
  return "Dashboard";
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const getAddButton = (): AddButton | null => {
    if (pathname?.startsWith("/products") && pathname === "/products") {
      return { route: "/products/new", label: "Add product" };
    }
    if (pathname?.startsWith("/categories") && pathname === "/categories") {
      return { route: "/categories/new", label: "Add category" };
    }
    return null;
  };

  const addButton = getAddButton();
  const title = pageTitle(pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex min-h-svh w-full flex-col bg-background">
        <header className="glass sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-white/5 bg-background/60 px-6 backdrop-blur-xl">
          <SidebarTrigger className="-ml-1 text-primary hover:bg-primary/10" />
          <div className="h-4 w-px bg-white/10" aria-hidden />
          <h1 className="min-w-0 flex-1 truncate text-base font-bold tracking-tight text-white">
            {title}
          </h1>
          {pathname !== "/dashboard" && addButton && (
            <Button
              size="sm"
              onClick={() => router.push(addButton.route)}
              className="shrink-0 cyan-glow"
            >
              {addButton.label}
            </Button>
          )}
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
