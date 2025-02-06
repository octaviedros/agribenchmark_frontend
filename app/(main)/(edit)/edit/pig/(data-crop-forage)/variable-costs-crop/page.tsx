"use client"

import { Separator } from "@/components/ui/separator"
import { del, upsert } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { Info, Trash2 } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import { useFarmData } from "@/hooks/use-farm-data"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
  FormLabel
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const varcostcropFormSchema = z.object({
  varcostcrop: z.array(
    z.object({
      general_id: z.string().uuid(),
      id: z.string().uuid(),
      var_cost_crop_id: z.string().uuid(),
      crop_name: z.string(),
      seeds: z.coerce.number(),
      fertilizer: z.coerce.number(),
      herbicides: z.coerce.number(),
      fungicide: z.coerce.number(),
      contract_labor: z.coerce.number(),
      energy: z.coerce.number(),
      other: z.coerce.number(),
    })
  )
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VarCostCropDBSchema = z.object({
  id: z.string().uuid(),
  var_cost_crop_id: z.string().uuid(),
  general_id: z.string().uuid(),
  crop_id: z.string().uuid(),
  seeds: z.coerce.number(),
  fertilizer: z.coerce.number(),
  herbicides: z.coerce.number(),
  fungicide: z.coerce.number(),
  contract_labor: z.coerce.number(),
  energy: z.coerce.number(),
  other: z.coerce.number(),
  crop_name: z.string(),
})

type VarCostCropFormValues = z.infer<typeof varcostcropFormSchema>
type VarCostCropDBValues = z.infer<typeof VarCostCropDBSchema>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbDataToForm(data: any, general_id: string) {
  if (!data || !data.length) return createDefaults(general_id)
  return {
    id: data[0].id,
    general_id: data[0].general_id,
    varcostcrop: data
  }
}
function formDataToDb(data: VarCostCropFormValues) {
  return data.varcostcrop.map((varcostcrops) => ({
    ...varcostcrops,
  }))
}

function createDefaults(general_id: string) {
  return {
    varcostcrop: [{
      general_id: general_id,
      id: uuidv4(),
      var_cost_crop_id: uuidv4(),
      crop_name: "",
      seeds: 0,
      fertilizer: 0,
      herbicides: 0,
      fungicide: 0,
      contract_labor: 0,
      energy: 0,
      other: 0,
    }],
  }
}

export default function VarCostCropPage() {
  const searchParams = useSearchParams()
  const general_id = searchParams.get("general_id") || ""
  const {
    data,
    isLoading,
    mutate
  } = useFarmData("/varcostcrop", general_id)

  const farmData = dbDataToForm(data, general_id)
  console.log(farmData)
  const form = useForm<VarCostCropFormValues>({
    resolver: zodResolver(varcostcropFormSchema),
    defaultValues: {
      ...farmData
    },
    mode: "onChange",
  })

  useEffect(() => {
    form.reset({
      ...farmData
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "varcostcrop",
  })

  async function onSubmit(formData: VarCostCropFormValues) {
    try {
      console.log("submit", formData)
      const updatedData = formDataToDb(formData)
      // merge with previous farm data
      const mergedData = updatedData.map((row) => {
        const existingRow = (data as VarCostCropDBValues[])?.find((r) => r.id === row.id)
        return existingRow ? { ...existingRow, ...row } : row
      })
      console.log(mergedData)
      await mutate(Promise.all(mergedData.map((row) => upsert(`/varcostcrop/`, row))), {
        optimisticData: mergedData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
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
  const varcostcropTypes: { name: string; value: keyof VarCostCropFormValues["varcostcrop"][number], tooltip?: string }[] = [
    {
      name: "Seeds",
      value: "seeds",
      tooltip: "price per ha"
    },
    {
      name: "Fertilizer",
      value: "fertilizer",
      tooltip: "price per ha"
    },
    {
      name: "Herbicide",
      value: "herbicides",
      tooltip: "price per ha"
    },
    {
      name: "Fungicide/Insecticide",
      value: "fungicide",
      tooltip: "price per ha"
    },
    {
      name: "Contract labor",
      value: "contract_labor",
      tooltip: "price per ha"
    },
    {
      name: "Energy",
      value: "energy",
      tooltip: "price per ha"
    },
    {
      name: "Other",
      value: "other",
      tooltip: "price per ha"
    },
  ]

  /*function logformerrors(errors) {
    console.log(errors)
  }*/

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Variable Costs of Crop and Forage Production</h3>
      </div>
      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, error => console.log(error))} className="space-y-4 w-full">
          <table className="w-full my-4">
            <thead>
              <tr>
                <th className="text-left pl-2 align-bottom"><FormLabel>Crop Name</FormLabel></th>
                {varcostcropTypes.map(({ name, tooltip }) => (
                  <th key={name} className="text-left pl-2 align-bottom">
                    <FormLabel>
                      {name}
                      {tooltip &&
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="align-sub pl-1"><Info size={16} /></TooltipTrigger>
                            <TooltipContent>
                              <p>{tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      }
                    </FormLabel>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td className="p-1 min-w-[120px]">
                    {/* Casual Worker */}
                    <FormField
                      control={form.control}
                      name={`varcostcrop.${index}.crop_name`}
                      render={({ field: f }) => (
                        <Input {...f} className="w-full" />
                      )}
                    />
                  </td>
                  {varcostcropTypes.map(({ value: varcostcropType }) => (
                    <td key={varcostcropType} className="p-1 min-w-[120px]">
                      {/* costType might be something like 'purchase_price', 'purchase_year', etc. */}
                      <FormField
                        control={form.control}
                        name={`varcostcrop.${index}.${varcostcropType as keyof VarCostCropFormValues["varcostcrop"][number]}`}
                        render={({ field: ff }) => (
                          <Input {...ff} className="w-full" type="number" value={ff.value as number} />
                        )}
                      />
                    </td>
                  ))}
                  <td>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        if (farmData.varcostcrop[index]?.id) {
                          del(`/varcostcrop/${farmData.varcostcrop[index].id}`)
                        }
                        remove(index)
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <Button
              type="button"
              className="mt-4"
              onClick={() => append(createDefaults(general_id).varcostcrop[0])}>Add Row</Button>
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}
