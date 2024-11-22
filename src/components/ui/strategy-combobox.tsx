// src/components/ui/strategy-combobox.tsx
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

interface StrategyComboboxProps {
  value: string
  onChange: (value: string) => void
  strategies: readonly string[]
  placeholder?: string
}

export function StrategyCombobox({ value, onChange, strategies, placeholder = "Select strategy..." }: StrategyComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const items = React.useMemo(() => {
    const predefinedItems = Array.from(strategies).map(s => ({ value: s, label: s }))
    if (inputValue && !strategies.includes(inputValue)) {
      predefinedItems.push({ value: inputValue, label: inputValue })
    }
    return predefinedItems
  }, [strategies, inputValue])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search or enter custom strategy..."
            value={inputValue}
            onValueChange={v => {
              setInputValue(v)
              onChange(v)
            }}
          />
          <CommandList>
            <CommandEmpty>Enter custom strategy name</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={currentValue => {
                    onChange(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}