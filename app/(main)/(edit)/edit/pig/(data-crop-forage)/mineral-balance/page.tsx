"use client"

import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Check, ChevronsUpDown } from "lucide-react"
import { z } from "zod"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashCan} from "@fortawesome/free-regular-svg-icons"

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

const minerals = [''];
const mineralTypes = ['Nitrogen','Phosphorus','Potash','Calcium','Other'];

const mineralbalanceFormSchema = z.object({
  fertilizer_type: z.string(),
  fertilizer_name: z.string(),
  fertilizer_name_custom: z.string(),
  amount: z.string(),
  amount_unit: z.string(),
  n_content_per_unit: z.string(),

  mineralrow: z.array(z.object({
    value: z.string()
  })),
  })
  
  type MineralBalanceValues = z.infer<typeof mineralbalanceFormSchema>
  
  export function MineralBalancePage() {
    const form = useForm<MineralBalanceValues>({
      resolver: zodResolver(mineralbalanceFormSchema),
      defaultValues: {
     },  
    }) 
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "mineralrow",
    })

    function onSubmit(data: MineralBalanceValues) {
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
        <h3 className="text-lg font-medium">Mineral Balance and Fertilizer Input</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-medium min-w-[120px]">Crop</th>
              {mineralTypes.map((mineralType) => (
                <th key={mineralType} className="p-1 font-medium min-w-[120px]">
                  {mineralType}
                </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {minerals.map((mineral) => (
                <tr key={mineral}>
                  <td className="p-2 ">{mineral}
                    <Input type="text" name={`${mineral}-name`}/>
                  </td>
                  {mineralTypes.map((mineralType) => (
                    <td key={mineralType} className="p-2">
                      <Input type="number" name={`${mineral}-${mineralType}`}/>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table> 
          <div>
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`mineralrow.${index}.value`}
                render={({ field }) => (
                  <table className="w-full my-4">
                    <tbody>
                      {minerals.map((mineral) => (
                        <tr key={mineral}>
                          <td className="p-2 min-w-[120px] ">{mineral}
                            <Input type="text" name={`${mineral}-name`}/>
                          </td>
                          {mineralTypes.map((mineralType) => (
                            <td key={mineralType} className="p-2 min-w-[120px]">
                              <Input type="number" name={`${mineral}-${mineralType}`}/>
                            </td>
                          ))}
                          <td>
                            <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => remove(index)}><FontAwesomeIcon icon={faTrashCan} /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table> 
                )}
              />
            ))}
            <Button
              type="button"
              onClick={() => append({ value: "" })}>Add Row</Button>
          </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export default MineralBalancePage
