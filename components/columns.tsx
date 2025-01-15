"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Pencil } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { labels, priorities } from "../data/data"
import { Farm } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { flagmoji } from "@algoflows/flagmoji";

export const columns: ColumnDef<Farm>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "farm_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Farm" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("farm_id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year" />
    ),
    cell: ({ row }) => <div className="w-[50px]">{row.getValue("year")}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "scenario_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Scenario" />
    ),
    cell: ({ row }) => <div className="w-[50px]">{row.getValue("scenario_name")}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "networks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Networks" />
    ),
    cell: ({ row }) => {
      const networks = row.original.networks ?? []
      const label = labels.filter((label) => networks.includes(label.value))

      return (
        <div className="flex space-x-2">
        {label.map((label) => (
            <Badge key={label.value} variant="outline">
              {label.label}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Firstname" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("firstname")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "lastname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lastname" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("lastname")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "land",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {flagmoji.countryCode(row.getValue("land"))?.emoji} {row.getValue("land")}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]