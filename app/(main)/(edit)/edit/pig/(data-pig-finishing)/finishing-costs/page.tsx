"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useFarmData } from "@/hooks/use-farm-data"
import { toast } from "@/hooks/use-toast"
import { upsert } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { Info } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const finishingcostFormSchema = z.object({
  id: z.string().uuid(),
  general_id: z.string().uuid(),
  var_cost_fin_id: z.string().uuid(),
  fix_cost_id: z.string().uuid(),
  veterinary_medicine_supplies: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  disinfection: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  energy: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  water: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  manure_cost: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  transport_cost: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  specialised_pig_advisor: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  animal_disease_levy: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  carcass_disposal: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  maintenance: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  feed_grinding_preparation: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  insurance: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  cleaning: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  year: z.number().int(),
})

type FinishingCostFormValues = z.infer<typeof finishingcostFormSchema>

function createDefaults(general_id: string): FinishingCostFormValues {
  return {
    id: uuidv4(),
    general_id: general_id,
    var_cost_fin_id: uuidv4(),
    fix_cost_id: uuidv4(),
    veterinary_medicine_supplies: 0,
    disinfection: 0,
    energy: 0,
    water: 0,
    manure_cost: 0,
    transport_cost: 0,
    specialised_pig_advisor: 0,
    animal_disease_levy: 0,
    carcass_disposal: 0,
    maintenance: 0,
    feed_grinding_preparation: 0,
    insurance: 0,
    cleaning: 0,
    year: new Date().getFullYear(),
  }
}

function mergeData(data: Array<object>, fixData: Array<object>, general_id: string): FinishingCostFormValues {
  if (data && fixData) {
    // @ts-expect-error zod types are not correct
    return {
      ...data[0],
      ...fixData[0],
    }
  }
  return createDefaults(general_id)
}

export default function FinishingCostPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/varcostfinishing", general_id)

  const {
    data: fixcosts,
    error: fixcosts_error,
    isLoading: fixcosts_isLoading,
    mutate: fixcosts_mutate
  } = useFarmData("/fixcosts", general_id)
 
const farmData = mergeData(data, fixcosts, general_id)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, fixcosts_isLoading])
  async function onSubmit(updatedData: FinishingCostFormValues) {
    try {
      const mergedData = {
        ...farmData, // overwrite the farmData with the new data
        ...updatedData,     //neuen Daten aus Formular; general_id und id wird nicht überschrieben
      }

      await mutate(upsert(`/varcostfinishing/`, {
        ...mergedData,
        id: data?.[0]?.id || farmData.id
      }), {
        optimisticData: mergedData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: true
      })
      await fixcosts_mutate(upsert(`/fixcosts/`, {
        ...mergedData,
        id: fixcosts?.[0]?.id || farmData.id
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
  if (isLoading || fixcosts_isLoading) {
    return <div className="p-4">Loading farm data…</div>
  }
  if ((error && error.status !== 404) || (fixcosts_error && fixcosts_error.status !== 404)) {
    console.error(error)
    return <div className="p-4">Failed to load farm data.</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Sow Costs</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, error => console.error(error))} className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Variable Costs</h3></div>
            <FormDescription>All Costs accounted as Cost per Head</FormDescription>
          <FormField
            control={form.control}
            name="veterinary_medicine_supplies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Veterinary Medicine & Supplies</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>Cost per head</p>
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
            name="disinfection"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disinfection</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>Cost per head</p>
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
            name="energy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Energy</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>Cost per head</p>
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
            name="water"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Water</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>Cost per head</p>
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
            name="manure_cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manure Costs</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>Cost per head</p>
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
            name="transport_cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transport Costs</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>Cost per head</p>
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
            name="specialised_pig_advisor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialised Pig Advisors</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>Cost per head</p>
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
            name="animal_disease_levy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Animal Disease Levy</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>Cost per head</p>
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
            name="carcass_disposal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carcass Disposal</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>Cost per head</p>
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
            name="maintenance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maintenance</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>Cost per head</p>
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
            <h3 className="text-lg font-medium">Fixed Costs</h3></div>
          <FormField
            control={form.control}
            name="feed_grinding_preparation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feed Mixing & Preparation</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>Cost per enterprise</p>
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
            name="insurance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insurance</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>Cost per enterprise</p>
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
            name="cleaning"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cleaning</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>Cost per enterprise</p>
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}