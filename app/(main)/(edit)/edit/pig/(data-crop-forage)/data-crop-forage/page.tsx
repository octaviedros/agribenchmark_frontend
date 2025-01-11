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

const lands = ['Own Land', 'Rented Land', 'Rent Price for existing contracts', 'Rent Price for new contracts', 'Market Value'];
const landTypes = ['Cropland', 'Grassland', 'Other incl. wood']

const acreageFormSchema = z.object({
  })
  
type AcreageFormValues = z.infer<typeof acreageFormSchema>
  
  export function DataCropFarmPage() {
    const form = useForm<AcreageFormValues>({
      resolver: zodResolver(acreageFormSchema),
      defaultValues: { },  
    }) 
  
    function onSubmit(data: AcreageFormValues) {
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
        <h3 className="text-lg font-medium">What does your labor force look like?</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <table className="w-full my-2">
        <thead>
          <tr>
            <th className="font-medium">Available Acreage and Prices</th>
            {landTypes.map((landType) => (
              <th key={landType} className="p-1 font-medium" >{landType}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lands.map((land) => (
            <tr key={land}>
              <td className="p-2">{land}</td>
              {landTypes.map((landType) => (
                <td key={landType}>
                  <Input type="number" name={`${land}-${landType}`} className="w-full m-1"/>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default DataCropFarmPage 