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


const overheadFormSchema = z.object({
  id: z.string().uuid(),
  general_id: z.string().uuid(),
  land_improvements: z.string({
      required_error: "Please enter your Costs for Land Improvements.",}),
  maintenance_machinery: z.string({
      required_error: "Please enter your Costs for Maintenance Machinery.",}),
  maintenance_buildings: z.string({
      required_error: "Please enter your Costs for Maintenance for your Buildings and Facilities.",}),
  contracted_labor_machinery_association: z.string({
      required_error: "Please enter your Costs for Contracted Labor and Machinery Association",}),
  diesel_vehicles: z.string({
      required_error: "Please enter your Costs for Diesel for Vehicles.",}),
  diesel_heating_irrigation: z.string({
      required_error: "Please enter your Costs for Diesel for Heating.",}),
  gasoline: z.string({
      required_error: "Please enter your Costs for Gasoline.",}),
  gas: z.string({
      required_error: "Please enter your Costs for Gas.",}),
  electricity: z.string({
      required_error: "Please enter your Costs for Electricity.",}),
  water_fresh_waste_water_fees: z.string({
      required_error: "Please enter your Costs for Fresh Water.",}),
  farm_insurance: z.string({
      required_error: "Please enter your Costs for Farm Insurance.",}),
  invalidity_insurance: z.string({
      required_error: "Please enter your Costs for Invalidity Insurance.",}),
  taxes_fees: z.string({
      required_error: "Please enter your Costs for Taxes and Fees.",}),
  advisory_services_trainings: z.string({
      required_error: "Please enter your Costs for Advisory Services.",}),
  accounting: z.string({
      required_error: "Please enter your Costs for Accounting.",}),
  office_communication_subs: z.string({
      required_error: "Please enter your Costs for Office, Communication, Subscriptions and others",}),    
  })
  
  type OverheadFormValues = z.infer<typeof overheadFormSchema>

  interface OverheadFormProps {
    farmData: OverheadFormValues | undefined
  }
  
  export function OverheadFarmPage({ farmData }: OverheadFormProps) {
      const searchParams = useSearchParams()
      const general_id = searchParams.get("general_id") || ""
      const { data, error, isLoading } = useFarmData("/overheadcosts", general_id)
      
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
      const { mutate } = useFarmData("/overheadcosts", farmData?.general_id?.toString())
        const form = useForm<OverheadFormValues>({
          resolver: zodResolver(overheadFormSchema),
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
    
  
       async function onSubmit(data: OverheadFormValues) {
          try {
            const mergedData = {
              ...farmData, // overwrite the farmData with the new data
              ...data,
            }
            await mutate(put(`/overheadcosts/${farmData?.general_id}`, mergedData), {
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
          <h3 className="text-lg font-medium">Overhead Costs</h3>
        </div>
        <Separator />
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
            control={form.control}
            name="land_improvements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Land Improvements</FormLabel>
                <FormDescription> Amount per year</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maintenance_machinery"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maintenance Machinery</FormLabel>
                <FormDescription> Amount per year</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maintenance_buildings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maintenance Buildings and Facilities</FormLabel>
                <FormDescription> Amount per year</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contracted_labor_machinery_association"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contracted Labor and Machinery Association</FormLabel>
                <FormDescription> Amount per year</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )} 
          />
          <FormField
            control={form.control}
            name="diesel_vehicles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diesel for Vehicles</FormLabel>
                <FormDescription> Amount per year</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="diesel_heating_irrigation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diesel for Heating</FormLabel>
                <FormDescription> Amount per year</FormDescription>

                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gasoline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gasoline</FormLabel>
                <FormDescription> Amount per year</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gas</FormLabel>
                <FormDescription> Amount per year</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="electricity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Electricity</FormLabel>
                <FormDescription> Amount per year</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="water_fresh_waste_water_fees"
            render={({ field }) => (
              <FormItem>
              <FormLabel>Fresh Water</FormLabel>
              <FormDescription> Amount per year</FormDescription>
              <FormControl>
                <Input {...field} /> 
              </FormControl>
              
              <FormMessage />
              </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="farm_insurance"
            render={({ field }) => (
              <FormItem>
              <FormLabel>Farm Insurances</FormLabel>
              <FormDescription> Amount per year</FormDescription>
              <FormControl>
                <Input {...field} /> 
              </FormControl>
              
              <FormMessage />
              </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="invalidity_insurance"
            render={({ field }) => (
              <FormItem>
              <FormLabel>Invalidity Insurance</FormLabel>
              <FormDescription> Amount per year</FormDescription>
              <FormControl>
                <Input {...field} /> 
              </FormControl>

              <FormMessage />
              </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="taxes_fees"
            render={({ field }) => (
              <FormItem>
              <FormLabel>Taxes and Fees</FormLabel>
              <FormDescription> Amount per year</FormDescription>
              <FormControl>
                <Input {...field} /> 
              </FormControl>
              
              <FormMessage />
              </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="advisory_services_trainings"
            render={({ field }) => (
              <FormItem>
              <FormLabel>Advisory Services/Trainings</FormLabel>
              <FormDescription> Amount per year</FormDescription>
              <FormControl>
                <Input {...field} /> 
              </FormControl>
              
              <FormMessage />
              </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="accounting"
            render={({ field }) => (
              <FormItem>
              <FormLabel>Accounting</FormLabel>
              <FormDescription> Amount per year</FormDescription>
              <FormControl>
                <Input {...field} /> 
              </FormControl>

              <FormMessage />
              </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="office_communication_subs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Office, Communication, Subscriptions...</FormLabel>
                <FormDescription> Amount per year</FormDescription>
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
  

export default OverheadFarmPage 