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

const finishingfeedrationFormSchema = z.object({
  id: z.string().uuid(),
  general_id: z.string().uuid(),
  self_produced_finishingfeed1: z
    .number({
      required_error: "Please enter a number.",
    }),
  self_produced_finishingfeed2: z
    .number({
      required_error: "Please enter a number.",
    }),
  self_produced_finishingfeed3: z
    .number({
      required_error: "Please enter a number.",
    }),
  bought_finishingfeed1: z
    .number({
      required_error: "Please enter a number.",
    }),
  bought_finishingfeed2: z
    .number({
      required_error: "Please enter a number.",
    }),
  bought_finishingfeed3: z
    .number({
      required_error: "Please enter a number.",
    }),
  selffeedrationrows: z.array(z.object({
    value: z.string()
  })),
  boughtfeedrationrows: z.array(z.object({
    value: z.string()
  })),

})

type FinishingFeedRationFormValues = z.infer<typeof finishingfeedrationFormSchema>

interface FinishingFeedRationFormProps {
  farmData: FinishingFeedRationFormValues | undefined
}

export function FinishingFeedRationPage({ farmData }: FinishingFeedRationFormProps) {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const { data, error, isLoading } = useFarmData("/feedration", general_id)

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
  const { mutate } = useFarmData("/feedration", farmData?.general_id?.toString())
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
  }, [farmData])

  async function onSubmit(data: FinishingFeedRationFormValues) {
    try {
      const mergedData = {
        ...farmData, // overwrite the farmData with the new data
        ...data,
      }
      await mutate(put(`/feedration/${farmData?.general_id}`, mergedData), {
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
    name: "selffeedrationrows",
  })

  const { fields: boughtfields, append: boughtappend, remove: boughtremove } = useFieldArray({
    control: form.control,
    name: "boughtfeedrationrows",
  })

  const finishingselfproduced = [''];
  const finishingselfproducedTypes = ['Finishing Feed 1', 'Finishing Feed 2', 'Finishing Feed 3'];

  const finishingboughtfeeds = [''];
  const finishingboughtfeedTypes = ['Finishing Feed 1', 'Finishing Feed 2', 'Finishing Feed 3'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Feed Rations Pig Finishing Enterprise</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h1>Self Produced Feed</h1>
          <table className="w-full my-4">
            <thead>
              <tr>
                <th className="font-medium min-w-[200px]">Crop Name</th>
                {finishingselfproducedTypes.map((finishingselfproducedTypes) => (
                  <th key={finishingselfproducedTypes} className="p-1 font-medium min-w-[120px]">
                    {finishingselfproducedTypes}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {finishingselfproduced.map((finishingselfproduced) => (
                <tr key={finishingselfproduced}>
                  <td className="p-2 min-w-[200px]">{finishingselfproduced}
                    <Input type="text" name={`${finishingselfproduced}-name`} className="w-full" />
                  </td>
                  {finishingselfproducedTypes.map((finishingselfproducedType) => (
                    <td key={finishingselfproducedType} className="p-2 min-w-[160px]">
                      <Input type="number" name={`${finishingselfproduced}-${finishingselfproducedType}`} className="w-full" />
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
                name={`selffeedrationrows.${index}.value`}
                render={({ field }) => (
                  <table className="w-full my-4">
                    <tbody>
                      {finishingselfproduced.map((finishingselfproduced) => (
                        <tr key={finishingselfproduced}>
                          <td className="p-2 min-w-[200px]">{finishingselfproduced}
                            <Input type="text" name={`${finishingselfproduced}-name`} className="w-full" />
                          </td>
                          {finishingselfproducedTypes.map((finishingselfproducedType) => (
                            <td key={finishingselfproducedType} className="p-2 min-w-[160px]">
                              <Input type="number" name={`${finishingselfproduced}-${finishingselfproducedType}`} className="w-full" />
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
            <Button type="button" onClick={() => append({ value: "" })}>Add Row</Button>
          </div>
          <h1>Bought Feed</h1>
          <table className="w-full my-4">
            <thead>
              <tr>
                <th className="font-medium min-w-[200px]">Crop Name</th>
                {finishingboughtfeedTypes.map((finishingboughtfeedTypes) => (
                  <th key={finishingboughtfeedTypes} className="p-1 font-medium min-w-[120px]">
                    {finishingboughtfeedTypes}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {finishingboughtfeeds.map((finishingboughtfeeds) => (
                <tr key={finishingboughtfeeds}>
                  <td className="p-2 min-w-[200px]">{finishingboughtfeeds}
                    <Input type="text" name={`${finishingboughtfeeds}-name`} className="w-full" />
                  </td>
                  {finishingboughtfeedTypes.map((finishingboughtfeedType) => (
                    <td key={finishingboughtfeedType} className="p-2 min-w-[160px]">
                      <Input type="number" name={`${finishingboughtfeeds}-${finishingboughtfeedType}`} className="w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {boughtfields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`boughtfeedrationrows.${index}.value`}
                render={({ field }) => (
                  <table className="w-full my-4">
                    <tbody>
                      {finishingboughtfeeds.map((finishingboughtfeeds) => (
                        <tr key={finishingboughtfeeds}>
                          <td className="p-2 min-w-[200px]">{finishingboughtfeeds}
                            <Input type="text" name={`${finishingboughtfeeds}-name`} className="w-full" />
                          </td>
                          {finishingboughtfeedTypes.map((finishingboughtfeedType) => (
                            <td key={finishingboughtfeedType} className="p-2 min-w-[160px]">
                              <Input type="number" name={`${finishingboughtfeeds}-${finishingboughtfeedType}`} className="w-full" />
                            </td>
                          ))}
                          <td>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => boughtremove(index)}></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              />
            ))}
            <Button type="button" onClick={() => boughtappend({ value: "" })}>Add Row</Button>
          </div>


        </form>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  )
}
export default FinishingFeedRationPage