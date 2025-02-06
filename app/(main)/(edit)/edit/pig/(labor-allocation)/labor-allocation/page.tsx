"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useFarmData } from "@/hooks/use-farm-data"
import { toast } from "@/hooks/use-toast"
import { upsert } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { Info } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const laborallocationFormSchema = z.object({
  id: z.string().uuid(),
  general_id: z.string().uuid(),
  casual_labor_sow: z.coerce.number( {
    message: "Please enter Casual Labor Allocation for Sow Entperise.",
  }),
  family_labor_sow: z.coerce.number( {
    message: "Please enter Family Labor Allocation for Sow Entperise.",
  }),
  casual_labor_finishing: z.coerce.number( {
    message: "Please enter Casual Labor Allocation for Pig Finishing Entperise.",
  }),
  family_labor_finishing: z.coerce.number( {
    message: "Please enter Family Labor Allocation for Pig Finishing Entperise.",
  }),
  year: z.number().int(),
})

type LaborAllocationFormValues = z.infer<typeof laborallocationFormSchema>

// eslint-disable-next-line @typescript-eslint/no-explicit-any

function createDefaults(general_id: string): LaborAllocationFormValues {
  return {
    id: uuidv4(),
    general_id: general_id,
    casual_labor_sow: 0,
    family_labor_sow: 0,
    casual_labor_finishing: 0,
    family_labor_finishing: 0,
    year: new Date().getFullYear(),
  }
}

function mergeData(data: Array<object>, general_id: string): LaborAllocationFormValues {
  if (data) {
    // @ts-expect-error zod types are not correct
    return {
      ...data[0],
    }
  }
  return createDefaults(general_id)
}

export default function LaborAllocationPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/laborallocsowfinishing/", general_id)

const farmData = mergeData(data, general_id)

  const form = useForm<LaborAllocationFormValues>({
    resolver: zodResolver(laborallocationFormSchema),
    defaultValues: {
      ...farmData
    },
    mode: "onChange",
  })
// 
  useEffect(() => {
    form.reset({
      ...farmData
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

async function onSubmit(updatedData: LaborAllocationFormValues) {
    try {
      const mergedData = {
        ...farmData, // overwrite the farmData with the new data
        ...updatedData,     //neuen Daten aus Formular; general_id und id wird nicht überschrieben
      }
      await mutate(upsert(`/laborallocsowfinishing`, {
        ...mergedData,
        id: data?.[0]?.id || farmData.id
      }), {
        optimisticData: mergedData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: true
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
  if (error && error.status !== 404) {
    console.error(error)
    return <div className="p-4">Failed to load farm data.</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Labor Allocation in Sow and Pig Finishing Enterprise</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, error => console.error(error))} className="space-y-2">
          <FormField
            control={form.control}
            name="casual_labor_sow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Casual Labor Sow Enterprise</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>0,0x</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="family_labor_sow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Family Labor Sow Enterprise</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>0,0x</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="casual_labor_finishing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Casual Labor Pig Finishing Enterprise</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>0,0x</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="family_labor_finishing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Family Labor Pig Finishing Enterprise</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>0,0x</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}