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

const finishingcostFormSchema = z.object({
  general_id: z.number().nullable().optional(),
  veterinary_medicine_supplies: z
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
  manure_cost: z
  .number({
    required_error: "Please enter a number.",
  }),
  transport_cost: z
  .number({
    required_error: "Please enter a number.",
  }),
  specialised_pig_advisor: z
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
})

  type FinishingCostFormValues = z.infer<typeof finishingcostFormSchema>

  interface FinishingCostFormProps {
    farmData: FinishingCostFormValues | undefined
  }
  
  export function FinishingCostPage({ farmData }: FinishingCostFormProps) {
            const searchParams = useSearchParams()
            const general_id = searchParams.get("general_id") || ""
            const { data, error, isLoading } = useFarmData("/varcostfinishing/fixcosts" , general_id)
            
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
            const { mutate } = useFarmData("/varcostfinishing/fixcosts", farmData?.general_id?.toString())
              const form = useForm<FinishingCostFormValues>({
                resolver: zodResolver(finishingcostFormSchema),
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
          
            async function onSubmit(data: FinishingCostFormValues) {
                  try {
                    const mergedData = {
                      ...farmData, // overwrite the farmData with the new data
                      ...data,
                    }
                    await mutate(put(`/varcostfinishing/fixcosts/${farmData?.general_id}`, mergedData), {
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

    /*const varcosts = ['Veterenary Medicine & Supplies', 'Disinfection', 'Energy', 'Water', 'Manure Costs', 'Transport Costs', 'Specialised Pig Advisors',
                          'Animal Disease Levy', 'Carcass Disposal', 'Maintenance' ]
    const varcostTypes = [''];

    const fixedcost = ['Feed Mixing & Preparation', 'Insurance', 'Cleaning']
    const fixedcostTypes = [''];*/

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Sow Costs</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
          <h3 className="text-lg font-medium">Variable Costs</h3></div>
          <FormField
            control={form.control}
            name="veterinary_medicine_supplies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Veterinary Medicine & Supplies</FormLabel>
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
            name="manure_cost"
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
            name="transport_cost"
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
            name="specialised_pig_advisor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialised Pig Advisors</FormLabel>
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
          <div>
          <h3 className="text-lg font-medium">Fixed Costs</h3></div>
          <FormField
            control={form.control}
            name="feed_grinding_preparation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feed Mixing & Preparation</FormLabel>
                <FormDescription>Cost per enterprise</FormDescription>
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
                <FormDescription>Cost per enterprise</FormDescription>
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
                <FormDescription>Cost per enterprise</FormDescription>
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

export default FinishingCostPage;