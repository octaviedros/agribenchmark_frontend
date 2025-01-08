import { Metadata } from "next"
import { NetworkProvider } from "@/context/NetworkContext"
import { EditLayoutContent } from "../(edit)/LayoutContent"
import { farmSchema } from "@/data/schema"
import fs from "fs/promises"
import path from "path"
import { z } from "zod"

export const metadata: Metadata = {
  title: "Edit | agribenchmark",
  description: "Edit a farm",
}

interface EditLayoutProps {
  children: React.ReactNode
}

export default async function EditLayout({ children }: EditLayoutProps) {
  // TODO: Fetch data from database
  const data = await fs.readFile(path.join(process.cwd(), "data/farms.json"))
    const farms = JSON.parse(data.toString())
    const validatedFarms = z.array(farmSchema).parse(farms)

  return (
    <NetworkProvider>
      <EditLayoutContent>
        {children}
      </EditLayoutContent>
    </NetworkProvider>
  )
}