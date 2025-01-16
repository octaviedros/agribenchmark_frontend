import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "@/app/(main)/(edit)/edit/pig/(overall-farm-data)/basic-information/basic-information"

export default function CreateFarmPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Whole Farm Data</h3>
        <p className="text-sm text-muted-foreground">
          Farm Overview
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  )
}