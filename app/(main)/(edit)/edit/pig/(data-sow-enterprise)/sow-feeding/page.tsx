"use client"

import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Check, ChevronsUpDown } from "lucide-react"
import { z } from "zod"
import { upsert, del } from "@/lib/api"
import { v4 as uuidv4 } from "uuid"
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
  feed_id: z.string().uuid(),
  sow_id: z.string().uuid(),
  finishing_id: z.string().uuid(),
  sows_gestation_feed: z.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  sows_lactation_feed: z.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  sows_total_feed_daily: z.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  sows_total_feed_yearly: z.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  gilts_special_feed: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
  gilts_share_gestation_feed: z.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  gilts_share_lactation_feed: z.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  gilts_feed_quantity_yearly: z.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  gilts_total_feed_yearly: z.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  boars_special_feed: z.string().min(1, {
    message: "Must be at least 1 characters.",
  }),
  boars_share_gestation_feed: z.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  boars_share_lactation_feed: z.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  boars_feed_quantity_yearly: z.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  boars_total_feed_yearly: z.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  piglet_feed_1: z.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  piglet_feed_2: z.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  piglet_feed_quantity_yearly: z.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  piglet_total_feed_yearly: z.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  year: z.number().int(),
})

type SowFeedingFormValues = z.infer<typeof sowfeedingFormSchema>

// eslint-disable-next-line @typescript-eslint/no-explicit-any

function createDefaults(general_id: string): SowFeedingFormValues {
  return {
    id: uuidv4(),
    feed_id: uuidv4(),
    sow_id: uuidv4(),
    finishing_id: uuidv4(),
    general_id: general_id,
    sows_gestation_feed: 0,
    sows_lactation_feed: 0,
    sows_total_feed_daily: 0,
    sows_total_feed_yearly: 0,
    gilts_special_feed: "",
    gilts_share_gestation_feed: 0,
    gilts_share_lactation_feed: 0,
    gilts_feed_quantity_yearly: 0,
    gilts_total_feed_yearly: 0,
    boars_special_feed: "",
    boars_share_gestation_feed: 0,
    boars_share_lactation_feed: 0,
    boars_feed_quantity_yearly: 0,
    boars_total_feed_yearly: 0,
    piglet_feed_1: 0,
    piglet_feed_2: 0,
    piglet_feed_quantity_yearly: 0,
    piglet_total_feed_yearly: 0,
    year: new Date().getFullYear(),
  }
}

export function SowFeedingPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/feedsows", general_id)
  const farmData = data ? data[0] : null
  /*let farmData 
  if (data) { 
    farmData = data[0]
  }*/
  console.log(farmData)
  const form = useForm<SowFeedingFormValues>({
    resolver: zodResolver(sowfeedingFormSchema),
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
  async function onSubmit(data: SowFeedingFormValues) {
    try {
      const mergedData = {
        ...farmData, // overwrite the farmData with the new data
        ...data,     //neuen Daten aus Formular; general_id und id wird nicht überschrieben
      }
      console.log(mergedData)
      await mutate(upsert(`/feedsows`, mergedData), {
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
                    <SelectItem value="Special gilt feed">Special Gilt Feed</SelectItem>
                    <SelectItem value="Mix of gestation and lactation feed">A mix of Gestation and Lactation Feed</SelectItem>
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
                    <SelectItem value="Special boar feed">Special Boar Feed</SelectItem>
                    <SelectItem value="Mix of gestation and lactation feed">A mix of Gestation and Lactation Feed</SelectItem>
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