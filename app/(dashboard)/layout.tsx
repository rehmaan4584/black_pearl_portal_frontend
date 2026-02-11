"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface AddButton {
  route: string;
  label: string;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const getAddButton = (): AddButton | null => {
    if (pathname.startsWith("/products")) {
      return { route: "/products/new", label: "Add Product" };
    }
    return null;
  };

  const addButton = getAddButton();
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-screen flex flex-col overflow-hidden">
        <SidebarTrigger style={{ height: "40px" }} />
        <div className="flex-1 pt-12 pb-4 px-4 overflow-y-auto">
          {pathname !== "/dashboard" && addButton && (
            <div className="flex px-2 py-2 justify-between mb-4">
              <div>searchbox</div>
                <Button
                  variant="secondary"
                  onClick={() => router.push(addButton.route)}
                >
                  {addButton.label}
                </Button>
            </div>
          )}
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
