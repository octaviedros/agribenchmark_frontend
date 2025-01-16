"use client"

import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Check, ChevronsUpDown } from "lucide-react"
import { z } from "zod"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'

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

const sowfeedrationFormSchema = z.object({
  production: z
  .string({
    required_error: "Please select a production system.",
  }),
  feed_sources: z
  .string({
    required_error: "Please select a production rhythm.",
  }),
  feed_type: z
  .string({
    required_error: "Please enter Livestock data.",
  }),
  feed_share: z
  .string({
    required_error: "Please enter Livestock data.",
  }),
  total_amount_feed_used: z
  .string({
    required_error: "Please enter Livestock data.",
  }),
  selffeedrationrows: z.array(z.object({
    value: z.string()
  })),
  boughtfeedrationrows: z.array(z.object({
    value: z.string()
  })),
  gestationfeed: z.number(),
  lactationfeed: z.number(),
  specialgiltfeed: z.number(),
  specialboarfeed: z.number(),
  pigletfeed1: z.number(),
  pigletfeed2: z.number(),
})

 
  type SowFeedRationFormValues = z.infer<typeof sowfeedrationFormSchema>
  
  export function SowFeedRationPage() {
    const form = useForm<SowFeedRationFormValues>({
      resolver: zodResolver(sowfeedrationFormSchema),
      defaultValues: { },  
    })

    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "selffeedrationrows",
    })

    const { fields:boughtfields, append:boughtappend, remove:boughtremove } = useFieldArray({
      control: form.control,
      name: "boughtfeedrationrows",
    })
 
    const sowselfproduced = [''];
    const sowselfproducedTypes = ['Gestation Feed', 'Lactation Feed', 'Special Gilt Feed', 'Special Boar Feed', 'Piglet Feed 1', 'Piglet Feed 2'];

    const sowboughtfeeds = [''];
    const sowboughtfeedTypes = ['Gestation Feed', 'Lactation Feed', 'Special Gilt Feed', 'Special Boar Feed', 'Piglet Feed 1', 'Piglet Feed 2'];

    function onSubmit(data: SowFeedRationFormValues) {
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
        <h3 className="text-lg font-medium">Feed Rations Sow Enterprise</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h3>Self Produced</h3>
         <table className="w-full my-4">
                   <thead>
                     <tr>
                       <th className="font-medium min-w-[200px]">Crop Name</th>
                       {sowselfproducedTypes.map((sowselfproducedTypes) => (
                         <th key={sowselfproducedTypes} className="p-1 font-medium min-w-[120px]">
                           {sowselfproducedTypes}
                         </th>
                         ))}
                       </tr>
                     </thead>
                     <tbody>
                       {sowselfproduced.map((sowselfproduced) => (
                         <tr key={sowselfproduced}>
                            <td className="p-2 ">{sowselfproduced}
                              <Input type="text" name={`${sowselfproduced}-name`} className="w-full"/>
                            </td>
                           {sowselfproducedTypes.map((sowselfproducedType) => (
                             <td key={sowselfproducedType} className="p-2">
                               <Input type="number" name={`${sowselfproduced}-${sowselfproducedType}`} className="w-full"/>
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
                    name={`selffeedrationrows.${index}.value`}
                    render={({ field }) => (
                      <table className="w-full my-4">
                     <tbody>
                       {sowselfproduced.map((sowselfproduced) => (
                         <tr key={sowselfproduced}>
                            <td className="p-2 min-w-[200px]">{sowselfproduced}
                              <Input type="text" name={`${sowselfproduced}-name`} className="w-full"/>
                            </td>
                           {sowselfproducedTypes.map((sowselfproducedType) => (
                             <td key={sowselfproducedType} className="p-2 min-w-[120px]">
                               <Input type="number" name={`${sowselfproduced}-${sowselfproducedType}`} className="w-full"/>
                             </td>
                           ))}
                            <td>
                            <Button
                             type="button"
                             variant="destructive"
                             size="icon" 
                             onClick={() => remove(0)}><FontAwesomeIcon icon={faTrashCan} /></Button>
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
                   <h3>Bought Feed</h3>
                     <table className="w-full my-4">
                     <thead>
                          <tr>
                             <th className="font-medium min-w-[200px]">Crop Name</th>
                             {sowboughtfeedTypes.map((sowboughtfeedTypes) => (
                            <th key={sowboughtfeedTypes} className="p-1 font-medium min-w-[120px]">
                              {sowboughtfeedTypes}
                            </th>
                            ))}
                             </tr>
                          </thead>
                          <tbody>
                             {sowboughtfeeds.map((sowboughtfeeds) => (
                            <tr key={sowboughtfeeds}>
                                <td className="p-2 ">{sowboughtfeeds}
                                  <Input type="text" name={`${sowboughtfeeds}-name`} className="w-full"/>
                                </td>
                              {sowboughtfeedTypes.map((sowboughtfeedType) => (
                                 <td key={sowboughtfeedType} className="p-2">
                                    <Input type="number" name={`${sowboughtfeeds}-${sowboughtfeedType}`} className="w-full"/>
                                 </td>
                              ))}
                            </tr>
                             ))}
                          </tbody>
                        </table>
                        <div>
                        {boughtfields.map((field, index) => (
                        <FormField
                        control={form.control}
                        key={field.id}
                        name={`boughtfeedrationrows.${index}.value`}
                        render={({ field }) => (
                          <table className="w-full my-4">
                          <tbody>
                             {sowboughtfeeds.map((sowboughtfeeds) => (
                            <tr key={sowboughtfeeds}>
                                <td className="p-2 min-w-[200px]">{sowboughtfeeds}
                                  <Input type="text" name={`${sowboughtfeeds}-name`} className="w-full"/>
                                </td>
                              {sowboughtfeedTypes.map((sowboughtfeedType) => (
                                 <td key={sowboughtfeedType} className="p-2 min-w-[120px]">
                                    <Input type="number" name={`${sowboughtfeeds}-${sowboughtfeedType}`} className="w-full"/>
                                 </td>
                              ))}
                              <td>
                              <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => boughtremove(0)}><FontAwesomeIcon icon={faTrashCan} /></Button>
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
                        onClick={() => boughtappend({ value: "" })}
                        >AddRow </Button>
                        </div>
      </form>
      <Button type="submit">Submit</Button>
    </Form>
    </div>
  )
}
export default SowFeedRationPage