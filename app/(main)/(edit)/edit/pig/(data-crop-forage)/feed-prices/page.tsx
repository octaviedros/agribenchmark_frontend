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

const feedpriceFormSchema = z.object({
  general_id: z.number().nullable().optional(),
  feed_type: z.array(
    z.object({
      value: z.string(),
    })
  ),
  price_per_tonne: z.array(
    z.object({
      value: z.string(),
    })
  ),
  dry_matter_percent: z.array(
    z.object({
      value: z.string(),
    })
  ),
  energy_mj: z.array(
    z.object({
      value: z.string(),
    })
  ),
  protein: z.array(
    z.object({
      value: z.string(),
    })
  ),
  concentrate: z.array(
    z.object({
      value: z.string(),
    })
  ),
  feedpricerow: z.array(z.object({
    value: z.string()
  })),

  })
  
  type FeedPriceValues = z.infer<typeof feedpriceFormSchema>

  interface FeedPriceProps {
    farmData: FeedPriceValues | undefined
  }
  
  export function FeedPricesPage({ farmData }: FeedPriceProps) {
          const searchParams = useSearchParams()
          const general_id = searchParams.get("general_id") || ""
          const { data, error, isLoading } = useFarmData("/feedpricesdrymatter", general_id)
          
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
          const { mutate } = useFarmData("/feedpricesdrymatter", farmData?.general_id?.toString())
            const form = useForm<FeedPriceValues>({
              resolver: zodResolver(feedpriceFormSchema),
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
        
          async function onSubmit(data: FeedPriceValues) {
                try {
                  const mergedData = {
                    ...farmData, // overwrite the farmData with the new data
                    ...data,
                  }
                  await mutate(put(`/feedpricesdrymatter/${farmData?.general_id}`, mergedData), {
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
      name: "feedpricerow",
    })

    const feedprices = [''];
    const feedpriceTypes = ['Price per tonne', 'Dry Matter', 'MJ', 'Protein (%)', 'Feed Concentrate'];

  return (
    <div className="space-y-6 min">
      <div>
        <h3 className="text-lg font-medium">Prices for Feed and Dry Matter Content</h3>
      </div>
      <Separator />

      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <table className="w-full my-4">
          <thead>
            <tr>
              <th className="font-medium min-w-[120px]">Feed Type</th>
              {feedpriceTypes.map((feedpriceType) => (
                <th key={feedpriceType} className="p-1 font-medium min-w-[120px]">
                  {feedpriceType}
                </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {feedprices.map((feedprice) => (
                <tr key={feedprice}>
                  <td className="p-2 ">{feedprice}
                    <Input type="text" name={`${feedprice}-name`}/>
                  </td>
                  {feedpriceTypes.map((feedpriceType) => (
                    <td key={feedpriceType} className="p-2">
                      <Input type="number" name={`${feedprice}-${feedpriceType}`}/>
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
                name={`feedpricerow.${index}.value`}
                render={({ field }) => (
                  <table className="w-full my-4">
                    <tbody>
                      {feedprices.map((feedprice) => (
                        <tr key={feedprice}>
                          <td className="p-2 min-w-[120px]">{feedprice}
                            <Input type="text" name={`${feedprice}-name`}/>
                          </td>
                          {feedpriceTypes.map((feedpriceType) => (
                            <td key={feedpriceType} className="p-2 min-w-[120px]">
                              <Input type="number" name={`${feedprice}-${feedpriceType}`}/>
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

export default FeedPricesPage
