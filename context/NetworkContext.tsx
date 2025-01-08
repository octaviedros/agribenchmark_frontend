"use client"

import React from "react"
import { PiggyBank } from "lucide-react"

type Network = {
  name: string
  value: string
  logo: React.ElementType
  plan: string
}

export const NetworkContext = React.createContext<{
  activeNetwork: Network
  setActiveNetwork: (n: Network) => void
}>({
  activeNetwork: { name: "", value: "", logo: () => null, plan: "" },
  setActiveNetwork: () => { },
})

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [activeNetwork, setActiveNetwork] = React.useState<Network>({
    name: "Pig",
    logo: PiggyBank,
    value: "pig",
    plan: "",
  })
  return (
    <NetworkContext.Provider value={{ activeNetwork, setActiveNetwork }}>
      {children}
    </NetworkContext.Provider>
  )
}