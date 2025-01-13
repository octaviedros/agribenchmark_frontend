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

const sowpriceFormSchema = z.object({
})

type SowPriceFormValues = z.infer<typeof sowpriceFormSchema>
  
  export function SowPricePage() {
    const form = useForm<SowPriceFormValues>({
      resolver: zodResolver(sowpriceFormSchema),
      defaultValues: {
      },
  })

      const sowbuying = ['Gilts', 'Boars'];
      const sowbuyingTypes = [''];
  
      const sowselling = ['Sow', 'Boar', 'Weaning Piglet', 'Rearing Piglet', 'Proportion of weaned Pigs sold', 'Number of weanded Pigs sold'];
      const sowsellingTypes = [''];
   

function onSubmit(data: SowPriceFormValues) {
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
        <h3 className="text-lg font-medium">Sow Prices</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
      <table className="my-4">
        <thead>
          <tr>
            <th className="font-semibold text-base text-left">Buying</th>
            {sowbuyingTypes.map((sowbuyingType) => (
              <th key={sowbuyingType} className="p-1 font-medium">
                {sowbuyingType}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sowbuying.map((sowbuying) => (
            <tr key={sowbuying}>
              <td className="text-s mr-1">{sowbuying}</td>
              {sowbuyingTypes.map((sowbuyingType) => (
                <td key={sowbuyingType} className="">
                  <Input className="ms-52 w-3/5" type="number" name={`${sowbuying}-${sowbuyingType}`}/>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        </table>
        <table className="my-4">
        <thead>
          <tr>
            <th className="font-semibold text-base text-left">Selling</th>
            {sowsellingTypes.map((sowsellingType) => (
              <th key={sowsellingType} className="p-1 font-medium">
                {sowsellingType}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sowselling.map((sowselling) => (
            <tr key={sowselling}>
              <td className="text-s mr-1">{sowselling}</td>
              {sowsellingTypes.map((sowsellingType) => (
                <td key={sowsellingType} className="">
                  <Input className="ms-8 w-60" type="number" name={`${sowselling}-${sowsellingType}`}/>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        </table>
      <Button className="mt-4"  type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default SowPricePage