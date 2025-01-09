"use client"

import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuSub,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    url: string
    title: string
    items?: {
      url: string
      title: string
    }[]
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <Sidebar {...props} id="agribenchmark-page-content-sidebar" variant="floating" collapsible="none" side="right" className="bg-background w-full z-0">
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {items.map((item, i) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen={pathname === item.url || item.items?.some((item) => pathname === item.url)}
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarMenu>
                <SidebarGroupLabel
                  asChild
                  className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <CollapsibleTrigger className="text-left">
                    {item.title}{" "}
                    {item.items && <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />}
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuSub>
                        {item.items && item.items.map((item) => (
                          <SidebarMenuItem key={item.title} >
                            <SidebarMenuButton asChild isActive={pathname === item.url} className="pt-8 pb-8">
                              <a href={item.url}>{item.title}</a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenuSub>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarMenu>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}