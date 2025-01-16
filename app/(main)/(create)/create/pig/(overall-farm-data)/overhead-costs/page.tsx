"use client"

import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Check, ChevronsUpDown } from "lucide-react"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const overheadFormSchema = z.object({
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
  
  export function OverheadFarmPage() {
    const form = useForm<OverheadFormValues>({
      resolver: zodResolver(overheadFormSchema),
      defaultValues: { },  
    }) 

    const overheadcosts = ['Land Improvements', 'Maintenance Machinery', 'Maintenance Buildings', 'Contracted Labor and Machinery Association',
                               'Diesel for Vehicles', 'Diesel for Heating', 'Gasoline', 'Gas', 'Electricity', 'Fresh Water', 'Farm Insurance', 
                                'Invalidity Insurance', 'Taxes and Fees', 'Advisory Services', 'Accounting', 'Office, Communication, Subscriptions and others'];
    const overheadcostsTypes = [''];
    const unitTypes = ['Amount per year'];
  
    function onSubmit(data: OverheadFormValues) {
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
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