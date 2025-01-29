"use client"

import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Trash2, Info } from "lucide-react"
import { z } from "zod"
import { useFarmData } from "@/hooks/use-farm-data"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { upsert, del } from "@/lib/api"
import { v4 as uuidv4 } from "uuid"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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

const wagesFormSchema = z.object({
  permanentworker: z.array(
    z.object({
      general_id: z.string().uuid(),
      id: z.string().uuid(),
      labour_id: z.string().uuid(),
      type: z.string(),
      name: z.string().optional(),
      labor_units: z.coerce.number(),
      working_hours: z.coerce.number(),
      annual_wage_incl_sidecosts: z.coerce.number(),
      enterprise_code: z.coerce.number().int(),
    })
  ),
  casualworker: z.array(
    z.object({
      general_id: z.string().uuid(),
      id: z.string().uuid(),
      labour_id: z.string().uuid(),
      type: z.string(),
      name: z.string(),
      labor_units: z.coerce.number(),
      working_hours: z.coerce.number(),
      annual_wage_incl_sidecosts: z.coerce.number(),
      enterprise_code: z.coerce.number().int(),
    })
  ),
  familyworker: z.array(
    z.object({
      general_id: z.string().uuid(),
      id: z.string().uuid(),
      labour_id: z.string().uuid(),
      type: z.string(),
      name: z.string(),
      labor_units: z.coerce.number(),
      working_hours: z.coerce.number(),
      annual_wage_incl_sidecosts: z.coerce.number(),
      enterprise_code: z.coerce.number().int(),
    })
  )
})

export const WagesDBSchema = z.object({
  id: z.string().uuid(),
  labour_id: z.string().uuid(),
  general_id: z.string().uuid(),
  sow_id: z.string().uuid().optional(),
  finishing_id: z.number().int().optional(),
  type: z.string().optional(),
  year: z.number().int().optional(),
  labor_units: z.coerce.number(),
  working_hours: z.coerce.number(),
  annual_wage_incl_sidecosts: z.coerce.number(),
  enterprise_code: z.coerce.number().int(),
})

type WagesFormValues = z.infer<typeof wagesFormSchema>
type WagesDBValues = z.infer<typeof WagesDBSchema>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbDataToForm(data: any, general_id: string) {
  if (!data || !data.length) return createDefaults(general_id)
  return {
    permanentworker: data.filter((row: WagesDBValues) => row.type !== "Casual Labour" && row.type !== "Family Labour"),
    casualworker: data.filter((row: WagesDBValues) => row.type === "Casual Labour"),
    familyworker: data.filter((row: WagesDBValues) => row.type === "Family Labour")
  }
}
function formDataToDb(data: WagesFormValues) {
  return [
    ...data.permanentworker,
    ...data.casualworker,
    ...data.familyworker
  ].map((worker) => ({
    ...worker,
  }))
}

function createDefaults(general_id: string) {
  return {
    permanentworker: [{
      general_id: general_id,
      id: uuidv4(),
      labour_id: uuidv4(),
      name: "",
      type: "",
      labor_units: 0,
      working_hours: 0,
      annual_wage_incl_sidecosts: 0,
      enterprise_code: 0
    }],
    casualworker: [{
      general_id: general_id,
      id: uuidv4(),
      name: "",
      labour_id: uuidv4(),
      type: "Casual Labour",
      labor_units: 0,
      working_hours: 0,
      annual_wage_incl_sidecosts: 0,
      enterprise_code: 0
    }],
    familyworker: [{
      general_id: general_id,
      id: uuidv4(),
      name: "",
      labour_id: uuidv4(),
      type: "Family Labour",
      labor_units: 0,
      working_hours: 0,
      annual_wage_incl_sidecosts: 0,
      enterprise_code: 0
    }]
  }
}

export function WagesFarmPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/labour", general_id)

  const farmData = dbDataToForm(data, general_id)
  console.log(farmData)
  const form = useForm<WagesFormValues>({
    resolver: zodResolver(wagesFormSchema),
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


  const { fields: permanentfields, append: permanentappend, remove: permanentremove } = useFieldArray({
    control: form.control,
    name: "permanentworker",
  })
  const { fields: casualfields, append: casualappend, remove: casualremove } = useFieldArray({
    control: form.control,
    name: "casualworker",
  })
  const { fields: familyfields, append: familyappend, remove: familyremove } = useFieldArray({
    control: form.control,
    name: "familyworker",
  })

  async function onSubmit(formData: WagesFormValues) {
    try {
      console.log("submit", formData)
      const updatedData = formDataToDb(formData)
      // merge with previous farm data
      const mergedData = updatedData.map((row) => {
        const existingRow = (data as WagesDBValues[])?.find((r) => r.id === row.id)
        return existingRow ? { ...existingRow, ...row } : row
      })
      console.log(mergedData)
      await mutate(Promise.all(mergedData.map((row) => upsert(`/labour`, row))), {
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
  const costTypes: { name: string; value: keyof WagesFormValues["permanentworker"][number], tooltip?: string }[] = [
    {
      name: "Workforce",
      value: "labor_units",
    },
    {
      name: "Hours",
      value: "working_hours",
      tooltip: "per Person per year"
    },
    {
      name: "Wage",
      value: "annual_wage_incl_sidecosts",
      tooltip: "Annual, per Person"
    },
    {
      name: "Enterprise Codes",
      value: "enterprise_code",
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
        <h3 className="text-lg font-medium">Labor Input and Wages</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, error => console.log(error))} className="space-y-8">
          <h3 className="text-lg font-medium">Permanent Workers</h3>
          <div>
            <table className="w-full my-4">
              <thead>
                <tr>
                  <th className="text-left pl-2 align-bottom"><FormLabel>Type</FormLabel></th>
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
                {permanentfields.map((field, index) => (
                  <tr key={field.id}>
                    <td className="p-1 min-w-[120px]">
                      {/* Permanent Worker */}
                      <FormField
                        control={form.control}
                        name={`permanentworker.${index}.type`}
                        render={({ field: f }) => (
                          <FormItem>
                            <Select onValueChange={f.onChange} defaultValue={f.value}>
                              <FormControl>
                                <SelectTrigger> <SelectValue placeholder="Select Group" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Manager">Group 1: Manager</SelectItem>
                                <SelectItem value="Executive Staff">Group 2: Executive Staff</SelectItem>
                                <SelectItem value="Tractor Driver">Group 3: Tractor</SelectItem>
                                <SelectItem value="Pigman">Group 4: Pigman</SelectItem>
                                <SelectItem value="Other">Group 5: Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>
                    {costTypes.map(({ value: permanentcostType }) => (
                      <td key={permanentcostType} className="p-1 min-w-[120px]">
                        {/* costType might be something like 'purchase_price', 'purchase_year', etc. */}
                        <FormField
                          control={form.control}
                          name={`permanentworker.${index}.${permanentcostType as keyof WagesFormValues["permanentworker"][number]}`}
                          render={({ field: ff }) => (
                            <FormItem>
                              <Input {...ff} className="w-full" type="number" value={ff.value as number} />
                              <FormMessage />
                            </FormItem>
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
                          if (farmData.permanentworker[index]?.id) {
                            del(`/labour/${farmData.permanentworker[index].id}`)
                          }
                          permanentremove(index)
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
                onClick={() => permanentappend(createDefaults(general_id).permanentworker[0])}>Add Row</Button>
            </div>
          </div>

          <br />
          <br />
          <h3 className="text-lg font-medium">Casual Workers</h3>
          <table className="w-full my-4">
            <thead>
              <tr>
                <th className="text-left pl-2 align-bottom"><FormLabel>Desc.</FormLabel></th>
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
              {casualfields.map((field, index) => (
                <tr key={field.id}>
                  <td className="p-1 min-w-[120px]">
                    {/* Casual Worker */}
                    <FormField
                      control={form.control}
                      name={`casualworker.${index}.name`}
                      render={({ field: f }) => (
                        <Input {...f} className="w-full" />
                      )}
                    />
                  </td>
                  {costTypes.map(({ value: casualcostType }) => (
                    <td key={casualcostType} className="p-1 min-w-[120px]">
                      {/* costType might be something like 'purchase_price', 'purchase_year', etc. */}
                      <FormField
                        control={form.control}
                        name={`casualworker.${index}.${casualcostType as keyof WagesFormValues["casualworker"][number]}`}
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
                        if (farmData.casualworker[index]?.id) {
                          del(`/labour/${farmData.casualworker[index].id}`)
                        }
                        casualremove(index)
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
              onClick={() => casualappend(createDefaults(general_id).casualworker[0])}>Add Row</Button>
          </div>

          <br />
          <br />
          <h3 className="text-lg font-medium">Family Workers</h3>
          <table className="w-full my-4">
            <thead>
              <tr>
                <th className="text-left pl-2 align-bottom">
                  <FormLabel>Desc.</FormLabel>
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
              {familyfields.map((field, index) => (
                <tr key={field.id}>
                  <td className="p-1 min-w-[120px]">
                    {/* Family Worker */}
                    <FormField
                      control={form.control}
                      name={`familyworker.${index}.name`}
                      render={({ field: f }) => (
                        <Input {...f} className="w-full" />
                      )}
                    />
                  </td>
                  {costTypes.map(({ value: familycostType }) => (
                    <td key={familycostType} className="p-1 min-w-[120px]">
                      {/* costType might be something like 'purchase_price', 'purchase_year', etc. */}
                      <FormField
                        control={form.control}
                        name={`familyworker.${index}.${familycostType as keyof WagesFormValues["familyworker"][number]}`}
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
                        if (farmData.familyworker[index]?.id) {
                          del(`/labour/${farmData.familyworker[index].id}`)
                        }
                        familyremove(index)
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
              onClick={() => familyappend(createDefaults(general_id).familyworker[0])}>Add Row</Button>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default WagesFarmPage