import { Button } from "@/components/ui/button";

export type ComparisonRange = "7D" | "30D" | "90D" | "1Y";

interface ComparisonPeriodSelectorProps {
  currentRange: ComparisonRange;
  onRangeChange: (range: ComparisonRange) => void;
}

const comparisonRanges: { value: ComparisonRange; label: string }[] = [
  { value: "7D", label: "7D" },
  { value: "30D", label: "30D" },
  { value: "90D", label: "90D" },
  { value: "1Y", label: "1Y" },
];

export const ComparisonPeriodSelector = ({ currentRange, onRangeChange }: ComparisonPeriodSelectorProps) => {
  return (
    <div className="flex gap-1 bg-secondary rounded-lg p-1">
      {comparisonRanges.map((range) => (
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