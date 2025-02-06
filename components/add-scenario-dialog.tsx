"use client"

import { ProfileFormValues } from "@/components/add-farm-dialog"
import { useFarmData } from "@/hooks/use-farm-data"
import { toast } from "@/hooks/use-toast"
import { post } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { ComponentType, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { KeyedMutator } from "swr"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const scenarioFormSchema = z.object({
  id: z.string(),
  scenario_name: z.string({
    required_error: "Scenario name is required",
  }),
  farm_id: z.string({
    required_error: "Select a farm ID to base the scenario on",
  }),
  year: z.number({
    required_error: "Select a year for the scenario",
  }),
})

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ProfileFormProps {
  item: {
    name: string
    icon: ComponentType
  }
}

export function AddScenarioDialog({
  item
}: ProfileFormProps) {
  const { data: farms, mutate } = useFarmData("/generalfarm") as { data: ProfileFormValues[], mutate: KeyedMutator<ProfileFormValues[]> }
  const [open, setOpen] = useState(false);

  const defaultValues: Partial<ProfileFormValues> = {
    id: uuidv4(),
    farm_id: "",
    scenario_name: "",
    year: new Date().getFullYear(),
  }


  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(scenarioFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const watchFarmId = form.watch("farm_id")

  const uniqueFarmIds = [...new Set(farms?.filter(f => f.scenario_name === "Baseline")?.map(f => f.farm_id))]
  const uniqueAvailableYears = [... new Set(farms?.filter(f => f.farm_id === watchFarmId)?.map(f => f.year))]


  useEffect(() => {
    if (open) {
      form.reset({
        ...defaultValues,
        id: uuidv4(),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function onSubmit(data: ProfileFormValues) {
    // get the corresponding farm data for the selected farm_id and year
    const farmData = farms?.find(f => f.farm_id === data.farm_id && f.year === data.year)
    if (farmData) {
      // overwrite scenario_name, id, and scenario_id
      const scenarioData = {
        ...farmData,
        scenario_name: data.scenario_name,
        id: data.id,
        general_id: uuidv4(),
        scenario_id: uuidv4(),
      }
      // send data to the server
      try {
        await mutate(post("/generalfarm/", scenarioData), {
          optimisticData: [...farms, scenarioData],
          rollbackOnError: true,
          populateCache: false,
          revalidate: false
        })
        toast({
          title: "Success",
          description: "Scenario has been saved successfully.",
        })
        // close the dialog
        setOpen(false)
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to save farm data. ${errorMessage}`,
        })
      }
    }
    console.log(farmData)
  }

  return (
    <Dialog key={item.name} open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <SidebarMenuItem key={item.name}>
          <SidebarMenuButton asChild>
            <div>
              <item.icon />
              <span>{item.name}</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Scenario</DialogTitle>
          <DialogDescription>
            Add a new scenario to the farm. The scenario is based on the Baseline scenario. If no Baseline scenario exists, create one first.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, errors => console.log(errors))} className="space-y-8">
            <FormField
              control={form.control}
              name="farm_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farm ID</FormLabel>
                  <FormControl>
                    <Select key={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a farm..." />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueFarmIds.map(farm_id => (
                          <SelectItem key={farm_id} value={farm_id}>{farm_id}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select the farm to add the scenario to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Select key={field.value} onValueChange={field.onChange} defaultValue={field.value.toString()} disabled={uniqueAvailableYears.length === 0}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a year..." />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueAvailableYears.map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select the year for the scenario.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scenario_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scenario Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="input"/>
                  </FormControl>
                  <FormDescription>
                    Enter the name of the scenario.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>)
}

