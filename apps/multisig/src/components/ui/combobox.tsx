import * as React from 'react'

import { Button } from '@components/ui/button'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { ChevronVertical } from '@talismn/icons'

type Props = {
  placeholder?: string
  searchPlaceholder?: string
  noResultMessage?: string
  options: { value: string; label: React.ReactNode; keywords?: string[] }[]
  maxResult?: number
  closeOnSelect?: boolean
  value?: string
  onSelect?: (value: string) => void
}

export const Combobox: React.FC<Props> = ({
  closeOnSelect,
  options,
  placeholder,
  searchPlaceholder,
  maxResult,
  noResultMessage,
  onSelect,
  value,
}) => {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')

  const filteredOptions = React.useMemo(() => {
    let filtered = options

    if (query) {
      filtered = options.filter(({ value, keywords }) => {
        const queryLowerCase = query.toLowerCase()
        if (value.toLowerCase().includes(queryLowerCase)) return true
        if (keywords) {
          for (const keyword of keywords) {
            if (keyword.toLowerCase().includes(query.toLowerCase())) return true
          }
        }
        return false
      })
    }
    if (maxResult && filtered.length > maxResult) return filtered.slice(0, maxResult)
    return filtered
  }, [maxResult, options, query])

  React.useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between px-[16px] h-[48px] [&>p]:text-[14px]"
        >
          {value ? (
            options.find(option => option.value === value)?.label
          ) : (
            <p className="text-gray-200">{placeholder}</p>
          )}
          <ChevronVertical size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder={searchPlaceholder} onValueChange={setQuery} />
          <CommandEmpty>{noResultMessage}</CommandEmpty>
          <CommandList>
            {filteredOptions.map(option => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => {
                  onSelect?.(option.value)
                  if (closeOnSelect) setOpen(false)
                }}
              >
                {option.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
