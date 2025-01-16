import {
  PiggyBank,
  Beef,
  Drumstick,
  Wheat,
  Apple,
  Fish,
  PieChart,
  House,
  HousePlus,
  TrendingUpDown,
  RefreshCcw,
  Plus,
  Edit,
  Pencil
} from "lucide-react"

export const navData = {
  networks: [
    {
      name: "Beef and sheep",
      value: "beef",
      logo: Beef,
      plan: "Beef and sheep",
    },
    {
      name: "Cash Crop",
      value: "crop",
      logo: Wheat,
      plan: "Cash Crop",
    },
    {
      name: "Pig",
      value: "pig",
      logo: PiggyBank,
      plan: "Pig",
    },
    {
      name: "Poultry",
      value: "poultry",
      logo: Drumstick,
      plan: "Pig",
    },
    {
      name: "Horticulture",
      value: "horticulture",
      logo: Apple,
      plan: "Horticulture",
    },
    {
      name: "Fish",
      value: "fish",
      logo: Fish,
      plan: "Fish",
    },
  ],
    navLinks: [
      {
        name: "Add Farm",
        url: "/create/pig/basic-information",
        icon: HousePlus,
        isActive: false,
      },
      {
        name: "Edit Farm",
        url: "/edit/pig/basic-information",
        icon: Pencil,
        isActive: false,
      },
      {
        name: "Add Scenario",
        url: "#",
        icon: TrendingUpDown,
        isActive: false,
      },
      {
        name: "Results",
        url: "#",
        icon: PieChart,
        isActive: false,
      },
    ]
}