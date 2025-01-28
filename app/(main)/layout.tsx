
import { NetworkProvider } from "@/context/NetworkContext"
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
    <NetworkProvider>
      <LayoutContent userData={data}>
        {children}
      </LayoutContent>
    </NetworkProvider>
  )
}