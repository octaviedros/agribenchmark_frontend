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
import { upsert, del } from "@/lib/api"
import { v4 as uuidv4 } from "uuid"

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

const liabilitiesFormSchema = z.object({
  general_id: z.string().uuid(),
  id: z.string().uuid(),
  liabilities_id: z.string().uuid(),
  long_term_loans: z.coerce.number({
    required_error: "Please enter your Long-Term loans.",
  }),
  medium_term_loans: z.coerce.number({
    required_error: "Please enter your Medium-Term loans.",
  }),
  short_term_loans: z.coerce.number({
    required_error: "Please enter your Short-Term loans.",
  }),
  circulating_capital_overdraft: z.coerce.number({
    required_error: "Please enter your Circulating Capital.",
  }),
  savings: z.coerce.number({
    required_error: "Please enter your Savings.",
  }),
  total_liabilities: z.coerce.number({
    required_error: "Please enter your Total Liabilities.",
  }),
  total_long_term_loans: z.coerce.number({
    required_error: "Please enter your Total Long-Term loans.",
  }),
  total_medium_term_loans: z.coerce.number({
    required_error: "Please enter your Total Medium-Term loans.",
  }),
  total_short_term_loans: z.coerce.number({
    required_error: "Please enter your Total Short-Term loans.",
  }),
  perc_debt_total_assets: z.coerce.number({
    required_error: "Please enter your Percentage Debt of Total Assets.",
  }),
  year: z.coerce.number().int(),
})


type LiabilitiesFormValues = z.infer<typeof liabilitiesFormSchema>


// eslint-disable-next-line @typescript-eslint/no-explicit-any


function createDefaults(general_id: string): LiabilitiesFormValues {
  return {
    id: uuidv4(),
    liabilities_id: uuidv4(),
    general_id: general_id,
    long_term_loans: 0,
    medium_term_loans: 0,
    short_term_loans: 0,
    circulating_capital_overdraft: 0,
    savings: 0,
    total_long_term_loans: 0,
    total_medium_term_loans: 0,
    total_short_term_loans: 0,
    perc_debt_total_assets: 0,
    total_liabilities: 0,
    year: new Date().getFullYear(),
  }}

export function LiabilitiesFarmPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/liabilitiesinterestrates", general_id)
  const farmData = data ? data[0] : null
/*let farmData 
if (data) { 
  farmData = data[0]
}*/
  console.log(farmData)
  const form = useForm<LiabilitiesFormValues>({
    resolver: zodResolver(liabilitiesFormSchema),
    defaultValues: {
      ...createDefaults(general_id),
      ...farmData
    },
    mode: "onChange",
  })
// 
  useEffect(() => {
    form.reset({
      ...farmData
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])
async function onSubmit(data: LiabilitiesFormValues) {
    try {
      const mergedData = {
        ...farmData, // overwrite the farmData with the new data
        ...data,     //neuen Daten aus Formular; general_id und id wird nicht überschrieben
      }
      console.log(mergedData)
      await mutate(upsert(`/liabilitiesinterestrates`, mergedData), {
        optimisticData: mergedData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: true
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
        <h3 className="text-lg font-medium">What are your Current Interest Rates and Total Liabilities?</h3>
      </div>
      <Separator
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="long_term_loans"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Interest Rates</FormLabel>
                <FormDescription>
                  Long-Term Loans
                </FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="medium_term_loans"
            render={({ field }) => (
              <FormItem>
                <FormDescription>
                  Medium-Term Loans
                </FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="short_term_loans"
            render={({ field }) => (
              <FormItem>
                <FormDescription>
                  Short-Term Loans
                </FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="circulating_capital_overdraft"
            render={({ field }) => (
              <FormItem>
                <FormDescription>
                  Circulating Capital (Overdraft)
                </FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="savings"
            render={({ field }) => (
              <FormItem>
                <FormDescription>
                  Savings
                </FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="total_liabilities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Liabilities</FormLabel>
                <FormDescription>
                  Total Liabilities
                </FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="total_long_term_loans"
            render={({ field }) => (
              <FormItem>
                <FormDescription>
                  Total Long-Term Loans
                </FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="total_medium_term_loans"
            render={({ field }) => (
              <FormItem>
                <FormDescription>
                  Total Medium-Term Loans
                </FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="total_short_term_loans"
            render={({ field }) => (
              <FormItem>
                <FormDescription>
                  Total Short-Term Loans
                </FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="perc_debt_total_assets"
            render={({ field }) => (
              <FormItem>
                <FormDescription>
                  Percentage Debt of Total Assets
                </FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-4" type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default LiabilitiesFarmPage 
