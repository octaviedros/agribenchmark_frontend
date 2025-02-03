"use client"

import { columns } from "@/components/columns"
import { DataTable } from "@/components/data-table"
import { NetworkContext } from "@/context/NetworkContext"
import { Farm } from "@/data/schema"
import { useFarmData } from "@/hooks/use-farm-data"
import Image from "next/image"
import { useContext, useState } from "react"

interface FarmData {
  data: Farm[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  isLoading: boolean
}

export function DashboardClient() {
  let { data: farms } = useFarmData("/generalfarm") as FarmData
  if (!farms) farms = [] as Farm[]
  const { activeNetwork } = useContext(NetworkContext)
  const filteredFarms = farms.filter(farm => 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (farm as any)["network_" + activeNetwork.value]
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const [selectedFarms, setSelectedFarms] = useState<Farm[]>([])

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