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
    productionrhythm: z
    .string({
      required_error: "Please select a production rhythm.",
    }),
    sowdata: z
    .string({
      required_error: "Please enter Livestock data.",
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Livestock and Performance Data for Sow Enterprise</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
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
            name="productionrhythm"
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
        <form>
        <table className="my-4">
        <thead>
          <tr>
            <th className="font-semibold text-base text-left">Livestock</th>
            {livestockTypes.map((livestockType) => (
              <th key={livestockType} className="p-1 font-medium">
                {livestockType}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {livestock.map((livestock) => (
            <tr key={livestock}>
              <td className="font-normal text-s mr-1">{livestock}</td>
              {sowdataTypes.map((livestockType) => (
                <td key={livestockType} className="">
                  <Input className="ml-6" type="number" name={`${sowdata}-${livestockType}`}/>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        </table>
        </form>
        <form>
        <table className="">
        <thead>
          <tr>
            <th className="font-semibold text-base text-left">Performance</th>
            {sowdataTypes.map((sowdataType) => (
              <th key={sowdataType} className="p-1 font-medium">
                {sowdataType}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sowdata.map((sowdata) => (
            <tr key={sowdata}>
              <td className="font-normal text-s">{sowdata}</td>
              {sowdataTypes.map((sowdataType) => (
                <td key={sowdataType} className="">
                  <Input className="ml-6" type="number" name={`${sowdata}-${sowdataType}`}/>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        </table>
        </form>
         <table className="">
        <thead>
          <tr>
            <th className="font-semibold text-base text-left">Sales Weight</th>
            {salesweightTypes.map((salesweightType) => (
              <th key={salesweightType} className="p-1 font-medium">
                {salesweightType}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {salesweight.map((salesweight) => (
            <tr key={salesweight}>
              <td className="font-normal text-s">{salesweight}</td>
              {salesweightTypes.map((salesweightType) => (
                <td key={salesweightType} className="">
                  <Input className="ms-36 w-2/3" type="number" name={`${salesweight}-${salesweightType}`}/>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        </table>
        <form>
        <Button className="mt-4"  type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default SowDataPage