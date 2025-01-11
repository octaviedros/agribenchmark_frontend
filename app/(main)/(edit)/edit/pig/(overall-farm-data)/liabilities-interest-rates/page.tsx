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

const liabilitiesFormSchema = z.object({
    longterm: z.string({
        required_error: "Please enter your Long-Term loans.",}),
    mediumterm: z.string({
        required_error: "Please enter your Medium-Term loans.",}),
    shortterm: z.string({
        required_error: "Please enter your Short-Term loans.",}),
    circulatingcapital: z.string({
        required_error: "Please enter your Circulating Capital.",}),
    savings: z.string({
        required_error: "Please enter your Savings.",}),
    totallongterm: z.string({
        required_error: "Please enter your Total Long-Term loans.",}),
    totalmediumterm: z.string({
        required_error: "Please enter your Total Medium-Term loans.",}),
    totalshortterm: z.string({
        required_error: "Please enter your Total Short-Term loans.",}),
    percentagetotaldebt: z.string({
        required_error: "Please enter your Percentage Debt of Total Assets.",}),

  })
  
  type LiabilitiesFormValues = z.infer<typeof liabilitiesFormSchema>
  
  export function LiabilitiesFarmPage() {
    const form = useForm<LiabilitiesFormValues>({
      resolver: zodResolver(liabilitiesFormSchema),
      defaultValues: { },
  })
  
    function onSubmit(data: LiabilitiesFormValues) {
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
        <h3 className="text-lg font-medium">What are your Current Interest Rates and Total Liabilities?</h3>
      </div>
      <Separator 
      />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y">
        <FormField
          control={form.control}
          name="longterm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Interest Rates</FormLabel>
              <FormDescription>
                    Long-Term Loans
                </FormDescription>
              <FormControl>
                <Input {...field} /> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mediumterm"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                    Medium-Term Loans
                </FormDescription>
              <FormControl>
                <Input {...field} /> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shortterm"
          render={({ field }) => (
            <FormItem>
             <FormDescription>
                    Short-Term Loans
                </FormDescription>
              <FormControl>
                <Input {...field} /> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="circulatingcapital"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                    Circulating Capital (Overdraft)
                </FormDescription>
              <FormControl>
                <Input {...field} /> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="savings"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                    Savings
                </FormDescription>
              <FormControl>
                <Input {...field} /> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totallongterm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Liabilities</FormLabel>
              <FormDescription>
                    Total Long-Term Loans
                </FormDescription>
              <FormControl>
                <Input {...field} /> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalmediumterm"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                    Total Medium-Term Loans
                </FormDescription>
              <FormControl>
                <Input {...field} /> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalshortterm"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                    Total Short-Term Loans
                </FormDescription>
              <FormControl>
                <Input {...field} /> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="percentagetotaldebt"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                    Percentage Debt of Total Assets
                </FormDescription>
              <FormControl>
                <Input {...field} /> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-4" type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default LiabilitiesFarmPage 
