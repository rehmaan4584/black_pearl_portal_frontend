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
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, Package, FolderTree, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlackPearlLogo } from "@/components/BlackPearlLogo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { clearStoredToken } from "@/lib/auth-token";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleLogout = () => {
    clearStoredToken();
    toast.success("Signed out");
    router.push("/login");
    router.refresh();
  };

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/products", icon: Package },
    { label: "Categories", href: "/categories", icon: FolderTree },
    { label: "Orders", href: "/orders", icon: ClipboardList },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 border-b border-white/5 flex items-center justify-center shrink-0">
        <BlackPearlLogo size="md" hideText={isCollapsed} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:px-0">
          {!isCollapsed && <SidebarGroupLabel>Menu</SidebarGroupLabel>}
          <SidebarMenu>
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.href} className={cn("relative flex flex-col px-0", isCollapsed ? "items-center" : "items-stretch")}>
                  {/* Active Indicator Pipe - Glued to the absolute left edge */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[3px] rounded-r-full bg-primary cyan-glow z-30" />
                  )}
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive} 
                    tooltip={item.label}
                    className={cn(
                      "transition-all duration-200",
                      isCollapsed ? "mx-auto" : "ml-2 mr-2"
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className={cn("shrink-0", isCollapsed ? "size-5" : "size-4")} />
                      {!isCollapsed && <span className="font-medium">{item.label}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/5 p-2 bg-white/2 group-data-[collapsible=icon]:px-0">
        <div className="flex flex-col gap-2">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 rounded-xl glass-darker px-3 py-3 border-white/5 shadow-inner">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-xs font-bold text-primary cyan-glow">
                BP
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">Merchant</p>
                <p className="truncate text-[10px] uppercase tracking-tighter text-primary/60 font-medium">
                  Premium Account
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center group-data-[collapsible=icon]:px-1">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-xs font-bold text-primary cyan-glow">
                BP
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "sm"}
            className={cn(
              "w-full justify-start gap-2 text-muted-foreground hover:text-destructive", 
              isCollapsed && "mx-auto justify-center"
            )}
            type="button"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            {!isCollapsed && <span>Sign out</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
