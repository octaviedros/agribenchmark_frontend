import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const farmSchema = z.object({
  id: z.string(),
  year: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  networks: z.array(z.string()),
  countryCode: z.string(),
  address: z.string(),
  email: z.string(),
  phone: z.string(),
  title: z.string(),
  status: z.string(),
  priority: z.string(),
})

export type Farm = z.infer<typeof farmSchema>