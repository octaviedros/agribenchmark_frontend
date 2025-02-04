
import { NetworkProvider } from "@/context/NetworkContext"
import { Suspense } from "react"
import { LayoutContent } from "./LayoutContent"

const data = {
  user: {
    name: "Octavie Droste",
    email: "octavie.droste@agribenchmark.com",
    avatar: "",
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense>
      <NetworkProvider>
        <LayoutContent userData={data}>
          {children}
        </LayoutContent>
      </NetworkProvider>
    </Suspense>
  )
}