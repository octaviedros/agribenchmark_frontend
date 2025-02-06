"use client"

import { Separator } from "@/components/ui/separator"
import { useFarmData } from "@/hooks/use-farm-data"
import { del, upsert } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { Info, Trash2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Combobox } from "@/components/ui/combobox"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const feedpriceFormSchema = z.object({
  feedprice: z.array(
    z.object({
      general_id: z.string().uuid(),
      id: z.string().uuid(),
      feed_prices_id: z.string().uuid(),
      land_use_id: z.string().uuid(),
      //name: z.string(),
      feed_type: z.string(),
      price_per_tonne: z.coerce.number(),
      dry_matter_percent: z.coerce.number(),
      energy_mj: z.coerce.number(),
      protein: z.coerce.number(),
      concentrate: z.boolean().nullable().optional(),
      year: z.number().int(),
    })
  ),

})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FeedPriceDBSchema = z.object({
  id: z.string().uuid(),
  feed_prices_id: z.string().uuid(),
  land_use_id: z.string().uuid(),
  general_id: z.string().uuid(),
  year: z.number().int(),
  feed_type: z.string(),
  price_per_tonne: z.coerce.number(),
  dry_matter_percent: z.coerce.number(),
  energy_mj: z.coerce.number(),
  protein: z.coerce.number(),
  concentrate: z.boolean().optional(),
})

type FeedPriceFormValues = z.infer<typeof feedpriceFormSchema>
type FeedPriceDBValues = z.infer<typeof FeedPriceDBSchema>

interface FeedOption {
  value: string;
  label: string;
}

interface FeedData {
  id: string;
  crop_name: string;
}

const feedpriceTypes: { name: string; value: keyof FeedPriceFormValues["feedprice"][number], tooltip?: string, type?: string }[] = [
  {
    name: "Price",
    value: "price_per_tonne",
    tooltip: "per tonne"
  },
  {
    name: "Dry Matter",
    value: "dry_matter_percent",
    tooltip: "%; write 12.34% as 0,1234"
  },
  {
    name: "MJ",
    value: "energy_mj",
  },
  {
    name: "Protein",
    value: "protein",
    tooltip: "%; write 12.34% as 0,1234"
  },
  {
    name: "Concentrate",
    value: "concentrate",
    type: "checkbox",
  },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbDataToForm(data: any, general_id: string) {
  if (!data || !data.length) return createDefaults(general_id)
  return {
    id: data[0].id,
    general_id: data[0].general_id,
    feedprice: data
  }
}

function formDataToDb(data: FeedPriceFormValues) {
  return data.feedprice.map((feedprices) => ({
    ...feedprices,
  }))
}

function createDefaults(general_id: string) {
  return {
    feedprice: [{
      general_id: general_id,
      id: uuidv4(),
      feed_prices_id: uuidv4(),
      land_use_id: "",
      //name: "",
      feed_type: "",
      price_per_tonne: 0,
      dry_matter_percent: 0,
      energy_mj: 0,
      protein: 0,
      concentrate: false,
      year: new Date().getFullYear(),
    }],
  }
}

export default function FeedPricesPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/feedpricesdrymatter", general_id)

  const {
    data: feedData,
    error: feedError,
    isLoading: feedIsLoading,
  } = useFarmData("/landuse", general_id)

  const feedOptions: FeedOption[] = (feedData as FeedData[] | undefined)?.map((feed: FeedData) => ({
    value: feed.id,
    label: feed.crop_name
  })) || []


  const farmData = dbDataToForm(data, general_id)
  console.log(farmData)
  const form = useForm<FeedPriceFormValues>({
    resolver: zodResolver(feedpriceFormSchema),
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
    name: "feedprice",
  })

  async function onSubmit(formData: FeedPriceFormValues) {
    try {
      console.log("submit", formData)
      const updatedData = formDataToDb(formData)
      // merge with previous farm data
      const mergedData = updatedData.map((row) => {
        const existingRow = (data as FeedPriceDBValues[])?.find((r) => r.id === row.id)
        return existingRow ? { ...existingRow, ...row } : row
      })
      console.log(mergedData)
      await mutate(Promise.all(mergedData.map((row) => upsert(`/feedpricesdrymatter`, row))), {
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
  if (error && error.status !== 404) {
    console.error(error)
    return <div className="p-4">Failed to load farm data.</div>
  }

  /*function logformerrors(errors) {
    console.log(errors)
  }*/

  return (
    <div className="space-y-6 min">
      <div>
        <h3 className="text-lg font-medium">Prices for Crop and Dry Matter Content</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, error => console.error(error))} className="space-y-4 w-full">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left pl-2 align-bottom"><FormLabel>Name</FormLabel></th>
                {feedpriceTypes.map(({ name, tooltip }) => (
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
                    {/* Feed Type */}
                    <FormField
                      control={form.control}
                      name={`feedprice.${index}.land_use_id`}
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
                  {feedpriceTypes.map(({ value: feedpriceType, type }) => (
                    <td key={feedpriceType} className="p-1 min-w-[120px]">
                      {/* feedpriceType might be something like 'price', 'dry_matter', etc. */}
                      <FormField
                        control={form.control}
                        name={`feedprice.${index}.${feedpriceType as keyof FeedPriceFormValues["feedprice"][number]}`}
                        render={({ field: ff }) => (
                          (type === "checkbox" ?
                            <div className="w-full flex items-center justify-center">
                              <Checkbox
                                checked={ff.value as boolean ?? false}
                                onCheckedChange={ff.onChange}
                              />
                            </div> :
                            <Input {...ff} className="w-full" type="number" value={ff.value as number} />
                          )
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
                        if (farmData.feedprice[index]?.id) {
                          del(`/feedpricesdrymatter/${farmData.feedprice[index].id}`)
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
              onClick={() => append(createDefaults(general_id).feedprice[0])}>Add Row</Button>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div >
  )
}