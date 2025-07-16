import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  showComparison?: boolean;
  comparisonPeriod?: string;
  previousValue?: number;
  currentValue?: number;
}

export const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = "neutral",
  showComparison = false,
  comparisonPeriod,
  previousValue,
  currentValue
}: MetricCardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-500";
      case "negative":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  const calculateChange = () => {
    if (!showComparison || previousValue === undefined || currentValue === undefined) {
      return null;
    }

    const difference = currentValue - previousValue;
    const percentageChange = previousValue > 0 ? ((difference / previousValue) * 100) : 0;
    
    let icon = Minus;
    let colorClass = "text-muted-foreground";
    
    if (difference > 0) {
      icon = TrendingUp;
      colorClass = "text-green-500";
    } else if (difference < 0) {
      icon = TrendingDown;
      colorClass = "text-red-500";
    }

    return {
      difference: Math.abs(difference),
      percentage: Math.abs(percentageChange),
      icon,
      colorClass,
      isPositive: difference > 0,
      isNegative: difference < 0
    };
  };

  const changeData = calculateChange();

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {showComparison && changeData ? (
              <div className="flex items-center gap-1">
                <changeData.icon className={`w-3 h-3 ${changeData.colorClass}`} />
                <p className={`text-xs font-medium ${changeData.colorClass}`}>
                  {changeData.isPositive ? '+' : changeData.isNegative ? '-' : ''}
                  {changeData.difference} ({changeData.percentage.toFixed(1)}%) vs {comparisonPeriod}
                </p>
              </div>
            ) : change && (
              <p className={`text-xs font-medium ${getChangeColor()}`}>
                {change} from last period
              </p>
            )}
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] to-transparent pointer-events-none" />
      </CardContent>
    </Card>
  );
};