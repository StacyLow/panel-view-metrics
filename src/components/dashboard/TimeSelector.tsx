import { Button } from "@/components/ui/button";
import { TimeRange } from "@/pages/Dashboard";

interface TimeSelectorProps {
  currentRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "6M", label: "6M" },
  { value: "1Y", label: "1Y" },
  { value: "ALL", label: "ALL" },
];

export const TimeSelector = ({ currentRange, onRangeChange }: TimeSelectorProps) => {
  return (
    <div className="flex gap-1 bg-secondary rounded-lg p-1">
      {timeRanges.map((range) => (
        <Button
          key={range.value}
          variant={currentRange === range.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onRangeChange(range.value)}
          className={`px-3 py-1 text-xs font-medium transition-all ${
            currentRange === range.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          }`}
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
};