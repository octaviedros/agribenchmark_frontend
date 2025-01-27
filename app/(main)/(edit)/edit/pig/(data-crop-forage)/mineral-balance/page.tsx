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

const mineralbalanceFormSchema = z.object({
  id: z.string().uuid(),
  general_id: z.string().uuid(),
  fertilizer_type: z.string(),
  fertilizer_name: z.string(),
  fertilizer_name_custom: z.string(),
  amount: z.string(),
  amount_unit: z.string(),
  n_content_per_unit: z.string(),

  mineralrow: z.array(z.object({
    value: z.string()
  })),
  })
  
  type MineralBalanceValues = z.infer<typeof mineralbalanceFormSchema>

  interface MineralBalanceProps {
    farmData: MineralBalanceValues | undefined
  }
  
  export function MineralBalancePage({ farmData }: MineralBalanceProps) {
        const searchParams = useSearchParams()
        const general_id = searchParams.get("general_id") || ""
        const { data, error, isLoading } = useFarmData("/fertilizer", general_id)
        
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
        const { mutate } = useFarmData("/fertilizer", farmData?.general_id?.toString())
          const form = useForm<MineralBalanceValues>({
            resolver: zodResolver(mineralbalanceFormSchema),
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
      
        async function onSubmit(data: MineralBalanceValues) {
              try {
                const mergedData = {
                  ...farmData, // overwrite the farmData with the new data
                  ...data,
                }
                await mutate(put(`/fertilizer/${farmData?.general_id}`, mergedData), {
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
      name: "mineralrow",
    })

    const minerals = [''];
    const mineralTypes = ['Nitrogen','Phosphorus','Potash','Calcium','Other'];

  return (
    <div className="space-y-6 min">
      <div>
        <h3 className="text-lg font-medium">Mineral Balance and Fertilizer Input</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-medium min-w-[120px]">Crop</th>
              {mineralTypes.map((mineralType) => (
                <th key={mineralType} className="p-1 font-medium min-w-[120px]">
                  {mineralType}
                </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {minerals.map((mineral) => (
                <tr key={mineral}>
                  <td className="p-2 ">{mineral}
                    <Input type="text" name={`${mineral}-name`}/>
                  </td>
                  {mineralTypes.map((mineralType) => (
                    <td key={mineralType} className="p-2">
                      <Input type="number" name={`${mineral}-${mineralType}`}/>
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
                name={`mineralrow.${index}.value`}
                render={({ field }) => (
                  <table className="w-full my-4">
                    <tbody>
                      {minerals.map((mineral) => (
                        <tr key={mineral}>
                          <td className="p-2 min-w-[120px] ">{mineral}
                            <Input type="text" name={`${mineral}-name`}/>
                          </td>
                          {mineralTypes.map((mineralType) => (
                            <td key={mineralType} className="p-2 min-w-[120px]">
                              <Input type="number" name={`${mineral}-${mineralType}`}/>
                            </td>
                          ))}
                          <td>
                            <Button
                            type="button"
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

export default MineralBalancePage
