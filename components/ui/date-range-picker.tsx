"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import "react-day-picker/dist/style.css"

interface DateRangePickerProps {
  startDate?: Date
  endDate?: Date
  onDateRangeChange: (startDate: Date | undefined, endDate: Date | undefined) => void
  className?: string
}

export function DateRangePicker({
  startDate,
  endDate,
  onDateRangeChange,
  className,
}: DateRangePickerProps) {
  const [selectedStart, setSelectedStart] = React.useState<Date | undefined>(startDate)
  const [selectedEnd, setSelectedEnd] = React.useState<Date | undefined>(endDate)
  const [isSelectingStart, setIsSelectingStart] = React.useState(true)

  React.useEffect(() => {
    setSelectedStart(startDate)
    setSelectedEnd(endDate)
  }, [startDate, endDate])

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    if (isSelectingStart) {
      // If we're selecting start and there's already an end date, or if the new date is after the end date, reset
      if (selectedEnd && date > selectedEnd) {
        setSelectedStart(date)
        setSelectedEnd(undefined)
        setIsSelectingStart(false)
      } else {
        setSelectedStart(date)
        setIsSelectingStart(false)
      }
    } else {
      // If selected date is before start date, swap them
      if (selectedStart && date < selectedStart) {
        setSelectedEnd(selectedStart)
        setSelectedStart(date)
        setIsSelectingStart(true)
        onDateRangeChange(date, selectedStart)
      } else {
        setSelectedEnd(date)
        setIsSelectingStart(true)
        onDateRangeChange(selectedStart, date)
      }
    }
  }

  const handleClear = () => {
    setSelectedStart(undefined)
    setSelectedEnd(undefined)
    setIsSelectingStart(true)
    onDateRangeChange(undefined, undefined)
  }

  const displayText = React.useMemo(() => {
    if (selectedStart && selectedEnd) {
      return `${format(selectedStart, "MMM d, yyyy")} - ${format(selectedEnd, "MMM d, yyyy")}`
    }
    if (selectedStart) {
      return `${format(selectedStart, "MMM d, yyyy")} - ...`
    }
    return "Pick a date range"
  }, [selectedStart, selectedEnd])

  const modifiers = {
    start: selectedStart,
    end: selectedEnd,
    range: (date: Date) => {
      if (!selectedStart || !selectedEnd) return false
      return date > selectedStart && date < selectedEnd
    },
  }

  const modifiersClassNames = {
    start: "rdp-day_range_start",
    end: "rdp-day_range_end",
    range: "rdp-day_range_middle",
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedStart && !selectedEnd && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-medium text-slate-900">
              {isSelectingStart ? "Select start date" : "Select end date"}
            </div>
            {(selectedStart || selectedEnd) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-7 px-2 text-xs"
              >
                Clear
              </Button>
            )}
          </div>
          <DayPicker
            mode="single"
            selected={isSelectingStart ? selectedStart : selectedEnd}
            onSelect={handleDateSelect}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="rounded-md"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: cn(
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground"
              ),
              day_range_start: "day-range-start bg-indigo-600 text-white hover:bg-indigo-600 hover:text-white",
              day_range_end: "day-range-end bg-indigo-600 text-white hover:bg-indigo-600 hover:text-white",
              day_selected: "bg-indigo-600 text-white hover:bg-indigo-600 hover:text-white focus:bg-indigo-600 focus:text-white",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-indigo-100 aria-selected:text-indigo-600",
              day_hidden: "invisible",
            }}
            disabled={(date) => {
              if (isSelectingStart) return false
              if (!selectedStart) return false
              return date < selectedStart
            }}
          />
          {selectedStart && selectedEnd && (
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <div className="text-xs text-slate-600">
                {format(selectedStart, "MMM d, yyyy")} - {format(selectedEnd, "MMM d, yyyy")}
              </div>
              <Button
                size="sm"
                onClick={() => {
                  onDateRangeChange(selectedStart, selectedEnd)
                }}
                className="h-8 bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Apply
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

