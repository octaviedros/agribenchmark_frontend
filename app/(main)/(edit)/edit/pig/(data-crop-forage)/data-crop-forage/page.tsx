"use client"

import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Check, ChevronsUpDown } from "lucide-react"
import { z } from "zod"

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


const lands = ['Own Land', 'Rented Land', 'Rent Price for existing contracts', 'Rent Price for new contracts', 'Market Value'];
const landTypes = ['Cropland', 'Grassland', 'Other incl. wood']

const acreageFormSchema = z.object({
  general_id: z.number().nullable().optional(),
  own_land: z.object({
    cropland: z.string(),
    grassland: z.string(),
    other: z.string(),
  }),
  rented_land: z.object({
    cropland: z.string(),
    grassland: z.string(),
    other: z.string(),
  }),
  rent_existing_contracts: z.object({
    cropland: z.string(),
    grassland: z.string(),
    other: z.string(),
  }),
  rent_new_contracts: z.object({
    cropland: z.string(),
    grassland: z.string(),
    other: z.string(),
  }),
  market_value: z.object({
    cropland: z.string(),
    grassland: z.string(),
    other: z.string(),
  }),
  })
  
type AcreageFormValues = z.infer<typeof acreageFormSchema>

interface AcreageFormProps {
  farmData: AcreageFormValues | undefined
}
  
  export function DataCropFarmPage({ farmData }: AcreageFormProps) {
    const searchParams = useSearchParams()
    const general_id = searchParams.get("general_id") || ""
    const { data, error, isLoading } = useFarmData("/acreageprices", general_id)
    
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
    const { mutate } = useFarmData("/acreageprices", farmData?.general_id?.toString())
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
      }, [farmData]) 
  
    async function onSubmit(data: AcreageFormValues) {
          try {
            const mergedData = {
              ...farmData, // overwrite the farmData with the new data
              ...data,
            }
            await mutate(put(`/acreageprices/${farmData?.general_id}`, mergedData), {
              optimisticData: mergedData,
              rollbackOnError: true,
              populateCache: false,
              revalidate: false
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <table className="w-full my-2">
        <thead>
          <tr>
            <th className="font-medium"></th>
            {landTypes.map((landType) => (
              <th key={landType} className="p-1 font-medium" >{landType}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lands.map((land) => (
            <tr key={land}>
              <td className="p-2">{land}</td>
              {landTypes.map((landType) => (
                <td key={landType}>
                  <Input type="number" name={`${land}-${landType}`} className="w-full m-2"/>
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