"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ChevronsUpDown, ChevronRight, ChevronDown } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
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
  /*
  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <div key={item.url}>
          <Link
            href={item.url}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "justify-start"
            )}
          >
            {item.title}
          </Link>
          {item.items && (
            <Collapsible>
              <div className="flex items-center justify-between space-x-4 px-4">
                <CollapsibleTrigger asChild>
                  <button className="flex items-center">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="ml-4 space-y-1">
                {item.items.map((subItem) => (
                  <Link
                    key={subItem.url}
                    href={subItem.url}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      pathname === subItem.url
                        ? "bg-muted hover:bg-muted"
                        : "hover:bg-transparent hover:underline",
                      "justify-start"
                    )}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      ))}
    </nav>
  )
  */

  return (
    <Sidebar {...props} variant="floating" collapsible="none" side="right" className="bg-white max-w-64 w-full">
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {items.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  {item.title}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items && item.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}