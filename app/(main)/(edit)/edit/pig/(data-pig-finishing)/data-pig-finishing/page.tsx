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


const pigfinishingdataFormSchema = z.object({
    productionsystem: z
    .string({
      required_error: "Please select a production system.",
    }),
    productioncycle: z
    .string({
      required_error: "Please select a production rhythm.",
    }),
    finishingdata: z
    .string({
      required_error: "Please enter Livestock data.",
    }),  
  })

  type PigFinishingDataFormValues = z.infer<typeof pigfinishingdataFormSchema>
  
  export function PigFinishingDataPage() {
    const form = useForm<PigFinishingDataFormValues>({
      resolver: zodResolver(pigfinishingdataFormSchema),
      defaultValues: {
      },
  }) 

        const livestock = ['Animal Places', 'Number of sold Pigs(female & castrates', 'Number of sold Pigs(Boars)', 'Share of female Pigs'];
        const livestockTypes = [''];

        const finishingdata = ['Stalling-in-Weight', 'Stalling-in-Weight (Boars)', 'Average Duration of a finishing Period', 
                                'Cleaning days per Cycle', 'Days without Animals in Stable', 'Mortality', 'Average selling Weight (females & castrates)',
                                'Carcass yield (%) (female & castrates)', 'Lean Meat content (FOM) (female & castrates)', 'Average selling Weight (Boars)',
                                'Carcass yield (%) (Boars)', 'Index points (AutoFOM; Boars)', 'Average Duration of a finishing Period (Boars)'];
        const finishingdataTypes= [''];
  
    function onSubmit(data: PigFinishingDataFormValues) {
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
        <h3 className="text-lg font-medium">Livestock and Performance Data for Pig Finishing Enterprise</h3>
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
                    <SelectValue placeholder="Select your Pig Finishing Production Sytsem" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="normalpigfinishing">Normal Pig Finishing</SelectItem>
                  <SelectItem value="boarfinishing">Additional Boar Finishing</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
            )}
            /> 
            <FormField
            control={form.control}
            name="productioncycle"
            render={({ field }) => (
            <FormItem>              
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your Sow Production Rhythm" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="allinalloutbarn">All-In-All-Out by Barn</SelectItem>
                    <SelectItem value="allinalloutsections">All-In-All-Out by Sections</SelectItem>
                    <SelectItem value="continuoussystem">Continuous System</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        </form>
        <form>
        <table className="my-4 ">
        <thead>
          <tr>
            <th className="font-semibold text-base text-left">Livestock</th>
            {livestockTypes.map((livestockType) => (
              <th key={livestockType} className="p-1 font-medium ml-6">
                {livestockType}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {livestock.map((livestock) => (
            <tr key={livestock}>
              <td className="font-normal text-s">{livestock}</td>
              {finishingdataTypes.map((livestockType) => (
                <td key={livestockType} className="">
                  <Input className="ml-16 w-10/12" type="number" name={`${finishingdata}-${livestockType}`}/>
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
            {finishingdataTypes.map((finishingdataType) => (
              <th key={finishingdataType} className="p-1 font-medium">
                {finishingdataType}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {finishingdata.map((finishingdata) => (
            <tr key={finishingdata}>
              <td className="font-normal text-s">{finishingdata}</td>
              {finishingdataTypes.map((finishingdataType) => (
                <td key={finishingdataType} className="">
                  <Input className="ml-5 w-half" type="number" name={`${finishingdata}-${finishingdataType}`}/>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        </table>
      </form>
    </Form>
    </div>
  )
}

export default PigFinishingDataPage