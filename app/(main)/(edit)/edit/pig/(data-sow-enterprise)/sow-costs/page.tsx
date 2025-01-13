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

const sowcostFormSchema = z.object({
})

  type SowCostFormValues = z.infer<typeof sowcostFormSchema>
  
  export function SowCostPage() {
    const form = useForm<SowCostFormValues >({
      resolver: zodResolver(sowcostFormSchema),
      defaultValues: { },  
    })

    const varcosts = ['Veterenary Medicine & Supplies', 'Artificial Insemination Costs', 'Pregnancy Check', 'Disinfection', 'Energy', 'Water', 'Manure Costs', 'Transport Costs', 'Specialised Advisor', 'Animal Disease Levy', 'Carcass Disposal', 'Sow Planner', 'Maintenance' ]
    const varcostTypes = [''];

    const overheadcost = ['Feed Mixing & Preparation', 'Insurance', 'Cleaning']
    const overheadcostTypes = [''];

    function onSubmit(data: SowCostFormValues) {
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
        <h3 className="text-lg font-medium">Sow Costs</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <table>
        <thead>
          <tr>
            <th className="text-left">Variable Costs</th>
            {varcostTypes.map((varcostType) => (
              <th key={varcostType}>{varcostType}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {varcosts.map((varcost) => (
            <tr key={varcost}>
              <td>{varcost}</td>
              {varcostTypes.map((varcostType) => (
                <td key={varcostType}>
                  <Input className="ml-6" type="number" name={`${varcost}-${varcostType}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <table>
        <thead>
          <tr>
            <th className="text-left">Overhead Costs</th>
            {overheadcostTypes.map((overheadcostType) => (
              <th key={overheadcostType}>{overheadcostType}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {overheadcost.map((overheadcost) => (
            <tr key={overheadcost}>
              <td>{overheadcost}</td>
              {overheadcostTypes.map((overheadcostType) => (
                <td key={overheadcostType}>
                  <Input className="ml-16 w-5/6" type="number" name={`${overheadcost}-${overheadcostType}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </form>
      <Button type="submit">Submit</Button>
    </Form>
    </div>
  )
}

export default SowCostPage;