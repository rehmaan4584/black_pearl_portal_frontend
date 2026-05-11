"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Package, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AppSidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Signed out");
    router.push("/login");
    router.refresh();
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="mx-auto flex items-center gap-3">
          <div
            aria-hidden
            className="flex size-10 items-center justify-center rounded-full border border-sidebar-border/80 bg-[radial-gradient(circle_at_30%_20%,rgba(234,179,8,0.22),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(234,179,8,0.10),transparent_55%)]"
          >
            <div className="h-4 w-4 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),rgba(255,255,255,0)_60%)]" />
          </div>
          <div className="leading-none">
            <div className="text-[11px] font-semibold tracking-[0.24em] text-sidebar-foreground/90">
              BLACK PEARL
            </div>
            <div className="mt-1 text-[10px] text-muted-foreground">
              portal
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard" className="gap-2">
                  <LayoutDashboard className="size-4 shrink-0" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/products" className="gap-2">
                  <Package className="size-4 shrink-0" />
                  <span>Products</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/categories" className="gap-2">
                  <FolderTree className="size-4 shrink-0" />
                  <span>Categories</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 px-2 py-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/15 text-xs font-semibold text-sidebar-primary">
              BP
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Merchant</p>
              <p className="truncate text-xs text-muted-foreground">
                Seller account
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            type="button"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
