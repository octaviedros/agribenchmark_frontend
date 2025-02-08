"use client"

import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Info } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useFarmData } from "@/hooks/use-farm-data"
import { upsert } from "@/lib/api"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

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


const overheadFormSchema = z.object({
  id: z.string().uuid(),
  general_id: z.string().uuid(),
  overhead_id: z.string().uuid(),
  year: z.number(),
  land_improvements: z.coerce.number({
    required_error: "Please enter your Costs for Land Improvements.",
  }),
  maintenance_machinery: z.coerce.number({
    required_error: "Please enter your Costs for Maintenance Machinery.",
  }),
  maintenance_buildings: z.coerce.number({
    required_error: "Please enter your Costs for Maintenance for your Buildings and Facilities.",
  }),
  contracted_labour_machinery_association: z.coerce.number({
    required_error: "Please enter your Costs for Contracted Labor and Machinery Association",
  }),
  diesel_vehicles: z.coerce.number({
    required_error: "Please enter your Costs for Diesel for Vehicles.",
  }),
  diesel_heating_irrigation: z.coerce.number({
    required_error: "Please enter your Costs for Diesel for Heating.",
  }),
  gasoline: z.coerce.number({
    required_error: "Please enter your Costs for Gasoline.",
  }),
  gas: z.coerce.number({
    required_error: "Please enter your Costs for Gas.",
  }),
  electricity: z.coerce.number({
    required_error: "Please enter your Costs for Electricity.",
  }),
  water_fresh_waste_water_fees: z.coerce.number({
    required_error: "Please enter your Costs for Fresh Water.",
  }),
  farm_insurance: z.coerce.number({
    required_error: "Please enter your Costs for Farm Insurance.",
  }),
  invalidity_insurance: z.coerce.number({
    required_error: "Please enter your Costs for Invalidity Insurance.",
  }),
  taxes_fees: z.coerce.number({
    required_error: "Please enter your Costs for Taxes and Fees.",
  }),
  advisory_services_trainings: z.coerce.number({
    required_error: "Please enter your Costs for Advisory Services.",
  }),
  accounting: z.coerce.number({
    required_error: "Please enter your Costs for Accounting.",
  }),
  office_communication_subs: z.coerce.number({
    required_error: "Please enter your Costs for Office, Communication, Subscriptions and others",
  }),
  others: z.coerce.number(),
})

type OverheadFormValues = z.infer<typeof overheadFormSchema>

// eslint-disable-next-line @typescript-eslint/no-explicit-any

function createDefaults(general_id: string): OverheadFormValues {
  return {
    id: uuidv4(),
    overhead_id: uuidv4(),
    general_id: general_id,
    land_improvements: 0,
    maintenance_machinery: 0,
    maintenance_buildings: 0,
    contracted_labour_machinery_association: 0,
    diesel_vehicles: 0,
    diesel_heating_irrigation: 0,
    gasoline: 0,
    gas: 0,
    electricity: 0,
    water_fresh_waste_water_fees: 0,
    farm_insurance: 0,
    invalidity_insurance: 0,
    taxes_fees: 0,
    advisory_services_trainings: 0,
    accounting: 0,
    office_communication_subs: 0,
    year: new Date().getFullYear(),
    others: 0,
  }
}

function mergeData(data: Array<object>, general_id: string): OverheadFormValues {
  if (data) {
    // @ts-expect-error zod types are not correct
    return {
      ...data[0],
    }
  }
  return createDefaults(general_id)
}

export default function OverheadFarmPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/overheadcosts", general_id)
  const farmData = mergeData(data, general_id)
  /*let farmData 
  if (data) { 
    farmData = data[0]
  }*/
  //console.log(farmData)
  const form = useForm<OverheadFormValues>({
    resolver: zodResolver(overheadFormSchema),
    defaultValues: {
      //...createDefaults(general_id),
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
  async function onSubmit(updatedData: OverheadFormValues) {
    try {
      const mergedData = {
        ...farmData, // overwrite the farmData with the new data
        ...updatedData,     //neuen Daten aus Formular; general_id und id wird nicht überschrieben
      }
      //console.log(mergedData)
      await mutate(upsert(`/overheadcosts`, {
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
        <h3 className="text-lg font-medium">Overhead Costs</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="land_improvements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Land Improvements</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                    <TooltipContent>
                      <p>Amount per year; Drainage etc.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maintenance_machinery"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maintenance Machinery</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                    <TooltipContent>
                      <p>Amount per year; If not known, calculate proxy, e.g. 3 % of the purchase price per annum; avoid double counting!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maintenance_buildings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maintenance Buildings and Facilities</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                    <TooltipContent>
                      <p>Amount per year; If not known, calculate proxy, e.g. 3 % of the purchase price per annum; avoid double counting!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contracted_labour_machinery_association"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contracted Labor and Machinery Association</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                    <TooltipContent>
                      <p>Amount per year</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Input type="number"{...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="diesel_vehicles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diesel for Vehicles</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                    <TooltipContent>
                      <p>Amount per year; Includes Pick-up trucks, farm vehicles, NOT tractors for crop and forage production (var. cost per ha!)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="diesel_heating_irrigation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diesel for Heating</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                    <TooltipContent>
                      <p>Amount per year</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gasoline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gasoline</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                    <TooltipContent>
                      <p>Amount per year</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gas</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                    <TooltipContent>
                      <p>Amount per year</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="electricity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Electricity</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                    <TooltipContent>
                      <p>Amount per year</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="water_fresh_waste_water_fees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fresh Water</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                    <TooltipContent>
                      <p>Amount per year; Water and energy for the farmstead, not for crop production and other enterprises</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="farm_insurance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Farm Insurances</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                    <TooltipContent>
                      <p>Amount per year; Insurances to cover the farm, e.g. fire insurance, crop insurance under other variable cost crop</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="invalidity_insurance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invalidity Insurance</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                    <TooltipContent>
                      <p>Amount per year; Fees for instutions that provide accident insurances and check safety on the farms</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taxes_fees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taxes and Fees</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                    <TooltipContent>
                      <p>Amount per year; Only farm taxes like ground tax, no personal taxes like income tax!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="advisory_services_trainings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Advisory Services/Trainings</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                    <TooltipContent>
                      <p>Amount per year; Costs for advisory/extension services if it cannot be allocated to the enterprises</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accounting"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accounting</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                    <TooltipContent>
                      <p>Amount per year; E.g. costs for hiring a person or a company to do the accounting</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="office_communication_subs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Office, Communication, Subscriptions...</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                    <TooltipContent>
                      <p>Amount per year; All kind of materials, hardware and communication expenses</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-4" type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}