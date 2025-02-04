"use client"

import { Separator } from "@/components/ui/separator"
import { useFarmData } from "@/hooks/use-farm-data"
import { del, upsert } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { Info, Trash2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

import {
  Form,
  FormItem,
  FormMessage,
  FormControl,
  FormField,
  FormLabel
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const sowfeedrationFormSchema = z.object({
  general_id: z.string().uuid(),
  total_amount_feed_used: z.coerce.number(),
  rations: z.array(
    z.object({
      id: z.string().uuid(),
      feed_ration_sows_id: z.string().uuid(),
      feeds_id: z.string().uuid(),
      crop_name: z.string(),
      sows_produced: z.string(),
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
  sows_produced: z.string(),
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

const feedTypes: { name: string; value: string, tooltip?: string }[] = [
  {
    name: "Crop Name",
    value: "crop_name",
  },
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
    id: data[0].id,
    general_id: data[0].general_id,
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
      feeds_id: uuidv4(),
      year: new Date().getFullYear(),
      sows_produced: "",
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

  const farmData = dbDataToForm(data, general_id)

  console.log(farmData)
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
        <h3 className="text-lg font-medium">Feed Rations Sow Enterprise</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, error => console.error(error))} className="space-y-4">
          <h3 className="text-lg font-medium">Feed Rations</h3>
          <table className="w-full my-4">
            <thead>
              <tr>
                <th className="text-left pl-2 align-bottom"><FormLabel>Production Type</FormLabel></th>
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
                  <td className="p-1 min-w-[120px]">
                    {/* Self Produced Feed */}
                    <FormField
                      control={form.control}
                      name={`rations.${index}.sows_produced`}
                      render={({ field: f }) => (
                        <td>
                          <FormField
                            control={form.control}
                            name={`rations.${index}.sows_produced`}
                            render={({ field: f }) => (
                              <FormItem>
                                <Select onValueChange={f.onChange} defaultValue={f.value}>
                                  <FormControl>
                                    <SelectTrigger> <SelectValue placeholder="Select Prod." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="selfproduced">Self Produced</SelectItem>
                                    <SelectItem value="boughtfeed">Bought Feed</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                      )}
                    />
                  </td>
                  {feedTypes.map(({ value: selfcostType }) => (
                    <td key={selfcostType} className="p-1 min-w-[120px]">
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