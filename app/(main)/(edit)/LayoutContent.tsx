"use client"

import { useContext, useState, useEffect } from "react"
import { NetworkContext } from "@/context/NetworkContext"
import Image from "next/image"
import { useSearchParams } from 'next/navigation'
import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/sidebar-nav"
import { allSidebarNavItems } from "@/app/(main)/(edit)/all-sidebar-nav-items"
import { Combobox } from "@/components/ui/combobox"

interface EditLayoutProps {
  children: React.ReactNode
}

export function EditLayoutContent({ children }: EditLayoutProps) {
  const { activeNetwork } = useContext(NetworkContext)
  // Use the active network to determine which sidebar nav items to show
  // E.g. pig related feeding etc.
  const sidebarNavItems = allSidebarNavItems[activeNetwork.value]
  // query available farms from the server
  // TODO: replace with actual query
  const farms = [
    { id: '1', name: 'Farm 1' },
    { id: '2', name: 'Farm 2' },
    { id: '3', name: 'Farm 3' },
  ]
  // parse query params
  const searchParams = useSearchParams()
  const farmId = searchParams.get('id') || farms[0].id
  const year = searchParams.get('year') || '2025'
  const scenario = searchParams.get('scenario') || 'baseline'

  const [selectedFarm, setSelectedFarm] = useState(farmId)
  const [selectedYear, setSelectedYear] = useState(year)
  const [selectedScenario, setSelectedScenario] = useState(scenario)

  // update query params
  const updateQueryParams = async () => {
    const params = new URLSearchParams()
    params.set('id', selectedFarm)
    params.set('year', selectedYear)
    params.set('scenario', selectedScenario)
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`)
  }

  // update query params when selected values change
  useEffect(() => {
    updateQueryParams()
  }, [selectedFarm, selectedYear, selectedScenario])

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
          <div className="pt-2 flex items-center space-x-4">
            <Combobox valueState={[selectedFarm, setSelectedFarm]} options={farms.map(f => ({
              value: f.id,
              label: f.name,
            }))} />
            <Combobox valueState={[selectedYear, setSelectedYear]} options={[{ value: '2025', label: '2025' }]} />
            <Combobox valueState={[selectedScenario, setSelectedScenario]} options={[{ value: 'baseline', label: 'Baseline' }]} />
          </div>
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