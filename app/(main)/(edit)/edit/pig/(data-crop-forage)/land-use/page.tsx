"use client"

import { Separator } from "@/components/ui/separator"
import { del, upsert } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { Info, Trash2 } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import { useFarmData } from "@/hooks/use-farm-data"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

import {
  Form,
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

const landuseFormSchema = z.object({
  general_id: z.string().uuid(),
  landusage: z.array(
    z.object({
      general_id: z.string().uuid(),
      id: z.string().uuid(),
      land_use_id: z.string().uuid(),
      acreage: z.coerce.number(),
      net_yield: z.coerce.number(),
      dry_matter: z.coerce.number(),
      price: z.coerce.number(),
      cap_dir_paym: z.coerce.number(),
      other_dir_paym: z.coerce.number(),
      enterprise_code: z.coerce.number(),
      crop_name: z.string(),
    })
  )
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LandUseDBSchema = z.object({
  id: z.string().uuid(),
  land_use_id: z.string().uuid(),
  general_id: z.string().uuid(),
  crop_id: z.string().uuid(),
  crop_name: z.string(),
  acreage: z.number(),
  net_yield: z.number(),
  dry_matter: z.number(),
  price: z.number(),
  cap_dir_paym: z.number(),
  other_dir_paym: z.number(),
  enterprise_code: z.number(),
  year: z.number(),
})

type LandUseFormValues = z.infer<typeof landuseFormSchema>
type LandUseDBValues = z.infer<typeof LandUseDBSchema>


const landuseTypes: { name: string; value: keyof LandUseFormValues["landusage"][number], tooltip?: string }[] = [
  {
    name: "Acreage",
    value: "acreage",
    tooltip: "in ha"
  },
  {
    name: "Net Yield",
    value: "net_yield",
    tooltip: "in t/ha"
  },
  {
    name: "Dry Matter",
    value: "dry_matter",
    tooltip: "%, write 12,34% as 0,1234"
  },
  {
    name: "Price",
    value: "price",
    tooltip: "per tonne"
  },
  {
    name: "CAP dir. payments",
    value: "cap_dir_paym",
    tooltip: "per ha"
  },
  {
    name: "Other dir. payments",
    value: "other_dir_paym",
    tooltip: "per ha"
  },
  {
    name: "Enterprise codes",
    value: "enterprise_code",
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
    //id: data[0].id,
    general_id: data[0].general_id,
    landusage: data
  }
}
function formDataToDb(data: LandUseFormValues) {
  return data.landusage.map((landusages) => ({
    ...landusages,
  }))
}

function createDefaults(general_id: string) {
  return {
    general_id: general_id,
    landusage: [{
      general_id: general_id,
      id: uuidv4(),
      land_use_id: uuidv4(),
      crop_id: uuidv4(),
      crop_name: "",
      //type: "Crop Name",
      acreage: 0,
      net_yield: 0,
      dry_matter: 0,
      price: 0,
      cap_dir_paym: 0,
      other_dir_paym: 0,
      enterprise_code: 0,
      year: new Date().getFullYear(),
    }],
  }
}

export default function LandUseFarmPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/landuse", general_id)

  const farmData = dbDataToForm(data, general_id)
  console.log(farmData)
  const form = useForm<LandUseFormValues>({
    resolver: zodResolver(landuseFormSchema),
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
    name: "landusage",
  })

  async function onSubmit(formData: LandUseFormValues) {
    try {
      console.log("submit", formData)
      const updatedData = formDataToDb(formData)
      // merge with previous farm data
      const mergedData = updatedData.map((row) => {
        const existingRow = (data as LandUseDBValues[])?.find((r) => r.id === row.id)
        return existingRow ? { ...existingRow, ...row } : row
      })
      console.log(mergedData)
      await mutate(Promise.all(mergedData.map((row) => upsert(`/landuse`, row))), {
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

  /*function logformerrors(errors) {
    console.log(errors)
  }*/

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Land use, Yields, Prices and Direct Payments</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, error => console.error(error))} className="space-y-4 w-full">
          <table className="w-full my-4">
            <thead>
              <tr>
                <th className="text-left pl-2 align-bottom"><FormLabel>Crop Name</FormLabel></th>
                {landuseTypes.map(({ name, tooltip }) => (
                  <th key={name} className="text-left pl-2 align-bottom">
                    <FormLabel>
                      {name}
                      {tooltip &&
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent className="max-w-64 p-2">
                              <ul className=" pl-4 space-y-1">
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
                    {/* Casual Worker */}
                    <FormField
                      control={form.control}
                      name={`landusage.${index}.crop_name`}
                      render={({ field: f }) => (
                        <Input {...f} className="w-full" />
                      )}
                    />
                  </td>
                  {landuseTypes.map(({ value: landuseType }) => (
                    <td key={landuseType} className="p-1 min-w-[120px]">
                      {/* costType might be something like 'purchase_price', 'purchase_year', etc. */}
                      <FormField
                        control={form.control}
                        name={`landusage.${index}.${landuseType as keyof LandUseFormValues["landusage"][number]}`}
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
                        if (farmData.landusage[index]?.id) {
                          del(`/landuse/${farmData.landusage[index].id}`)
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
              onClick={() => append(createDefaults(general_id).landusage[0])}>Add Row</Button>
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}
