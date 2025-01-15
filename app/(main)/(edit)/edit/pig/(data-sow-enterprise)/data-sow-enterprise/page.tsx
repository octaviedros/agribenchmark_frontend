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


const sowdataFormSchema = z.object({
  productionsystem: z
  .string({
    required_error: "Please select a production system.",
  }),
  production_rhythm: z
  .string({
    required_error: "Please select a production rhythm.",
  }),
  no_sows_mated_gilts: z
  .number({
    required_error: "Please enter Number of Sows and Mated Gilts.",
  }),
  no_unserved_gilts: z
  .number({
    required_error: "Please enter Number of Unserved Gilts.",
  }),
  no_boars: z
  .number({
    required_error: "Please enter Number of Boars.",
  }),
  total_no_sows_gilts: z
  .number({
    required_error: "Please enter Total Number of Sows and Gilts.",
  }),
  piglets_born_alive: z
  .number({
    required_error: "Please enter Piglets born Alive.",
  }),
  cycles_per_sow_year: z 
  .number({
    required_error: "Please enter Cycles born per sow and year.",
  }),
  avg_gestation_period: z
  .number({
    required_error: "Please enter Average time of gestation period.",
  }),
  duration_suckling_per_farrowing: z
  .number({
    required_error: "Please enter Duration of Suckling.",
  }),
  dry_sow_days: z
  .number({
    required_error: "Please enter Number of Dry Sow Days.",
  }),
  rate_insuccessful_insemination: z
  .number({
    required_error: "Please enter Rate in Successful Insemination.",
  }),
  weaning_weights: z
  .number({
    required_error: "Please enter the Weaning Weight.",
  }),
  cull_rate_sows: z
  .number({
    required_error: "Please enter the Cull Rate of Sows.",
  }),
  cull_rate_boars: z
  .number({
    required_error: "Please enter the Cull Rate of Boars.",
  }),
  fraction_own_replacement: z
  .number({
    required_error: "Please enter the Fraction of Own Replacement.",
  }),
  annual_sow_mortality: z
  .number({
    required_error: "Please enter the Annual Sow Mortality.",
  }),
  annual_boar_mortality: z
  .number({
    required_error: "Please enter the Annual Boar Mortality.",
  }),
  piglet_mortality_weaning: z
  .number({
    required_error: "Please enter the Piglet Mortality Weaning.",
  }),
  piglet_mortality_rearing: z
  .number({
    required_error: "Please enter the Piglet Mortality Rearing.",
  }),
  piglets_weaned: z
  .number({
    required_error: "Please enter the Piglets Weaned.",
  }),
  avg_duration_piglet_rearing: z
  .number({
    required_error: "Please enter the Average Piglet Rearing.",
  }),
  reared_piglets: z
  .number({
    required_error: "Please enter the amount of Reared Piglets.",
  }),
  salesweightsows: z
  .number({
    required_error: "Please enter the Sales Weight of Sows.",
  }),
  salesweightboars: z
  .number({
    required_error: "Please enter the Sales Weight of Boars.",
  }),
  salesweightweaningpiglets: z
  .number({
    required_error: "Please enter the Sales Weight of Weaning Piglets.",
  }),
  salesweightrearingpiglets: z
  .number({
    required_error: "Please enter the Sales Weight of Rearing Piglets.",
  }),
  })

  type SowDataFormValues = z.infer<typeof sowdataFormSchema>
  
  export function SowDataPage() {
    const form = useForm<SowDataFormValues>({
      resolver: zodResolver(sowdataFormSchema),
      defaultValues: {
      },
  }) 

        const livestock = ['Number of Sows and Mated Gilts', 'Number of Unserved Gilts', 'Number of Boars', 'Total Number of Sows and Gilts'];
        const livestockTypes = [''];

        const sowdata = ['Piglets born Alive', 'Cycles born per sow and year', 'Average time of gestation period', 
                        'Duration of Suckling', 'Number of Dry Sow Days', 'Rate in Successful Insemination', 
                        'Weaning Weight', 'Cull Rate Sows', 'Cull Rate Boars', 'Fraction of Own Replacement', 
                        'Annual Sow Moratlity', 'Annual Boar Mortality', 'Piglet Mortalitiy Weaning', 
                        'Piglet Mortality Rearing', 'Piglets Weaned', 'Average Piglet Rearing', 'Reared Piglets'];
        const sowdataTypes= [''];

        const salesweight = ['Sows', 'Boars', 'Weaning Piglets', 'Rearing Piglets'];
        const salesweightTypes = [''];
  
    function onSubmit(data: SowDataFormValues) {
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
    <div className="space-y-4">
        <h3 className="text-lg font-medium">Livestock and Performance Data for Sow Enterprise</h3>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
      <FormField
          control={form.control}
          name="productionsystem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Production System</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your Sow Production Sytsem" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="systempigletsale">System Piglet Sale(ca.8kg)</SelectItem>
                  <SelectItem value="weanersales">Weaner Sales (approx.25-30kg)</SelectItem>
                  <SelectItem value="purepigletrearing">Pure Piglet Rearing</SelectItem>
                  <SelectItem value="closedsystem">Closed System</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
            )}
            /> 
            <FormField
            control={form.control}
            name="production_rhythm"
            render={({ field }) => (
            <FormItem>              
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your Sow Production Rhythm" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1weekrhythm">1-Week Rhythm</SelectItem>
                    <SelectItem value="2weekrhythm">2-Week Rhythm</SelectItem>
                    <SelectItem value="3weekrhythm">3-Week Rhythm</SelectItem>
                    <SelectItem value="4weekrhythm">4-Week Rhythm</SelectItem>
                    <SelectItem value="nonrhythm">None or other Rhythm</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        </form>
        <form className="my-2 max-w-72">
        <div>
          <h3 className="mt-6 font-medium">Performance</h3>
        <FormField
          control={form.control}
          name="no_sows_mated_gilts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Sows and Mated Gilts</FormLabel>
              <FormDescription>Number of heads </FormDescription>
              <FormControl>
          <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="no_unserved_gilts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Unserved Gilts</FormLabel>
              <FormDescription>Number of heads </FormDescription>
              <FormControl>
          <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="no_boars"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Boars</FormLabel>
              <FormControl>
          <Input type="number" {...field} />
              </FormControl>
              <FormDescription>Number of heads </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="total_no_sows_gilts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Number of Sows and Gilts</FormLabel>
              <FormControl>
          <Input type="number" {...field} />
              </FormControl>
              <FormDescription>Number of heads </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          </div>
          </form>
          <form className="my-2 max-w-72">
          <div><h3 className="mt-6 font-medium">Livestock</h3>
          </div>
          <FormField
          control={form.control}
          name="piglets_born_alive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Piglets born Alive</FormLabel>
              <FormControl>
          <Input type="number" {...field} />
              </FormControl>
              <FormDescription>Number of heads </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="cycles_per_sow_year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cycles born per sow and year</FormLabel>
              <FormControl>
          <Input type="number" {...field} />
              </FormControl>
              <FormDescription>Number of heads </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="avg_gestation_period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Average time of gestation period</FormLabel>
              <FormControl>
          <Input type="number" {...field} />
              </FormControl>
              <FormDescription>Days </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="duration_suckling_per_farrowing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration of Suckling</FormLabel>
              <FormControl>
          <Input type="number" {...field} />
              </FormControl>
              <FormDescription>Days </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="dry_sow_days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Dry Sow Days</FormLabel>
              <FormControl>
          <Input type="number" {...field} />
              </FormControl>
              <FormDescription>Days </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="rate_insuccessful_insemination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate of insuccessful Insemination</FormLabel>
              <FormControl>
          <Input type="number" {...field} />
              </FormControl>
              <FormDescription>% </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="weaning_weights"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weaning Weight</FormLabel>
              <FormControl>
          <Input type="number" {...field} />
              </FormControl>
              <FormDescription>kg </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="cull_rate_sows"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cull Rate Sows</FormLabel>
              <FormControl>
          <Input type="number" {...field} />
              </FormControl>
              <FormDescription>% </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="cull_rate_boars"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cull Rate Boars</FormLabel>
              <FormControl>
          <Input type="number" {...field} />
              </FormControl>
              <FormDescription>% </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="fraction_own_replacement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fraction of Own Replacement</FormLabel>
              <FormControl>
          <Input type="number" {...field} />
              </FormControl>
              <FormDescription>% </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="annual_sow_mortality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Sow Mortality</FormLabel>
              <FormControl>
          <Input type="number" {...field} />
              </FormControl>
              <FormDescription>% </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="annual_boar_mortality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Boar Mortality</FormLabel>
              <FormControl>
          <Input type="number" {...field} />
              </FormControl>
              <FormDescription>% </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="piglet_mortality_weaning"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Piglet Mortality Weaning</FormLabel>
              <FormControl>
          <Input type="number" {...field} />
              </FormControl>
              <FormDescription>% </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="piglet_mortality_rearing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Piglet Mortality Rearing</FormLabel>
              <FormControl>
          <Input type="number" {...field} />
              </FormControl>
              <FormDescription>% </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="piglets_weaned"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Piglets Weaned</FormLabel>
              <FormControl>
          <Input type="number" {...field} />
              </FormControl>
              <FormDescription>Number of heads </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="avg_duration_piglet_rearing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Average Piglet Rearing</FormLabel>
              <FormControl>
          <Input type="number" {...field} />
              </FormControl>
              <FormDescription>kg </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="reared_piglets"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reared Piglets</FormLabel>
              <FormControl>
          <Input type="number" {...field} />
              </FormControl>
              <FormDescription>Number of heads </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
        <div>
          <h3 className="mt-6 font-medium">Sales Weight</h3>
          <FormField
          control={form.control}
          name="salesweightsows"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sows</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>kg CW per head </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="salesweightboars"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Boars</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>kg CW per head </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="salesweightweaningpiglets"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weaning Piglets</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>kg CW per head </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
          control={form.control}
          name="salesweightrearingpiglets"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rearing Piglets</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>kg CW per head </FormDescription>
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

export default SowDataPage