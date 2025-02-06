"use client"

import {
  type LucideIcon,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ProfileForm } from "./add-farm-dialog"
import { AddScenarioDialog } from "./add-scenario-dialog"

export function NavActions({
  actions,
}: {
  actions: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Actions</SidebarGroupLabel>
      <SidebarMenu>
        {actions.map((item) => {
          if (item.name === "Add Farm") {
            return (
              <ProfileForm item={item} key={item.name} />
            )
          } else if (item.name === "Add Scenario") {
            return (
              <AddScenarioDialog item={item} key={item.name} />
            )
          } else {
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
