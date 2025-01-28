/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { put } from "@/lib/api"
import { useFarmData } from "@/hooks/use-farm-data"

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
import { Combobox } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import countries from "@/data/countries.json"
import currencies from "@/data/currencies.json"

const CountriesEnum = z.enum(countries.map((country) => country.alpha3) as [string, ...string[]])
const CurrenciesEnum = z.enum(currencies.map((curr) => curr.code) as [string, ...string[]])
const countryOptions = countries.map((c) => ({
  value: c.alpha3,
  label: c.en,
}))
const currencyOptions = currencies.map((cur) => ({
  value: cur.code,
  label: `${cur.name} (${cur.symbol})`,
}))

const profileFormSchema = z.object({
  id: z.string().uuid(),
  general_id: z.string().uuid(),
  land: CountriesEnum,
  region: z
    .string()
    .min(2, {
      message: "Region must be at least 2 characters.",
    })
    .max(30, {
      message: "Region must not be longer than 30 characters.",
    }),
  currency: CurrenciesEnum,
  legal_status: z
    .string()
    .min(2, {
      message: "Legal status must be at least 2 characters.",
    }),
  reference_year_data: z.coerce.number().int().positive().min(1000).max(9999).optional(),
  cash_crop: z.boolean().nullable().optional(),
  sows: z.boolean().nullable().optional(),
  pig_finishing: z.boolean().nullable().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
  farmData: ProfileFormValues | undefined
}

export function ProfileForm({ farmData }: ProfileFormProps) {
  const { mutate } = useFarmData("/generalfarm", farmData?.general_id?.toString())
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
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

  async function onSubmit(data: ProfileFormValues) {
    try {
      const mergedData = {
        ...farmData, // overwrite the farmData with the new data
        ...data,
      }
      console.log(mergedData)
      await mutate(put(`/generalfarm/${farmData?.id}`, mergedData), {
        optimisticData: mergedData,
        rollbackOnError: true,
        populateCache: false,
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, (error) => console.log(error))} className="space-y-8">
        <FormField
          control={form.control}
          name="land"
          render={({ field }) => {
            const [countryValue, setCountryValue] = useState<string>(field.value)

            useEffect(() => {
              field.onChange(countryValue)
              setCountryValue(field.value)
            }, [field.value])

            useEffect(() => {
              field.onChange(countryValue)
            }, [countryValue])

            return (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <br />
                <FormControl>
                  <Combobox
                    valueState={[countryValue, setCountryValue]}
                    options={countryOptions}
                    selectText="Select country..."
                    placeholder="Search countries..."
                    noOptionText="No country found."
                    isDialog={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>In which Region is your farm located?</FormLabel>
              <FormControl>
                <Input placeholder="Region" {...field} value={field.value ?? ""}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => {
            const [currencyValue, setCurrencyValue] = useState<string>(field.value)
            useEffect(() => {
              setCurrencyValue(field.value)
            }, [field.value])

            useEffect(() => {
              field.onChange(currencyValue)
            }, [currencyValue])

            return (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <br />
                <FormControl>
                  <Combobox
                    valueState={[currencyValue, setCurrencyValue]}
                    options={currencyOptions}
                    selectText="Select currency..."
                    placeholder="Search currencies..."
                    noOptionText="No currency found."
                    isDialog={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="legal_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is the legal status of your farm?</FormLabel>
              <FormControl>
                <Input placeholder="Legal status" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reference_year_data"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is the Reference year of the following Data for this farm?</FormLabel>
              <FormControl>
                <Input placeholder="Reference year" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="mb-4 col-span-3">
            <FormLabel className="text-base">Enterprise</FormLabel>
            <FormDescription>
              Please select the enterprises that are present on your farm.
            </FormDescription>
          </div>
          <FormField
            control={form.control}
            name="cash_crop"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value || false}
                    onCheckedChange={(checked) => field.onChange(!!checked)}
                  />
                </FormControl>
                <FormLabel className="font-normal">Cash Crop</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sows"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value || false}
                    onCheckedChange={(checked) => field.onChange(!!checked)}
                  />
                </FormControl>
                <FormLabel className="font-normal">Sows</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pig_finishing"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value || false}
                    onCheckedChange={(checked) => field.onChange(!!checked)}
                  />
                </FormControl>
                <FormLabel className="font-normal">Pig Finishing</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  )
}