"use client"

import { Plus, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

type TimeSlot = {
  id: number
  start: string
  end: string
}

const toTodayInputValue = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const createTimeSlot = (id: number): TimeSlot => ({
  id,
  start: "",
  end: "",
})

const parseTime = (value: string) => {
  if (!value) return null
  const [hours, minutes] = value.split(":").map(Number)
  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null
  }
  return hours * 60 + minutes
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(toTodayInputValue())
  const [slots, setSlots] = useState<TimeSlot[]>([createTimeSlot(0)])
  const [nextId, setNextId] = useState(1)

  const { totalMinutes, invalidRanges } = useMemo(() => {
    const invalid: number[] = []
    const total = slots.reduce((sum, { start, end }, index) => {
      const startMinutes = parseTime(start)
      const endMinutes = parseTime(end)

      if (startMinutes === null || endMinutes === null) {
        return sum
      }

      if (endMinutes <= startMinutes) {
        invalid.push(index)
        return sum
      }

      return sum + (endMinutes - startMinutes)
    }, 0)

    return { totalMinutes: total, invalidRanges: invalid }
  }, [slots])

  const totalHours = Math.floor(totalMinutes / 60)
  const totalRemainderMinutes = totalMinutes % 60
  const totalLabel = totalMinutes
    ? `${totalHours}時間${String(totalRemainderMinutes).padStart(2, "0")}分`
    : "--"

  const updateSlot = (
    id: number,
    field: keyof Omit<TimeSlot, "id">,
    value: string,
  ) => {
    setSlots((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot)),
    )
  }

  const addSlot = () => {
    setSlots((prev) => [...prev, createTimeSlot(nextId)])
    setNextId((prev) => prev + 1)
  }

  const removeSlot = (id: number) => {
    setSlots((prev) => (prev.length > 1 ? prev.filter((slot) => slot.id !== id) : prev))
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-10">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            勤務時間トラッカー
          </h1>
          <p className="text-sm text-muted-foreground">
            24時間表記で開始・終了時刻を入力すると、合計勤務時間を自動計算します。
          </p>
        </header>

        <Card>
          <CardHeader className="gap-1">
            <CardTitle>勤務時間を入力</CardTitle>
            <CardDescription>
              日付と時間帯を入力すると、中抜けがあっても自動で合計時間を計算します。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="work-date">日付</Label>
              <Input
                id="work-date"
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              {slots.map((slot, index) => {
                const startId = `slot-${slot.id}-start`
                const endId = `slot-${slot.id}-end`
                const showError = invalidRanges.includes(index)

                return (
                  <div
                    key={slot.id}
                    className="space-y-3 rounded-lg border border-dashed border-border/70 p-4"
                  >
                    <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                      <div className="space-y-2">
                        <Label htmlFor={startId}>開始時刻</Label>
                        <Input
                          id={startId}
                          type="time"
                          inputMode="numeric"
                          value={slot.start}
                          onChange={(event) =>
                            updateSlot(slot.id, "start", event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={endId}>終了時刻</Label>
                        <Input
                          id={endId}
                          type="time"
                          inputMode="numeric"
                          value={slot.end}
                          onChange={(event) =>
                            updateSlot(slot.id, "end", event.target.value)
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="md:justify-self-end"
                        onClick={() => removeSlot(slot.id)}
                        disabled={slots.length === 1}
                        aria-label={`時間帯${index + 1}を削除`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {showError && (
                      <p className="text-xs text-destructive">
                        終了時刻は開始時刻より後に設定してください。
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-muted-foreground">
              中抜けがある場合は時間帯を追加して入力してください。
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={addSlot}
              className="w-full md:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" /> 時間帯を追加
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="gap-1">
            <CardTitle>{selectedDate || "日付未選択"}</CardTitle>
            <CardDescription>
              入力済みの時間帯の合計勤務時間を確認できます。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">合計勤務時間</span>
              <span className="text-3xl font-semibold tracking-tight text-foreground">
                {totalLabel}
              </span>
            </div>
            <Separator />
            <p className="text-xs text-muted-foreground">
              時刻をすべて入力すると合計が表示されます。終了時刻が開始時刻よりも前の場合は赤字で警告が表示されます。
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
