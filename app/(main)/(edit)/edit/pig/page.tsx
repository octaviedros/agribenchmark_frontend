import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "@/app/(main)/(edit)/edit/pig/(overall-farm-data)/basic-information/basic-information"

export default function EditFarmPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  )
}