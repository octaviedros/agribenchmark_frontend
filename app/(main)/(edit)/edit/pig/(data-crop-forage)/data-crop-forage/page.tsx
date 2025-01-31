"use client"

import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Info } from "lucide-react"
import { z } from "zod"
import { upsert, del } from "@/lib/api"
import { v4 as uuidv4 } from "uuid"
import { put } from "@/lib/api"
import { useFarmData } from "@/hooks/use-farm-data"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const acreageFormSchema = z.object({
  acreagedata: z.array(
    z.object({
      general_id: z.string().uuid(),
      id: z.string().uuid(),
      acreage_id: z.string().uuid(),
      land: z.string(),
      cropland: z.coerce.number(),
      grassland: z.coerce.number(),
      otherland: z.coerce.number(),
    }))
})

export const AcreageDBSchema = z.object({
  id: z.string().uuid(),
  acreage_id: z.string().uuid(),
  general_id: z.string().uuid(),
  land_type: z.string(),
  own_land: z.number(),
  rented_land: z.number(),
  rent_existing_contracts: z.number(),
  rent_new_contracts: z.number(),
  market_value: z.number(),
  year: z.number().int(),
})

type AcreageFormValues = z.infer<typeof acreageFormSchema>
type AcreageDBValues = z.infer<typeof AcreageDBSchema>

const landTypes: { name: string; value: string, tooltip?: string }[] = [
  {
    name: "Cropland",
    value: "cropland",
  },
  {
    name: "Grassland",
    value: "grassland",
  },
  {
    name: "Other incl. wood",
    value: "otherland",
  },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbDataToForm(data: any, general_id: string) {
  if (!data || !data.length) return createDefaults(general_id)
  return {
    acreagedata: data.filter((row: AcreageDBValues) => row.land_type === ""),
  }
}
function formDataToDb(data: AcreageDBValues) {
  return landTypes.map((landType) => ({
    
}
const lands: { name: string; value: keyof AcreageDBValues, tooltip?: string }[] = [
  {
    name: "Own Land",
    value: "own_land",
    tooltip: "in ha",
  },
  {
    name: "Rented Land",
    value: "rented_land",
    tooltip: "in ha",
  },
  {
    name: "Rent Price for existing contracts",
    value: "rent_existing_contracts",
    tooltip: "cost per ha",
  },
  {
    name: "Rent Price for new contracts",
    value: "rent_new_contracts",
    tooltip: "cost per ha",
  },
  {
    name: "Market Value",
    value: "market_value",
    tooltip: "cost per ha",
  },
]
function createDefaults(general_id: string) {
  return {
    acreagedata: lands.map(land => ({
      general_id: general_id,
      id: uuidv4(),
      acreage_id: uuidv4(),
      land: land.value,
      cropland: 0,
      grassland: 0,
      otherland: 0,
    }))
  }
}

export function DataCropFarmPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/acreage_prices", general_id)

  const farmData = dbDataToForm(data, general_id)
  console.log(farmData)
  const form = useForm<AcreageFormValues>({
    resolver: zodResolver(acreageFormSchema),
    defaultValues: {
      ...farmData
    },
    mode: "onChange",
  })

  useEffect(() => {
    form.reset({
      ...farmData
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  async function onSubmit(formData: AcreageFormValues) {
    try {
      console.log("submit", formData)
      const updatedData = formDataToDb(formData)
      // merge with previous farm data
      const mergedData = updatedData.map((row) => {
        const existingRow = (data as AcreageDBValues[])?.find((r) => r.id === row.id)
        return existingRow ? { ...existingRow, ...row } : row
      })
      console.log(mergedData)
      await mutate(Promise.all(mergedData.map((row) => upsert(`/acreageprices`, row))), {
        optimisticData: mergedData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      })
      toast({
        title: "Success",
        description: "Farm data has been saved successfully.",
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to save farm data. ${errorMessage}`,
      })
    }
  }


 


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
  if (error && error.status !== 404) {
    console.error(error)
    return <div className="p-4">Failed to load farm data.</div>
  }
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Data on Crop and Forage Production</h3>
        <p className="text-sm text-muted-foreground">
          Available Acreage and Prices
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, error => console.log(error))} className="space-y-8">
          <table className="w-full my-2">
            <thead>
              <tr>
                <th className="font-medium"></th>
                {landTypes.map((landType, index) => (
                  <th key={index} className="p-1 font-medium" >{landType.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lands.map((land, index) => (
                <tr key={index}>
                  <td className="p-2">{land.name}</td>
                  {landTypes.map((landType, index2) => (
                    <td key={index + "-" + index2}>
                      <FormField
                        control={form.control}
                        name={`acreagedata.${index}.${landType.value as keyof AcreageFormValues["acreagedata"][number]}`}
                        render={({ field: ff }) => (
                          <Input {...ff} className="w-full" type="number" value={ff.value as number} />
                        )}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default DataCropFarmPage 