"use client"

import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useFarmData } from "@/hooks/use-farm-data"
import { toast } from "@/hooks/use-toast"
import { del, upsert } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { Info, Trash2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

const sowfeedrationFormSchema = z.object({
  general_id: z.string().uuid(),
  total_amount_feed_used: z.coerce.number(),
  rations: z.array(
    z.object({
      id: z.string().uuid(),
      general_id: z.string().uuid(),
      feed_ration_sows_id: z.string().uuid(),
      feeds_id: z.string().uuid(),
      crop_name: z.string(),
      
      gestation_feed: z.coerce.number(),
      lactation_feed: z.coerce.number(),
      special_gilt_feed: z.coerce.number(),
      special_boar_feed: z.coerce.number(),
      piglet_feed_1: z.coerce.number(),
      piglet_feed_2: z.coerce.number(),
    })
  )
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SowFeedRationDBSchema = z.object({
  id: z.string().uuid(),
  feed_ration_sows_id: z.string().uuid(),
  general_id: z.string().uuid(),
  feeds_id: z.string().uuid(),
  year: z.number().int(),
  
  crop_name: z.string(),  // In DB ENUM Gesattion, lactation,... but are in excel columns individually
  gestation_feed: z.number(),
  lactation_feed: z.number(),
  special_gilt_feed: z.number(),
  special_boar_feed: z.number(),
  piglet_feed_1: z.number(),
  piglet_feed_2: z.number(),
  total_amount_feed_used: z.number(),
})

type SowFeedRationFormValues = z.infer<typeof sowfeedrationFormSchema>
type SowFeedRationDBValues = z.infer<typeof SowFeedRationDBSchema>

interface FeedOption {
  value: string;
  label: string;
}

interface FeedData {
  id: string;
  crop_name: string;
  production_type: string;
}

const feedTypes: { name: string; value: string, tooltip?: string }[] = [
  
  {
    name: "Gestation Feed",
    value: "gestation_feed",
    tooltip: "Share",
  },
  {
    name: "Lactation Feed",
    value: "lactation_feed",
    tooltip: "Share",
  },
  {
    name: "Special Gilt Feed",
    value: "special_gilt_feed",
    tooltip: "Share",
  },
  {
    name: "Special Boar Feed",
    value: "special_boar_feed",
    tooltip: "Share",
  },
  {
    name: "Piglet Feed 1",
    value: "piglet_feed_1",
    tooltip: "Share",
  },
  {
    name: "Piglet Feed 2",
    value: "piglet_feed_2",
    tooltip: "Share",
  },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbDataToForm(data: any, general_id: string) {
  if (!data || !data.length) return createDefaults(general_id)
  return {
    general_id: data[0].general_id,
    total_amount_feed_used: data[0].total_amount_feed_used,
    rations: data
  }
}
function formDataToDb(data: SowFeedRationFormValues) {
  return [
    ...data.rations,
  ].map((worker) => ({
    ...worker,
    total_amount_feed_used: data.total_amount_feed_used,
  }))
}

function createDefaults(general_id: string) {
  return {
    general_id: general_id,
    total_amount_feed_used: 0,
    rations: [{
      id: uuidv4(),
      general_id: general_id,
      feed_ration_sows_id: uuidv4(),
      feeds_id: "",
      year: new Date().getFullYear(),
      crop_name: "",
      gestation_feed: 0,
      lactation_feed: 0,
      special_gilt_feed: 0,
      special_boar_feed: 0,
      piglet_feed_1: 0,
      piglet_feed_2: 0,
    }],
  }
}

export default function SowFeedRationPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/feedrationsows", general_id)

  const {
    data: feedData,
    error: feedError,
    isLoading: feedIsLoading
  } = useFarmData("/feeds", general_id)
  

  const feedOptions: FeedOption[] = (feedData as FeedData[] | undefined)?.map((feed: FeedData) => ({
    value: feed.id,
    label: feed.crop_name + " (" + feed.production_type + ")",
  })) || []

  const farmData = dbDataToForm(data, general_id)

 
  const form = useForm<SowFeedRationFormValues>({
    resolver: zodResolver(sowfeedrationFormSchema),
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rations",
  })

  async function onSubmit(formData: SowFeedRationFormValues) {
    try {
      console.log("submit", formData)
      const updatedData = formDataToDb(formData)
      // merge with previous farm data
      const mergedData = updatedData.map((row) => {
        const existingRow = (data as SowFeedRationDBValues[])?.find((r) => r.id === row.id)
        return existingRow ? { ...existingRow, ...row } : row
      })
      console.log(mergedData)
      await mutate(Promise.all(mergedData.map((row) => upsert(`/feedrationsows`, row))), {
        optimisticData: mergedData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
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

  if (isLoading || feedIsLoading) {
    return <div className="p-4">Loading farm data…</div>
  }
  if ((error && error.status !== 404) || (feedError && feedError.status !== 404)) {
    console.error(error)
    return <div className="p-4">Failed to load farm data.</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Feed Rations Sow Enterprise</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, error => console.error(error, form.getValues()))} className="space-y-4">
          <h3 className="text-lg font-medium">Feed Rations</h3>
          <table className="w-full my-4">
            <thead>
              <tr>
                <th className="text-left pl-2 align-bottom"><FormLabel>Feed</FormLabel></th>
                {feedTypes.map(({ name, tooltip }) => (
                  <th key={name} className="text-left pl-2 align-bottom">
                    <FormLabel>
                      {name}
                      {tooltip &&
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>{tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      }
                    </FormLabel>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td className="p-1 min-w-[80px]">
                    {/* Self Produced Feed */}
                    <FormField
                      control={form.control}
                      name={`rations.${index}.feeds_id`}
                      render={({ field }) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const [feedValue, setfeedValue] = useState<string>(field.value)
                        
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                          setfeedValue(field.value)
                        }, [field.value])

                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        useEffect(() => {
                          field.onChange(feedValue)
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [feedValue])
                        
                        return (
                          <FormItem>
                            <FormControl>
                              <Combobox
                                valueState={[feedValue, setfeedValue]}
                                options={feedOptions}
                                selectText="Select feed..."
                                placeholder="Search feeds..."
                                noOptionText="No feed found."
                                isDialog={true}
                                width={"150"}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  </td>
                  {feedTypes.map(({ value: selfcostType }) => (
                    <td key={selfcostType} className="p-1 min-w-[125px]">
                      <FormField
                        control={form.control}
                        name={`rations.${index}.${selfcostType as keyof SowFeedRationFormValues["rations"][number]}`}
                        render={({ field: ff }) => (
                          <Input {...ff}
                            className="w-full"
                            type={selfcostType === 'crop_name' ? 'text' : 'number'}
                            value={ff.value}
                          />
                        )}
                      />
                    </td>
                  ))}
                  <td>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        if (farmData.rations[index]?.id) {
                          del(`/feedrationsows/${farmData.rations[index].id}`)
                        }
                        remove(index)
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <Button
              type="button"
              className="mt-4 mb-4"
              onClick={() => append(createDefaults(general_id).rations[0])}>Add Row</Button>
          </div>
          <FormField
            control={form.control}
            name="total_amount_feed_used"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Amount of Feed Used</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
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