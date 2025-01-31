"use client"

import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Info, Trash2 } from "lucide-react"
import { z } from "zod"
import { upsert, del } from "@/lib/api"
import { v4 as uuidv4 } from "uuid"
import { useFarmData } from "@/hooks/use-farm-data"
import { useState, useEffect } from "react"
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const finishingfeedrationFormSchema = z.object({
  selfproduced: z.array(
    z.object({
      general_id: z.string().uuid(),
      id: z.string().uuid(),
      crop_name: z.string(),
      produced: z.string(),
      feed_ration_finishing_id: z.string().uuid(),
      feed_id: z.string().uuid(),
      year: z.number().int(),
      finishing_feed_1: z.coerce.number(),
      finishing_feed_2: z.coerce.number(),
      finishing_feed_3: z.coerce.number(),
      total_amount_feed_used: z.coerce.number(),
    })
  ),
  boughtfeed: z.array(
    z.object({
      general_id: z.string().uuid(),
      id: z.string().uuid(),
      crop_name: z.string(),
      produced: z.string(),
      feed_ration_finishing_id: z.string().uuid(),
      feed_id: z.string().uuid(),
      year: z.number().int(),
      finishing_feed_1: z.coerce.number(),
      finishing_feed_2: z.coerce.number(),
      finishing_feed_3: z.coerce.number(),
      total_amount_feed_used: z.number(),
    })
  )
})
export const FinishingFeedRationDBSchema = z.object({
  id: z.string().uuid(),
  feed_ration_finishing_id: z.string().uuid(),
  general_id: z.string().uuid(),
  crop_name: z.string(),
  produced: z.string(),
  feed_id: z.string().uuid(),
  year: z.number().int(),
  finishing_feed_1: z.coerce.number(),
  finishing_feed_2: z.coerce.number(),
  finishing_feed_3: z.coerce.number(),
  total_amount_feed_used: z.coerce.number(),
})

type FinishingFeedRationFormValues = z.infer<typeof finishingfeedrationFormSchema>
type FinishingFeedRationDBValues = z.infer<typeof FinishingFeedRationDBSchema>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbDataToForm(data: any, general_id: string) {
  if (!data || !data.length) return createDefaults(general_id)
  return {
    selfproduced: data.filter((row: FinishingFeedRationDBValues) => row.produced === "Self Produced"),
    boughtfeed: data.filter((row: FinishingFeedRationDBValues) => row.produced === "Bought Feed"),
  }
}
function formDataToDb(data: FinishingFeedRationFormValues) {
  return [
    ...data.selfproduced,
    ...data.boughtfeed,
  ].map((worker) => ({
    ...worker,
  }))
}

function createDefaults(general_id: string) {
  return {
    selfproduced: [{
      general_id: general_id,
      id: uuidv4(),
      feed_ration_finishing_id: uuidv4(),
      feed_id: uuidv4(),
      crop_name: "",
      produced: "Self Produced",
      finishing_feed_1: 0,
      finishing_feed_2: 0,
      finishing_feed_3: 0,
      total_amount_feed_used: 0,
      year: new Date().getFullYear(),
    }],
    boughtfeed: [{
      general_id: general_id,
      id: uuidv4(),
      feed_id: uuidv4(),
      feed_ration_finishing_id: uuidv4(),
      crop_name: "",
      produced: "Bought Feed",
      finishing_feed_1: 0,
      finishing_feed_2: 0,
      finishing_feed_3: 0,
      total_amount_feed_used: 0,
      year: new Date().getFullYear(),
    }],

  }
}

export function FinishingFeedRationPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/feedrationfinishing", general_id)

  const farmData = dbDataToForm(data, general_id)
  console.log(farmData)
  const form = useForm<FinishingFeedRationFormValues>({
    resolver: zodResolver(finishingfeedrationFormSchema),
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
    name: "selfproduced",
  })

  const { fields: boughtfields, append: boughtappend, remove: boughtremove } = useFieldArray({
    control: form.control,
    name: "boughtfeed",
  })

  async function onSubmit(formData: FinishingFeedRationFormValues) {
    try {
      console.log("submit", formData)
      const updatedData = formDataToDb(formData)
      // merge with previous farm data
      const mergedData = updatedData.map((row) => {
        const existingRow = (data as FinishingFeedRationDBValues[])?.find((r) => r.id === row.id)
        return existingRow ? { ...existingRow, ...row } : row
      })
      console.log(mergedData)
      await mutate(Promise.all(mergedData.map((row) => upsert(`/feedrationfinishing`, row))), {
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
  const costTypes: { name: string; value: keyof FinishingFeedRationFormValues["selfproduced"][number], tooltip?: string }[] = [
    {
      name: "Finishing Feed 1",
      value: "finishing_feed_1",
      tooltip: "Share",
    },
    {
      name: "Finishing Feed 2",
      value: "finishing_feed_2",
      tooltip: "Share",
    },
    {
      name: "Finishing Feed 3",
      value: "finishing_feed_3",
      tooltip: "Share",
    },
    {
      name: "Total Amount Feed Used",
      value: "total_amount_feed_used",
      tooltip: "Total Amount Feed Used",
    },
  ]

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
        <h3 className="text-lg font-medium">Feed Rations Pig Finishing Enterprise</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h3 className="text-lg font-medium">Self Produced Feed</h3>
          <table className="w-full my-4">
            <thead>
              <tr>
                <th className="text-left pl-2 align-bottom"><FormLabel>Crop Name</FormLabel></th>
                {costTypes.map(({ name, tooltip }) => (
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
                      name={`selfproduced.${index}.crop_name`}
                      render={({ field: f }) => (
                        <Input {...f} className="w-full" />
                      )}
                    />
                  </td>
                  {costTypes.map(({ value: selfcostType }) => (
                    <td key={selfcostType} className="p-1 min-w-[120px]">
                      {/* costType might be something like 'purchase_price', 'purchase_year', etc. */}
                      <FormField
                        control={form.control}
                        name={`selfproduced.${index}.${selfcostType as keyof FinishingFeedRationFormValues["selfproduced"][number]}`}
                        render={({ field: ff }) => (
                          <Input {...ff} className="w-full" type="number" value={ff.value as number} />
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
                        if (farmData.selfproduced[index]?.id) {
                          del(`/feedrationsows/${farmData.selfproduced[index].id}`)
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
              className="mt-4"
              onClick={() => append(createDefaults(general_id).selfproduced[0])}>Add Row</Button>
          </div>
          <br />
          <br />
          <h3 className="text-lg font-medium">Bought Feed</h3>
          <table className="w-full my-4">
            <thead>
              <tr>
                <th className="text-left pl-2 align-bottom">
                  <FormLabel>Crop Name</FormLabel>
                </th>
                {costTypes.map(({ name, tooltip }) => (
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
              {boughtfields.map((field, index) => (
                <tr key={field.id}>
                  <td className="p-1 min-w-[120px]">
                    {/* Bought Feed*/}
                    <FormField
                      control={form.control}
                      name={`boughtfeed.${index}.crop_name`}
                      render={({ field: f }) => (
                        <Input {...f} className="w-full" />
                      )}
                    />
                  </td>
                  {costTypes.map(({ value: boughtcostType }) => (
                    <td key={boughtcostType} className="p-1 min-w-[120px]">
                      {/* costType might be something like 'purchase_price', 'purchase_year', etc. */}
                      <FormField
                        control={form.control}
                        name={`boughtfeed.${index}.${boughtcostType as keyof FinishingFeedRationFormValues["boughtfeed"][number]}`}
                        render={({ field: ff }) => (
                          <Input {...ff} className="w-full" type="number" value={ff.value as number} />
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
                        if (farmData.boughtfeed[index]?.id) {
                          del(`/feedrationsows/${farmData.boughtfeed[index].id}`)
                        }
                        boughtremove(index)
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
              className="mt-4"
              onClick={() => boughtappend(createDefaults(general_id).boughtfeed[0])}>Add Row</Button>
          </div>

        <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}
export default FinishingFeedRationPage