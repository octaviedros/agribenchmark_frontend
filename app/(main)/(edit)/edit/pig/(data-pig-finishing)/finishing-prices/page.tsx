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

const finishingpriceFormSchema = z.object({
})

type FinishingPriceFormValues = z.infer<typeof finishingpriceFormSchema>
  
  export function FinishingPricePage() {
    const form = useForm<FinishingPriceFormValues>({
      resolver: zodResolver(finishingpriceFormSchema),
      defaultValues: {
      },
  })

      const finishingbuying = ['Female & Castrate Piglets', 'Boars Piglets for Finishing'];
      const finishingbuyingTypes = [''];
  
      const finishingselling = ['Finishing Pigs (Female & Castrates)', 'Finishing Pigs (Boars)'];
      const finishingsellingTypes = [''];
   

function onSubmit(data: FinishingPriceFormValues) {
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
        <h3 className="text-lg font-medium">Pig Finishing Prices</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
      <table className="my-4">
        <thead>
          <tr>
            <th className="font-semibold text-base text-left">Buying</th>
            {finishingbuyingTypes.map((finishingbuyingType) => (
              <th key={finishingbuyingType} className="p-1 font-medium w-60">
                {finishingbuyingType}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {finishingbuying.map((finishingbuying) => (
            <tr key={finishingbuying}>
              <td className="text-s mr-1">{finishingbuying}</td>
              {finishingbuyingTypes.map((finishingbuyingType) => (
                <td key={finishingbuyingType} className="">
                  <Input className="ml-24 w-half" type="number" name={`${finishingbuying}-${finishingbuyingType}`}/>
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
            {finishingsellingTypes.map((finishingsellingType) => (
              <th key={finishingsellingType} className="p-1 font-medium">
                {finishingsellingType}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {finishingselling.map((finishingselling) => (
            <tr key={finishingselling}>
              <td className="text-s mr-1">{finishingselling}</td>
              {finishingsellingTypes.map((finishingsellingType) => (
                <td key={finishingsellingType} className="">
                  <Input className="ms-8 w-60" type="number" name={`${finishingselling}-${finishingsellingType}`}/>
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

export default FinishingPricePage