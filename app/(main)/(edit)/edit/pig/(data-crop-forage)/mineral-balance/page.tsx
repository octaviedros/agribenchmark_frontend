"use client"

import { Separator } from "@/components/ui/separator"
import { useFarmData } from "@/hooks/use-farm-data"
import { upsert } from "@/lib/api"
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
  FormField
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"


const mineralbalanceFormSchema = z.object({
  fertilizerusage: z.array(
    z.object({
      general_id: z.string().uuid(),
      id: z.string().uuid(),
      fertilizer_id: z.string().uuid(),
      fertilizer_type: z.string(),
      fertilizer_name: z.string(),
      fertilizer_name_custom: z.string(),
      amount: z.coerce.number(),
      amount_unit: z.coerce.number(),
      n_content_per_unit: z.coerce.number(),
    })
  )
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MineralBalanceDBSchema = z.object({
  id: z.string().uuid(),
  fertilizer_id: z.string().uuid(),
  general_id: z.string().uuid(),
  fertilizer_type: z.string(),
  fertilizer_name: z.string(),
  fertilizer_name_custom: z.string(),
  amount: z.coerce.number(),
  amount_unit: z.coerce.number(),
  n_content_per_unit: z.coerce.number(),
})

type MineralBalanceValues = z.infer<typeof mineralbalanceFormSchema>
type MineralBalanceDBValues = z.infer<typeof MineralBalanceDBSchema>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbDataToForm(data: any, general_id: string) {
  if (!data || !data.length) return createDefaults(general_id)
  return {
    id: data[0].id,
    general_id: data[0].general_id,
    fertilizerusage: data
  }
}

function formDataToDb(data: MineralBalanceValues) {
  return data.fertilizerusage.map((fertilizerusages) => ({
    ...fertilizerusages,
  }))
}

function createDefaults(general_id: string) {
  return {
    feedprice: [{
      general_id: general_id,
      id: uuidv4(),
      fertilizer_id: uuidv4(),
      crop_name: "",//das fehlt in der DB; die ganze DB Tabelle ergibt keinen Sinn
      fertilizer_type: "",
      /*fertilizer_name: "",
      fertilizer_name_custom: "",
      amount: 0,
      amount_unit: 0,
      n_content_per_unit: 0,*/
    }],
  }
}

export default function MineralBalancePage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    isLoading,
    mutate
  } = useFarmData("/fertilizer", general_id)

  const farmData = dbDataToForm(data, general_id)
  console.log(farmData)
  const form = useForm<MineralBalanceValues>({
    resolver: zodResolver(mineralbalanceFormSchema),
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
    name: "fertilizerusage",
  })

  async function onSubmit(formData: MineralBalanceValues) {
    try {
      console.log("submit", formData)
      const updatedData = formDataToDb(formData)
      // merge with previous farm data
      const mergedData = updatedData.map((row) => {
        const existingRow = (data as MineralBalanceDBValues[])?.find((r) => r.id === row.id)
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

  const mineralTypes: { name: string; value: keyof MineralBalanceValues["fertilizerusage"][number], tooltip?: string, type?: string }[] = [
    {
      name: "Nitrogen",
      value: "fertilizer_name",
      tooltip: "kg/ha"
    },
    {
      name: "Phosphorus",
      value: "fertilizer_name",
      tooltip: "kg/ha"
    },
    {
      name: "Potash",
      value: "fertilizer_name",
      tooltip: "kg/ha"
    },
    {
      name: "Calcium",
      value: "fertilizer_name",
      tooltip: "kg/ha"
    },
    {
      name: "Other",
      value: "fertilizer_name",
      tooltip: "kg/ha"
    },
  ]

  return (
    <div className="space-y-6 min">
      <div>
        <h3 className="text-lg font-medium">Mineral Balance and Fertilizer Input</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          <table className="w-full">
            <thead>
              <tr>
                <th className="font-medium min-w-[120px]">Crop</th>
                {mineralTypes.map((mineralType) => (
                  <th key={mineralType} className="p-1 font-medium min-w-[120px]">
                    {mineralType}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {minerals.map((mineral) => (
                <tr key={mineral}>
                  <td className="p-2 ">{mineral}
                    <Input type="text" name={`${mineral}-name`} />
                  </td>
                  {mineralTypes.map((mineralType) => (
                    <td key={mineralType} className="p-2">
                      <Input type="number" name={`${mineral}-${mineralType}`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`mineralrow.${index}.value`}
                render={({ field }) => (
                  <table className="w-full my-4">
                    <tbody>
                      {minerals.map((mineral) => (
                        <tr key={mineral}>
                          <td className="p-2 min-w-[120px] ">{mineral}
                            <Input type="text" name={`${mineral}-name`} {...field} />
                          </td>
                          {mineralTypes.map((mineralType) => (
                            <td key={mineralType} className="p-2 min-w-[120px]">
                              <Input type="number" name={`${mineral}-${mineralType}`} />
                            </td>
                          ))}
                          <td>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => remove(index)}><Trash2 /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              />
            ))}
            <Button
              type="button"
              onClick={() => append({ value: "" })}>Add Row</Button>
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}
