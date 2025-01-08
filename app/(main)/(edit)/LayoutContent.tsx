"use client"

import { useContext } from "react"
import { NetworkContext } from "@/context/NetworkContext"
import Image from "next/image"
import { useSearchParams } from 'next/navigation'
import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/sidebar-nav"
import { allSidebarNavItems } from "@/app/(main)/(edit)/all-sidebar-nav-items"

interface EditLayoutProps {
  children: React.ReactNode
}

export function EditLayoutContent({ children }: EditLayoutProps) {
  const { activeNetwork } = useContext(NetworkContext)
  const sidebarNavItems = allSidebarNavItems[activeNetwork.value]
  // parse query params
  const searchParams = useSearchParams()
  const farmId = searchParams.get('id')
  const year = searchParams.get('year')
  const scenario = searchParams.get('scenario')

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
          <h2 className="text-2xl font-bold tracking-tight">Edit Farm</h2>
          <p className="text-muted-foreground">
            Select a farm and edit its data.
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