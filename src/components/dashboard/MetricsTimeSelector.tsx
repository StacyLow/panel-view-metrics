import { Button } from "@/components/ui/button";

export type MetricsTimeRange = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y";

interface MetricsTimeSelectorProps {
  currentRange: MetricsTimeRange;
  onRangeChange: (range: MetricsTimeRange) => void;
}

const metricsTimeRanges: { value: MetricsTimeRange; label: string }[] = [
  { value: "1D", label: "1 Day" },
  { value: "1W", label: "1 Week" },
  { value: "1M", label: "1 Month" },
  { value: "3M", label: "3 Months" },
  { value: "6M", label: "6 Months" },
  { value: "1Y", label: "1 Year" },
];

export const MetricsTimeSelector = ({ currentRange, onRangeChange }: MetricsTimeSelectorProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-foreground">Compare to</h3>
      <div className="flex flex-wrap gap-2 bg-secondary rounded-xl p-2">
        {metricsTimeRanges.map((range) => (
          <Button
            key={range.value}
            variant={currentRange === range.value ? "default" : "ghost"}
            size="sm"
            onClick={() => onRangeChange(range.value)}
            className={`px-4 py-2 text-sm font-medium transition-all rounded-lg ${
              currentRange === range.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            {range.label}
          </Button>
        ))}
      </div>
    </div>
  );
};