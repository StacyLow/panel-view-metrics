import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart3, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Activity className="h-12 w-12 mx-auto mb-4 text-primary" />
          <CardTitle className="text-2xl">Production Panel Tracker</CardTitle>
          <p className="text-muted-foreground">Monitor your panel production in real-time</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-2">
              <BarChart3 className="h-8 w-8 mx-auto text-primary" />
              <p className="text-sm font-medium">Real-time Charts</p>
            </div>
            <div className="space-y-2">
              <Shield className="h-8 w-8 mx-auto text-primary" />
              <p className="text-sm font-medium">Secure Access</p>
            </div>
          </div>
          <Link to="/dashboard" className="block">
            <Button className="w-full">Access Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
