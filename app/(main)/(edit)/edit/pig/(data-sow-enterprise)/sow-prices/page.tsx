"use client"

import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Check, ChevronsUpDown } from "lucide-react"
import { number, z } from "zod"

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
  buying_gilts: z
  .number({
    required_error: "Please enter a number.",
  }),
  buying_boars: z
  .number({
    required_error: "Please enter a number.",
  }),
  selling_sow: z
  .number({
    required_error: "Please enter a number.",
  }),
  selling_boar: z
  .number({
    required_error: "Please enter a number.",
  }),
  selling_weaning_piglet: z
  .number({
    required_error: "Please enter a number.",
  }),
  selling_rearing_piglet: z
  .number({
    required_error: "Please enter a number.",
  }),
  proportion_weanded_pigs_sold: z
  .number({
    required_error: "Please enter a number.",
  }),
  no_weanded_pigs_sold: z
  .number({
    required_error: "Please enter a number.",
  }),
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
      <div>
        <h3 className="text-lg font-medium">Buying</h3></div>
      <FormField
            control={form.control}
            name="buying_gilts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buying Guilt Price</FormLabel>
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
            name="buying_boars"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buying Boar Price</FormLabel>
                <FormDescription>Cost per head</FormDescription>
                <FormControl>
                  <Input {...field} /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
        <h3 className="text-lg font-medium">Selling</h3></div>
          <FormField
            control={form.control}
            name="selling_sow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Sow Price</FormLabel>
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
            name="selling_boar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Boar Price</FormLabel>
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
            name="selling_weaning_piglet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Weaning Piglet Price</FormLabel>
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
            name="selling_rearing_piglet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Rearing Piglet Price</FormLabel>
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
            name="proportion_weanded_pigs_sold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proportion of weaned Pigs sold</FormLabel>
                <FormDescription>Percentage</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
      <Button className="mt-4"  type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default SowPricePage