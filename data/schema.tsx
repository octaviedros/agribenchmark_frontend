import { z } from "zod"
import countries from "@/data/countries.json"
import currencies from "@/data/currencies.json"

const CountriesEnum = z.enum(countries.map((country) => country.alpha3) as [string, ...string[]])
const CurrenciesEnum = z.enum(currencies.map((curr) => curr.code) as [string, ...string[]])

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const farmSchema = z.object({
  general_id: z.number().optional().nullable(),
  scenario_id: z.string().uuid().optional().nullable(),
  scenario_name: z.string().min(3).max(50).optional().nullable(),
  farm_id: z
    .string()
    .min(3)
    .default(""), // We'll generate/update it in code
  farm_name: z.string().min(3).max(50).optional().nullable(),
  firstname: z.string().min(3).max(25).optional().nullable(),
  lastname: z.string().min(3).max(25).optional().nullable(),
  // username: z.string().min(3).max(25),
  email: z.string().email().optional().nullable(),
  // password: z.string().min(6),
  land: CountriesEnum,
  region: z.string().max(50).optional().nullable(),
  currency: CurrenciesEnum,
  year: z.number().int().nonnegative().min(1000).max(9999).optional().nullable(),
  legal_status: z.string().optional().nullable(),
  reference_year_data: z.number().int().positive().min(1000).max(9999).optional().nullable(),
  cash_crop: z.boolean().optional().nullable(),
  sows: z.boolean().optional().nullable(),
  pig_finishing: z.boolean().optional().nullable(),
  network_pig: z.boolean().optional().nullable(),
  network_beef: z.boolean().optional().nullable(),
  network_crop: z.boolean().optional().nullable(),
  network_horticulture: z.boolean().optional().nullable(),
  network_fish: z.boolean().optional().nullable(),
  network_poultry: z.boolean().optional().nullable(),
  networks: z.array(z.string()).optional().nullable(),
})

export type Farm = z.infer<typeof farmSchema>