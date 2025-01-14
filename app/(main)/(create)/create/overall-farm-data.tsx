"use client"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"

import countries from "@/data/countries.json"
import currencies from "@/data/currencies.json"
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
import { Combobox } from "@/components/ui/combobox"
import { Checkbox } from "@/components/ui/checkbox"
import { post } from "@/lib/api"

const CountriesEnum = z.enum(countries.map((country) => country.alpha3) as [string, ...string[]])
const CurrenciesEnum = z.enum(currencies.map((curr) => curr.code) as [string, ...string[]])

// Match the format: "XX_YYYY_{UUID}"
// Where XX = alpha2, YYYY = year, {UUID} = valid UUID
const GeneralIdRegex = /^[A-Za-z]{2}_[0-9]{4}_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const profileFormSchema = z.object({
  scenario_id: z.string().uuid(),
  scenario_name: z.string().min(3).max(50).optional(),
  farm_id: z
    .string()
    .regex(GeneralIdRegex, "Invalid format. Expected CC_YYYY_UUID.")
    .default(""), // We'll generate/update it in code
  farm_name: z.string().min(3).max(50).optional(),
  username: z.string().min(3).max(25),
  email: z.string().email(),
  password: z.string().min(6),
  land: CountriesEnum,
  region: z.string().max(50),
  currency: CurrenciesEnum,
  year: z.number().int().nonnegative().min(1000).max(9999),
  legal_status: z.string().optional(),
  reference_year_data: z.number().int().positive().min(1000).max(9999).optional(),
  cash_crop: z.boolean().optional(),
  sows: z.boolean().optional(),
  pig_finishing: z.boolean().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const defaultValues: Partial<ProfileFormValues> = {
  // Provide your defaults as needed
  scenario_id: uuidv4(),
  scenario_name: "Baseline",
  land: "DEU",
  currency: "EUR",
  year: new Date().getFullYear(),
  reference_year_data: new Date().getFullYear(),
  email: "",
}

export function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  // Generate or update farm_id whenever land or year changes
  const watchLand = form.watch("land")
  const watchYear = form.watch("year")

  React.useEffect(() => {
    // Whenever country or year changes, update farm_id automatically
    const alpha2 =
      countries.find((c) => c.alpha3 === watchLand)?.alpha2?.toUpperCase() || "DE"
    const currentYear = watchYear || 2025
    // Generate a new random UUID but preserve the user-modified part if desired
    const newUuid = uuidv4()
    const newGeneralId = `${alpha2}_${currentYear}_${newUuid}`
    form.setValue("farm_id", newGeneralId)
  }, [watchLand, watchYear, form, form.setValue])

  async function onSubmit(data: ProfileFormValues) {
    // send data to the server
    try {
      await post("/generalfarm/", data)
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

  // Prepare combobox options for country selection
  const countryOptions = countries.map((c) => ({
    value: c.alpha3,
    label: c.en,
  }))

  // Prepare combobox options for currency selection
  const currencyOptions = currencies.map((cur) => ({
    value: cur.code,
    label: `${cur.name} (${cur.symbol})`,
  }))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, errors => console.log(errors))} className="space-y-8">
        {/** farm_id field */}
        <FormField
          control={form.control}
          name="farm_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Farm ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Format: CC_YYYY_UUID. Automatically updates if country/year changes.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/** farm_name */}
        <FormField
          control={form.control}
          name="farm_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Farm name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. John Does Farm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/** username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="e.g. farmer123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/** email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/** password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/** land (country) combobox */}
        <FormField
          control={form.control}
          name="land"
          render={({ field }) => {
            const [countryValue, setCountryValue] = React.useState<string>(field.value || defaultValues.land as string)
            React.useEffect(() => {
              field.onChange(countryValue)
            }, [countryValue, field])
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        {/** currency combobox */}
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => {
            const [currencyValue, setCurrencyValue] = React.useState<string>(field.value || defaultValues.currency as string)
            React.useEffect(() => {
              field.onChange(currencyValue)
            }, [currencyValue, field])
            React.useEffect(() => {
              // Update currency automatically based on country if needed:
              const countryObj = countries.find((c) => c.alpha3 === watchLand)
              if (countryObj) {
                const matchedCurrency = currencies.find((cur) => cur.code === countryObj.currency)
                if (matchedCurrency) {
                  setCurrencyValue(matchedCurrency.code)
                }
              }
            }, [watchLand])
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        {/** year */}
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
          <Input
            type="number"
            placeholder="2025"
            {...field}
            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
          />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/** region */}
        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region</FormLabel>
              <FormControl>
                <Input placeholder="Region/State" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/** legal_status */}
        <FormField
          control={form.control}
          name="legal_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Legal Status</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. LLC" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/** reference_year_data */}
        <FormField
          control={form.control}
          name="reference_year_data"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reference Year</FormLabel>
              <FormControl>
                <Input type="number" placeholder="2022" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/** Checkboxes for booleans */}
        <div className="grid grid-cols-3 gap-4">
          <FormLabel className="col-span-3">Farm branches</FormLabel>
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

        <Button type="submit">Save</Button>
      </form>
    </Form>
  )
}