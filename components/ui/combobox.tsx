"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Combobox({
  valueState,
  options,
  selectText = "Select option...",
  placeholder = "Search option...",
  noOptionText = "No option found.",
  isDialog = false,
}: {
  valueState: [string, React.Dispatch<React.SetStateAction<string>>]
  options: { value: string; label: string }[],
  selectText?: string,
  placeholder?: string,
  noOptionText?: string,
  isDialog?: boolean,
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = valueState
  
  return (
    <Popover open={open} onOpenChange={setOpen} modal={isDialog}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <span className="max-w-[176px] overflow-hidden whitespace-nowrap overflow-ellipsis">
            {value
              ? options.find((option) => option.value === value)?.label
              : selectText}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{noOptionText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  keywords={[option.label, option.value]}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
