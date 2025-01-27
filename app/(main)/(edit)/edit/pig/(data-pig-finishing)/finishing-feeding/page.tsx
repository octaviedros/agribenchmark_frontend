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

const finishingfeedingFormSchema = z.object({
  id: z.string().uuid(),
  general_id: z.string().uuid(),
  proportion_finishing_feed_1: z
    .number({
      required_error: "Please enter a number.",
    }),
  proportion_finishing_feed_2: z
    .number({
      required_error: "Please enter a number.",
    }),
  proportion_finishing_feed_3: z
    .number({
      required_error: "Please enter a number.",
    }),
  amount_finishing_feed_1: z
    .number({
      required_error: "Please enter a number.",
    }),
  amount_finishing_feed_2: z
    .number({
      required_error: "Please enter a number.",
    }),
  amount_finishing_feed_3: z
    .number({
      required_error: "Please enter a number.",
    }),
  total_amount_feed: z
    .number({
      required_error: "Please enter a number.",
    }),
})

type FinishingFeedingFormValues = z.infer<typeof finishingfeedingFormSchema>

interface FinishingFeedingFormProps {
  farmData: FinishingFeedingFormValues | undefined
}

export function FinishingFeedingPage({ farmData }: FinishingFeedingFormProps) {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const { data, error, isLoading } = useFarmData("/feedingfinishing", general_id)

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
  const { mutate } = useFarmData("/feedingfinishing", farmData?.general_id?.toString())
  const form = useForm<FinishingFeedingFormValues>({
    resolver: zodResolver(finishingfeedingFormSchema),
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

  async function onSubmit(data: FinishingFeedingFormValues) {
    try {
      const mergedData = {
        ...farmData, // overwrite the farmData with the new data
        ...data,
      }
      await mutate(put(`/feedingfinishing/${farmData?.general_id}`, mergedData), {
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

  /*const finishingproportion = ['Finishing Feed 1 (%)', 'Finishing Feed 2 (%)', 'Finishing Feed 3 (%)'];
  const finishingproportionTypes = [''];
 
  const finishingamount = ['Finishing Feed 1 (kg per year)', 'Finishing Feed 2 (kg per year)', 'Finishing Feed 3 (kg per year)', 'Total Amount of Feed (kg per year)'];
  const finishingamountTypes = [''];*/

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Pig Finishing Prices</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y- w-full">
          <div>
            <h3 className="text-lg font-medium">Proportion of Finishing Period</h3></div>
          <FormField
            control={form.control}
            name="proportion_finishing_feed_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finishing Feed 1</FormLabel>
                <FormDescription>%</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="proportion_finishing_feed_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finishing Feed 2</FormLabel>
                <FormDescription>%</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="proportion_finishing_feed_3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finishing Feed 3</FormLabel>
                <FormDescription>%</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <h3 className="space-y- mt-6 text-lg font-medium">Amount of Feed</h3>
            <FormField
              control={form.control}
              name="amount_finishing_feed_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Finishing Feed 3</FormLabel>
                  <FormDescription>kg per year</FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount_finishing_feed_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Finishing Feed 2</FormLabel>
                  <FormDescription>kg per year</FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount_finishing_feed_3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Finishing Feed 3</FormLabel>
                  <FormDescription>kg per year</FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="total_amount_feed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount of Feed</FormLabel>
                  <FormDescription>kg per year</FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> </div>

          <Button className="mt-4" type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default FinishingFeedingPage