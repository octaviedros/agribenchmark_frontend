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


const liabilitiesFormSchema = z.object({
  general_id: z.number().nullable().optional(),
  long_term_loans: z.string({
    required_error: "Please enter your Long-Term loans.",}),
  medium_term_loans: z.string({
    required_error: "Please enter your Medium-Term loans.",}),
  short_term_loans: z.string({
    required_error: "Please enter your Short-Term loans.",}),
  circulating_capital_overdraft: z.string({
    required_error: "Please enter your Circulating Capital.",}),
  savings: z.string({
    required_error: "Please enter your Savings.",}),
  total_liablilities: z.string({
    required_error: "Please enter your Total Liabilities.",}),
  total_long_term_loans: z.string({
    required_error: "Please enter your Total Long-Term loans.",}),
  total_medium_term_loans: z.string({
    required_error: "Please enter your Total Medium-Term loans.",}),
  total_short_term_loans: z.string({
    required_error: "Please enter your Total Short-Term loans.",}),
  perc_debt_total_assets: z.string({
    required_error: "Please enter your Percentage Debt of Total Assets.",}),
})
  
  type LiabilitiesFormValues = z.infer<typeof liabilitiesFormSchema>

  interface LiabilitiesFormProps {
    farmData: LiabilitiesFormValues | undefined
  }
  
  export function LiabilitiesFarmPage({ farmData }: LiabilitiesFormProps) {
      const searchParams = useSearchParams()
      const general_id = searchParams.get("general_id") || ""
      const { data, error, isLoading } = useFarmData("/liabilitiesinterestrates", general_id)
      
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
      const { mutate } = useFarmData("/liabilitiesinterestrates", farmData?.general_id?.toString())
        const form = useForm<LiabilitiesFormValues>({
          resolver: zodResolver(liabilitiesFormSchema),
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
    
    

       async function onSubmit(data: LiabilitiesFormValues) {
          try {
            const mergedData = {
              ...farmData, // overwrite the farmData with the new data
              ...data,
            }
            await mutate(put(`/liabilitiesinterestrates/${farmData?.general_id}`, mergedData), {
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
        <h3 className="text-lg font-medium">What are your Current Interest Rates and Total Liabilities?</h3>
      </div>
      <Separator 
      />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y">
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
          name="total_long_term_loans"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Liabilities</FormLabel>
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
