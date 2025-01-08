import { Metadata } from "next"
import { NetworkProvider } from "@/context/NetworkContext"
import { CreateLayoutContent } from "../(create)/LayoutContent"

export const metadata: Metadata = {
  title: "Create | agribenchmark",
  description: "Create a new farm",
}

interface CreateLayoutProps {
  children: React.ReactNode
}

export default function CreateLayout({ children }: CreateLayoutProps) {
  return (
    <NetworkProvider>
      <CreateLayoutContent>
        {children}
      </CreateLayoutContent>
    </NetworkProvider>
  )
}