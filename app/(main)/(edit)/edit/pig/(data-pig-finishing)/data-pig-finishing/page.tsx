"use client"

import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { upsert } from "@/lib/api"
import { v4 as uuidv4 } from "uuid"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useFarmData } from "@/hooks/use-farm-data"
import { Info } from "lucide-react"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const pigfinishingdataFormSchema = z.object({
  id: z.string().uuid(),
  general_id: z.string().uuid(),
  finishing_id: z.string().uuid(),
  performance_fin_id: z.string().uuid(),
  production_system: z
    .string({
      required_error: "Please select a production system.",
    }),
  production_cycle: z
    .string({
      required_error: "Please select a production rhythm.",
    }),
  animal_places: z
    .coerce.number().int(),
  no_sold_pigs_gi_ba: z
    .coerce.number().int(),
  no_sold_em_ic: z
    .coerce.number().int(),
  share_gi_pigs: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  stalling_in_weight: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  stalling_in_weight_em_ic_piglets: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  avg_duration_finishing_period: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  cleaning_days_cycle: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  days_without_animals_instable: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  mortality: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  avg_selling_weight_gi_ba: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  carcass_yield_gi_ba: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  index_points_autofom_gi_ba: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  lean_meat_from_gi_ba: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  avg_selling_weight_em_ic: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  carcass_yield_em_ic: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  index_points_autofom_em_ic: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  avg_duration_finishing_period_em_ic: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  year: z.number().int(),
})

type PigFinishingDataFormValues = z.infer<typeof pigfinishingdataFormSchema>

function createDefaults(general_id: string): PigFinishingDataFormValues {
  return {
    id: uuidv4(),
    general_id: general_id,
    finishing_id: uuidv4(),
    performance_fin_id: uuidv4(),
    production_system: "",
    production_cycle: "",
    animal_places: 0,
    no_sold_pigs_gi_ba: 0,
    no_sold_em_ic: 0,
    share_gi_pigs: 0,
    stalling_in_weight: 0,
    stalling_in_weight_em_ic_piglets: 0,
    avg_duration_finishing_period: 0,
    cleaning_days_cycle: 0,
    days_without_animals_instable: 0,
    mortality: 0,
    avg_selling_weight_gi_ba: 0,
    carcass_yield_gi_ba: 0,
    index_points_autofom_gi_ba: 0,
    lean_meat_from_gi_ba: 0,
    avg_selling_weight_em_ic: 0,
    carcass_yield_em_ic: 0,
    index_points_autofom_em_ic: 0,
    avg_duration_finishing_period_em_ic: 0,
    year: new Date().getFullYear(),
  }
}

function mergeData(data: Array<object>, performanceData: Array<object>, general_id: string): PigFinishingDataFormValues {
  if (data && performanceData) {
    // @ts-expect-error zod types are not correct
    return {
      ...data[0],
      ...performanceData[0],
    }
  }
  return createDefaults(general_id)
}

export function PigFinishingDataPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/pigfinishing", general_id)

  const {
    data: performancepigfinishing,
    error: performancepigfinishing_error,
    isLoading: performancepigfinishing_isLoading
  } = useFarmData("/performancepigfinishing", general_id)
  const farmData = mergeData(data, performancepigfinishing, general_id)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, performancepigfinishing_isLoading])

  async function onSubmit(updatedData: PigFinishingDataFormValues) {
    try {
      const mergedData = {
        ...farmData, // overwrite the farmData with the new data
        ...updatedData,     //neuen Daten aus Formular; general_id und id wird nicht überschrieben
      }
      await mutate(upsert(`/pigfinishing`, {
        ...mergedData,
        id: data?.[0]?.id || farmData.id
      }), {
        optimisticData: mergedData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: true
      })
      await mutate(upsert(`/performancepigfinishing`, {
        ...mergedData,
        id: performancepigfinishing?.[0]?.id || farmData.id
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
  if (isLoading || performancepigfinishing_isLoading) {
    return <div className="p-4">Loading farm data…</div>
  }
  if ((error && error.status !== 404) || (performancepigfinishing_error && performancepigfinishing_error.status !== 404)) {
    console.error(error)
    return <div className="p-4">Failed to load farm data.</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Livestock and Performance Data for Pig Finishing Enterprise</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, error => console.error(error))} className="space-y-2 w-full">
          <FormField
            control={form.control}
            name="production_system"
            render={({ field: p }) => (
              <FormItem key={p.value}>
                <FormLabel>Production System</FormLabel>
                <Select onValueChange={p.onChange} defaultValue={p.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your Pig Finishing Production Sytsem" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="normal pig finishing">Normal Pig Finishing</SelectItem>
                    <SelectItem value="additional boar finishing">Additional Boar Finishing</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="production_cycle"
            render={({ field: c }) => (
              <FormItem key={c.value}>
                <Select onValueChange={c.onChange} defaultValue={c.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your Sow Production Rhythm" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all-in all-out by barn">All-In-All-Out by Barn</SelectItem>
                    <SelectItem value="all-in all-out by sections">All-In-All-Out by Sections</SelectItem>
                    <SelectItem value="continuous system">Continuous System</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <h3 className="text-lg font-medium">Livestock</h3>
          </div>
          <FormField
            control={form.control}
            name="animal_places"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Animal Places</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>Number of heads</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                <FormControl>
                  <Input type="number" {...field} value={field.value}/>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>Number of heads</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>Number of heads</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>%, e.g. 12,34% is 0,1234</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>kg LW per head</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>kg LW per head</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>days</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>days</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="days_without_animals_instable"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Days without Animals in Stable</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>days</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>%, e.g. 12,34% is 0,1234</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>kg LW per head</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>%, e.g. 12,34% is 0,1234</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>%, e.g. 12,34% is 0,1234</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>%, e.g. 12,34% is 0,1234</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>kg LW per head</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>%, e.g. 12,34% is 0,1234</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>points</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>days</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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

export default PigFinishingDataPage