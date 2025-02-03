"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const finishingpriceFormSchema = z.object({
  id: z.string().uuid(),
  general_id: z.string().uuid(),
  prices_fin_id: z.string().uuid(),
  buying_f_castpiglets: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  buying_piglets_for_finishing: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  selling_finishing_pigs_gi_ba: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  selling_finishing_pigs_em_ic: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  year: z.number(),
})

type FinishingPriceFormValues = z.infer<typeof finishingpriceFormSchema>

function createDefaults(general_id: string): FinishingPriceFormValues {
  return {
    id: uuidv4(),
    general_id: general_id,
    prices_fin_id: uuidv4(),
    buying_f_castpiglets: 0,
    buying_piglets_for_finishing: 0,
    selling_finishing_pigs_gi_ba: 0,
    selling_finishing_pigs_em_ic: 0,
    year: new Date().getFullYear(),
  }
}

function mergeData(data: Array<object>, general_id: string): FinishingPriceFormValues {
  if (data) {
    // @ts-expect-error zod types are not correct
    return {
      ...data[0],
    }
  }
  return createDefaults(general_id)
}

export function FinishingPricePage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/pricesfinishing", general_id)

const farmData = mergeData(data, general_id)

  const form = useForm<FinishingPriceFormValues>({
    resolver: zodResolver(finishingpriceFormSchema),
    defaultValues: {
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

async function onSubmit(updatedData: FinishingPriceFormValues) {
    try {
      const mergedData = {
        ...farmData, // overwrite the farmData with the new data
        ...updatedData,     //neuen Daten aus Formular; general_id und id wird nicht überschrieben
      }
      await mutate(upsert(`/pricesfinishing`,{
        ...mergedData,
        id: data?.[0]?.id || farmData.id
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
        <h3 className="text-lg font-medium">Pig Finishing Prices</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, error =>console.error(error))} className="space-y-2 w-full">
          <h3 className="space-y- mt-4 text-lg font-medium">Buying Prices</h3>
            <FormField
              control={form.control}
              name="buying_f_castpiglets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Female & Castrate Piglets</FormLabel>
                  <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>kg per LW</p>
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
              name="buying_piglets_for_finishing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Boars Piglets for Finishing</FormLabel>
                  <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>kg per LW</p>
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
          
          <h3 className="space-y- mt-6 text-lg font-medium">Selling Prices</h3>
            <FormField
              control={form.control}
              name="selling_finishing_pigs_gi_ba"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Finishing Pigs (Female & Castrates)
                  <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>kg per CW</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="selling_finishing_pigs_em_ic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Finishing Pigs (Boars)</FormLabel>
                  <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>kg per CW</p>
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

export default FinishingPricePage