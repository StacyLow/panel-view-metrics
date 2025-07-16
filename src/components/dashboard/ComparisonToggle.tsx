import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ComparisonToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  periodLabel?: string;
}

export const ComparisonToggle = ({ enabled, onToggle, periodLabel }: ComparisonToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="comparison-toggle"
        checked={enabled}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="comparison-toggle" className="text-sm font-medium">
        Compare vs {periodLabel || "previous period"}
      </Label>
    </div>
  );
};