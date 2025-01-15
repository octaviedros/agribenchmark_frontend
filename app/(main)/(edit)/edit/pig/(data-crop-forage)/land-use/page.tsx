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

const landuses = [''];
const landuseTypes = ['Acreage (ha)','Net yield (t/ha)','Dry matter (0,0x)', 'Price (per tonne)', 'CAP dir. payments (per ha)', 'Other dir. payments (per ha)', 'Enterprise codes'];

const landuseFormSchema = z.object({
  acreage: z.array(
    z.object({
      value: z.string(),
    })
  ),
  net_yield: z.array(
    z.object({
      value: z.string(),
    })
  ),
  dry_matter: z.array(
    z.object({
      value: z.string(),
    })
  ),
  price: z.array(
    z.object({
      value: z.string(),
    })
  ),
  cap_dir_paym: z.array(
    z.object({
      value: z.string(),
    })
  ),
  other_dir_paym: z.array(
    z.object({
      value: z.string(),
    })
  ),
  enterprise_code: z.array(
    z.object({
      value: z.string(),
    })
  ),
  landuserow: z.array(z.object({
    value: z.string()
  })),

  })
  
  type LandUseFormValues = z.infer<typeof landuseFormSchema>
  
  export function LandUseFarmPage() {
    const form = useForm<LandUseFormValues>({
      resolver: zodResolver(landuseFormSchema),
      defaultValues: {
         },  
    })
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "landuserow",
    }) 

    function onSubmit(data: LandUseFormValues) {
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
        <h3 className="text-lg font-medium">Land use, Yields, Prices and Direct Payments</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <table className="w-full my-4">
          <thead>
            <tr>
              <th className="font-medium min-w-[120px]">Crop Name</th>
              {landuseTypes.map((landuseType) => (
                <th key={landuseType} className="p-1 font-medium min-w-[120px]">
                  {landuseType}
                </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {landuses.map((landuse) => (
                <tr key={landuse}>
                  <td className="p-2 ">{landuse}
                    <Input type="text" name={`${landuse}-name`}/>
                  </td>
                  {landuseTypes.map((landuseType) => (
                    <td key={landuseType} className="p-2">
                      <Input type="number" name={`${landuse}-${landuseType}`}/>
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
            name={`landuserow.${index}.value`}
            render={({ field }) => (
              <table className="w-full my-4">
              <thead>
                <tr>
                  <th className="font-medium min-w-[120px]">Crop Name</th>
                  {landuseTypes.map((landuseType) => (
                    <th key={landuseType} className="p-1 font-medium min-w-[120px]">
                      {landuseType}
                    </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {landuses.map((landuse) => (
                    <tr key={landuse}>
                      <td className="p-2 ">{landuse}
                        <Input type="text" name={`${landuse}-name`}/>
                      </td>
                      {landuseTypes.map((landuseType) => (
                        <td key={landuseType} className="p-2">
                          <Input type="number" name={`${landuse}-${landuseType}`}/>
                        </td>
                      ))}
                      <td>
                        <Button type="button"
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

export default LandUseFarmPage
