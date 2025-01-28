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
import { Textarea } from "@/components/ui/textarea"

const buildings = [''];
const costTypes = ['Purchase Year', 'Purchase Price', 'Utilization Period', 'Replacement Value', 'Enterprise Codes'];

const buildingsFormSchema = z.object({
  id: z.string().uuid(),
  general_id: z.string().uuid(),
  sum_annual_depreciation: z.string().min(2, {
    message: "Depreciation must be at least 2 characters.",
  }),
  sum_book_values: z.string().min(2, {
    message: "Book Value must be at least 2 characters.",
  }),
  building_name: z.array(
    z.object({
      name: z.string(),
      purchase_year: z.string(),
      purchase_price: z.string(),
      utilization_period: z.string(),
      replacement_value: z.string(),
      enterprise_codes: z.string(),
    })
    .optional(),
  ),
})


  type BuildingsFormValues = z.infer<typeof buildingsFormSchema>

  interface BuildingsFormProps {
    farmData: BuildingsFormValues | undefined
  }
  
  export function BuildingsFarmPage({ farmData }: BuildingsFormProps) {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const { data, error, isLoading } = useFarmData("/buildings", general_id)
  
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

  const { mutate } = useFarmData("/buildings", farmData?.general_id?.toString())
    const form = useForm<BuildingsFormValues>({
      resolver: zodResolver(buildingsFormSchema),
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

    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "building_name",
    })
   async function onSubmit(data: BuildingsFormValues) {
      try {
        const mergedData = {
          ...farmData, // overwrite the farmData with the new data
          ...data,
        }
        await mutate(put(`/buildings/${farmData?.general_id}`, mergedData), {
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
        <h3 className="text-lg font-medium">Buildings and Facilities</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="sum_annual_depreciation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Deprecation on Buildings & Facilities</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Annual Depreciation" {...field} />
              </FormControl>
              <FormDescription>
              Sum of all depreciation values of all buildings. Can be found in the inventory list of your accounting.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          /> 
        <FormField
          control={form.control}
          name="sum_book_values"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Building & Facilities Book Values</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Book Value" {...field} />
              </FormControl>
              <FormDescription>
              Sum of all building book values in the start year. Often corresponds with the residual value.
              </FormDescription>
              <FormMessage />
            </FormItem>
            )}
            />
        <table className="w-full my-4">
          <thead>
            <tr>
              <th className="font-medium min-w-[120px]">Building</th>
              {costTypes.map((costType) => (
                <th key={costType} className="p-1 font-medium min-w-[120px]">
                  {costType}
                </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {buildings.map((building) => (
                <tr key={building}>
                  <td className="p-2 ">{building}
                    <Input type="text" name={`${building}-name`} className="w-full"/>
                  </td>
                  {costTypes.map((costType) => (
                    <td key={costType} className="p-2">
                      <Input type="number" name={`${building}-${costType}`} className="w-full"/>
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
              name={`building_name.${index}.name`}
              render={({ field }) => (
        <table className="w-full my-4 ">
            <tbody>
              {buildings.map((building) => (
                <tr key={building}>
                  <td className="p-2 min-w-[120px]">{building}
                    <Input type="text" name={`${building}-name`} className="w-full"/>
                  </td>
                  {costTypes.map((costType) => (
                    <td key={costType} className="p-2 min-w-[120px]">
                      <Input type="number" name={`${building}-${costType}`} className="w-full"/>
                    </td>
                  ))}
                  <td>
                    <Button 
                    type="button"
                    variant="destructive"
                    size="icon" onClick={() => remove(index)}> <Trash2 /></Button>
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
        onClick={() => append({ 
          name: "",
          purchase_year: "",
          purchase_price: "",
          utilization_period: "",
          replacement_value: "",
          enterprise_codes: ""
        })} >Add Row</Button>
        
          </div>
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default BuildingsFarmPage 