"use client"

import useSWR from "swr"
import { get } from "@/lib/api"

interface FarmProps {
  farm_id: string
  networks: string[],
  [key: string]: unknown
}

async function fetchFarmData(table: string, general_id: string = "") {
  const data = await get(`${table}/${general_id}`)
  return data
}

/** 
 * Provides farm data, or error/loading states. 
 * Re-fetches automatically whenever general_id changes.
 */
export function useFarmData(table: string, general_id: string = "") {
  const { data, error, isLoading, mutate } = useSWR(
    `${table}/${general_id}`,
    () => fetchFarmData(table as string, general_id as string)
  )
  return {
    data,
    error,
    isLoading,
    mutate
  }
}