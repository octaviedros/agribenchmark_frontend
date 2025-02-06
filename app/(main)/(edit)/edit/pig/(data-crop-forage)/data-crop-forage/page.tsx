"use client"

import { Separator } from "@/components/ui/separator"
import { useFarmData } from "@/hooks/use-farm-data"
import { upsert } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

import {
  Form,
  FormField,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const acreageFormSchema = z.object({
  db_ids: z.array(z.string().uuid()),
  acreage_ids: z.array(z.string().uuid()),
  acreagedata: z.array(
    z.object({
      general_id: z.string().uuid(),
      land: z.string(),
      cropland: z.coerce.number(),
      grassland: z.coerce.number(),
      otherland: z.coerce.number(),
    }))
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AcreageDBSchema = z.object({
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

function dbDataToForm(data: AcreageDBValues[], general_id: string) {
  if (!data || !data.length) return createDefaults(general_id)
  return {
    db_ids: data.map(d => d.id),
    acreage_ids: data.map(d => d.acreage_id),
    acreagedata: lands.map((land) => {
      return {
        general_id: general_id,
        land: land.value,
        cropland: Number(data?.find(d => d.land_type === "cropland")?.[land.value as keyof AcreageDBValues] ?? 0),
        grassland: Number(data?.find(d => d.land_type === "grassland")?.[land.value as keyof AcreageDBValues] ?? 0),
        otherland: Number(data?.find(d => d.land_type === "otherland")?.[land.value as keyof AcreageDBValues] ?? 0),
      }
    })
  }
}

function formDataToDb(data: AcreageFormValues) {
  return landTypes.map((landType, index) => ({
    general_id: data.acreagedata[0].general_id,
    id: data.db_ids[index],
    acreage_id: data.acreage_ids[index],
    land_type: landType.value,
    own_land: data.acreagedata[0][landType.value as keyof AcreageFormValues["acreagedata"][number]],
    rented_land: data.acreagedata[1][landType.value as keyof AcreageFormValues["acreagedata"][number]],
    rent_existing_contracts: data.acreagedata[2][landType.value as keyof AcreageFormValues["acreagedata"][number]],
    rent_new_contracts: data.acreagedata[3][landType.value as keyof AcreageFormValues["acreagedata"][number]],
    market_value: data.acreagedata[4][landType.value as keyof AcreageFormValues["acreagedata"][number]],
  }))
}

function createDefaults(general_id: string) {
  return {
    db_ids: landTypes.map(() => uuidv4()),
    acreage_ids: landTypes.map(() => uuidv4()),
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

export default function DataCropFarmPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/acreageprices", general_id)

  const farmData = dbDataToForm(data, general_id)

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
      await mutate(Promise.all(mergedData.map((row) => upsert(`/acreageprices/`, row))), {
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
                  <th key={index} className="py-2 font-medium" >{landType.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lands.map((land, index) => (
                <tr key={index}>
                  <td className="py-4">{land.name}</td>
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