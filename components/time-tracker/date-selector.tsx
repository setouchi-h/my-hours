import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateSelectorProps {
  selectedDate: string;
  onChange: (date: string) => void;
}

export function DateSelector({ selectedDate, onChange }: DateSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="work-date">日付</Label>
      <Input
        id="work-date"
        type="date"
        value={selectedDate}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}