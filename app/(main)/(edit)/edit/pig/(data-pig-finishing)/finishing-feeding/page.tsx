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
  proportion_finishingfeed_1: z
  .number({
    required_error: "Please enter a number.",
  }),
  proportion_finishingfeed_2: z
  .number({
    required_error: "Please enter a number.",
  }),
  proportion_finishingfeed_3: z
  .number({
    required_error: "Please enter a number.",
  }),
  amount_finishingfeed_1: z
  .number({
    required_error: "Please enter a number.",
  }),
  amount_finishingfeed_2: z
  .number({
    required_error: "Please enter a number.",
  }),
  amount_finishingfeed_3: z
  .number({
    required_error: "Please enter a number.",
  }),
  total_amount_feed: z
  .number({
    required_error: "Please enter a number.",
  }),
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y- w-full">
      <div>
      <h3 className="text-lg font-medium">Proportion of Finishing Period</h3></div>
      <FormField
            control={form.control}
            name="proportion_finishingfeed_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finishing Feed 1</FormLabel>
                <FormDescription>%</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="proportion_finishingfeed_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finishing Feed 2</FormLabel>
                <FormDescription>%</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="proportion_finishingfeed_3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finishing Feed 3</FormLabel>
                <FormDescription>%</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
      <h3 className="space-y- mt-6 text-lg font-medium">Amount of Feed</h3>
      <FormField
            control={form.control}
            name="amount_finishingfeed_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finishing Feed 3</FormLabel>
                <FormDescription>kg per year</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount_finishingfeed_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finishing Feed 2</FormLabel>
                <FormDescription>kg per year</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount_finishingfeed_3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finishing Feed 3</FormLabel>
                <FormDescription>kg per year</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="total_amount_feed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Amount of Feed</FormLabel>
                <FormDescription>kg per year</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> </div>           

      <Button className="mt-4"  type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default FinishingFeedingPage