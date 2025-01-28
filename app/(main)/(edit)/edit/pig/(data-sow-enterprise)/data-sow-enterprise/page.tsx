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

const sowdataFormSchema = z.object({
  id: z.string().uuid(),
  general_id: z.string().uuid(),
  productionsystem: z
    .string({
      required_error: "Please select a production system.",
    }),
  production_rhythm: z
    .string({
      required_error: "Please select a production rhythm.",
    }),
  no_sows_mated_gilts: z
    .number({
      required_error: "Please enter Number of Sows and Mated Gilts.",
    }),
  no_unserved_gilts: z
    .number({
      required_error: "Please enter Number of Unserved Gilts.",
    }),
  no_boars: z
    .number({
      required_error: "Please enter Number of Boars.",
    }),
  total_no_sows_gilts: z
    .number({
      required_error: "Please enter Total Number of Sows and Gilts.",
    }),
  piglets_born_alive: z
    .number({
      required_error: "Please enter Piglets born Alive.",
    }),
  cycles_per_sow_year: z
    .number({
      required_error: "Please enter Cycles born per sow and year.",
    }),
  avg_gestation_period: z
    .number({
      required_error: "Please enter Average time of gestation period.",
    }),
  duration_suckling_per_farrowing: z
    .number({
      required_error: "Please enter Duration of Suckling.",
    }),
  dry_sow_days: z
    .number({
      required_error: "Please enter Number of Dry Sow Days.",
    }),
  rate_insuccessful_insemination: z
    .number({
      required_error: "Please enter Rate in Successful Insemination.",
    }),
  weaning_weights: z
    .number({
      required_error: "Please enter the Weaning Weight.",
    }),
  cull_rate_sows: z
    .number({
      required_error: "Please enter the Cull Rate of Sows.",
    }),
  cull_rate_boars: z
    .number({
      required_error: "Please enter the Cull Rate of Boars.",
    }),
  fraction_own_replacement: z
    .number({
      required_error: "Please enter the Fraction of Own Replacement.",
    }),
  annual_sow_mortality: z
    .number({
      required_error: "Please enter the Annual Sow Mortality.",
    }),
  annual_boar_mortality: z
    .number({
      required_error: "Please enter the Annual Boar Mortality.",
    }),
  piglet_mortality_weaning: z
    .number({
      required_error: "Please enter the Piglet Mortality Weaning.",
    }),
  piglet_mortality_rearing: z
    .number({
      required_error: "Please enter the Piglet Mortality Rearing.",
    }),
  piglets_weaned: z
    .number({
      required_error: "Please enter the Piglets Weaned.",
    }),
  avg_duration_piglet_rearing: z
    .number({
      required_error: "Please enter the Average Piglet Rearing.",
    }),
  reared_piglets: z
    .number({
      required_error: "Please enter the amount of Reared Piglets.",
    }),
  sales_weight_sows: z
    .number({
      required_error: "Please enter the Sales Weight of Sows.",
    }),
  sales_weight_boars: z
    .number({
      required_error: "Please enter the Sales Weight of Boars.",
    }),
  sales_weight_weaning_piglets: z
    .number({
      required_error: "Please enter the Sales Weight of Weaning Piglets.",
    }),
  sales_weight_rearing_piglets: z
    .number({
      required_error: "Please enter the Sales Weight of Rearing Piglets.",
    }),
})

type SowDataFormValues = z.infer<typeof sowdataFormSchema>

interface SowDataProps {
  farmData: SowDataFormValues | undefined
}

export function SowDataPage({ farmData }: SowDataProps) {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const { data, error, isLoading } = useFarmData("/sows", general_id)
  const { data: salesweight, error: salesweight_error, isLoading: salesweight_isLoading } = useFarmData("/salesweight", general_id)
  const { data: sowsperformance, error: sowsperformance_error, isLoading: sowsperformance_isLoading } = useFarmData("/sowsperformance", general_id)

  if (!general_id) {
    return (
      <div className="p-4">
        <h2>No farm selected.</h2>
        <p>Select a farm from the dropdown menu to get started.</p>
      </div>
    )
  }

  if (isLoading || salesweight_isLoading || sowsperformance_isLoading) {
    return <div className="p-4">Loading farm data…</div>
  }
  if (error || salesweight_error || sowsperformance_error) {
    console.error(error)
    return <div className="p-4">Failed to load farm data.</div>
  }
  const { mutate } = useFarmData("/sows/salesweight/sowsperformance", farmData?.general_id?.toString())
  const { mutate: salesweight_mutate } = useFarmData("/salesweight", farmData?.general_id?.toString())
  const { mutate: sowsperformance_mutate } = useFarmData("/sowsperformance", farmData?.general_id?.toString())
  const form = useForm<SowDataFormValues>({
    resolver: zodResolver(sowdataFormSchema),
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

  async function onSubmit(data: SowDataFormValues) {
    try {
      const mergedData = {
        ...farmData, // overwrite the farmData with the new data
        ...data,
      }
      await mutate(put(`/sows/${farmData?.general_id}`, mergedData), {
        optimisticData: mergedData,
        rollbackOnError: true,
        populateCache: false,
        revalidate: false
      })
      await salesweight_mutate(put(`/salesweight/${farmData?.general_id}`, mergedData), {
        optimisticData: mergedData,
        rollbackOnError: true,
        populateCache: false,
        revalidate: false
      })
      await sowsperformance_mutate(put(`/sowsperformance/${farmData?.general_id}`, mergedData), {
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

  /*const livestock = ['Number of Sows and Mated Gilts', 'Number of Unserved Gilts', 'Number of Boars', 'Total Number of Sows and Gilts'];
  const livestockTypes = [''];

  const sowdata = ['Piglets born Alive', 'Cycles born per sow and year', 'Average time of gestation period', 
                  'Duration of Suckling', 'Number of Dry Sow Days', 'Rate in Successful Insemination', 
                  'Weaning Weight', 'Cull Rate Sows', 'Cull Rate Boars', 'Fraction of Own Replacement', 
                  'Annual Sow Moratlity', 'Annual Boar Mortality', 'Piglet Mortalitiy Weaning', 
                  'Piglet Mortality Rearing', 'Piglets Weaned', 'Average Piglet Rearing', 'Reared Piglets'];
  const sowdataTypes= [''];

  const salesweight = ['Sows', 'Boars', 'Weaning Piglets', 'Rearing Piglets'];
  const salesweightTypes = [''];*/


  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Livestock and Performance Data for Sow Enterprise</h3>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
          <FormField
            control={form.control}
            name="productionsystem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Production System</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your Sow Production Sytsem" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="systempigletsale">System Piglet Sale(ca.8kg)</SelectItem>
                    <SelectItem value="weanersales">Weaner Sales (approx.25-30kg)</SelectItem>
                    <SelectItem value="purepigletrearing">Pure Piglet Rearing</SelectItem>
                    <SelectItem value="closedsystem">Closed System</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="production_rhythm"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your Sow Production Rhythm" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1weekrhythm">1-Week Rhythm</SelectItem>
                    <SelectItem value="2weekrhythm">2-Week Rhythm</SelectItem>
                    <SelectItem value="3weekrhythm">3-Week Rhythm</SelectItem>
                    <SelectItem value="4weekrhythm">4-Week Rhythm</SelectItem>
                    <SelectItem value="nonrhythm">None or other Rhythm</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </form>
        <form className="my-2 w-full">
          <div>
            <h3 className="mt-6 font-medium">Performance</h3>
            <FormField
              control={form.control}
              name="no_sows_mated_gilts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Sows and Mated Gilts</FormLabel>
                  <FormDescription>Number of heads </FormDescription>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="no_unserved_gilts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Unserved Gilts</FormLabel>
                  <FormDescription>Number of heads </FormDescription>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="no_boars"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Boars</FormLabel>
                  <FormDescription>Number of heads </FormDescription>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="total_no_sows_gilts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Number of Sows and Gilts</FormLabel>
                  <FormDescription>Number of heads </FormDescription>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
        <form className="my-2">
          <div><h3 className="mt-6 font-medium">Livestock</h3>
          </div>
          <FormField
            control={form.control}
            name="piglets_born_alive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Piglets born Alive</FormLabel>
                <FormDescription>Number of heads </FormDescription>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cycles_per_sow_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cycles born per sow and year</FormLabel>
                <FormDescription>Number of heads </FormDescription>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avg_gestation_period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Average time of gestation period</FormLabel>
                <FormDescription>Days</FormDescription>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration_suckling_per_farrowing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration of Suckling</FormLabel>
                <FormDescription>Days </FormDescription>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dry_sow_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Dry Sow Days</FormLabel>
                <FormDescription>Days </FormDescription>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rate_insuccessful_insemination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate of insuccessful Insemination</FormLabel>
                <FormDescription>% </FormDescription>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weaning_weights"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weaning Weight</FormLabel>
                <FormDescription>kg </FormDescription>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cull_rate_sows"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cull Rate Sows</FormLabel>
                <FormDescription>% </FormDescription>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cull_rate_boars"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cull Rate Boars</FormLabel>
                <FormDescription>% </FormDescription>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fraction_own_replacement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fraction of Own Replacement</FormLabel>
                <FormDescription>% </FormDescription>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="annual_sow_mortality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Sow Mortality</FormLabel>
                <FormDescription>% </FormDescription>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="annual_boar_mortality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Boar Mortality</FormLabel>
                <FormDescription>% </FormDescription>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="piglet_mortality_weaning"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Piglet Mortality Weaning</FormLabel>
                <FormDescription>% </FormDescription>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="piglet_mortality_rearing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Piglet Mortality Rearing</FormLabel>
                <FormDescription>% </FormDescription>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="piglets_weaned"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Piglets Weaned</FormLabel>
                <FormDescription>Number of heads </FormDescription>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avg_duration_piglet_rearing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Average Piglet Rearing</FormLabel>
                <FormDescription>kg </FormDescription>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reared_piglets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reared Piglets</FormLabel>
                <FormDescription>Number of heads </FormDescription>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <h3 className="mt-6 font-medium">Sales Weight</h3>
            <FormField
              control={form.control}
              name="sales_weight_sows"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sows</FormLabel>
                  <FormDescription>kg CW per head </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sales_weight_boars"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Boars</FormLabel>
                  <FormDescription>kg CW per head </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sales_weight_weaning_piglets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weaning Piglets</FormLabel>
                  <FormDescription>kg CW per head </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sales_weight_rearing_piglets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rearing Piglets</FormLabel>
                  <FormDescription>kg CW per head </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>


          <Button className="mt-4" type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default SowDataPage