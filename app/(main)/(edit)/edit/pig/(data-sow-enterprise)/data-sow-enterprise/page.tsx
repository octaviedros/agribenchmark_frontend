"use client"

import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { upsert } from "@/lib/api"
import { v4 as uuidv4 } from "uuid"
import { useFarmData } from "@/hooks/use-farm-data"
import { useEffect } from "react"
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
  sows_id: z.string().uuid(),
  sales_weight_id: z.string().uuid(),
  sows_performance_id: z.string().uuid(),
  productionsystem: z
    .string({
      required_error: "Please select a production system.",
    }),
  production_rhythm: z
    .string({
      required_error: "Please select a production rhythm.",
    }),
  no_sows_mated_gilts: z
    .coerce.number().int(),
  no_unserved_gilts: z
    .coerce.number().int(),
  no_boars: z
    .coerce.number().int(),
  total_no_sows_gilts: z
    .coerce.number().int(),
  piglets_born_alive: z
    .coerce.number().int(),
  cycles_per_sow_year: z
    .coerce.number().int(),
  avg_gestation_period: z
    .coerce.number({
      required_error: "Please enter Average time of gestation period.",
    }),
  duration_suckling_per_farrowing: z
    .coerce.number({
      required_error: "Please enter Duration of Suckling.",
    }),
  dry_sow_days: z
    .coerce.number().int(),
  rate_insuccesful_insemination: z
    .coerce.number({
      required_error: "Please enter Rate in Successful Insemination.",
    }),
  weaning_weights: z
    .coerce.number({
      required_error: "Please enter the Weaning Weight.",
    }),
  cull_rate_sows: z
    .coerce.number({
      required_error: "Please enter the Cull Rate of Sows.",
    }),
  cull_rate_boars: z
    .coerce.number({
      required_error: "Please enter the Cull Rate of Boars.",
    }),
  fraction_own_replacement: z
    .coerce.number({
      required_error: "Please enter the Fraction of Own Replacement.",
    }),
  annual_sow_mortality: z
    .coerce.number({
      required_error: "Please enter the Annual Sow Mortality.",
    }),
  annual_boar_mortality: z
    .coerce.number({
      required_error: "Please enter the Annual Boar Mortality.",
    }),
  piglet_mortality_weaning: z
    .coerce.number({
      required_error: "Please enter the Piglet Mortality Weaning.",
    }),
  piglet_mortality_rearing: z
    .coerce.number({
      required_error: "Please enter the Piglet Mortality Rearing.",
    }),
  piglets_weaned: z
    .coerce.number({
      required_error: "Please enter the Piglets Weaned.",
    }),
  avg_duration_piglet_rearing: z
    .coerce.number({
      required_error: "Please enter the Average Piglet Rearing.",
    }),
  reared_piglets: z
    .coerce.number({
      required_error: "Please enter the amount of Reared Piglets.",
    }),
  sales_weight_sows: z
    .coerce.number({
      required_error: "Please enter the Sales Weight of Sows.",
    }),
  sales_weight_boars: z
    .coerce.number({
      required_error: "Please enter the Sales Weight of Boars.",
    }),
  sales_weight_weaning_piglet: z
    .coerce.number({
      required_error: "Please enter the Sales Weight of Weaning Piglets.",
    }),
  sales_weight_rearing_piglet: z
    .coerce.number({
      required_error: "Please enter the Sales Weight of Rearing Piglets.",
    }),
  year: z.number().int(),
})

type SowDataFormValues = z.infer<typeof sowdataFormSchema>

// eslint-disable-next-line @typescript-eslint/no-explicit-any


function createDefaults(general_id: string): SowDataFormValues {
  return {
    id: uuidv4(),
    sows_id: uuidv4(),
    sales_weight_id: uuidv4(),
    sows_performance_id: uuidv4(),
    general_id: general_id,
    productionsystem: "",
    production_rhythm: "",
    no_sows_mated_gilts: 0,
    no_unserved_gilts: 0,
    no_boars: 0,
    total_no_sows_gilts: 0,
    piglets_born_alive: 0,
    cycles_per_sow_year: 0,
    avg_gestation_period: 0,
    duration_suckling_per_farrowing: 0,
    dry_sow_days: 0,
    rate_insuccesful_insemination: 0,
    weaning_weights: 0,
    cull_rate_sows: 0,
    cull_rate_boars: 0,
    fraction_own_replacement: 0,
    annual_sow_mortality: 0,
    annual_boar_mortality: 0,
    piglet_mortality_weaning: 0,
    piglet_mortality_rearing: 0,
    piglets_weaned: 0,
    avg_duration_piglet_rearing: 0,
    reared_piglets: 0,
    sales_weight_sows: 0,
    sales_weight_boars: 0,
    sales_weight_weaning_piglet: 0,
    sales_weight_rearing_piglet: 0,
    year: new Date().getFullYear(),
  }
}

function mergeData(data: Array<object>, performanceData: Array<object>, weightData: Array<object>, general_id: string): SowDataFormValues {
  if (data && performanceData && weightData) {
    // @ts-expect-error zod types are not correct
    return {
      ...data[0],
      ...weightData[0],
      ...performanceData[0],
    }
  }
  return createDefaults(general_id)
}
export function SowDataPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/sows", general_id)

  const {
    data: salesweight,
    error: salesweight_error,
    isLoading: salesweight_isLoading,
    mutate: salesweight_mutate
  } = useFarmData("/salesweight", general_id)

  const {
    data: sowsperformance,
    error: sowsperformance_error,
    isLoading: sowsperformance_isLoading,
    mutate: sowsperformance_mutate
  } = useFarmData("/sowsperformance", general_id)
  const farmData = mergeData(data, salesweight, sowsperformance, general_id)

  /*const farmData = data ? data[0] : null
  const salesweightData = salesweight ? salesweight[0] : null
  const sowsperformanceData = sowsperformance ? sowsperformance[0] : null*/

  //console.log(farmData)

  const form = useForm<SowDataFormValues>({
    resolver: zodResolver(sowdataFormSchema),
    defaultValues: {
      //...createDefaults(general_id),
      ...farmData
    },
    mode: "onChange",
  })

  useEffect(() => {
    form.reset({
      ...farmData
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, salesweight_isLoading, sowsperformance_isLoading])

  async function onSubmit(updatedData: SowDataFormValues) {
    try {
      const mergedData = {
        ...farmData, // overwrite the farmData with the new data
        ...updatedData,     //neuen Daten aus Formular; general_id und id wird nicht überschrieben
      }
      //console.log(mergedData)
      await mutate(upsert(`/sows`, {
        ...mergedData,
        id: data?.[0]?.id || farmData.id
      }), {
        optimisticData: mergedData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: true
      })
      await salesweight_mutate(upsert(`/salesweight`, {
        ...mergedData,
        id: salesweight?.[0]?.id || farmData.id
      }), {
        optimisticData: mergedData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: true
      })
      await sowsperformance_mutate(upsert(`/sowsperformance`, {
        ...mergedData,
        id: sowsperformance?.[0]?.id || farmData.id
      }), {
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
  if (isLoading || salesweight_isLoading || sowsperformance_isLoading) {
    return <div className="p-4">Loading farm data…</div>
  }
  if ((error && error.status !== 404) || (salesweight_error && salesweight_error.status !== 404) || (sowsperformance_error && sowsperformance_error.status !== 404)) {
    console.error(error)
    return <div className="p-4">Failed to load farm data.</div>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Livestock and Performance Data for Sow Enterprise</h3>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, error => console.error(error))} className="space-y-2 w-full">
          <FormField
            control={form.control}
            name="productionsystem"
            render={({ field: p }) => (
              <FormItem key={p.value}>
                <FormLabel>Production System</FormLabel>
                <Select onValueChange={p.onChange} defaultValue={p.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your Sow Production Sytsem" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="system piglet sales (approx. 8kg)">System Piglet Sale(ca.8kg)</SelectItem>
                    <SelectItem value="weaner sales (approx. 25-30kg)">Weaner Sales (approx.25-30kg)</SelectItem>
                    <SelectItem value="pure piglet rearing">Pure Piglet Rearing</SelectItem>
                    <SelectItem value="closed system">Closed System</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="production_rhythm"
            render={({ field: c }) => (
              <FormItem key={c.value}>
                <Select onValueChange={c.onChange} defaultValue={c.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your Sow Production Rhythm" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1-week rhythm">1-Week Rhythm</SelectItem>
                    <SelectItem value="2-week rhythm">2-Week Rhythm</SelectItem>
                    <SelectItem value="3-week-rhythm">3-Week Rhythm</SelectItem>
                    <SelectItem value="4-week-rhythm">4-Week Rhythm</SelectItem>
                    <SelectItem value="non or other rhythm">None or other Rhythm</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />


          <div className="my-2 w-full">
            <h3 className="text-lg font-medium">Performance</h3>
          </div>
            <FormField
              control={form.control}
              name="no_sows_mated_gilts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Sows and Mated Gilts</FormLabel>
                  <FormDescription>Number of heads </FormDescription>
                  <FormControl>
                    <Input type="number" {...field} value={field.value as number}/>
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
          <div>
          <h3 className="text-lg mt-6 font-medium">Livestock</h3></div>
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
              name="rate_insuccesful_insemination"
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
            <h3 className="mt-6 text-lg font-medium">Sales Weight</h3></div>
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
              name="sales_weight_weaning_piglet"
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
              name="sales_weight_rearing_piglet"
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
          <Button className="mt-4" type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default SowDataPage