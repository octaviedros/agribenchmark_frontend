"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

const sowfeedingFormSchema = z.object({
  id: z.string().uuid(),
  general_id: z.string().uuid(),
  feed_id: z.string().uuid(),
  sow_id: z.string().uuid(),
  finishing_id: z.string().uuid(),
  sows_gestation_feed: z.coerce.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  sows_lactation_feed: z.coerce.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  sows_total_feed_daily: z.coerce.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  sows_total_feed_yearly: z.coerce.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  gilts_special_feed: z.string(),
  gilts_share_gestation_feed: z.coerce.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  gilts_share_lactation_feed: z.coerce.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  gilts_feed_quantity_yearly: z.coerce.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  gilts_total_feed_yearly: z.coerce.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  boars_special_feed: z.string(),
  boars_share_gestation_feed: z.coerce.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  boars_share_lactation_feed: z.coerce.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  boars_feed_quantity_yearly: z.coerce.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  boars_total_feed_yearly: z.coerce.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  piglet_feed_1: z.coerce.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  piglet_feed_2: z.coerce.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  piglet_feed_quantity_yearly: z.coerce.number().min(1, {
    message: "Must be at least 1 characters.",
  }),
  piglet_total_feed_yearly: z.coerce.number().min(1, {
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

function mergeData(data: Array<object>, general_id: string): SowFeedingFormValues {
  if (data) {
    // @ts-expect-error zod types are not correct
    return {
      ...data[0],
    }
  }
  return createDefaults(general_id)
}

export default function SowFeedingPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/feedsows", general_id)

  const farmData = mergeData(data, general_id)

  const form = useForm<SowFeedingFormValues>({
    resolver: zodResolver(sowfeedingFormSchema),
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

  async function onSubmit(updatedData: SowFeedingFormValues) {
    try {
      const mergedData = {
        ...farmData, // overwrite the farmData with the new data
        ...updatedData,     //neuen Daten aus Formular; general_id und id wird nicht überschrieben
      }

      await mutate(upsert(`/feedsows/`, {
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
        <h3 className="text-lg font-medium">Sow Feeding</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, error => console.error(error))} className="space-y-1 w-full">
          <div><h3 className="text-lg font-medium">Sows</h3></div>
          <FormField
            control={form.control}
            name="sows_gestation_feed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gestation Feed</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>kg per animal and year</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>kg per animal and year</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <FormLabel>Total Amount of Feed</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>kg per animal and year</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <FormLabel>Total Amount of Feed</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>kg per animal and year</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div><h3 className="pt-2 text-lg font-medium">Gilts</h3></div>
          <FormField
            control={form.control}
            name="gilts_special_feed"
            render={({ field: p }) => (
              <FormItem key={p.value}>
                <FormLabel>Special Gilt Feed</FormLabel>
                <Select onValueChange={p.onChange} defaultValue={p.value}>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>%, e.g. 12,34% is 0,1234</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>%, e.g. 12,34% is 0,1234</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <FormLabel>Feed Quantity (in terms of fresh matter)</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>kg per animal and year</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <FormLabel>Total Amount of Feed</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>kg per animal and year</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div><h3 className="pt-2 text-lg font-medium">Boars</h3></div>
          <FormField
            control={form.control}
            name="boars_special_feed"
            render={({ field: c }) => (
              <FormItem key={c.value}>
                <FormLabel>Special Boar Feed</FormLabel>
                <Select onValueChange={c.onChange} defaultValue={c.value}>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>%, e.g. 12,34% is 0,1234</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <FormLabel>Share Lactation Feed</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>%, e.g. 12,34% is 0,1234</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <FormLabel>Feed Quantity (in terms of fresh matter)</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>kg per animal and year</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <FormLabel>Total Amount of Feed</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>kg per year</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div><h3 className="pt-2 text-lg font-medium">Piglets</h3></div>
          <FormField
            control={form.control}
            name="piglet_feed_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Piglet Feed 1</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>kg per year</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>kg per animal</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <FormLabel>Feed Quantity (in terms of fresh matter)</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>kg per animal and year</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>kg per year</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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