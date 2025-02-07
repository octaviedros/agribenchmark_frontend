"use client"

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
import { useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

//const buildings = [''];
//const costTypes = ['Purchase Year', 'Purchase Price', 'Utilization Period', 'Replacement Value', 'Enterprise Codes'];

const buildingsFormSchema = z.object({
  general_id: z.string().uuid(),
  sum_annual_depreciation: z.coerce.number({
    required_error: "Please enter your yearly building depreciation.",
  }),
  sum_book_values: z.coerce.number({
    required_error: "Please enter your Buildings and Facilities Book Values.",
  }),
  buildings: z.array(
    z.object({
      id: z.string().uuid(),
      buildings_id: z.string().uuid(),
      building_name: z.string(),
      purchase_year: z.coerce.number(),
      purchase_price: z.coerce.number(),
      utilization_period: z.coerce.number(),
      replacement_value: z.coerce.number(),
      enterprise_codes: z.coerce.number(),
    })
  )
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BuildingsDBSchema = z.object({
  id: z.string().uuid(),
  buildings_id: z.string().uuid(),
  general_id: z.string().uuid(),
  sow_id: z.string().uuid().optional(),
  finishing_id: z.number().int().optional(),
  sum_annual_depreciation: z.coerce.number().optional(),
  sum_book_values: z.coerce.number().optional(),
  buildings: z.string().max(255).optional(),
  purchase_year: z.coerce.number().optional(),
  purchase_price: z.coerce.number().optional(),
  utilization_period: z.coerce.number().optional(),
  salvage_value: z.coerce.number().optional(),
  replacement_value: z.coerce.number().optional(),
  enterprise_codes: z.coerce.number().int().optional(),
  year: z.coerce.number().int().optional(),
});

type BuildingsFormValues = z.infer<typeof buildingsFormSchema>
type BuildingsDBValues = z.infer<typeof BuildingsDBSchema>

const costTypes: { name: string; value: keyof BuildingsFormValues["buildings"][number], tooltip?: string, type?: string }[] = [
  {
    name: "Purchase Year",
    value: "purchase_year",
  },
  {
    name: "Purchase Price",
    value: "purchase_price",
  },
  {
    name: "Utilization Period",
    value: "utilization_period",
  },
  {
    name: "Replacement Value",
    value: "replacement_value",
  },
  {
    name: "Enterprise Codes",
    value: "enterprise_codes",
    tooltip: `1:Item used for all enterprises
    2:Crop and Forage Production
    3:Livestock Production general
    4:Cash Crop Production only
    5:Forage Production only
    6:Dairy only
    7:Cow calf only
    8:Beef Finishing only
    9:Sheep(ewe) only
    10:Lamb Finishing only
    11:Sow Production only
    12:Pig Finishing only
    13:Broiler only
    14:Layers only
    15:Other only`
  },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbDataToForm(data: any, general_id: string) {
  if (!data || !data.length) return createDefaults(general_id)
  return {
    id: data[0].id,
    general_id: data[0].general_id,
    sum_annual_depreciation: data[0].sum_annual_depreciation,
    sum_book_values: data[0].sum_book_values,
    buildings: data
  }
}

function formDataToDb(data: BuildingsFormValues) {
  return data.buildings.map((building) => ({
    general_id: data.general_id,
    ...building,
    sum_annual_depreciation: data.sum_annual_depreciation,
    sum_book_values: data.sum_book_values,
  }))
}

function createDefaults(general_id: string) {
  return {
    general_id: general_id,
    sum_annual_depreciation: 0,
    sum_book_values: 0,
    buildings: [{
      id: uuidv4(),
      buildings_id: uuidv4(),
      general_id: general_id,
      building_name: "",
      purchase_year: 2010,
      purchase_price: 0,
      utilization_period: 0,
      replacement_value: 0,
      enterprise_codes: 0
    }]
  }
}

export default function BuildingsFarmPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/buildings", general_id)

  const farmData = dbDataToForm(data, general_id)

  const form = useForm<BuildingsFormValues>({
    resolver: zodResolver(buildingsFormSchema),
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
    name: "buildings",
  })
  async function onSubmit(formData: BuildingsFormValues,) {
    try {
      console.log(formData)
      const updatedData = formDataToDb(formData)
      // merge with previous farm data
      const mergedData = updatedData.map((row) => {
        const existingRow = (data as BuildingsDBValues[])?.find((r) => r.id === row.id)
        return existingRow ? { ...existingRow, ...row } : row
      })
      console.log(mergedData)
      await mutate(Promise.all(mergedData.map((row) => upsert(`/buildings`, row))), {
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
        <h3 className="text-lg font-medium">Buildings and Facilities</h3>
        <p className="text-sm text-muted-foreground">
          You can enter annual values or specific values for each Building below.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="sum_annual_depreciation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Deprecation on Buildings & Facilities</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Annual Depreciation" {...field} />
                </FormControl>
                <FormDescription>
                  Sum of all depreciation values of all buildings. Can be found in the inventory list of your accounting.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sum_book_values"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Building & Facilities Book Values</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Book Value" {...field} />
                </FormControl>
                <FormDescription>
                  Sum of all building book values in the start year. Often corresponds with the residual value.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <table className="w-full my-4">
            <thead>
              <tr>
                <th className="font-medium min-w-[120px]">Building</th>
                {costTypes.map(({ name, tooltip }) => (
                  <th key={name} className="text-left pl-2 align-bottom">
                    <FormLabel>
                      {name}
                      {tooltip &&
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent className="max-w-64 p-2">
                              <ul className="pl-4 space-y-1">
                                {tooltip.split('\n').map((line, index) => (
                                  <li key={index} className="text-sm">{line.trim()}</li>
                                ))}
                              </ul>
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
                    {/* Tractor name */}
                    <FormField
                      control={form.control}
                      name={`buildings.${index}.building_name`}
                      render={({ field: f }) => (
                        <Input {...f} className="w-full" />
                      )}
                    />
                  </td>
                  {costTypes.map(({ value: costType }) => (
                    <td key={costType} className="p-1 min-w-[120px]">
                      {/* costType might be something like 'purchase_price', 'purchase_year', etc. */}
                      <FormField
                        control={form.control}
                        name={`buildings.${index}.${costType as keyof BuildingsFormValues["buildings"][number]}`}
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
                        if (farmData.buildings[index]?.id) {
                          del(`/buildings/${farmData.buildings[index].id}`)
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
              onClick={() => append(createDefaults(general_id).buildings[0])}>Add Building</Button>
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}
