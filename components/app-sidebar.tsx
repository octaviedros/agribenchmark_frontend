"use client"

import * as React from "react"

import { ModeToggle } from "./mode-toggle"
// import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { NetworkSwitcher } from "@/components/network-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  PiggyBank,
  Beef,
  Drumstick,
  Wheat,
  Apple,
  Fish,
  PieChart,
  House,
  HousePlus,
  TrendingUpDown,
  RefreshCcw
} from "lucide-react"
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
        {/* <NavMain items={navData.navMain} /> */}
        <NavProjects projects={navData.navLinks} />
      </SidebarContent>
      <SidebarFooter>
        <ModeToggle />
        <NavUser user={userData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
