import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"

interface DestructiveDialogProps {
  title: string
  description?: string
  body?: React.HTMLAttributes<HTMLDivElement>
  onConfirm: () => void
  onCancel?: () => void
}

export function DestructiveDialog({
  title,
  description,
  body,
  onConfirm,
  onCancel
}: DestructiveDialogProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description &&
          <DialogDescription>
            {description}
          </DialogDescription>
        }
      </DialogHeader>
      {body && <div {...body} />}
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="destructive" type="submit" onClick={onConfirm}>Delete</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}