"use client"

import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form
} from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"

const overheadFormSchema = z.object({

})

type OverheadFormValues = z.infer<typeof overheadFormSchema>

export default function OwnershipFarmPage() {
  const form = useForm<OverheadFormValues>({
    resolver: zodResolver(overheadFormSchema),
    defaultValues: {},
  })

  function onSubmit(data: OverheadFormValues) {
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Ownership?</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}