"use client"

import useSWR from "swr"
import { get } from "@/lib/api"

async function fetchFarmData(table: string, general_id: string = "") {
  const data = general_id ? await get(`${table}/by_general_id/${general_id}`) : await get(`${table}/${general_id}`)
  return data
}

/** 
 * Provides farm data, or error/loading states. 
 * Re-fetches automatically whenever general_id changes.
 */
export function useFarmData(table: string, general_id: string = "") {
  const { data, error, isLoading, mutate } = useSWR(
    `${table}/by_general_id/${general_id}`,
    () => fetchFarmData(table as string, general_id as string),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )
  return {
    data,
    error,
    isLoading,
    mutate
  }
}