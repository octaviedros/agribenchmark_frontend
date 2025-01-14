"use client"

import { Table } from "@tanstack/react-table"
import { X, Dumbbell, Copy, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table-view-options"

import { statuses } from "../data/data"
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter"
import { flagmoji } from "@algoflows/flagmoji";

interface DataTableToolbarProps<TData> {
  selected?: TData[]
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const selected = table.getSelectedRowModel().rows.map((row) => row.original)
  // create an array of objects from the countryCodes, including the props label, value
  const uniqueCountries = table.getCoreRowModel().flatRows.map(row => row.getValue("countryCode")).reduce((acc: { label: string, value: string }[], countryCode) => {
    if (typeof countryCode === "string" && !acc.some(item => item.value === countryCode)) {
      acc.push({ 
        label: flagmoji.countryCode(countryCode) + " " + countryCode, 
        value: countryCode
      })
    }
    return acc
  }, [])

  const uniqueYears = table.getCoreRowModel().flatRows.map(row => row.getValue("year")).reduce((acc: { label: string, value: string}[], year) => {
    if (typeof year === "number" && !acc.some(item => item.value === year.toString())) {
      acc.push({
        label: year.toString(),
        value: year.toString()
      })
    }
    return acc
  }, [])

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter farms..."
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("year") && (
          <DataTableFacetedFilter
            column={table.getColumn("year")}
            title="Year"
            options={uniqueYears}
          />
        )}
        {table.getColumn("countryCode") && (
          <DataTableFacetedFilter
            column={table.getColumn("countryCode")}
            title="Country"
            options={uniqueCountries}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {/*table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )*/}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
        {selected.length > 0 && (
          <Button
            variant="secondary"
            className="h-8 px-2 lg:px-3"
          >
            Duplicate
            <Copy />
          </Button>
        )}
        {selected.length > 0 && (
          <Button
            variant="secondary"
            className="h-8 px-2 lg:px-3"
          >
            Delete
            <Trash />
          </Button>
        )}
        {selected.length > 1 && (
          <Button
            variant="secondary"
            className="h-8 px-2 lg:px-3"
          >
            Benchmark
            <Dumbbell />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}