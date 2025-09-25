import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface WorkTimeSummaryProps {
  selectedDate: string;
  totalMinutes: number;
}

export function WorkTimeSummary({ selectedDate, totalMinutes }: WorkTimeSummaryProps) {
  const totalHours = Math.floor(totalMinutes / 60);
  const totalRemainderMinutes = totalMinutes % 60;
  const totalLabel = totalMinutes
    ? `${totalHours}時間${String(totalRemainderMinutes).padStart(2, "0")}分`
    : "--";

  return (
    <Card>
      <CardHeader className="gap-1">
        <CardTitle>{selectedDate || "日付未選択"}</CardTitle>
        <CardDescription>
          入力済みの時間帯の合計勤務時間を確認できます。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">
            合計勤務時間
          </span>
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
  );
}