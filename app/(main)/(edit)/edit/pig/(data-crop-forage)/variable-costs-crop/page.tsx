"use client"

import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Check, ChevronsUpDown, Trash2 } from "lucide-react"
import { z } from "zod"

import { put } from "@/lib/api"
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

const varcostcropFormSchema = z.object({
  id: z.string().uuid(),
  general_id: z.string().uuid(),
  seeds: z.number(),
  fertilizer: z.number(),
  herbicide: z.number(),
  fungicide: z.number(),
  contract_labor: z.number(),
  energy: z.number(),
  other: z.number(),

  varcostrow: z.array(z.object({
    value: z.string()
  })),


})

type VarCostCropFormValues = z.infer<typeof varcostcropFormSchema>

interface VarCostCropFormProps {
  farmData: VarCostCropFormValues | undefined
}

export function VarCostCropPage({ farmData }: VarCostCropFormProps) {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const { data, error, isLoading } = useFarmData("/varcostcrop", general_id)

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
  if (error) {
    console.error(error)
    return <div className="p-4">Failed to load farm data.</div>
  }
  const { mutate } = useFarmData("/varcostcrop", farmData?.general_id?.toString())
  const form = useForm<VarCostCropFormValues>({
    resolver: zodResolver(varcostcropFormSchema),
    defaultValues: {
      ...farmData
    },
    mode: "onChange",
  })

  useEffect(() => {
    form.reset({
      ...farmData
    })
  }, [farmData])

  async function onSubmit(data: VarCostCropFormValues) {
    try {
      const mergedData = {
        ...farmData, // overwrite the farmData with the new data
        ...data,
      }
      await mutate(put(`/varcostcrop/${farmData?.general_id}`, mergedData), {
        optimisticData: mergedData,
        rollbackOnError: true,
        populateCache: false,
        revalidate: false
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "varcostrow",
  })

  const varcostcrops = [''];
  const varcostcropTypes = ['Seeds', 'Fertilizer', 'Herbicide', 'Fungicide/Insecticide', 'Contract labor', 'Energy', 'Other'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Variable Costs of Crop and Forage Production</h3>
      </div>
      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          <table className="w-full my-4">
            <thead>
              <tr>
                <th className="font-medium">Crop</th>
                {varcostcropTypes.map((varcostcropType) => (
                  <th key={varcostcropType} className="p-1 font-medium">
                    {varcostcropType}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {varcostcrops.map((varcostcrop) => (
                <tr key={varcostcrop}>
                  <td className="p-2 min-w-[120px]">{varcostcrop}
                    <Input type="text" name={`${varcostcrop}-name`} />
                  </td>
                  {varcostcropTypes.map((varcostcropType) => (
                    <td key={varcostcropType} className="p-2 min-w-[120px]">
                      <Input type="number" name={`${varcostcrop}-${varcostcropType}`} />
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
                name={`varcostrow.${index}.value`}
                render={({ field }) => (
                  <table className="w-full my-4">
                    <tbody>
                      {varcostcrops.map((varcostcrop) => (
                        <tr key={varcostcrop}>
                          <td className="p-2 min-w-[127px]">{varcostcrop}
                            <Input type="text" name={`${varcostcrop}-name`} />
                          </td>
                          {varcostcropTypes.map((varcostcropType) => (
                            <td key={varcostcropType} className="p-2 min-w-[127px]">
                              <Input type="number" name={`${varcostcrop}-${varcostcropType}`} />
                            </td>
                          ))}
                          <td>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => remove(index)} ><Trash2 /></Button>
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
              onClick={() => append({ value: "" })} >Add Row</Button>
          </div>


          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default VarCostCropPage
