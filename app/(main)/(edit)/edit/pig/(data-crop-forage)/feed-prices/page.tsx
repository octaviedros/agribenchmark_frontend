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

const feedprices = [''];
const feedpriceTypes = ['Price per tonne', 'Dry Matter', 'MJ', 'Protein (%)', 'Feed Concentrate'];

const feedpriceFormSchema = z.object({
  feed_type: z.array(
    z.object({
      value: z.string(),
    })
  ),
  price_per_tonne: z.array(
    z.object({
      value: z.string(),
    })
  ),
  dry_matter_percent: z.array(
    z.object({
      value: z.string(),
    })
  ),
  energy_mj: z.array(
    z.object({
      value: z.string(),
    })
  ),
  protein: z.array(
    z.object({
      value: z.string(),
    })
  ),
  concentrate: z.array(
    z.object({
      value: z.string(),
    })
  ),
  feedpricerow: z.array(z.object({
    value: z.string()
  })),

  })
  
  type FeedPriceValues = z.infer<typeof feedpriceFormSchema>
  
  export function FeedPricesPage() {
    const form = useForm<FeedPriceValues>({
      resolver: zodResolver(feedpriceFormSchema),
      defaultValues: {
     },  
    }) 
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "feedpricerow",
    })

    function onSubmit(data: FeedPriceValues) {
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
        <h3 className="text-lg font-medium">Prices for Feed and Dry Matter Content</h3>
      </div>
      <Separator />

      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <table className="w-full my-4">
          <thead>
            <tr>
              <th className="font-medium min-w-[120px]">Feed Type</th>
              {feedpriceTypes.map((feedpriceType) => (
                <th key={feedpriceType} className="p-1 font-medium min-w-[120px]">
                  {feedpriceType}
                </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {feedprices.map((feedprice) => (
                <tr key={feedprice}>
                  <td className="p-2 ">{feedprice}
                    <Input type="text" name={`${feedprice}-name`}/>
                  </td>
                  {feedpriceTypes.map((feedpriceType) => (
                    <td key={feedpriceType} className="p-2">
                      <Input type="number" name={`${feedprice}-${feedpriceType}`}/>
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
                name={`feedpricerow.${index}.value`}
                render={({ field }) => (
                  <table className="w-full my-4">
                    <tbody>
                      {feedprices.map((feedprice) => (
                        <tr key={feedprice}>
                          <td className="p-2 min-w-[120px]">{feedprice}
                            <Input type="text" name={`${feedprice}-name`}/>
                          </td>
                          {feedpriceTypes.map((feedpriceType) => (
                            <td key={feedpriceType} className="p-2 min-w-[120px]">
                              <Input type="number" name={`${feedprice}-${feedpriceType}`}/>
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

export default FeedPricesPage
