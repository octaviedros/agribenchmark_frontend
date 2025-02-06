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
import { Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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

const finishingfeedingFormSchema = z.object({
  id: z.string().uuid(),
  general_id: z.string().uuid(),
  feed_fin_id: z.string().uuid(),
  proportion_finishing_feed_1: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  proportion_finishing_feed_2: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  proportion_finishing_feed_3: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  amount_finishing_feed_1: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  amount_finishing_feed_2: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  amount_finishing_feed_3: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  total_amount_feed: z
    .coerce.number({
      required_error: "Please enter a number.",
    }),
  year: z.number().int(),
})

type FinishingFeedingFormValues = z.infer<typeof finishingfeedingFormSchema>

// eslint-disable-next-line @typescript-eslint/no-explicit-any


function createDefaults(general_id: string): FinishingFeedingFormValues {
  return {
    id: uuidv4(),
    general_id: general_id,
    feed_fin_id: uuidv4(),
    proportion_finishing_feed_1: 0,
    proportion_finishing_feed_2: 0,
    proportion_finishing_feed_3: 0,
    amount_finishing_feed_1: 0,
    amount_finishing_feed_2: 0,
    amount_finishing_feed_3: 0,
    total_amount_feed: 0,
    year: new Date().getFullYear(),
  }
}

function mergeData(data: Array<object>, general_id: string): FinishingFeedingFormValues {
  if (data) {
    // @ts-expect-error zod types are not correct
    return {
      ...data[0],
    }
  }
  return createDefaults(general_id)
}

export default function FinishingFeedingPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/feedingfinishing", general_id)

  const farmData = mergeData(data, general_id)


  const form = useForm<FinishingFeedingFormValues>({
    resolver: zodResolver(finishingfeedingFormSchema),
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
  }, [isLoading])
  async function onSubmit(updatedData: FinishingFeedingFormValues) {
    try {
      const mergedData = {
        ...farmData, // overwrite the farmData with the new data
        ...updatedData,     //neuen Daten aus Formular; general_id und id wird nicht überschrieben
      }

      await mutate(upsert(`/feedingfinishing`, {
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
        <form onSubmit={form.handleSubmit(onSubmit, error => console.error(error))} className="space-y- w-full">
          <div>
            <h3 className="text-lg font-medium">Proportion of Finishing Period</h3></div>
          <FormField
            control={form.control}
            name="proportion_finishing_feed_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finishing Feed 1</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                    <TooltipContent>
                      <p>%</p>
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
            name="proportion_finishing_feed_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finishing Feed 2</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                    <TooltipContent>
                      <p>%</p>
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
            name="proportion_finishing_feed_3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finishing Feed 3</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                    <TooltipContent>
                      <p>%</p>
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
            <h3 className="space-y- mt-6 text-lg font-medium">Amount of Feed</h3>
            <FormField
              control={form.control}
              name="amount_finishing_feed_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Finishing Feed 3</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                      <TooltipContent>
                        <p>%</p>
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
              name="amount_finishing_feed_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Finishing Feed 2</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                      <TooltipContent>
                        <p>%</p>
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
              name="amount_finishing_feed_3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Finishing Feed 3</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                      <TooltipContent>
                        <p>%</p>
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
              name="total_amount_feed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount of Feed</FormLabel>                
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                      <TooltipContent>
                        <p>kg per xear</p>
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
          </div>
          <Button className="mt-4" type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}