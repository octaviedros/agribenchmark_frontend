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
  landimprovements: z.string({
      required_error: "Please enter your Costs forLand Improvements.",}),
  maintenancemachinery: z.string({
      required_error: "Please enter your Costs for Maintenance Machinery.",}),
  maintenancebuildings: z.string({
      required_error: "Please enter your Costs for Maintenance for your Buildings and Facilities.",}),
  contractedlabor: z.string({
      required_error: "Please enter your Costs for Contracted Labor and Machinery Association",}),
  dieselvehicle: z.string({
      required_error: "Please enter your Costs for Diesel for Vehicles.",}),
  dieselheating: z.string({
      required_error: "Please enter your Costs for Diesel for Heating.",}),
  gasoline: z.string({
      required_error: "Please enter your Costs for Gasoline.",}),
  gas: z.string({
      required_error: "Please enter your Costs for Gas.",}),
  electricity: z.string({
      required_error: "Please enter your Costs for Electricity.",}),
  waterfresh: z.string({
      required_error: "Please enter your Costs for Fresh Water.",}),
  farminsurance: z.string({
      required_error: "Please enter your Costs for Farm Insurance.",}),
  invalidityinsurance: z.string({
      required_error: "Please enter your Costs for Invalidity Insurance.",}),
  taxesfees: z.string({
      required_error: "Please enter your Taxes and Fees.",}),
  advisoryservices: z.string({
      required_error: "Please enter your Costs for Advisory Services.",}),
  accounting: z.string({
      required_error: "Please enter your Costs for Accounting.",}),
  office: z.string({
      required_error: "Please enter your Costs for Office, Communication, Subscriptions and others",}),    
  })
  
  type OverheadFormValues = z.infer<typeof overheadFormSchema>
  
  export function OverheadFarmPage() {
    const form = useForm<OverheadFormValues>({
      resolver: zodResolver(overheadFormSchema),
      defaultValues: { },  
    }) 
  
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
        <h3 className="text-lg font-medium">What are your Overhead costs?</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y">
      <FormField
          control={form.control}
          name="landimprovements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Overhead Costs</FormLabel>
              <FormDescription>
                    Land Improvements
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
          name="maintenancemachinery"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                    Costs for Maintenance Machinery
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
          name="maintenancebuildings"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                    Costs for Maintenance for your Buildings and Facilities
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
          name="contractedlabor"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                    Costs for Contracted Labor and Machinery Association
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
          name="dieselvehicle"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                    Costs for Diesel for Vehicles
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
          name="dieselheating"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                    Costs for Diesel for Heating
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
          name="gasoline"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                    Costs for Gasoline
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
          name="gas"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                    Costs for Gas
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
          name="electricity"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                    Costs for Electricity
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
          name="waterfresh"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                    Costs for Fresh Water
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
          name="farminsurance"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                    Costs for Farm Insurance
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
          name="invalidityinsurance"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                    Costs for Invalidity Insurance
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
          name="taxesfees"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                    Taxes and Fees
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
          name="advisoryservices"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                    Costs for Advisory Services
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
          name="accounting"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                    Costs for Accounting
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
          name="office"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                    Costs for Office, Communication, Subscriptions and others
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

export default OverheadFarmPage 