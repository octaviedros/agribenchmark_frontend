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

import { cn } from "@/lib/utils"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const feedpriceFormSchema = z.object({
  feedprice: z.array(
    z.object({
      general_id: z.string().uuid(),
      id: z.string().uuid(),
      feed_prices_id: z.string().uuid(),
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
export const FeedPriceDBSchema = z.object({
  id: z.string().uuid(),
  feed_prices_id: z.string().uuid(),
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

export function FeedPricesPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/feedpricesdrymatter", general_id)

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
      name: "Feed Concentrate",
      value: "concentrate",
      type: "checkbox",
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

  /*function logformerrors(errors) {
    console.log(errors)
  }*/

  return (
    <div className="space-y-6 min">
      <div>
        <h3 className="text-lg font-medium">Prices for Feed and Dry Matter Content</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, error => console.error(error))} className="space-y-4 w-full">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left pl-2 align-bottom"><FormLabel>Feed Type</FormLabel></th>
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
                      name={`feedprice.${index}.feed_type`} // here feed_type instead of name
                      render={({ field: f }) => (
                        <FormItem>
                          <Select onValueChange={f.onChange} defaultValue={f.value}>
                            <FormControl>
                              <SelectTrigger> <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Finishing feed 1">Finishing Feed 1</SelectItem>
                              <SelectItem value="Finishing feed 2">Finishing Feed 2</SelectItem>
                              <SelectItem value="Finishing feed 3">Finishing Feed 3</SelectItem>
                              <SelectItem value="Gestation feed">Gestation Feed</SelectItem>
                              <SelectItem value="Lactation feed">Lactation Feed</SelectItem>
                              <SelectItem value="Piglet feed 1">Piglet Feed 1</SelectItem>
                              <SelectItem value="Piglet feed 2">Piglet Feed 2</SelectItem>
                              <SelectItem value="Special boar feed">Special Boar Feed</SelectItem>
                              <SelectItem value="Special gilt feed">Special Gilt Feed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  {feedpriceTypes.map(({ value: feedpriceType, type }) => (
                    <td key={feedpriceType} className="p-1 min-w-[120px]">
                      {/* feedpriceType might be something like 'price', 'dry_matter', etc. */}
                      <FormField
                        control={form.control}
                        name={`feedprice.${index}.${feedpriceType as keyof FeedPriceFormValues["feedprice"][number]}`}
                        render={({ field: ff }) => (
                          <Input {...ff} className="w-full" type={type === "checkbox" ? "checkbox" : "number"} value={ff.value as number} />
                          
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

export default FeedPricesPage
