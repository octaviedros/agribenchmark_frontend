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
        sowtotalamountday: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        sowtotalamountyear: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
    giltsfeeding: z.string().min(2, {
        message: "Username must be at least 2 characters.",
        }),
        gitlsspecialfeeding: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        giltssharegestation: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        giltssharelactation: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        giltfeedquantity: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        gilttotalamountyear: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
    boarsfeeding: z.string().min(2, {
        message: "Username must be at least 2 characters.",
        }),
        boarsspecialfeeding: z.string().min(2, {
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
        boartotalamountyear: z.string().min(2, {
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
        piglettotalamountyear: z.string().min(2, {
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
        <div><h3>Sows</h3></div>
      <FormField
          control={form.control}
          name="sowgestationfeed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gestation Feed</FormLabel>
              <FormDescription>kg per animal and year</FormDescription>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sowlactationfeed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lactation Feed</FormLabel>
              <FormDescription>kg per animal and year</FormDescription>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sowtotalamountday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Amount of Feed per animal and day</FormLabel>
              <FormDescription>kg per animal and day</FormDescription>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sowtotalamountyear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Amount of Feed kg and year</FormLabel>
              <FormDescription>kg per animal and year</FormDescription>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div><h3>Gilts</h3></div>
        <FormField
          control={form.control}
          name="gitlsspecialfeeding"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Gilt Feed</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your Gilt Feed" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="specialgiltfeed">Special Gilt Feed</SelectItem>
                  <SelectItem value="giltsmixgestationlactationfeed">A mix of Gestation and Lactation Feed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />  
        <FormField
          control={form.control}
          name="giltssharegestation"
          render={({ field }) => (
            <FormItem>             
              <FormLabel>Share Gestation Feed</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="giltssharelactation"
          render={({ field }) => (
            <FormItem>             
              <FormLabel>Share Lactation Feed</FormLabel>
              <FormControl>
              <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="giltfeedquantity"
            render={({ field }) => (
            <FormItem>             
              <FormLabel>Feed Quantity (in terms of dry matter)</FormLabel>
              <FormControl>
              <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gilttotalamountyear"
            render={({ field }) => (
            <FormItem>             
              <FormLabel>Total Amount of Feed kg per year</FormLabel>
              <FormControl>
              <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
            )}
          />
        <div><h3>Boars</h3></div>
        <FormField
          control={form.control}
          name="boarsspecialfeeding"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Boar Feed</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your Boar Feed" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="specialboarfeed">Special Boar Feed</SelectItem>
                  <SelectItem value="boarmixgestationlactationfeed">A mix of Gestation and Lactation Feed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="boarsharegestation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Share of Gestation Feed</FormLabel>             
              <FormDescription>%</FormDescription>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="boarsharelactation"
          render={({ field }) => (
            <FormItem>             
              <FormDescription>Share Lactation Feed</FormDescription>
              <FormLabel>%</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="boarfeedquantity"
          render={({ field }) => (
            <FormItem>             
              <FormDescription>Feed Quantity (in terms of dry matter)</FormDescription>
              <FormLabel>Feed Quantity (in terms of dry matter)</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="boartotalamountyear"
          render={({ field }) => (
            <FormItem>             
              <FormDescription>Total Amount of Feed kg per year</FormDescription>
              <FormLabel>Total Amount of Feed kg per year</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div><h3>Piglets</h3></div>
        <FormField
          control={form.control}
          name="pigletsfeeding1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Piglet Feed 1</FormLabel>
              <FormDescription>kg per animal</FormDescription>
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
              <FormLabel>Piglet Feed 2</FormLabel>  
              <FormDescription>kg per animal</FormDescription>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pigletfeedquantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Feed Quantity (in terms of dry matter)</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="piglettotalamountyear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Amount of Feed</FormLabel>
              <FormDescription>kg per year</FormDescription>
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