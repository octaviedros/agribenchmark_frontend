"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
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
import { Separator } from "@/components/ui/separator"
import { useFarmData } from "@/hooks/use-farm-data"
import { toast } from "@/hooks/use-toast"
import { del, upsert } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { Info, Trash2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const feedproductionFormSchema = z.object({
    general_id: z.string().uuid(),
    production: z.array(
        z.object({
            id: z.string().uuid(),
            general_id: z.string().uuid(),
            production_type: z.string(), // Own Production or Bought Feed
            crop_name: z.string(),
            dry_matter: z.coerce.number(),
            xp: z.coerce.number(),
            energy: z.coerce.number(),
            price: z.coerce.number(),
            concentrate: z.boolean(),
            protein: z.coerce.number(),
        })
    )
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FeedProductionDBSchema = z.object({
    id: z.string().uuid(),
    general_id: z.string().uuid(),
    production_type: z.string(),
    crop_name: z.string(),
    dry_matter: z.number(),
    xp: z.number(),
    energy: z.number(),
    price: z.number(),
    concentrate: z.boolean(),
    protein: z.number(),
})

type FeedProductionFormValues = z.infer<typeof feedproductionFormSchema>
type FeedProductionDBValues = z.infer<typeof FeedProductionDBSchema>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbDataToForm(data: any, general_id: string) {
    if (!data || !data.length) return createDefaults(general_id)
    return {
        general_id: data[0].general_id,
        production: data
    }
}
function formDataToDb(data: FeedProductionFormValues) {
    return data.production.map((varcostcrops) => ({
        ...varcostcrops,
    }))
}

function createDefaults(general_id: string) {
    return {
        general_id: general_id,
        production: [{
            general_id: general_id,
            id: uuidv4(),
            production_type: "",
            crop_name: "",
            dry_matter: 0,
            xp: 0,
            energy: 0,
            price: 0,
            concentrate: false,
            protein: 0,
        }],
    }
}

export default function FeedProductionPage() {
    const searchParams = useSearchParams()
    const general_id = searchParams.get("general_id") || ""
    const {
        data,
        error,
        isLoading,
        mutate
    } = useFarmData("/feeds", general_id)

    const farmData = dbDataToForm(data, general_id)
    console.log("hallo", farmData)
    const form = useForm<FeedProductionFormValues>({
        resolver: zodResolver(feedproductionFormSchema),
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
        name: "production",
    })

    async function onSubmit(formData: FeedProductionFormValues) {
        try {
            console.log("submit", formData)
            const updatedData = formDataToDb(formData)
            // merge with previous farm data
            const mergedData = updatedData.map((row) => {
                const existingRow = (data as FeedProductionDBValues[])?.find((r) => r.id === row.id)
                return existingRow ? { ...existingRow, ...row } : row
            })
            console.log(mergedData)
            await mutate(Promise.all(mergedData.map((row) => upsert(`/feeds`, row))), {
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
    const cropTypes: { name: string; value: keyof FeedProductionFormValues["production"][number], tooltip?: string, type?: string }[] = [
        {
            name: "Name",
            value: "crop_name",
        },
        {
            name: "Dry Matter",
            value: "dry_matter",
            tooltip: "Dry matter content of the feed in percent",
        },
        {
            name: "XP",
            value: "xp",
            tooltip: "Crude protein content of the feed in percent",
        },
        {
            name: "Energy",
            value: "energy",
            tooltip: "Energy content of the feed in MJ/kg",
        },
        {
            name: "Price",
            value: "price",
            tooltip: "Price of the feed per tonne",
        },
        {
            name: "Concentrate",
            value: "concentrate",
            type: "checkbox",
        },
    ]

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
            <div><h3 className="text-lg font-medium">Data on Feed</h3></div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, error => console.log(error))} className="space-y-8">
                    <h3 className="text-lg font-medium">Feed Components</h3>
                    <div>
                        <table className="w-full my-4">
                            <thead>
                                <tr>
                                    <th className="text-left pl-2 align-bottom"><FormLabel>Type</FormLabel></th>
                                    {cropTypes.map(({ name, tooltip }) => (
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
                                            {/* Permanent Worker */}
                                            <FormField
                                                control={form.control}
                                                name={`production.${index}.production_type`}
                                                render={({ field: f }) => (
                                                    <FormItem>
                                                        <Select onValueChange={f.onChange} defaultValue={f.value}>
                                                            <FormControl>
                                                                <SelectTrigger> <SelectValue placeholder="Select Production" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="selfproduced">Self Produced</SelectItem>
                                                                <SelectItem value="boughtfeed">Bought Feed</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </td>
                                        {cropTypes.map(({ value: permanentcostType, type }) => (
                                            <td key={permanentcostType} className="p-1 min-w-[120px]">
                                                {/* costType might be something like 'purchase_price', 'purchase_year', etc. */}
                                                <FormField
                                                    control={form.control}
                                                    name={`production.${index}.${permanentcostType as keyof FeedProductionFormValues["production"][number]}`}
                                                    render={({ field: ff }) => (
                                                        (type === "checkbox" ?
                                                            <div className="w-full flex items-center justify-center">
                                                                <Checkbox
                                                                    checked={ff.value as boolean ?? false}
                                                                    onCheckedChange={ff.onChange}
                                                                />
                                                            </div> :
                                                            <Input {...ff} className="w-full" type={permanentcostType === 'crop_name' ? 'text' : 'number'} value={ff.value as number} />
                                                        )
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
                                                    if (farmData.production[index]?.id) {
                                                        del(`/feeds/${farmData.production[index].id}`)
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
                                onClick={() => append(createDefaults(general_id).production[0])}>Add Row</Button>
                        </div>
                        <Button className="mt-4" type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
