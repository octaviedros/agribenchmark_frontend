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

const machines = [''];
const costTypes = ['Purchase Year', 'Purchase Price', 'Utilization Period', 'Replacement Value', 'Enterprise Codes'];

const machineryFormSchema = z.object({
    depreciation: z.string({
        required_error: "Please enter your yearly machinery depreciation.",}),
    bookvalue: z.string({
            required_error: "Please enter your machinery Book Values.",}),       
  })
  
  type MachineryFormValues = z.infer<typeof machineryFormSchema>
  
  export function MachineryFarmPage() {
    const form = useForm<MachineryFormValues>({
      resolver: zodResolver(machineryFormSchema),
      defaultValues: {
        depreciation: "", bookvalue: "", },  
    }) 

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
          name="depreciation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your annual Machinery Depreciation?</FormLabel>
              <FormControl>
                <Input placeholder="Depreciation" {...field} />
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
          name="bookvalue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your Machinery Book Values?</FormLabel>
              <FormControl>
                <Input placeholder="Book Values" {...field} />
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
              <th className="font-medium">Machine</th>
              {costTypes.map((costType) => (
                <th key={costType} className="p-1 font-medium">
                  {costType}
                </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {machines.map((machine) => (
                <tr key={machine}>
                  <td className="p-2 ">{machine}
                    <Input type="text" name={`${machine}-name`} className="w-full"/>
                  </td>
                  {costTypes.map((costType) => (
                    <td key={costType} className="p-2">
                      <Input type="number" name={`${machine}-${costType}`} className="w-full"/>
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

export default MachineryFarmPage
