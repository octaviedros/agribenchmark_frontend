"use client"

import { useContext, useState } from "react"
import { NetworkContext } from "@/context/NetworkContext"
import { useFarmData } from "@/hooks/use-farm-data"
import Image from "next/image"
import { DataTable } from "@/components/data-table"
import { columns } from "@/components/columns"
import { Farm } from "@/data/schema"

interface FarmData {
  data: Farm[],
  error: any,
  isLoading: boolean
}

export function DashboardClient() {
  let { data: farms, error, isLoading } = useFarmData("/generalfarm") as FarmData
  if (!farms) farms = [] as Farm[]
  const { activeNetwork } = useContext(NetworkContext)
  const filteredFarms = farms.filter(farm => 
    (farm as any)["network_" + activeNetwork.value]
  )
  const [selectedFarms, setSelectedFarms] = useState<any[]>([])

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-4 md:flex">
        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here&apos;s a list of your farms in the {activeNetwork.name} network. You can select multiple farms to perform actions on them.
        </p>
        <DataTable 
          data={filteredFarms} 
          columns={columns} 
          onSelectionChange={setSelectedFarms}
        />
      </div>
    </>
  )
}