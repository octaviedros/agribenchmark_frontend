"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLogin } from "@/context/LoginContext"
import { AppSidebar } from "@/components/app-sidebar"
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes'
import Image from "next/image"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function LayoutContent({ 
  children, 
  userData
}: { 
  children: React.ReactNode, 
  userData: { user: { name: string, email: string, avatar: string } }
}) {
  const router = useRouter();
  const { theme } = useTheme()
  // const { activeNetwork } = useContext(NetworkContext)
  const { email } = useLogin()
  const pathname = usePathname()
  const paths = pathname
    .split('/')
    .filter(Boolean)
    .filter(p => p !== 'dashboard')
    .map(p => ({
      label: p.charAt(0).toUpperCase() + p.slice(1),
      href: `${p}`
    }));

  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (email) {
    userData.user.name = email;
    userData.user.email = email;
  } else {
    // Redirect to login page
    router.push('/'); 
  }

  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar userData={userData} />
        <SidebarInset>
          <header className="flex h-16 sticky top-0 z-50 backdrop-blur-md shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {!isSSR && paths.length > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                  {!isSSR && paths.length > 0 && paths.map((segment, index, arr) => (
                    <BreadcrumbItem key={index}>
                      <BreadcrumbLink href={`/${arr.map(p => p.href).slice(0, index + 1).join('/')}`}>
                        {segment.label}
                      </BreadcrumbLink>
                      {index < arr.length - 1 && <BreadcrumbSeparator className="hidden md:block"  />}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="ml-auto pt-4 pr-8">
              {!isSSR && theme === "light" && <Image key="light-logo" src="/images/logo.png" alt="Logo" width={150} height={40} />}
              {!isSSR && theme === "dark" && <Image key="dark-logo" src="/images/logo-dark.png" alt="Logo" width={150} height={40} />}
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <main>{children}</main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}