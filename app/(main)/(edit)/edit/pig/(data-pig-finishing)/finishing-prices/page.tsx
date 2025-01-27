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


const finishingpriceFormSchema = z.object({
  general_id: z.number().nullable().optional(),
  buying_f_castpiglets: z
  .number({
    required_error: "Please enter a number.",
  }),
  buying_piglets_for_finishing: z
  .number({
    required_error: "Please enter a number.",
  }),
  selling_finishing_pigs_gi_ba: z
  .number({
    required_error: "Please enter a number.",
  }),
  selling_finishing_pigs_em_ic: z
  .number({
    required_error: "Please enter a number.",
  }),
})

type FinishingPriceFormValues = z.infer<typeof finishingpriceFormSchema>

interface FinishingPriceFormProps {
  farmData: FinishingPriceFormValues | undefined
}
  
  export function FinishingPricePage({ farmData }: FinishingPriceFormProps) {
          const searchParams = useSearchParams()
          const general_id = searchParams.get("general_id") || ""
          const { data, error, isLoading } = useFarmData("/pricesfinishing" , general_id)
          
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
          const { mutate } = useFarmData("/pricesfinishing", farmData?.general_id?.toString())
            const form = useForm<FinishingPriceFormValues>({
              resolver: zodResolver(finishingpriceFormSchema),
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
        
          async function onSubmit(data: FinishingPriceFormValues) {
                try {
                  const mergedData = {
                    ...farmData, // overwrite the farmData with the new data
                    ...data,
                  }
                  await mutate(put(`/pricesfinishing/${farmData?.general_id}`, mergedData), {
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

      /*const finishingbuying = ['Female & Castrate Piglets', 'Boars Piglets for Finishing'];
      const finishingbuyingTypes = [''];
  
      const finishingselling = ['Finishing Pigs (Female & Castrates)', 'Finishing Pigs (Boars)'];
      const finishingsellingTypes = [''];*/
   

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Pig Finishing Prices</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
        <div><h3 className="space-y- mt-4 text-lg font-medium">Buying</h3>
        <FormField
            control={form.control}
            name="buying_f_castpiglets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Female & Castrate Piglets</FormLabel>
                <FormDescription>per kg LW</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="buying_piglets_for_finishing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Boars Piglets for Finishing</FormLabel>
                <FormDescription>per kg LW</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div><h3 className="space-y- mt-6 text-lg font-medium">Selling</h3>
          <FormField
            control={form.control}
            name="selling_finishing_pigs_gi_ba"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finishing Pigs (Female & Castrates)</FormLabel>
                <FormDescription>per kg CW</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="selling_finishing_pigs_em_ic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finishing Pigs (Boars)</FormLabel>
                <FormDescription>per kg CW</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
     
      <Button className="mt-4"  type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default FinishingPricePage