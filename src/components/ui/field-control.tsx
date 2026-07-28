import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Control, FieldValues, FieldPath } from "react-hook-form"

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
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export type Option = {
  label: string
  value: string
}

export interface FieldControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>
  name: TName
  label: string
  type: "input" | "textarea" | "select" | "switch" | "lookup"
  description?: string
  placeholder?: string
  options?: Option[]
  inputType?: React.HTMLInputTypeAttribute
  disabled?: boolean
  className?: string
  // Additional props for lookup async search
  loading?: boolean
  onSearch?: (value: string) => void
}

export function FieldControl<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  type,
  description,
  placeholder,
  options = [],
  inputType = "text",
  disabled = false,
  className,
  loading,
  onSearch,
}: FieldControlProps<TFieldValues, TName>) {
  const isSwitch = type === "switch"

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(isSwitch ? "flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm space-y-0" : "flex flex-col", className)}>
          <div className={cn(isSwitch ? "space-y-0.5" : "space-y-2", isSwitch ? "" : "w-full flex flex-col")}>
            <FormLabel>{label}</FormLabel>
            
            {description && isSwitch && (
              <FormDescription>{description}</FormDescription>
            )}

            {type === "input" && (
              <FormControl>
                <Input
                  placeholder={placeholder}
                  type={inputType}
                  disabled={disabled}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            )}

            {type === "textarea" && (
              <FormControl>
                <Textarea
                  placeholder={placeholder}
                  disabled={disabled}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            )}

            {type === "select" && (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {type === "lookup" && (
              <Popover>
                <PopoverTrigger render={
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={disabled}
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? options.find((opt) => opt.value === field.value)?.label || field.value
                        : placeholder || "Select..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                } />
                <PopoverContent className="w-full p-0" align="start">
                  <Command shouldFilter={!onSearch}>
                    <CommandInput
                      placeholder={placeholder ? `Search ${placeholder.toLowerCase()}...` : "Search..."}
                      onValueChange={onSearch}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {loading ? "Loading..." : "No results found."}
                      </CommandEmpty>
                      <CommandGroup>
                        {options.map((option) => (
                          <CommandItem
                            value={option.label}
                            key={option.value}
                            onSelect={() => {
                              field.onChange(option.value)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                option.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>
          
          {type === "switch" && (
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
            </FormControl>
          )}
          
          {description && !isSwitch && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
