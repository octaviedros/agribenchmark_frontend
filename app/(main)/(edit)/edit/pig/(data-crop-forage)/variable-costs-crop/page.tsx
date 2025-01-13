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

const varcostcrops = [''];
const varcostcropTypes = ['Seeds', 'Fertilizer','Herbicide','Fungicide/Insecticide','Contract labor','Energy','Other'];

const varcostcropFormSchema = z.object({
  })
  
  type VarCostCropFormValues = z.infer<typeof varcostcropFormSchema>
  
  export function VarCostCropPage() {
    const form = useForm<VarCostCropFormValues>({
      resolver: zodResolver(varcostcropFormSchema),
      defaultValues: {
     },  
    }) 

    function onSubmit(data: VarCostCropFormValues) {
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
    <div className="space-y-6 min">
      <div>
        <h3 className="text-lg font-medium">Variable Costs of Crop and Forage Production</h3>
      </div>
      <Separator />

      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <table className="w-full my-4">
          <thead>
            <tr>
              <th className="font-medium min-w-[120px]">Crop</th>
              {varcostcropTypes.map((varcostcropType) => (
                <th key={varcostcropType} className="p-1 font-medium min-w-[120px]">
                  {varcostcropType}
                </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {varcostcrops.map((varcostcrop) => (
                <tr key={varcostcrop}>
                  <td className="p-2 ">{varcostcrop}
                    <Input type="text" name={`${varcostcrop}-name`}/>
                  </td>
                  {varcostcropTypes.map((varcostcropType) => (
                    <td key={varcostcropType} className="p-2">
                      <Input type="number" name={`${varcostcrop}-${varcostcropType}`}/>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table> 
          <Button className="mx-2" type="button">Add Row</Button>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default VarCostCropPage
