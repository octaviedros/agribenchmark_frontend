"use client"

import { Separator } from "@/components/ui/separator"
import { useFarmData } from "@/hooks/use-farm-data"
import { del, upsert } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { Trash2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

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
import { toast } from "@/hooks/use-toast"

const machineryFormSchema = z.object({
  general_id: z.string().uuid(),
  sum_annual_depreciation: z.coerce.number({
    required_error: "Please enter your yearly machinery depreciation.",
  }),
  sum_book_values: z.coerce.number({
    required_error: "Please enter your machinery Book Values.",
  }),
  tractors: z.array(
    z.object({
      id: z.string().uuid(),
      machines_id: z.string().uuid(),
      name: z.string(),
      purchase_year: z.coerce.number(),
      purchase_price: z.coerce.number(),
      utilization_period: z.coerce.number(),
      replacement_value: z.coerce.number(),
      enterprise_code: z.coerce.number(),
    })
  )
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MachinesDBSchema = z.object({
  id: z.string().uuid(),
  machines_id: z.string().uuid(),
  general_id: z.string().uuid(),
  sow_id: z.string().uuid().optional(),
  finishing_id: z.number().int().optional(),
  sum_annual_depreciation: z.coerce.number().optional(),
  sum_book_values: z.coerce.number().optional(),
  tractors: z.string().max(255).optional(),
  purchase_year: z.coerce.number().optional(),
  purchase_price: z.coerce.number().optional(),
  utilization_period: z.coerce.number().optional(),
  salvage_value: z.coerce.number().optional(),
  replacement_value: z.coerce.number().optional(),
  enterprise_code: z.coerce.number().int().optional(),
  year: z.coerce.number().int().optional(),
});

type MachineryFormValues = z.infer<typeof machineryFormSchema>
type MachinesDBValues = z.infer<typeof MachinesDBSchema>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbDataToForm(data: any, general_id: string) {
  if (!data || !data.length) return createDefaults(general_id)
  return {
    id: data[0].id,
    general_id: data[0].general_id,
    sum_annual_depreciation: data[0].sum_annual_depreciation,
    sum_book_values: data[0].sum_book_values,
    tractors: data
  }
}

function formDataToDb(data: MachineryFormValues) {
  return data.tractors.map((tractor) => ({
    general_id: data.general_id,
    ...tractor,
    sum_annual_depreciation: data.sum_annual_depreciation,
    sum_book_values: data.sum_book_values,
  }))
}

function createDefaults(general_id: string) {
  return {
    general_id: general_id,
    sum_annual_depreciation: 0,
    sum_book_values: 0,
    tractors: [{
      id: uuidv4(),
      machines_id: uuidv4(),
      general_id: general_id,
      name: "",
      purchase_year: 2010,
      purchase_price: 0,
      utilization_period: 0,
      replacement_value: 0,
      enterprise_code: 0
    }]
  }
}

export default function MachineryFarmPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/machines", general_id)

  const farmData = dbDataToForm(data, general_id)
  
  const form = useForm<MachineryFormValues>({
    resolver: zodResolver(machineryFormSchema),
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
    name: "tractors",
  })

  async function onSubmit(formData: MachineryFormValues,) {
    try {
      console.log(formData)
      const updatedData = formDataToDb(formData)
      // merge with previous farm data
      const mergedData = updatedData.map((row) => {
        const existingRow = (data as MachinesDBValues[])?.find((r) => r.id === row.id)
        return existingRow ? { ...existingRow, ...row } : row
      })
      console.log(mergedData)
      await mutate(Promise.all(mergedData.map((row) => upsert(`/machines`, row))), {
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

  const costTypes: { name: string; value: keyof MachineryFormValues["tractors"][number] }[] = [
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
        <h3 className="text-lg font-medium">What kind of machinery and equipment do you use on your farm?</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <FormField
            control={form.control}
            name="sum_annual_depreciation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your annual Machinery Depreciation?</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Depreciation" {...field} />
                </FormControl>
                <FormDescription>
                  Sum of all depreciation values of all machines. Can be found in the inventory list of your accounting.
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
                <FormLabel>What is your Machinery Book Values?</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Book Values" {...field} />
                </FormControl>
                <FormDescription>
                  Sum of all machinery book values in the start year. Often corresponds with the residual value.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <table className="w-full my-4">
            <thead>
              <tr>
                <th className="font-medium min-w-[120px]">Machine</th>
                {costTypes.map(({ name }) => (
                  <th key={name} className="p-1 font-medium min-w-[120px]">
                    {name}
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
                      name={`tractors.${index}.name`}
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
                        name={`tractors.${index}.${costType as keyof MachineryFormValues["tractors"][number]}`}
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
                        if (farmData.tractors[index]?.id) {
                          del(`/machines/${farmData.tractors[index].id}`)
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
              onClick={() => append(createDefaults(general_id).tractors[0])}>Add Machine</Button>
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}
