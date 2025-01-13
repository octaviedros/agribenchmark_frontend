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

const finishingfeedingFormSchema = z.object({
})

type FinishingFeedingFormValues = z.infer<typeof finishingfeedingFormSchema>
  
  export function FinishingFeedingPage() {
    const form = useForm<FinishingFeedingFormValues>({
      resolver: zodResolver(finishingfeedingFormSchema),
      defaultValues: {
      },
  })

      const finishingproportion = ['Finishing Feed 1 (%)', 'Finishing Feed 2 (%)', 'Finishing Feed 3 (%)'];
      const finishingproportionTypes = [''];
  
      const finishingamount = ['Finishing Feed 1 (kg per year)', 'Finishing Feed 2 (kg per year)', 'Finishing Feed 3 (kg per year)', 'Total Amount of Feed (kg per year)'];
      const finishingamountTypes = [''];
   

function onSubmit(data: FinishingFeedingFormValues) {
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
            {finishingproportionTypes.map((finishingproportionType) => (
              <th key={finishingproportionType} className="p-1 font-medium">
                {finishingproportionType}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {finishingproportion.map((finishingproportion) => (
            <tr key={finishingproportion}>
              <td className="text-s mr-1">{finishingproportion}</td>
              {finishingproportionTypes.map((finishingproportionType) => (
                <td key={finishingproportionType} className="">
                  <Input className="ms-44 w-56" type="number" name={`${finishingproportion}-${finishingproportionType}`}/>
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
            {finishingamountTypes.map((finishingamountType) => (
              <th key={finishingamountType} className="p-1 font-medium">
                {finishingamountType}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {finishingamount.map((finishingamount) => (
            <tr key={finishingamount}>
              <td className="text-s mr-1">{finishingamount}</td>
              {finishingamountTypes.map((finishingamountType) => (
                <td key={finishingamountType} className="">
                  <Input className="ml-16 w-56" type="number" name={`${finishingamount}-${finishingamountType}`}/>
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

export default FinishingFeedingPage