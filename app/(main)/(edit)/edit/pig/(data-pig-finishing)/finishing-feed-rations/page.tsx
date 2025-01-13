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

const finishingfeedrationFormSchema = z.object({
})
 
  type FinishingFeedRationFormValues = z.infer<typeof finishingfeedrationFormSchema>
  
  export function FinishingFeedRationPage() {
    const form = useForm<FinishingFeedRationFormValues>({
      resolver: zodResolver(finishingfeedrationFormSchema),
      defaultValues: { },  
    })
 
    const finishingselfproduced = [''];
    const finishingselfproducedTypes = ['Finishing Feed 1', 'Finishing Feed 2', 'Finishing Feed 3'];

    const finishingboughtfeeds = [''];
    const finishingboughtfeedTypes = ['Finishing Feed 1', 'Finishing Feed 2', 'Finishing Feed 3'];

    function onSubmit(data: FinishingFeedRationFormValues) {
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
        <h3 className="text-lg font-medium">How are your feed rations proportioned?</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h3></h3>
         <table className="w-full my-4">
                   <thead> <h1>Self Produced Feed</h1>
                     <tr>
                       <th className="font-medium min-w-[200px]">Crop Name</th>
                       {finishingselfproducedTypes.map((finishingselfproducedTypes) => (
                         <th key={finishingselfproducedTypes} className="p-1 font-medium min-w-[120px]">
                           {finishingselfproducedTypes}
                         </th>
                         ))}
                       </tr>
                     </thead>
                     <tbody>
                       {finishingselfproduced.map((finishingselfproduced) => (
                         <tr key={finishingselfproduced}>
                            <td className="p-2 ">{finishingselfproduced}
                              <Input type="text" name={`${finishingselfproduced}-name`} className="w-full"/>
                            </td>
                           {finishingselfproducedTypes.map((finishingselfproducedType) => (
                             <td key={finishingselfproducedType} className="p-2">
                               <Input type="number" name={`${finishingselfproduced}-${finishingselfproducedType}`} className="w-full"/>
                             </td>
                           ))}
                         </tr>
                       ))}
                     </tbody>
                   </table> 
                   <Button type="button">Add Row</Button>
                   
                     <table className="w-full my-4">
                     <thead> <h1>Bought Feed</h1>
                          <tr>
                             <th className="font-medium min-w-[200px]">Crop Name</th>
                             {finishingboughtfeedTypes.map((finishingboughtfeedTypes) => (
                            <th key={finishingboughtfeedTypes} className="p-1 font-medium min-w-[120px]">
                              {finishingboughtfeedTypes}
                            </th>
                            ))}
                             </tr>
                          </thead>
                          <tbody>
                             {finishingboughtfeeds.map((finishingboughtfeeds) => (
                            <tr key={finishingboughtfeeds}>
                                <td className="p-2 ">{finishingboughtfeeds}
                                  <Input type="text" name={`${finishingboughtfeeds}-name`} className="w-full"/>
                                </td>
                              {finishingboughtfeedTypes.map((finishingboughtfeedType) => (
                                 <td key={finishingboughtfeedType} className="p-2">
                                    <Input type="number" name={`${finishingboughtfeeds}-${finishingboughtfeedType}`} className="w-full"/>
                                 </td>
                              ))}
                            </tr>
                             ))}
                          </tbody>
                        </table>
                        <Button type="button">Add Row</Button>


      </form>
      <Button type="submit">Submit</Button>
    </Form>
    </div>
  )
}
export default FinishingFeedRationPage