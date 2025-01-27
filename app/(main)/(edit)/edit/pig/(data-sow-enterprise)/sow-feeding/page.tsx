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
import { Checkbox } from "@/components/ui/checkbox"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const sowfeedingFormSchema = z.object({
  id: z.string().uuid(),
  general_id: z.string().uuid(),
  sowfeeding: z.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  sows_gestation_feed: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
  sows_lactation_feed: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
  sows_total_feed_daily: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
  sows_total_feed_yearly: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
  gilts_feeding: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
  gilts_special_feed: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
  gilts_share_gestation_feed: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
  gilts_share_lactation_feed: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
  gilts_feed_quantity_yearly: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
  gilts_total_feed_yearly: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
  boars_feeding: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
  boars_special_feed: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
  boars_share_gestation_feed: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
  boars_share_lactation_feed: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
  boars_feed_quantity_yearly: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
  boars_total_feed_yearly: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
  piglet_feed_1: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
  piglet_feed_2: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
  piglet_feed_quantity_yearly: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
  piglet_total_feed_yearly: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
})

type SowFeedingFormValues = z.infer<typeof sowfeedingFormSchema>

interface SowFeedingFormProps {
  farmData: SowFeedingFormValues | undefined
}

export function SowFeedingPage({ farmData }: SowFeedingFormProps) {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const { data, error, isLoading } = useFarmData("/feedsows", general_id)

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
  const { mutate } = useFarmData("/feedsows", farmData?.general_id?.toString())
  const form = useForm<SowFeedingFormValues>({
    resolver: zodResolver(sowfeedingFormSchema),
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

  async function onSubmit(data: SowFeedingFormValues) {
    try {
      const mergedData = {
        ...farmData, // overwrite the farmData with the new data
        ...data,
      }
      await mutate(put(`/feedsows/${farmData?.general_id}`, mergedData), {
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
  /*const sowfeeding =['Gestation Feed', 'Lactation Feed', 'Total Amount of Feed per animal and day', 'Total Amount of Feed kg and year'];
  const sowfeedingTypes = [''];

  const giltsfeeding = ['Share of Gestation Feed','Share of Lactation Feed', 'Feed Quantity (in terms of dry matter)', 'Total Amount of Feed kg per year'];
  const specialfeeding = ['Special Gilt Feed']
  const giltsfeedingTypes = [''];

  const boarsfeeding = ['Special Boar Feed', 'Share of Gestation Feed','Share of Lactation Feed', 'Feed Quantity (in terms of dry matter)', 'Total Amount of Feed kg per year'];
  const boarsfeedingTypes = [''];

  const pigletsfeeding = ['Piglet Feed 1', 'Piglet Feed 2', 'Total Amount of Feed kg per year'];
  const pigletsfeedingTypes = [''];*/

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Sow Feeding</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
          <div><h3>Sows</h3></div>
          <FormField
            control={form.control}
            name="sows_gestation_feed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gestation Feed</FormLabel>
                <FormDescription>kg per animal and year</FormDescription>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sows_lactation_feed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lactation Feed</FormLabel>
                <FormDescription>kg per animal and year</FormDescription>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sows_total_feed_daily"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Amount of Feed per animal and day</FormLabel>
                <FormDescription>kg per animal and day</FormDescription>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sows_total_feed_yearly"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Amount of Feed kg and year</FormLabel>
                <FormDescription>kg per animal and year</FormDescription>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div><h3>Gilts</h3></div>
          <FormField
            control={form.control}
            name="gilts_special_feed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Gilt Feed</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your Gilt Feed" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="specialgiltfeed">Special Gilt Feed</SelectItem>
                    <SelectItem value="giltsmixgestationlactationfeed">A mix of Gestation and Lactation Feed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gilts_share_gestation_feed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Share Gestation Feed</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gilts_share_lactation_feed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Share Lactation Feed</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gilts_feed_quantity_yearly"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feed Quantity (in terms of dry matter)</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gilts_total_feed_yearly"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Amount of Feed kg per year</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div><h3>Boars</h3></div>
          <FormField
            control={form.control}
            name="boars_special_feed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Boar Feed</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your Boar Feed" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="specialboarfeed">Special Boar Feed</SelectItem>
                    <SelectItem value="boarmixgestationlactationfeed">A mix of Gestation and Lactation Feed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="boars_share_gestation_feed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Share of Gestation Feed</FormLabel>
                <FormDescription>%</FormDescription>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="boars_share_lactation_feed"
            render={({ field }) => (
              <FormItem>
                <FormDescription>Share Lactation Feed</FormDescription>
                <FormLabel>%</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="boars_feed_quantity_yearly"
            render={({ field }) => (
              <FormItem>
                <FormDescription>Feed Quantity (in terms of dry matter)</FormDescription>
                <FormLabel>Feed Quantity (in terms of dry matter)</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="boars_total_feed_yearly"
            render={({ field }) => (
              <FormItem>
                <FormDescription>Total Amount of Feed kg per year</FormDescription>
                <FormLabel>Total Amount of Feed kg per year</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div><h3>Piglets</h3></div>
          <FormField
            control={form.control}
            name="piglet_feed_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Piglet Feed 1</FormLabel>
                <FormDescription>kg per animal</FormDescription>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="piglet_feed_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Piglet Feed 2</FormLabel>
                <FormDescription>kg per animal</FormDescription>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="piglet_feed_quantity_yearly"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feed Quantity (in terms of dry matter)</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="piglet_total_feed_yearly"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Amount of Feed</FormLabel>
                <FormDescription>kg per year</FormDescription>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <Button className="mt-4" type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default SowFeedingPage