"use client"
import React from "react"
import { Farm } from "@/data/schema"
import { getFarms } from "@/lib/utils"

export const FarmsContext = React.createContext<{
  farms: Farm[]
  setFarms: React.Dispatch<React.SetStateAction<Farm[]>>
}>({
  farms: [],
  setFarms: () => { },
})

export function FarmsProvider({ children }: { children: React.ReactNode }) {
  const [farms, setFarms] = React.useState<Farm[]>([])

  React.useEffect(() => {
    async function fetchFarms() {
      const farms = await getFarms()
      setFarms(farms)
    }
    fetchFarms()
  })

  return (
    <FarmsContext.Provider value={{ farms, setFarms }}>
      {children}
    </FarmsContext.Provider>
  )
}