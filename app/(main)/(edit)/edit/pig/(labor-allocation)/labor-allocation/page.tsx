"use client"

import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Check, ChevronsUpDown } from "lucide-react"
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

const laborallocationFormSchema = z.object({
  id: z.string().uuid(),
  general_id: z.string().uuid(),
  casual_labor_sow: z.number().min(2, {
    message: "Please enter Casual Labor Allocation for Sow Entperise.",
  }),
  family_labor_sow: z.number().min(2, {
    message: "Please enter Family Labor Allocation for Sow Entperise.",
  }),
  casual_labor_finishing: z.number().min(2, {
    message: "Please enter Casual Labor Allocation for Pig Finishing Entperise.",
  }),
  family_labor_finishing: z.number().min(2, {
    message: "Please enter Family Labor Allocation for Pig Finishing Entperise.",
  })
})

type LaborAllocationFormValues = z.infer<typeof laborallocationFormSchema>

interface LaborAllocationFormProps {
  farmData: LaborAllocationFormValues | undefined
}

export function LaborAllocationPage({ farmData }: LaborAllocationFormProps) {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const { data, error, isLoading } = useFarmData("/laborallocsowfinishing", general_id)

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
  const { mutate } = useFarmData("/laborallocsowfinishing", farmData?.general_id?.toString())
  const form = useForm<LaborAllocationFormValues>({
    resolver: zodResolver(laborallocationFormSchema),
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

  async function onSubmit(data: LaborAllocationFormValues) {
    try {
      const mergedData = {
        ...farmData, // overwrite the farmData with the new data
        ...data,
      }
      await mutate(put(`/laborallocsowfinishing/${farmData?.general_id}`, mergedData), {
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Labor Allocation in Sow and Pig Finishing Enterprise</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="casual_labor_sow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Casual Labor Sow Enterprise</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="family_labor_sow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Family Labor Sow Enterprise</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="casual_labor_finishing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Casual Labor Pig Finishing Enterprise</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="family_labor_finishing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Family Labor Pig Finishing Enterprise</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default LaborAllocationPage 