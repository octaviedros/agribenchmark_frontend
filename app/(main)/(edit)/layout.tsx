import { Metadata } from "next"
import { NetworkProvider } from "@/context/NetworkContext"
import { EditLayoutContent } from "../(edit)/LayoutContent"

export const metadata: Metadata = {
  title: "Edit | agribenchmark",
  description: "Edit a farm",
}

interface EditLayoutProps {
  children: React.ReactNode
}

export default async function EditLayout({ children }: EditLayoutProps) {
  return (
    <NetworkProvider>
      <EditLayoutContent>
        {children}
      </EditLayoutContent>
    </NetworkProvider>
  )
}