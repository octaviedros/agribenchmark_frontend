"use client"

import { Separator } from "@/components/ui/separator"
import { useFarmData } from "@/hooks/use-farm-data"
import { upsert } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { Info } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

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

const liabilitiesFormSchema = z.object({
  general_id: z.string().uuid(),
  id: z.string().uuid(),
  liabilities_id: z.string().uuid(),
  long_term_loans: z.coerce.number({
    required_error: "Please enter your Long-Term loans.",
  }),
  medium_term_loans: z.coerce.number({
    required_error: "Please enter your Medium-Term loans.",
  }),
  short_term_loans: z.coerce.number({
    required_error: "Please enter your Short-Term loans.",
  }),
  circulating_capital_overdraft: z.coerce.number({
    required_error: "Please enter your Circulating Capital.",
  }),
  savings: z.coerce.number({
    required_error: "Please enter your Savings.",
  }),
  total_liabilities: z.coerce.number({
    required_error: "Please enter your Total Liabilities.",
  }),
  total_long_term_loans: z.coerce.number({
    required_error: "Please enter your Total Long-Term loans.",
  }),
  total_medium_term_loans: z.coerce.number({
    required_error: "Please enter your Total Medium-Term loans.",
  }),
  total_short_term_loans: z.coerce.number({
    required_error: "Please enter your Total Short-Term loans.",
  }),
  perc_debt_total_assets: z.coerce.number({
    required_error: "Please enter your Percentage Debt of Total Assets.",
  }),
  year: z.coerce.number().int(),
})


type LiabilitiesFormValues = z.infer<typeof liabilitiesFormSchema>


// eslint-disable-next-line @typescript-eslint/no-explicit-any


function createDefaults(general_id: string): LiabilitiesFormValues {
  return {
    id: uuidv4(),
    liabilities_id: uuidv4(),
    general_id: general_id,
    long_term_loans: 0,
    medium_term_loans: 0,
    short_term_loans: 0,
    circulating_capital_overdraft: 0,
    savings: 0,
    total_long_term_loans: 0,
    total_medium_term_loans: 0,
    total_short_term_loans: 0,
    perc_debt_total_assets: 0,
    total_liabilities: 0,
    year: new Date().getFullYear(),
  }}

  function mergeData(data: Array<object>, general_id: string): LiabilitiesFormValues {
    if (data) {
      // @ts-expect-error zod types are not correct
      return {
        ...data[0],
      }
    }
    return createDefaults(general_id)
  } 

export default function LiabilitiesFarmPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    error,
    isLoading,
    mutate
  } = useFarmData("/liabilitiesinterestrates", general_id)

const farmData = mergeData(data, general_id)

  const form = useForm<LiabilitiesFormValues>({
    resolver: zodResolver(liabilitiesFormSchema),
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

async function onSubmit(updatedData: LiabilitiesFormValues) {
    try {
      const mergedData = {
        ...farmData, // overwrite the farmData with the new data
        ...updatedData,     //neuen Daten aus Formular; general_id und id wird nicht überschrieben
      }

      await mutate(upsert(`/liabilitiesinterestrates/`,{
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
        <h3 className="text-lg font-medium">What are your Current Interest Rates and Total Liabilities?</h3>
      </div>
      <Separator
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, error => console.error(error))} className="space-y-2">
        <h3 className="text-lg font-medium">Current Interest Rates</h3>
          <FormField
            control={form.control}
            name="long_term_loans"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Long-Term Loans</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>0.0x</p>
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
            name="medium_term_loans"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medium-Term Loans</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>0.0x</p>
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
            name="short_term_loans"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short-Term Loans</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>0.0x</p>
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
            name="circulating_capital_overdraft"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Circulating Capital (Overdraft)</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>0.0x</p>
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
            name="savings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Savings</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>0.0x</p>
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
          <h3 className="text-lg font-medium">Liabilities</h3>
          <FormField
            control={form.control}
            name="total_liabilities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Liabilities</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>Amount in your currency</p>
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
            name="total_long_term_loans"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Long-Term Loans</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>Amount in your currency</p>
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
            name="total_medium_term_loans"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Medium-Term Loans</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>Amount in your currency</p>
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
            name="total_short_term_loans"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Short-Term Loans</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>Amount in your currency</p>
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
            name="perc_debt_total_assets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Percentage Debt of Total Assets</FormLabel>
                <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>0.0x</p>
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
          <Button className="mt-4" type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}
