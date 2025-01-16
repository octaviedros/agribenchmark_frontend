"use client"

import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Check, ChevronsUpDown } from "lucide-react"
import { z } from "zod"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashCan} from "@fortawesome/free-regular-svg-icons"

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



const machineryFormSchema = z.object({
    sum_annual_depreciation: z.string({
        required_error: "Please enter your yearly machinery depreciation.",}),
    sum_bookvalues: z.string({
            required_error: "Please enter your machinery Book Values.",}),
    tractors: z.array(
        z.object({
            name: z.string(),
            purchase_year: z.string(),
            purchase_price: z.string(),
            utilization_period: z.string(),
            replacement_value: z.string(),
            enterprise_codes: z.string(),
        })
    )       
  })
  
  type MachineryFormValues = z.infer<typeof machineryFormSchema>
  
  export function MachineryFarmPage() {
    const form = useForm<MachineryFormValues>({
      resolver: zodResolver(machineryFormSchema),
      defaultValues: {
        sum_annual_depreciation: "", sum_bookvalues: "", },  
    })

    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "tractors",
    })

    const machines = [''];
    const costTypes = ['Purchase Year', 'Purchase Price', 'Utilization Period', 'Replacement Value', 'Enterprise Codes'];

    function onSubmit(data: MachineryFormValues) {
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
        <h3 className="text-lg font-medium">What kind of machinery and equipment do you use on your farm?</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="sum_annual_depreciation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your annual Machinery Depreciation?</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Depreciation" {...field} />
              </FormControl>
              <FormDescription>
                Sum of all depreciation values of all machines. Can be found in the inventory list of your accounting.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
       <FormField
          control={form.control}
          name="sum_bookvalues"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your Machinery Book Values?</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Book Values" {...field} />
              </FormControl>
              <FormDescription>
                Sum of all machinery book values in the start year. Often corresponds with the residual value.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <table className="w-full my-4">
          <thead>
            <tr>
              <th className="font-medium min-w-[120px]">Machine</th>
              {costTypes.map((costType) => (
                <th key={costType} className="p-1 font-medium min-w-[120px]">
                  {costType}
                </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {machines.map((machine) => (
                <tr key={machine}>
                  <td className="p-1 ">{machine}
                    <Input type="text" name={`${machine}-name`} className="w-full"/>
                  </td>
                  {costTypes.map((costType) => (
                    <td key={costType} className="p-1">
                      <Input type="number" name={`${machine}-${costType}`} className="w-full"/>
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
              name={`tractors.${index}.name`}
              render={({ field }) => (
          <table className="">
            <tbody>
              {machines.map((machine) => (
                <tr key={machine}>
                  <td className="p-1 min-w-[120px]">{machine}
                    <Input type="text" name={`${machine}-name`} className="w-full"/>
                  </td>
                  {costTypes.map((costType) => (
                    <td key={costType} className="p-1 min-w-[120px]">
                      <Input type="number" name={`${machine}-${costType}`} className="w-full"/>
                    </td>
                  ))}
                  <td>
                    <Button 
                    type="button"
                    variant="destructive"
                    size="icon" onClick={() => remove(index)}><FontAwesomeIcon icon={faTrashCan} /></Button>
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
            className="mt-4"
            onClick={() => append({ name: "", purchase_year: "", purchase_price: "", utilization_period: "", replacement_value: "", enterprise_codes: "" })}>Add Row</Button>
            </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default MachineryFarmPage
