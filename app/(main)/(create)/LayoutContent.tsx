"use client"

import { useContext } from "react"
import { NetworkContext } from "@/context/NetworkContext"
import Image from "next/image"
import { sidebarNavItems } from "@/app/(main)/(create)/sidebar-nav-items"
import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/sidebar-nav"

interface CreateLayoutProps {
  children: React.ReactNode
}

export function CreateLayoutContent({ children }: CreateLayoutProps) {
  const { activeNetwork } = useContext(NetworkContext)

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Create a new Farm</h2>
          <p className="text-muted-foreground">
            Fill in the details below to create a new farm in the {activeNetwork.name} network.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  )
}