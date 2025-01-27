"use client"

import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Check, ChevronsUpDown, Trash2 } from "lucide-react"
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

const landuseFormSchema = z.object({
  general_id: z.number().nullable().optional(),
  acreage: z.array(
    z.object({
      value: z.string(),
    })
  ),
  net_yield: z.array(
    z.object({
      value: z.string(),
    })
  ),
  dry_matter: z.array(
    z.object({
      value: z.string(),
    })
  ),
  price: z.array(
    z.object({
      value: z.string(),
    })
  ),
  cap_dir_paym: z.array(
    z.object({
      value: z.string(),
    })
  ),
  other_dir_paym: z.array(
    z.object({
      value: z.string(),
    })
  ),
  enterprise_code: z.array(
    z.object({
      value: z.string(),
    })
  ),
  landuserow: z.array(z.object({
    value: z.string()
  })),

  })
  
  type LandUseFormValues = z.infer<typeof landuseFormSchema>

  interface LandUseFormProps {
    farmData: LandUseFormValues | undefined
  }
  
  export function LandUseFarmPage({ farmData }: LandUseFormProps) {
    const searchParams = useSearchParams()
    const general_id = searchParams.get("general_id") || ""
    const { data, error, isLoading } = useFarmData("/landuse", general_id)
    
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
    const { mutate } = useFarmData("/landuse", farmData?.general_id?.toString())
      const form = useForm<LandUseFormValues>({
        resolver: zodResolver(landuseFormSchema),
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
  
    async function onSubmit(data: LandUseFormValues) {
          try {
            const mergedData = {
              ...farmData, // overwrite the farmData with the new data
              ...data,
            }
            await mutate(put(`/landuse/${farmData?.general_id}`, mergedData), {
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
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "landuserow",
    }) 

    const landuses = [''];
    const landuseTypes = ['Acreage (ha)','Net yield (t/ha)','Dry matter (0,0x)', 'Price (per tonne)', 'CAP dir. payments (per ha)', 'Other dir. payments (per ha)', 'Enterprise codes'];



  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Land use, Yields, Prices and Direct Payments</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <table className="w-full my-4">
          <thead>
            <tr>
              <th className="font-medium min-w-[120px]">Crop Name</th>
              {landuseTypes.map((landuseType) => (
                <th key={landuseType} className="p-1 font-medium min-w-[120px]">
                  {landuseType}
                </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {landuses.map((landuse) => (
                <tr key={landuse}>
                  <td className="p-2 ">{landuse}
                    <Input type="text" name={`${landuse}-name`}/>
                  </td>
                  {landuseTypes.map((landuseType) => (
                    <td key={landuseType} className="p-2">
                      <Input type="number" name={`${landuse}-${landuseType}`}/>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {fields.map((field, index) => (
              <FormField
            control={form.control}
            key={field.id}
            name={`landuserow.${index}.value`}
            render={({ field }) => (
              <table className="w-full my-4">
                <tbody>
                  {landuses.map((landuse) => (
                    <tr key={landuse}>
                      <td className="p-2 min-w-[120px]">{landuse}
                        <Input type="text" name={`${landuse}-name`}/>
                      </td>
                      {landuseTypes.map((landuseType) => (
                        <td key={landuseType} className="p-2 min-w-[120px]">
                          <Input type="number" name={`${landuse}-${landuseType}`}/>
                        </td>
                      ))}
                      <td>
                        <Button type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}><Trash2/></Button>   
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          />
            ))}
            <Button
            type="button"
            onClick={() => append({ value: "" })}>Add Row</Button>  
          </div>
        

        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default LandUseFarmPage
