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
  buying_f_castpiglets: z
  .number({
    required_error: "Please enter a number.",
  }),
  buying_piglets_for_finishing: z
  .number({
    required_error: "Please enter a number.",
  }),
  selling_finishing_pigs_gi_ba: z
  .number({
    required_error: "Please enter a number.",
  }),
  selling_finishing_pigs_em_ic: z
  .number({
    required_error: "Please enter a number.",
  }),
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
        <div><h3 className="space-y- mt-4 text-lg font-medium">Buying</h3>
        <FormField
            control={form.control}
            name="buying_f_castpiglets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Female & Castrate Piglets</FormLabel>
                <FormDescription>per kg LW</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="buying_piglets_for_finishing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Boars Piglets for Finishing</FormLabel>
                <FormDescription>per kg LW</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div><h3 className="space-y- mt-6 text-lg font-medium">Selling</h3>
          <FormField
            control={form.control}
            name="selling_finishing_pigs_gi_ba"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finishing Pigs (Female & Castrates)</FormLabel>
                <FormDescription>per kg CW</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="selling_finishing_pigs_em_ic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finishing Pigs (Boars)</FormLabel>
                <FormDescription>per kg CW</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
     
      <Button className="mt-4"  type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default FinishingPricePage