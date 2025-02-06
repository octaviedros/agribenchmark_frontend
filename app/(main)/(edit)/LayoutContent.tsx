/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
"use client"

import { allSidebarNavItems } from "@/app/(main)/(edit)/all-sidebar-nav-items"
import { SidebarNav } from "@/components/sidebar-nav"
import { Combobox } from "@/components/ui/combobox"
import { Separator } from "@/components/ui/separator"
import { NetworkContext } from "@/context/NetworkContext"
import { Farm } from "@/data/schema"
import { useFarmData } from "@/hooks/use-farm-data"
import { useSearchParams } from 'next/navigation'
import { useContext, useEffect, useState } from "react"

interface EditLayoutProps {
  children: React.ReactNode
}

interface FarmData {
  data: Farm[],
  error: Error | null,
  isLoading: boolean
}

export function EditLayoutContent({ children }: EditLayoutProps) {
  let { 
    data: farms,
    error, 
    isLoading 
  } = useFarmData("/generalfarm") as FarmData
  if (!farms) farms = [] as Farm[] 
  const uniqueFarms = [...new Set(farms.map(f => f.farm_id))]
  const { activeNetwork } = useContext(NetworkContext)
  // Use the active network to determine which sidebar nav items to show
  // E.g. pig related feeding etc.
  const sidebarNavItems = allSidebarNavItems[activeNetwork.value]

  // parse query params
  const searchParams = useSearchParams()
  const generalId = searchParams.get("general_id") || (farms[0]?.general_id ?? "") 
  let activeFarm = farms.find(f => f.general_id?.toString() === generalId)

  const [selectedFarm, setSelectedFarm] = useState(activeFarm?.farm_id || "")
  const [selectedYear, setSelectedYear] = useState(activeFarm?.year?.toString() || "")
  const [selectedScenario, setSelectedScenario] = useState(activeFarm?.scenario_name || "")
  const [availableYears, setAvailableYears] = useState<{ value: string, label: string}[]>([])
  const [availableScenarios, setAvailableScenarios] = useState<{ value: string, label: string }[]>([])

  useEffect(() => {
    setSelectedFarm(activeFarm?.farm_id || "")
    setSelectedYear(activeFarm?.year?.toString() || "")
    setSelectedScenario(activeFarm?.scenario_name || "")
    
    const availableYears = farms
      .filter(f => f.farm_id === activeFarm?.farm_id)
      .map(f => ({value: f.year?.toString() || "", label: f.year?.toString() || ""}))
    setAvailableYears(availableYears)
    
    const availableScenarios = farms
      .filter(f => f.farm_id === activeFarm?.farm_id && f.year?.toString() === activeFarm?.year?.toString())
      .map(f => ({value: f.scenario_name || "", label: f.scenario_name || ""}))
    setAvailableScenarios(availableScenarios)
  }, [activeFarm])
  
  // update query params
  const updateQueryParams = async () => {
    const params = new URLSearchParams()
    // get general_id from the combination of selectedFarm, selectedYear, and selectedScenario
    let newFarm = farms.find(f => (
      f.farm_id === selectedFarm 
        && f.year?.toString() === selectedYear 
        && f.scenario_name === selectedScenario
      )
    )
    if (!newFarm) {
      // if no farm is found, use the first farm with the selected farm_id
      newFarm = farms.find(f => f.farm_id === selectedFarm)
    }
    if (newFarm) {
      params.set('general_id', newFarm?.general_id?.toString() || "")
      window.history.replaceState({}, '', `${window.location.pathname}?${params}`)
    }
  }

  // update query params when selected values change
  useEffect(() => {
    updateQueryParams()
  }, [selectedFarm, selectedYear, selectedScenario])

  if (error) {
    return <div>failed to load</div>
  }
  if (isLoading) {
    return <div>loading...</div>
  }

  // If no farms exist, show a notice and return
  if (!farms || farms.length === 0) {
    return (
      <div className="space-y-6 p-10 pb-16 md:block">
        <h2 className="text-2xl font-bold tracking-tight">No Farms Found</h2>
        <p className="text-muted-foreground">
          You currently have access to no farms. Please create one first, or contact your agribenchmark associate for help.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Edit Farm</h2>
          <p className="text-muted-foreground">
            Select a farm and edit its data.
          </p>
          <div className="pt-2 flex items-center space-x-4">
            <Combobox valueState={[selectedFarm, setSelectedFarm]} options={uniqueFarms.map(farm_id => ({
              value: farm_id,
              label: farm_id,
            }))} />
            <Combobox valueState={[selectedYear, setSelectedYear]} options={availableYears} />
            <Combobox valueState={[selectedScenario, setSelectedScenario]} options={availableScenarios} />
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