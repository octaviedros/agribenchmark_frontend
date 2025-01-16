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
import { tr } from "@faker-js/faker"

const finishingcostFormSchema = z.object({
  veterinary_medicine_supplies: z
  .number({
    required_error: "Please enter a number.",
  }),
  disinfection: z
  .number({
    required_error: "Please enter a number.",
  }),
  energy: z
  .number({
    required_error: "Please enter a number.",
  }),
  water: z
  .number({
    required_error: "Please enter a number.",
  }),
  manure_cost: z
  .number({
    required_error: "Please enter a number.",
  }),
  transport_cost: z
  .number({
    required_error: "Please enter a number.",
  }),
  specialised_pig_advisor: z
  .number({
    required_error: "Please enter a number.",
  }),
  animal_disease_levy: z
  .number({
    required_error: "Please enter a number.",
  }),
  carcass_disposal: z
  .number({
    required_error: "Please enter a number.",
  }),
  maintenance: z
  .number({
    required_error: "Please enter a number.",
  }),
  feed_mixing_preparation: z
  .number({
    required_error: "Please enter a number.",
  }),
  insurance: z
  .number({
    required_error: "Please enter a number.",
  }),
  cleaning: z
  .number({
    required_error: "Please enter a number.",
  }),
})

  type FinishingCostFormValues = z.infer<typeof finishingcostFormSchema>
  
  export function FinishingCostPage() {
    const form = useForm<FinishingCostFormValues >({
      resolver: zodResolver(finishingcostFormSchema),
      defaultValues: { },  
    })

    const varcosts = ['Veterenary Medicine & Supplies', 'Disinfection', 'Energy', 'Water', 'Manure Costs', 'Transport Costs', 'Specialised Pig Advisors',
                          'Animal Disease Levy', 'Carcass Disposal', 'Maintenance' ]
    const varcostTypes = [''];

    const fixedcost = ['Feed Mixing & Preparation', 'Insurance', 'Cleaning']
    const fixedcostTypes = [''];

    function onSubmit(data: FinishingCostFormValues) {
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
        <h3 className="text-lg font-medium">Sow Costs</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
          <h3 className="text-lg font-medium">Variable Costs</h3></div>
          <FormField
            control={form.control}
            name="veterinary_medicine_supplies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Veterinary Medicine & Supplies</FormLabel>
                <FormDescription>Cost per head</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="disinfection"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disinfection</FormLabel>
                <FormDescription>Cost per head</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="energy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Energy</FormLabel>
                <FormDescription>Cost per head</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="water"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Water</FormLabel>
                <FormDescription>Cost per head</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="manure_cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manure Costs</FormLabel>
                <FormDescription>Cost per head</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="transport_cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transport Costs</FormLabel>
                <FormDescription>Cost per head</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialised_pig_advisor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialised Pig Advisors</FormLabel>
                <FormDescription>Cost per head</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="animal_disease_levy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Animal Disease Levy</FormLabel>
                <FormDescription>Cost per head</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="carcass_disposal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carcass Disposal</FormLabel>
                <FormDescription>Cost per head</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maintenance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maintenance</FormLabel>
                <FormDescription>Cost per head</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
          <h3 className="text-lg font-medium">Fixed Costs</h3></div>
          <FormField
            control={form.control}
            name="feed_mixing_preparation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feed Mixing & Preparation</FormLabel>
                <FormDescription>Cost per enterprise</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="insurance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insurance</FormLabel>
                <FormDescription>Cost per enterprise</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cleaning"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cleaning</FormLabel>
                <FormDescription>Cost per enterprise</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
      </form>
      <Button type="submit">Submit</Button>
    </Form>
    </div>
  )
}

export default FinishingCostPage;