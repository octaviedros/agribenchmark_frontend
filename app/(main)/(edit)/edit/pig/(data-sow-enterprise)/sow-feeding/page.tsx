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

const sowfeedingFormSchema = z.object({
    sowfeeding: z.string().min(2, {
        message: "Username must be at least 2 characters.",
      }),
        sowgestationfeed: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        sowlactationfeed: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        sowtotalamount: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
    giltsfeeding: z.string().min(2, {
        message: "Username must be at least 2 characters.",
        }),
        gitlspecialfeeding: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        giltsharegestation: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        giltsharelactation: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        giltfeedquantity: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        gilttotalamount: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
    boarsfeeding: z.string().min(2, {
        message: "Username must be at least 2 characters.",
        }),
        boarspecialfeeding: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        boarsharegestation: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        boarsharelactation: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        boarfeedquantity: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        boartotalamount: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
    pigletsfeeding1: z.string().min(2, {
        message: "Username must be at least 2 characters.",
        }),
        pigletsfeeding2: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        pigletfeedquantity: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
})

type SowFeedingFormValues = z.infer<typeof sowfeedingFormSchema>
  
  export function SowFeedingPage() {
    const form = useForm<SowFeedingFormValues>({
      resolver: zodResolver(sowfeedingFormSchema),
      defaultValues: {
      },
  })
    const sowfeeding =['Gestation Feed', 'Lactation Feed', 'Total Amount of Feed per animal and day', 'Total Amount of Feed kg and year'];
    const sowfeedingTypes = [''];

    const giltsfeeding = ['Share of Gestation Feed','Share of Lactation Feed', 'Feed Quantity (in terms of dry matter)', 'Total Amount of Feed kg per year'];
    const specialfeeding = ['Special Gilt Feed']
    const giltsfeedingTypes = [''];

    const boarsfeeding = ['Special Boar Feed', 'Share of Gestation Feed','Share of Lactation Feed', 'Feed Quantity (in terms of dry matter)', 'Total Amount of Feed kg per year'];
    const boarsfeedingTypes = [''];

    const pigletsfeeding = ['Piglet Feed 1', 'Piglet Feed 2', 'Total Amount of Feed kg per year'];
    const pigletsfeedingTypes = [''];


    function onSubmit(data: SowFeedingFormValues) {
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
        <h3 className="text-lg font-medium">Sow Feeding</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
      <FormField
          control={form.control}
          name="sowfeeding"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sow Feeding</FormLabel>
              <FormDescription>Gestation Feed</FormDescription>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="giltsfeeding"
          render={({ field }) => (
            <FormItem>             
              <FormDescription>Special Gilt Feed</FormDescription>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="boarsfeeding"
          render={({ field }) => (
            <FormItem>             
              <FormDescription>Special Boar Feed</FormDescription>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pigletsfeeding1"
          render={({ field }) => (
            <FormItem>
              <FormDescription>Piglet Feed 1</FormDescription>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pigletsfeeding2"
          render={({ field }) => (
            <FormItem>
              <FormDescription>Piglet Feed 2</FormDescription>
              <FormControl>
                <Input placeholder="" {...field} />
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

export default SowFeedingPage