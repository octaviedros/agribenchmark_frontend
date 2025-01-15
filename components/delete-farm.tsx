import { useContext } from "react"
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DestructiveDialog } from "@/components/ui/destructive-dialog"
import type { Farm } from "@/data/schema"
import { toast } from "@/hooks/use-toast"
import { del } from "@/lib/api"
import { FarmsContext } from "@/context/FarmsContext"
import { getFarms } from "@/lib/utils"

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
  const { setFarms } = useContext(FarmsContext)

  const onConfirm = async () => {
    try {
      await Promise.all(farms.map(farm => del(`/generalfarm/${farm.general_id}`)))
      toast({
        title: "Success",
        description: `The farm${farms.length === 1 ? "" : "s"} ${farms.length === 1 ? "has" : "have"} been deleted.`,
      })
      // Update the farms list
      const updatedFarms = await getFarms()
      setFarms(updatedFarms)
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
