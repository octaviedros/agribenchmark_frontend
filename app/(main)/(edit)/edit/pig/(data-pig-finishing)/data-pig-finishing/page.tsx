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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const pigfinishingdataFormSchema = z.object({
  id: z.string().uuid(),
  general_id: z.string().uuid(),
  production_system: z
    .string({
      required_error: "Please select a production system.",
    }),
  production_cycle: z
    .string({
      required_error: "Please select a production rhythm.",
    }),
  finishingdata: z
    .string({
      required_error: "Please enter Livestock data.",
    }),
  animal_places: z
    .number({
      required_error: "Please enter a number.",
    }),
  no_sold_pigs_gi_ba: z
    .number({
      required_error: "Please enter a number.",
    }),
  no_sold_em_ic: z
    .number({
      required_error: "Please enter a number.",
    }),
  share_gi_pigs: z
    .number({
      required_error: "Please enter a number.",
    }),
  stalling_in_weight: z
    .number({
      required_error: "Please enter a number.",
    }),
  stalling_in_weight_em_ic_piglets: z
    .number({
      required_error: "Please enter a number.",
    }),
  avg_duration_finishing_period: z
    .number({
      required_error: "Please enter a number.",
    }),
  cleaning_days_cycle: z
    .number({
      required_error: "Please enter a number.",
    }),
  days_without_animals_stable: z
    .number({
      required_error: "Please enter a number.",
    }),
  mortality: z
    .number({
      required_error: "Please enter a number.",
    }),
  avg_selling_weight_gi_ba: z
    .number({
      required_error: "Please enter a number.",
    }),
  carcass_yield_gi_ba: z
    .number({
      required_error: "Please enter a number.",
    }),
  index_points_autofom_gi_ba: z
    .number({
      required_error: "Please enter a number.",
    }),
  lean_meat_from_gi_ba: z
    .number({
      required_error: "Please enter a number.",
    }),
  avg_selling_weight_em_ic: z
    .number({
      required_error: "Please enter a number.",
    }),
  carcass_yield_em_ic: z
    .number({
      required_error: "Please enter a number.",
    }),
  index_points_autofom_em_ic: z
    .number({
      required_error: "Please enter a number.",
    }),
  avg_duration_finishing_period_em_ic: z
    .number({
      required_error: "Please enter a number.",
    }),
})

type PigFinishingDataFormValues = z.infer<typeof pigfinishingdataFormSchema>

interface PigFinishingDataProps {
  farmData: PigFinishingDataFormValues | undefined
}

export function PigFinishingDataPage({ farmData }: PigFinishingDataProps) {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const { data, error, isLoading } = useFarmData("/pigfinishing", general_id)
  const { data: performancepigfinishing, error: performancepigfinishing_error, isLoading: performancepigfinishing_isLoading } = useFarmData("/performancepigfinishing", general_id)

  if (!general_id) {
    return (
      <div className="p-4">
        <h2>No farm selected.</h2>
        <p>Select a farm from the dropdown menu to get started.</p>
      </div>
    )
  }

  if (isLoading || performancepigfinishing_isLoading) {
    return <div className="p-4">Loading farm data…</div>
  }
  if (error || performancepigfinishing_error) {
    console.error(error)
    return <div className="p-4">Failed to load farm data.</div>
  }
  const { mutate } = useFarmData("/pigfinishing", farmData?.general_id?.toString())
  const { mutate: performancepigfinishing_mutate } = useFarmData("/performancepigfinishing", farmData?.general_id?.toString())
  const form = useForm<PigFinishingDataFormValues>({
    resolver: zodResolver(pigfinishingdataFormSchema),
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

  async function onSubmit(data: PigFinishingDataFormValues) {
    try {
      const mergedData = {
        ...farmData, // overwrite the farmData with the new data
        ...data,
      }
      await mutate(put(`/pigfinishing/performancepigfinishing/${farmData?.general_id}`, mergedData), {
        optimisticData: mergedData,
        rollbackOnError: true,
        populateCache: false,
        revalidate: false
      })
      await performancepigfinishing_mutate(put(`/performancepigfinishing/${farmData?.general_id}`, mergedData), {
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

  /* const livestock = ['Animal Places', 'Number of sold Pigs(female & castrates', 'Number of sold Pigs(Boars)', 'Share of female Pigs'];
   const livestockTypes = [''];

   const finishingdata = ['Stalling-in-Weight', 'Stalling-in-Weight (Boars)', 'Average Duration of a finishing Period', 
                           'Cleaning days per Cycle', 'Days without Animals in Stable', 'Mortality', 'Average selling Weight (females & castrates)',
                           'Carcass yield (%) (female & castrates)', 'Lean Meat content (FOM) (female & castrates)', 'Average selling Weight (Boars)',
                           'Carcass yield (%) (Boars)', 'Index points (AutoFOM; Boars)', 'Average Duration of a finishing Period (Boars)'];
   const finishingdataTypes= [''];*/


  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Livestock and Performance Data for Pig Finishing Enterprise</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
          <FormField
            control={form.control}
            name="production_system"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Production System</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your Pig Finishing Production Sytsem" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="normalpigfinishing">Normal Pig Finishing</SelectItem>
                    <SelectItem value="boarfinishing">Additional Boar Finishing</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="production_cycle"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your Sow Production Rhythm" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="allinalloutbarn">All-In-All-Out by Barn</SelectItem>
                    <SelectItem value="allinalloutsections">All-In-All-Out by Sections</SelectItem>
                    <SelectItem value="continuoussystem">Continuous System</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <div>
            <h3 className="text-lg font-medium">Livestock</h3></div>
          <FormField
            control={form.control}
            name="animal_places"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Animal Places</FormLabel>
                <FormDescription>Number of heads</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="no_sold_pigs_gi_ba"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of sold Pigs (Female & Castrates)</FormLabel>
                <FormDescription>Number of heads</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="no_sold_em_ic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of sold Pigs (Boars)</FormLabel>
                <FormDescription>Number of heads</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="share_gi_pigs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Share of Female Pigs </FormLabel>
                <FormDescription>Percentage</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <h3 className="text-lg font-medium">Performance</h3></div>
          <FormField
            control={form.control}
            name="stalling_in_weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stalling-in-Weight</FormLabel>
                <FormDescription>kg LW per head</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stalling_in_weight_em_ic_piglets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stalling-in-Weight (Boars)</FormLabel>
                <FormDescription>kg LW per head</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avg_duration_finishing_period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Average Duration of a finishing Period</FormLabel>
                <FormDescription>days</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cleaning_days_cycle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cleaning days per Cycle</FormLabel>
                <FormDescription>days</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="days_without_animals_stable"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Days without Animals in Stable</FormLabel>
                <FormDescription>days</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mortality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mortality</FormLabel>
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
            name="avg_selling_weight_gi_ba"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Average selling Weight (Female & Castrates)</FormLabel>
                <FormDescription>kg LW per head</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="carcass_yield_gi_ba"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carcass yield (Female & Castrates)</FormLabel>
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
            name="lean_meat_from_gi_ba"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lean Meat Content (FOM, Female & Castrates)</FormLabel>
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
            name="index_points_autofom_gi_ba"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Index Points (AutoFOM, Female & Castrates)</FormLabel>
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
            name="avg_selling_weight_em_ic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Average selling Weight (Boars)</FormLabel>
                <FormDescription>kg LW per head</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="carcass_yield_em_ic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carcass yield (Boars)</FormLabel>
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
            name="index_points_autofom_em_ic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Index Points (AutoFOM, Boars)</FormLabel>
                <FormDescription>points</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avg_duration_finishing_period_em_ic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Average Duration of a finishing Period (Boars)</FormLabel>
                <FormDescription>days</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}

export default PigFinishingDataPage