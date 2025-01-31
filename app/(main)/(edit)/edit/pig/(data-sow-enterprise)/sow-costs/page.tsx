"use client"

import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { upsert, del } from "@/lib/api"
import { v4 as uuidv4 } from "uuid"
import { useFarmData } from "@/hooks/use-farm-data"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
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


const sowcostFormSchema = z.object({
  id: z.string().uuid(),
  general_id: z.string().uuid(),
  var_cost_id: z.string().uuid(),
  fix_cost_id: z.string().uuid(),
  verterinary_medicine_supplies: z
    .number({
      required_error: "Please enter a number.",
    }),
  artificial_insemination: z
    .number({
      required_error: "Please enter a number.",
    }),
  pregnancy_check: z
    .number({
      required_error: "Please enter a number.",
    }),
  disinfection: z
    .number({
      required_error: "Please enter a number.",
    }),
  energy: z
    .number({
      required_error: "Please enter a number.",
    }),
  water: z
    .number({
      required_error: "Please enter a number.",
    }),
  manure_costs: z
    .number({
      required_error: "Please enter a number.",
    }),
  transport_costs: z
    .number({
      required_error: "Please enter a number.",
    }),
  specialised_advisors: z
    .number({
      required_error: "Please enter a number.",
    }),
  animal_disease_levy: z
    .number({
      required_error: "Please enter a number.",
    }),
  carcass_disposal: z
    .number({
      required_error: "Please enter a number.",
    }),
  sow_planner: z
    .number({
      required_error: "Please enter a number.",
    }),
  maintenance: z
    .number({
      required_error: "Please enter a number.",
    }),
  feed_grinding_preparation: z
    .number({
      required_error: "Please enter a number.",
    }),
  insurance: z
    .number({
      required_error: "Please enter a number.",
    }),
  cleaning: z
    .number({
      required_error: "Please enter a number.",
    }),
  others: z.number(),
  year: z.number().int(),
})

type SowCostFormValues = z.infer<typeof sowcostFormSchema>

// eslint-disable-next-line @typescript-eslint/no-explicit-any


function createDefaults(general_id: string): SowCostFormValues {
  return {
    id: uuidv4(),
    general_id: general_id,
    var_cost_id: uuidv4(),
    fix_cost_id: uuidv4(),
    verterinary_medicine_supplies: 0,
    artificial_insemination: 0,
    pregnancy_check: 0,
    disinfection: 0,
    energy: 0,
    water: 0,
    manure_costs: 0,
    transport_costs: 0,
    specialised_advisors: 0,
    animal_disease_levy: 0,
    carcass_disposal: 0,
    sow_planner: 0,
    maintenance: 0,
    feed_grinding_preparation: 0,
    insurance: 0,
    cleaning: 0,
    others: 0,
    year: new Date().getFullYear(),
  }
}

export function SowCostPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/variablecostssows", general_id)
  const {
    data: fixcosts,
    error: fixcosts_error,
    isLoading: fixcosts_isLoading,
    mutate: fixcosts_mutate
  } = useFarmData("/fixcosts", general_id)

  const farmData = data ? data[0] : null
  const fixcostsData = fixcosts ? fixcosts[0] : null

  console.log(farmData)
  const form = useForm<SowCostFormValues>({
    resolver: zodResolver(sowcostFormSchema),
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

  async function onSubmit(data: SowCostFormValues) {
    try {
      const mergedData = {
        ...farmData, // overwrite the farmData with the new data
        ...data,     //neuen Daten aus Formular; general_id und id wird nicht überschrieben
      }
      console.log(mergedData)
      await mutate(upsert(`/variablecostssows`, mergedData), {
        optimisticData: mergedData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: true
      })
      await fixcosts_mutate(upsert(`/fixcosts`, mergedData), {
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

  /*const varcosts = ['Veterenary Medicine & Supplies', 'Artificial Insemination Costs', 'Pregnancy Check', 'Disinfection', 'Energy', 'Water', 'Manure Costs', 'Transport Costs', 'Specialised Advisor', 'Animal Disease Levy', 'Carcass Disposal', 'Sow Planner', 'Maintenance' ]
  const varcostTypes = [''];

  const overheadcost = ['Feed Mixing & Preparation', 'Insurance', 'Cleaning']
  const overheadcostTypes = [''];*/


  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Sow Costs</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div>
            <h3 className="text-lg font-medium">Variable Costs</h3>
          </div>
          <FormField
            control={form.control}
            name="verterinary_medicine_supplies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Veterinary and Medicine Supplies</FormLabel>
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
            name="artificial_insemination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Artificial Insemination Costs</FormLabel>
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
            name="pregnancy_check"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pregnancy Check</FormLabel>
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
            name="disinfection"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disinfection</FormLabel>
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
            name="energy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Energy</FormLabel>
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
            name="water"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Water</FormLabel>
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
            name="manure_costs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manure Costs</FormLabel>
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
            name="transport_costs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transport Costs</FormLabel>
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
            name="specialised_advisors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialised Advisors</FormLabel>
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
            name="animal_disease_levy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Animal Disease Levy</FormLabel>
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
            name="carcass_disposal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carcass Disposal</FormLabel>
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
            name="sow_planner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sow Planner</FormLabel>
                <FormDescription>Cost per head</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <h3 className="text-lg font-medium">Overhead Costs</h3>
          </div>
          <FormField
            control={form.control}
            name="maintenance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maintenance</FormLabel>
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
            name="feed_grinding_preparation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feed Grinding & Preparation</FormLabel>
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
            name="insurance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insurance</FormLabel>
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
            name="cleaning"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cleaning</FormLabel>
                <FormDescription>Cost per head</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  )
}

export default SowCostPage;