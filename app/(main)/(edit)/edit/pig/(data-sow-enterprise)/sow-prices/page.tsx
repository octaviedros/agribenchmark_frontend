"use client"

import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Check, ChevronsUpDown } from "lucide-react"
import { number, z } from "zod"
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

const sowpriceFormSchema = z.object({
  id: z.string().uuid(),
  general_id: z.string().uuid(),
  prices_sows_id: z.string().uuid(),
  buying_gilts: z
  .number({
    required_error: "Please enter a number.",
  }),
  buying_boars: z
  .number({
    required_error: "Please enter a number.",
  }),
  selling_sow: z
  .number({
    required_error: "Please enter a number.",
  }),
  selling_boar: z
  .number({
    required_error: "Please enter a number.",
  }),
  selling_weaning_piglet: z
  .number({
    required_error: "Please enter a number.",
  }),
  selling_rearing_piglet: z
  .number({
    required_error: "Please enter a number.",
  }),
  proportion_weanded_pigs_sold: z
  .number({
    required_error: "Please enter a number.",
  }),
  no_weanded_pigs_sold: z
  .number({
    required_error: "Please enter a number.",
  }),
  year: z.number().int(),
})

type SowPriceFormValues = z.infer<typeof sowpriceFormSchema>

// eslint-disable-next-line @typescript-eslint/no-explicit-any


function createDefaults(general_id: string): SowPriceFormValues {
  return {
  id: uuidv4(),
  general_id: general_id,
  prices_sows_id: uuidv4(),
  buying_gilts: 0,
  buying_boars: 0,
  selling_sow: 0,
  selling_boar: 0,
  selling_weaning_piglet: 0,
  selling_rearing_piglet: 0,
  proportion_weanded_pigs_sold: 0,
  no_weanded_pigs_sold: 0,
  year: new Date().getFullYear(),
  }
}    
export function SowPricePage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/pricessows", general_id)
  const farmData = data ? data[0] : null
/*let farmData 
if (data) { 
  farmData = data[0]
}*/
  console.log(farmData)
  const form = useForm<SowPriceFormValues>({
    resolver: zodResolver(sowpriceFormSchema),
    defaultValues: {
      ...createDefaults(general_id),
      ...farmData
    },
    mode: "onChange",
  })
// 
  useEffect(() => {
    form.reset({
      ...farmData
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])
async function onSubmit(data: SowPriceFormValues) {
    try {
      const mergedData = {
        ...farmData, // overwrite the farmData with the new data
        ...data,     //neuen Daten aus Formular; general_id und id wird nicht überschrieben
      }
      console.log(mergedData)
      await mutate(upsert(`/pricessows`, mergedData), {
        optimisticData: mergedData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: true
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
        <h3 className="text-lg font-medium">Sow Prices</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
      <div>
        <h3 className="text-lg font-medium">Buying</h3></div>
      <FormField
            control={form.control}
            name="buying_gilts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buying Guilt Price</FormLabel>
                <FormDescription>Cost per head</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="buying_boars"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buying Boar Price</FormLabel>
                <FormDescription>Cost per head</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
        <h3 className="text-lg font-medium">Selling</h3></div>
          <FormField
            control={form.control}
            name="selling_sow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Sow Price</FormLabel>
                <FormDescription>Cost per head</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="selling_boar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Boar Price</FormLabel>
                <FormDescription>Cost per head</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="selling_weaning_piglet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Weaning Piglet Price</FormLabel>
                <FormDescription>Cost per head</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="selling_rearing_piglet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Rearing Piglet Price</FormLabel>
                <FormDescription>Cost per head</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="proportion_weanded_pigs_sold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proportion of weaned Pigs sold</FormLabel>
                <FormDescription>Percentage</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
      <Button className="mt-4"  type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default SowPricePage