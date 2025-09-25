"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DateSelector } from "@/components/time-tracker/date-selector";
import { TimeSlotInput } from "@/components/time-tracker/time-slot-input";
import { WorkTimeSummary } from "@/components/time-tracker/work-time-summary";
import { useTimeTracking } from "@/hooks/use-time-tracking";

export default function Home() {
  const {
    selectedDate,
    setSelectedDate,
    slots,
    totalMinutes,
    invalidRanges,
    updateSlot,
    addSlot,
    removeSlot,
  } = useTimeTracking();

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
            <DateSelector
              selectedDate={selectedDate}
              onChange={setSelectedDate}
            />

            <Separator />

            <div className="space-y-4">
              {slots.map((slot, index) => (
                <TimeSlotInput
                  key={slot.id}
                  slot={slot}
                  index={index}
                  showError={invalidRanges.includes(index)}
                  onUpdate={updateSlot}
                  onRemove={removeSlot}
                  isRemoveDisabled={slots.length === 1}
                />
              ))}
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

        <WorkTimeSummary
          selectedDate={selectedDate}
          totalMinutes={totalMinutes}
        />
      </main>
    </div>
  );
}
