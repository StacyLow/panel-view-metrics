import { Button } from "@/components/ui/button";

export type MetricsTimeRange = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y";

interface MetricsTimeSelectorProps {
  currentRange: MetricsTimeRange;
  onRangeChange: (range: MetricsTimeRange) => void;
}

const metricsTimeRanges: { value: MetricsTimeRange; label: string }[] = [
  { value: "1D", label: "1D" },
  { value: "1W", label: "1W" },
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "6M", label: "6M" },
  { value: "1Y", label: "1Y" },
];

export const MetricsTimeSelector = ({ currentRange, onRangeChange }: MetricsTimeSelectorProps) => {
  return (
    <div className="flex gap-1 bg-secondary rounded-lg p-1">
      {metricsTimeRanges.map((range) => (
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