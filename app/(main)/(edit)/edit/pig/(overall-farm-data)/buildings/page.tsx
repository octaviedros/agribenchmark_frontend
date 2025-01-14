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

const buildings = [''];
const costTypes = ['Purchase Year', 'Purchase Price', 'Utilization Period', 'Replacement Value', 'Enterprise Codes'];

const buildingsFormSchema = z.object({
  sum_annual_depreciation: z.string().min(2, {
    message: "Depreciation must be at least 2 characters.",
  }),
  sum_book_values: z.string().min(2, {
    message: "Book Value must be at least 2 characters.",
  }),
  building_name: z.array(
    z.object({
      name: z.string(),
      purchase_year: z.string(),
      purchase_price: z.string(),
      utilization_period: z.string(),
      replacement_value: z.string(),
      enterprise_codes: z.string(),
  }),

)})
  
  type BuildingsFormValues = z.infer<typeof buildingsFormSchema>
  
  export function BuildingsFarmPage() {
    const form = useForm<BuildingsFormValues>({
      resolver: zodResolver(buildingsFormSchema),
      defaultValues: {
        sum_annual_depreciation: "",
      },
  }) 
  
    function onSubmit(data: BuildingsFormValues) {
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
        <h3 className="text-lg font-medium">Buildings and Facilities</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="sum_annual_depreciation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Deprecation on Buildings & Facilities</FormLabel>
              <FormControl>
                <Input placeholder="Annual Depreciation" {...field} />
              </FormControl>
              <FormDescription>
              Sum of all depreciation values of all buildings. Can be found in the inventory list of your accounting.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          /> 
        <FormField
          control={form.control}
          name="sum_book_values"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Building & Facilities Book Values</FormLabel>
              <FormControl>
                <Input placeholder="Book Value" {...field} />
              </FormControl>
              <FormDescription>
              Sum of all building book values in the start year. Often corresponds with the residual value.
              </FormDescription>
              <FormMessage />
            </FormItem>
            )}
            />
        <table className="w-full my-4">
          <thead>
            <tr>
              <th className="font-medium">Building</th>
              {costTypes.map((costType) => (
                <th key={costType} className="p-1 font-medium">
                  {costType}
                </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {buildings.map((building) => (
                <tr key={building}>
                  <td className="p-2 ">{building}
                    <Input type="text" name={`${building}-name`} className="w-full"/>
                  </td>
                  {costTypes.map((costType) => (
                    <td key={costType} className="p-2">
                      <Input type="number" name={`${building}-${costType}`} className="w-full"/>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table> 
          <Button className="mx-2" type="button">Add Row</Button>
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default BuildingsFarmPage 