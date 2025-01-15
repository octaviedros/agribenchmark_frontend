"use client"

import * as React from "react"

import { ModeToggle } from "./mode-toggle"
import { NavActions } from "@/components/nav-actions"
import { NavUser } from "@/components/nav-user"
import { NetworkSwitcher } from "@/components/network-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { navData } from "@/data/nav-data"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userData: {
    user: { name: string, email: string, avatar: string }
  }
}

export function AppSidebar({ 
  userData, 
  ...props 
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NetworkSwitcher networks={navData.networks} />
      </SidebarHeader>
      <SidebarContent>
        <NavActions actions={navData.actions} />
      </SidebarContent>
      <SidebarFooter>
        <ModeToggle />
        <NavUser user={userData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
