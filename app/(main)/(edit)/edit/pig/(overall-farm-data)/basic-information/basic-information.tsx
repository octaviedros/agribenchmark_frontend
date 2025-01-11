"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Check, ChevronsUpDown } from "lucide-react"
import { z } from "zod"

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

const countries = [
  { label: "Austria", value: "austria" },
  { label: "Albania", value: "albania" },
  { label: "Andorra", value: "andorra" },
  { label: "Belarus", value: "belarus" },
  { label: "Belgium", value: "belgium" },
  { label: "Bosnia and Herzegovina", value: "bosnia" },
  { label: "Bulgaria", value: "bulgaria" },
  { label: "Croatia", value: "croatia" },
  { label: "Czech Republic", value: "czech" },
  { label: "Denmark", value: "denmark" },
  { label: "Estonia", value: "estonia" },
  { label: "Finland", value: "finland" },
  { label: "France", value: "france" },
  { label: "Germany", value: "germany" },
  { label: "Greece", value: "greece" },
  { label: "Hungary", value: "hungary" },
  { label: "Iceland", value: "iceland" },
  { label: "Ireland", value: "ireland" },
  { label: "Italy", value: "italy" },
  { label: "Latvia", value: "latvia" },
  { label: "Liechtenstein", value: "liechtenstein" },
  { label: "Lithuania", value: "lithuania" },
  { label: "Luxembourg", value: "luxembourg" },
  { label: "Malta", value: "malta" },
  { label: "Moldova", value: "moldova" },
  { label: "Monaco", value: "monaco" },
  { label: "Montenegro", value: "montenegro" },
  { label: "Netherlands", value: "netherlands" },
  { label: "North Macedonia", value: "macedonia" },
  { label: "Norway", value: "norway" },
  { label: "Poland", value: "poland" },
  { label: "Portugal", value: "portugal" },
  { label: "Romania", value: "romania" },
  { label: "Russia", value: "russia" },
  { label: "San Marino", value: "sanmarino" },
  { label: "Serbia", value: "serbia" },
  { label: "Slovakia", value: "slovakia" },
  { label: "Slovenia", value: "slovenia" },
  { label: "Spain", value: "spain" },
  { label: "Sweden", value: "sweden" },
  { label: "Switzerland", value: "switzerland" },
  { label: "Ukraine", value: "ukraine" },
  { label: "United Kingdom", value: "uk" },
  { label: "Vatican City", value: "vatican" }
 
] as const

const currencies = [
  { label: "Australian Dollar (AUD)", value: "aud" },
  { label: "Brazilian Real (BRL)", value: "brl" },
  { label: "British Pound (GBP)", value: "gbp" },
  { label: "Canadian Dollar (CAD)", value: "cad" },
  { label: "Chinese Yuan (CNY)", value: "cny" },
  { label: "Euro (EUR)", value: "eur" },
  { label: "Hong Kong Dollar (HKD)", value: "hkd" },
  { label: "Indian Rupee (INR)", value: "inr" },
  { label: "Indonesian Rupiah (IDR)", value: "idr" },
  { label: "Japanese Yen (JPY)", value: "jpy" },
  { label: "Mexican Peso (MXN)", value: "mxn" },
  { label: "New Zealand Dollar (NZD)", value: "nzd" },
  { label: "Norwegian Krone (NOK)", value: "nok" },
  { label: "Russian Ruble (RUB)", value: "rub" },
  { label: "Saudi Riyal (SAR)", value: "sar" },
  { label: "Singapore Dollar (SGD)", value: "sgd" },
  { label: "South African Rand (ZAR)", value: "zar" },
  { label: "South Korean Won (KRW)", value: "krw" },
  { label: "Swiss Franc (CHF)", value: "chf" },
  { label: "US Dollar (USD)", value: "usd" }
] as const

const enterprises = [
  {
    id: "cashcrop",
    label: "Cash Crop",
  },
  {
    id: "pigfinishing",
    label: "Pig Finishing",
  },
  {
    id: "sows",
    label: "Sows",
  },
] as const

const profileFormSchema = z.object({
  countries: z.string({
    required_error: "Please select a Country.",
  }),
  region: z
    .string()
    .min(2, {
      message: "Region must be at least 2 characters.",
    })
    .max(30, {
      message: "Region must not be longer than 30 characters.",
    }),
    currencies: z.string({
      required_error: "Please select your Currency.",
    }),
    legalstatus: z
    .string()
    .min(2, {
      message: "Legal status must be at least 2 characters.",
    }),
    referenceyear: z
    .string()
    .min(2, {
      message: "Reference year must be at least 2 characters.",
    })
    .max(4, {
      message: "Reference year must not be longer than 30 characters.",
    }),
    enterprises: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>


export function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      enterprises: [],},
    mode: "onChange",
  })

  function onSubmit(data: ProfileFormValues) {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
          control={form.control}
          name="countries"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Country</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? countries.find(
                            (countries) => countries.value === field.value
                          )?.label
                        : "Select Country"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search countries..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>Country not found.</CommandEmpty>
                      <CommandGroup>
                        {countries.map((countries) => (
                          <CommandItem
                            value={countries.label}
                            key={countries.value}
                            onSelect={() => {
                              form.setValue("countries", countries.value)
                            }}
                          >
                            {countries.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                countries.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>In which Region is your farm located?</FormLabel>
              <FormControl>
                <Input placeholder="Region" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
             <FormField
          control={form.control}
          name="currencies"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Currency</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? currencies.find(
                            (currency) => currency.value === field.value
                          )?.label
                        : "Select Currency"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search currencies..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>Currency not found.</CommandEmpty>
                      <CommandGroup>
                        {currencies.map((currency) => (
                          <CommandItem
                            value={currency.label}
                            key={currency.value}
                            onSelect={() => {
                              form.setValue("currencies", currency.value)
                            }}
                          >
                            {currency.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                currency.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="legalstatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is the legal status of your farm?</FormLabel>
              <FormControl>
                <Input placeholder="Legal status" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="referenceyear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is the Reference year of the following Data for this farm?</FormLabel>
              <FormControl>
                <Input placeholder="Reference year" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="enterprises"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Enterprise</FormLabel>
                <FormDescription>
                  Please select the enterprises that are present on your farm.
                </FormDescription>
              </div>
              {enterprises.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="enterprises"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  )
}