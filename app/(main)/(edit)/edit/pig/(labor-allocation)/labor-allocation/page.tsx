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

const laborallocationFormSchema = z.object({
    casual_labor_sow: z.number().min(2, {
        message: "Please enter Casual Labor Allocation for Sow Entperise.",
    }),
    family_labor_sow: z.number().min(2, {
        message: "Please enter Family Labor Allocation for Sow Entperise.",
    }),
    casual_labor_finishing: z.number().min(2, {
        message: "Please enter Casual Labor Allocation for Pig Finishing Entperise.",
    }),
    family_labor_finishing: z.number().min(2, {
        message: "Please enter Family Labor Allocation for Pig Finishing Entperise.",
    })
    })
  
  type LaborAllocationFormValues = z.infer<typeof laborallocationFormSchema>
  
  export function LaborAllocationPage() {
    const form = useForm<LaborAllocationFormValues>({
      resolver: zodResolver(laborallocationFormSchema),
      defaultValues: { },  
    }) 
  
    function onSubmit(data: LaborAllocationFormValues) {
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
        <h3 className="text-lg font-medium">Labor Allocation in Sow and Pig Finishing Enterprise</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2"> 
      <FormField
          control={form.control}
          name="casual_labor_sow"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Casual Labor Sow Enterprise</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="family_labor_sow"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Family Labor Sow Enterprise</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="casual_labor_finishing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Casual Labor Pig Finishing Enterprise</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="family_labor_finishing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Family Labor Pig Finishing Enterprise</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default LaborAllocationPage 