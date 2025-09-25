import { useMemo, useState } from "react";
import { TimeSlot } from "@/components/time-tracker/time-slot-input";

const toTodayInputValue = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const createTimeSlot = (id: number): TimeSlot => ({
  id,
  start: "",
  end: "",
});

const parseTime = (value: string) => {
  if (!value) return null;
  const [hours, minutes] = value.split(":").map(Number);
  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }
  return hours * 60 + minutes;
};

export function useTimeTracking() {
  const [selectedDate, setSelectedDate] = useState(toTodayInputValue());
  const [slots, setSlots] = useState<TimeSlot[]>([createTimeSlot(0)]);
  const [nextId, setNextId] = useState(1);

  const { totalMinutes, invalidRanges } = useMemo(() => {
    const invalid: number[] = [];
    const total = slots.reduce((sum, { start, end }, index) => {
      const startMinutes = parseTime(start);
      const endMinutes = parseTime(end);

      if (startMinutes === null || endMinutes === null) {
        return sum;
      }

      if (endMinutes <= startMinutes) {
        invalid.push(index);
        return sum;
      }

      return sum + (endMinutes - startMinutes);
    }, 0);

    return { totalMinutes: total, invalidRanges: invalid };
  }, [slots]);

  const updateSlot = (
    id: number,
    field: keyof Omit<TimeSlot, "id">,
    value: string
  ) => {
    setSlots((prev) =>
      prev.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot))
    );
  };

  const addSlot = () => {
    setSlots((prev) => [...prev, createTimeSlot(nextId)]);
    setNextId((prev) => prev + 1);
  };

  const removeSlot = (id: number) => {
    setSlots((prev) =>
      prev.length > 1 ? prev.filter((slot) => slot.id !== id) : prev
    );
  };

  return {
    selectedDate,
    setSelectedDate,
    slots,
    totalMinutes,
    invalidRanges,
    updateSlot,
    addSlot,
    removeSlot,
  };
}