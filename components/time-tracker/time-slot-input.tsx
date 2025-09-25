import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface TimeSlot {
  id: number;
  start: string;
  end: string;
}

interface TimeSlotInputProps {
  slot: TimeSlot;
  index: number;
  showError: boolean;
  onUpdate: (id: number, field: keyof Omit<TimeSlot, "id">, value: string) => void;
  onRemove: (id: number) => void;
  isRemoveDisabled: boolean;
}

export function TimeSlotInput({
  slot,
  index,
  showError,
  onUpdate,
  onRemove,
  isRemoveDisabled,
}: TimeSlotInputProps) {
  const startId = `slot-${slot.id}-start`;
  const endId = `slot-${slot.id}-end`;

  return (
    <div className="space-y-3 rounded-lg border border-dashed border-border/70 p-4">
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <div className="space-y-2">
          <Label htmlFor={startId}>開始時刻</Label>
          <Input
            id={startId}
            type="time"
            inputMode="numeric"
            value={slot.start}
            onChange={(event) =>
              onUpdate(slot.id, "start", event.target.value)
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
              onUpdate(slot.id, "end", event.target.value)
            }
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="md:justify-self-end"
          onClick={() => onRemove(slot.id)}
          disabled={isRemoveDisabled}
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
  );
}