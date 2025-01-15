"use client"
import React from "react"
import { Farm } from "@/data/schema"

export const FarmsContext = React.createContext<{
  farms: Farm[]
  setFarms: React.Dispatch<React.SetStateAction<Farm[]>>
}>({
  farms: [],
  setFarms: () => { },
})

export function FarmsProvider({ children }: { children: React.ReactNode }) {
  const [farms, setFarms] = React.useState<Farm[]>([])

  return (
    <FarmsContext.Provider value={{ farms, setFarms }}>
      {children}
    </FarmsContext.Provider>
  )
}