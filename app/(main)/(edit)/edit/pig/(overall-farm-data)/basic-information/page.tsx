"use client"

import { Separator } from "@/components/ui/separator"
import { useSearchParams } from "next/navigation"
import { useFarmData } from "@/hooks/use-farm-data"
import { ProfileForm } from "@/app/(main)/(edit)/edit/pig/(overall-farm-data)/basic-information/basic-information"

export default function EditFarmPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const { data, error, isLoading } = useFarmData("/generalfarm", general_id)

  if (!general_id) {
    return (
      <div className="p-4">
        <h2>No farm selected.</h2>
        <p>Select a farm from the dropdown menu to get started.</p>
      </div>
    )
  }

  if (isLoading) {
    return <div className="p-4">Loading farm data…</div>
  }
  if (error) {
    console.error(error)
    return <div className="p-4">Failed to load farm data.</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Whole Farm Data</h3>
        <p className="text-sm text-muted-foreground">
          Farm Overview
        </p>
      </div>
      <Separator />
      <ProfileForm farmData={data[0]} />
    </div>
  )
}