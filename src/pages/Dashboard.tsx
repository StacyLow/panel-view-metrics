import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { PanelChart } from "@/components/dashboard/PanelChart";
import { TimeSelector } from "@/components/dashboard/TimeSelector";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Activity, TrendingUp, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PanelData {
  date: string;
  count: number;
}

export type TimeRange = "1M" | "3M" | "6M" | "1Y" | "ALL";

const Dashboard = () => {
  const [panelData, setPanelData] = useState<PanelData[]>([]);
  const [currentCount, setCurrentCount] = useState(0);
  const [timeRange, setTimeRange] = useState<TimeRange>("1M");
  const [loading, setLoading] = useState(false);

  // Fetch panel count from Supabase on mount and when time range changes
  useEffect(() => {
    fetchPanelCount();
  }, [timeRange]);

  const fetchPanelCount = async () => {
    setLoading(true);
    try {
      // Fetch both count and actual panel data with timestamps
      const { data: panels, error } = await supabase
        .from('panels')
        .select('created_at')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const panelCount = panels?.length || 0;
      setCurrentCount(panelCount);
      
      // Process real historical data based on actual creation dates
      const historicalData = processRealHistoricalData(panels || [], timeRange);
      setPanelData(historicalData);
      
      toast({
        title: "Data loaded",
        description: `Found ${panelCount} installed panels`,
      });
    } catch (error) {
      console.error("Error fetching panel count:", error);
      toast({
        title: "Data fetch failed",
        description: "Unable to retrieve panel data",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const processRealHistoricalData = (panels: { created_at: string }[], range: TimeRange): PanelData[] => {
    if (!panels.length) return [];

    const now = new Date();
    const data: PanelData[] = [];
    let days = 30;
    
    switch (range) {
      case "3M": days = 90; break;
      case "6M": days = 180; break;
      case "1Y": days = 365; break;
      case "ALL": days = 730; break;
    }

    // Create date range for the chart
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);

    // Group panels by date and calculate cumulative counts
    for (let i = 0; i <= days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Count panels installed up to this date
      const cumulativeCount = panels.filter(panel => {
        const panelDate = new Date(panel.created_at).toISOString().split('T')[0];
        return panelDate <= dateStr;
      }).length;
      
      data.push({
        date: dateStr,
        count: cumulativeCount
      });
    }
    
    return data;
  };


  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Production Panel Dashboard</h1>
            <p className="text-muted-foreground">Real-time monitoring of panel production</p>
          </div>
          <Button variant="outline" onClick={fetchPanelCount} disabled={loading}>
            {loading ? "Loading..." : "Refresh Data"}
          </Button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Total Panels"
            value={currentCount.toString()}
            icon={Activity}
            change="+5.2%"
            changeType="positive"
          />
          <MetricCard
            title="This Month"
            value={currentCount.toString()}
            icon={Calendar}
            change="+12.3%"
            changeType="positive"
          />
          <MetricCard
            title="Trend"
            value="Increasing"
            icon={TrendingUp}
            change="+2.1%"
            changeType="positive"
          />
        </div>

        {/* Main Chart */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <CardTitle>Panel Production Over Time</CardTitle>
            <TimeSelector currentRange={timeRange} onRangeChange={setTimeRange} />
          </div>
          <PanelChart data={panelData} timeRange={timeRange} />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;