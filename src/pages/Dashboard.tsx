import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { PanelChart } from "@/components/dashboard/PanelChart";
import { TimeSelector } from "@/components/dashboard/TimeSelector";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, TrendingUp, Calendar, Shield } from "lucide-react";

const API_BASE = "https://apps.data.wearebasis.io/api";

interface PanelData {
  date: string;
  count: number;
}

export type TimeRange = "1M" | "3M" | "6M" | "1Y" | "ALL";

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [panelData, setPanelData] = useState<PanelData[]>([]);
  const [currentCount, setCurrentCount] = useState(0);
  const [timeRange, setTimeRange] = useState<TimeRange>("1M");
  const [loading, setLoading] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // Check for stored credentials on mount
  useEffect(() => {
    const storedPassword = localStorage.getItem("panel_dashboard_password");
    const storedToken = localStorage.getItem("panel_dashboard_token");
    
    if (storedPassword && storedToken) {
      setPassword(storedPassword);
      setToken(storedToken);
      setIsAuthenticated(true);
      fetchPanelData(storedToken);
    }
  }, []);

  const authenticate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/v1/roles/admin/authorize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: password }),
      });

      if (response.ok) {
        const setCookie = response.headers.get("Set-Cookie");
        
        if (setCookie) {
          const sessionToken = setCookie.split(";")[0];
          setToken(sessionToken);
          setIsAuthenticated(true);
          setLoginOpen(false);
          
          // Store credentials
          localStorage.setItem("panel_dashboard_password", password);
          localStorage.setItem("panel_dashboard_token", sessionToken);
          
          toast({
            title: "Authentication successful",
            description: "Connected to panel tracking system",
          });
          
          fetchPanelData(sessionToken);
        } else {
          throw new Error("No session token received");
        }
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please check your password and try again",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const fetchPanelData = async (authToken: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/v1/switchboards?type_id=0`, {
        headers: {
          "Cookie": authToken,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const switchboards = await response.json();
        const count = Array.isArray(switchboards) ? switchboards.length : 0;
        setCurrentCount(count);
        
        // Generate mock historical data based on current count
        // In a real implementation, you'd modify your API to return historical data
        const mockData = generateMockHistoricalData(count, timeRange);
        setPanelData(mockData);
        
        toast({
          title: "Data updated",
          description: `Found ${count} active panels`,
        });
      } else {
        throw new Error("Failed to fetch panel data");
      }
    } catch (error) {
      toast({
        title: "Data fetch failed",
        description: "Unable to retrieve panel data",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const generateMockHistoricalData = (currentCount: number, range: TimeRange): PanelData[] => {
    const now = new Date();
    const data: PanelData[] = [];
    let days = 30;
    
    switch (range) {
      case "3M": days = 90; break;
      case "6M": days = 180; break;
      case "1Y": days = 365; break;
      case "ALL": days = 730; break;
    }

    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Generate realistic panel count variation
      const variation = Math.random() * 0.2 - 0.1; // ±10% variation
      const count = Math.max(0, Math.floor(currentCount * (1 + variation)));
      
      data.push({
        date: date.toISOString().split('T')[0],
        count: count
      });
    }
    
    return data;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setPassword("");
    localStorage.removeItem("panel_dashboard_password");
    localStorage.removeItem("panel_dashboard_token");
    toast({
      title: "Logged out",
      description: "Session ended",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle className="text-2xl">Panel Dashboard Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && authenticate()}
              />
            </div>
            <Button 
              onClick={authenticate} 
              className="w-full"
              disabled={loading || !password}
            >
              {loading ? "Authenticating..." : "Access Dashboard"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Production Panel Dashboard</h1>
            <p className="text-muted-foreground">Real-time monitoring of panel production</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => token && fetchPanelData(token)}>
              Refresh Data
            </Button>
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </div>
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