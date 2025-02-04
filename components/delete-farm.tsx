import { DestructiveDialog } from "@/components/ui/destructive-dialog"
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Farm } from "@/data/schema"
import { useFarmData } from "@/hooks/use-farm-data"
import { toast } from "@/hooks/use-toast"
import { del } from "@/lib/api"
import { KeyedMutator } from "swr"

interface DeleteFarmProps {
  farms: Farm[]
  children: React.ReactNode
}

export function DeleteFarm({
  farms,
  children
}: DeleteFarmProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DeleteFarmContent
        farms={farms}
      />
    </Dialog>
  )
}

export function DeleteFarmContent({
  farms,
}: {
  farms: Farm[]
}) {
  const { data: allFarms, mutate } = useFarmData("/generalfarm") as { data: Farm[], mutate: KeyedMutator<DeleteFarmProps[]> }

  const onConfirm = async () => {
    try {
      await mutate(
        Promise.all(farms.map(farm => del(`/generalfarm/${farm.id}`))),
        {
          // @ts-expect-error bla bla fix later
          optimisticData: allFarms.filter(f => !farms.some(farm => farm.id === f.id)),
          rollbackOnError: true,
          populateCache: false,
          revalidate: false
        }
      )
      
      toast({
        title: "Success",
        description: `The farm${farms.length === 1 ? "" : "s"} ${farms.length === 1 ? "has" : "have"} been deleted.`,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      toast({
        variant: "destructive",
        title: "Error",
        description: `An error occurred while deleting the farm: ${errorMessage}`,
      })
    }
  }

  return (
    <DestructiveDialog
      title={farms.length === 1 ? "Delete Farm" : "Delete Farms"}
      description={`Are you sure you want to delete ${farms.length === 1 ? "this farm" : "these farms"}?`}
      onConfirm={onConfirm}
    />
  )
}
