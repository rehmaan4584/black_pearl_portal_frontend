"use client"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-screen flex flex-col overflow-hidden">
        <SidebarTrigger style={{ height: "40px" }} />
        <div className="flex-1 pt-12 pb-4 px-4 overflow-y-auto">
          {pathname !== "/dashboard" && (
            <div className="flex px-2 py-2 justify-between mb-4">
              <div>searchbox</div>
              <div>Add button</div>
            </div>
          )}
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
