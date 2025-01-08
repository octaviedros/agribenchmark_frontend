import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  CircleOff,
  HelpCircle,
  Timer,
} from "lucide-react"

export const labels = [
  {
    value: "crop",
    label: "Cash Crop",
  },
  {
    value: "beef",
    label: "Beef and Sheep",
  },
  {
    value: "pig",
    label: "Pig",
  },
  {
    value: "poultry",
    label: "Poultry",
  },
  {
    value: "horticulture",
    label: "Horticulture",
  },
  {
    value: "fish",
    label: "Fish",
  },
]

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: HelpCircle,
  },
  {
    value: "todo",
    label: "Todo",
    icon: Circle,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: Timer,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircle,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CircleOff,
  },
]

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUp,
  },
]