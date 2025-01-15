import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { get } from "@/lib/api"
import { navData } from "@/data/nav-data"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface FarmProps {
  farm_id: string
  networks: string[],
  [key: string]: unknown
}

export async function getFarms() {
  let farms = await get("/generalfarm/")
  // add networks array to each farm
  farms = farms.map((farm: FarmProps) => {
    farm.networks = []
    navData.networks.forEach((network) => {
      if (farm["network_" + network.value]) {
        farm.networks.push(network.value)
      }
    })
    return farm
  })
  return farms
}
