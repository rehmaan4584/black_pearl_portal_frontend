import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Image src="/black_pearl_logo.svg"
          alt="brand logo"
          style={{alignSelf:"center"}}
          width={90}
          height={30}
          />
      </SidebarHeader>


      <SidebarContent>

        <SidebarGroup>
           <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
           <SidebarMenu>
             <SidebarMenuItem>
               <SidebarMenuButton asChild>
                <Link href="/dashboard">
                   Dashboard
                </Link>
              </SidebarMenuButton>
             </SidebarMenuItem>

             <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/product">
                   Product
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
           </SidebarMenu>
        </SidebarGroup>


        {/* for another same values of group */}
        <SidebarGroup />
      </SidebarContent>


       <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
           User
          </div>
          <div>
            <p className="font-medium">Ahmed Ali</p>
            <p className="text-sm text-gray-500">ahmed@email.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}