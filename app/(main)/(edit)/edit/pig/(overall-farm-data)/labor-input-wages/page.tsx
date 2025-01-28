"use client"

import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Check, ChevronsUpDown, Trash2 } from "lucide-react"
import { z } from "zod"
import { put } from "@/lib/api"
import { useFarmData } from "@/hooks/use-farm-data"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
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

const wagesFormSchema = z.object({
  id: z.string().uuid(),
  general_id: z.string().uuid(),
  permanentwages: z
  .string({
    required_error: "Please select an option.",
  }),
  laborForce: z.number(),
  workingHours: z.number(),
  annualWage: z.number(),
  
  permanentcostTypes: z
  .string({
    required_error: "Please select an option.",
  }),
  workerrows: z.array(
    z.object({
      value: z.string(),
    })
  )
  .optional(),
  permanentrows: z.array(
    z.object({
      value: z.string(),
    })
  )
  .optional(),
  casualrows: z.array(
    z.object({
      value: z.string(),
    })
  )
  .optional(),
  familyrows: z.array(
    z.object({
      value: z.string(),
    })
  )
  .optional(),
})
 
  type WagesFormValues = z.infer<typeof wagesFormSchema>

  interface WagesFormProps {
    farmData: WagesFormValues | undefined
  }
  
  export function WagesFarmPage({ farmData }: WagesFormProps) {
      const searchParams = useSearchParams()
      const general_id = searchParams.get("general_id") || ""
      const { data, error, isLoading } = useFarmData("/labour", general_id)
      
      if (!general_id) {
        return (
          <div className="p-4">
            <h2>No farm selected.</h2>
            <p>Select a farm from the dropdown menu to get started.</p>
          </div>
        )
      }
    
      if (isLoading) {
        return <div className="p-4">Loading farm data…</div>
      }
      if (error) {
        console.error(error)
        return <div className="p-4">Failed to load farm data.</div>
      }
      const { mutate } = useFarmData("/labour", farmData?.general_id?.toString())
        const form = useForm<WagesFormValues>({
          resolver: zodResolver(wagesFormSchema),
          defaultValues: {
            ...farmData
          },
          mode: "onChange",
        })
      
        useEffect(() => {
          form.reset({
            ...farmData
          })
        }, [farmData])


    const { fields:permanentfields, append:permanentapped, remove:permanentremove } = useFieldArray({
      control: form.control,
      name: "permanentrows",
    })
    const { fields:casualfields, append:casualapped, remove:casualremove } = useFieldArray({
      control: form.control,
      name: "casualrows",
    })
    const { fields:familyfields, append:familyapped, remove:familyremove } = useFieldArray({
      control: form.control,
      name: "familyrows",
    })

    async function onSubmit(data: WagesFormValues) {
            try {
              const mergedData = {
                ...farmData, // overwrite the farmData with the new data
                ...data,
              }
              await mutate(put(`/labour/${farmData?.general_id}`, mergedData), {
                optimisticData: mergedData,
                rollbackOnError: true,
                populateCache: false,
                revalidate: false
              })
              toast({
                title: "Success",
                description: "Farm data has been saved successfully.",
              })
            } catch (error: unknown) {
              const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
              toast({
                variant: "destructive",
                title: "Error",
                description: `Failed to save farm data. ${errorMessage}`,
              })
            }
          }
 
    const permanentwages = [''];
    const permanentcostTypes = ['Labor Force', 'Working hours (per Person per year)', 'Annual Wage per Person', 'Enterprise Codes'];

    const casualwages = [''];
    const casualcostTypes = ['Labor Force', 'Working hours per Person per year', 'Wage per hour per Person', 'Enterprise Codes'];

    const familywages = [''];
    const familycostTypes = ['Labor Force', 'Working hours per Person per year', 'Opportuniy Costs per Person', 'Enterprise Codes'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Labor Input and Wages</h3>
      </div>
      <Separator />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h3></h3>
        <div>
         <table className="w-full my-4">
                   <thead>
                     <tr>
                       <th className="font-medium min-w-[200px]">Permanent Worker</th>
                       {permanentcostTypes.map((permanentcostTypes) => (
                         <th key={permanentcostTypes} className="p-1 font-medium min-w-[160px]">
                           {permanentcostTypes}
                         </th>
                         ))}
                       </tr>
                     </thead>
                     <tbody>
                       {permanentwages.map((permanentwages) => (
                         <tr key={permanentwages}>
                           <td className="p-2 ">{permanentwages}
                           <FormField
                              control={form.control}
                              name="permanentwages"
                              render={({ field }) => (
                                <FormItem>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger> <SelectValue placeholder="Select Group" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="group1:manager">Group 1: Manager</SelectItem>
                                      <SelectItem value="group2:executivestaff">Group 2: Executive Staff</SelectItem>
                                      <SelectItem value="group3:tractor">Group 3: Tractor</SelectItem>
                                      <SelectItem value="group4:pigman">Group 4: Pigman</SelectItem>
                                      <SelectItem value="group5:other">Group 5: Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                           </td>
                           {permanentcostTypes.map((permanentcostType) => (
                             <td key={permanentcostType} className="p-2">
                               <Input type="number" name={`${permanentwages}-${permanentcostType}`} className="w-full"/>
                             </td>
                           ))}
                         </tr>
                       ))}
                     </tbody>
                   </table>
                       {permanentfields.map((field, index) => (
                        <FormField
                          control={form.control}
                         key={field.id}
                          name={`permanentrows.${index}.value`}
                          render={({ field }) => (
                            <table className="w-full my-4">
                              <tbody>
                                {permanentwages.map((permanentwages) => (
                                  <tr key={permanentwages}>
                                    <td className="p-2 min-w-[200px]">{permanentwages}
                                    <FormField
                                       control={form.control}
                                       name="permanentwages"
                                       render={({ field }) => (
                                         <FormItem>
                                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                                             <FormControl>
                                               <SelectTrigger> <SelectValue placeholder="Select Group" />
                                               </SelectTrigger>
                                             </FormControl>
                                             <SelectContent>
                                               <SelectItem value="group1:manager">Group 1: Manager</SelectItem>
                                               <SelectItem value="group2:executivestaff">Group 2: Executive Staff</SelectItem>
                                               <SelectItem value="group3:tractor">Group 3: Tractor</SelectItem>
                                               <SelectItem value="group4:pigman">Group 4: Pigman</SelectItem>
                                               <SelectItem value="group5:other">Group 5: Other</SelectItem>
                                             </SelectContent>
                                           </Select>
                                           <FormMessage />
                                         </FormItem>
                                       )}
                                     />
                                    </td>
                                    {permanentcostTypes.map((permanentcostType) => (
                                      <td key={permanentcostType} className="p-2 min-w-[160px]">
                                        <Input type="number" name={`${permanentwages}-${permanentcostType}`} className="w-full"/>
                                      </td>
                                    ))}
                                    <td>
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => permanentremove(0)}><Trash2/></Button>
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
                      className="mt-2 mr-2" onClick={() => permanentapped({ value: "" })}>Add Row</Button>
                   </div>
                   
                   <table className="w-full my-4">
                    <thead>
                      <tr>
                        <th className="font-medium">Casual Worker</th>
                        {casualcostTypes.map((casualcostTypes) => (
                          <th key={casualcostTypes} className="p-1 font-medium">
                            {casualcostTypes}
                          </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {casualwages.map((casualwages) => (
                          <tr key={casualwages}>
                            <td className="p-2 min-w-[200px]">{casualwages}
                              <Input type="text" name={`${casualwages}-name`} className="w-full"/>
                            </td>
                            {casualcostTypes.map((casualcostType) => (
                              <td key={casualcostType} className="p-2 min-w-[160px]">
                                <Input type="number" name={`${casualwages}-${casualcostType}`} className="w-full"/>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div>
                      {casualfields.map((field, index) => (
                        <FormField
                          control={form.control}
                          key={field.id}
                          name={`casualrows.${index}.value`}
                          render={({ field }) => (
                            <table className="w-full my-4">
                              <tbody>
                                {casualwages.map((casualwages) => (
                                  <tr key={casualwages}>
                                    <td className="p-2 min-w-[200px] ">{casualwages}
                                      <Input type="text" name={`${casualwages}-name`} className="w-full"/>
                                    </td>
                                    {casualcostTypes.map((casualcostType) => (
                                      <td key={casualcostType} className="p-2 min-w-[160px]">
                                        <Input type="number" name={`${casualwages}-${casualcostType}`} className="w-full"/>
                                      </td>
                                    ))}
                                    <td>
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => casualremove(0)}><Trash2/></Button>
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
                      className="mt-2 mr-2" onClick={() => casualapped({ value: "" })}>Add Row</Button>
                    </div>

                    <table className="w-full my-4">
                      <thead>
                        <tr>
                          <th className="font-medium">Family Worker</th>
                          {familycostTypes.map((familycostTypes) => (
                            <th key={familycostTypes} className="p-1 font-medium">
                              {familycostTypes}
                            </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {familywages.map((familywages) => (
                            <tr key={familywages}>
                              <td className="p-2 min-w-[200px] ">{familywages}
                                <Input type="text" name={`${familywages}-name`} className="w-full"/>
                              </td>
                              {familycostTypes.map((familycostType) => (
                                <td key={familycostType} className="p-2 min-w-[160px]">
                                  <Input type="number" name={`${familywages}-${familycostType}`} className="w-full"/>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div>
                        {familyfields.map((field, index) => (
                          <FormField
                            control={form.control}
                            key={field.id}
                            name={`familyrows.${index}.value`}
                            render={({ field }) => (
                              <table className="w-full my-4">
                                <tbody>
                                  {familywages.map((familywages) => (
                                    <tr key={familywages}>
                                      <td className="p-2 min-w-[200px] ">{familywages}
                                        <Input type="text" name={`${familywages}-name`} className="w-full"/>
                                      </td>
                                      {familycostTypes.map((familycostType) => (
                                        <td key={familycostType} className="p-2 min-w-[160px]">
                                          <Input type="number" name={`${familywages}-${familycostType}`} className="w-full"/>
                                        </td>
                                      ))}
                                      <td>
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          size="icon"
                                          onClick={() => familyremove(0)}><Trash2/></Button>
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
                        className="mt-2 mr-2" onClick={() => familyapped({ value: "" })}>Add Row</Button>
                      </div>
                      
      </form>
      <Button type="submit">Submit</Button>
    </Form>
    </div>
  )
}

export default WagesFarmPage