
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const DashboardMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Students</CardTitle>
          <CardDescription>Active enrollments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">2,541</div>
          <p className="text-xs text-muted-foreground mt-1">
            +12% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Average Score</CardTitle>
          <CardDescription>Across all assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">76.2%</div>
          <div className="mt-2">
            <Progress value={76.2} className="h-2" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Completion Rate</CardTitle>
          <CardDescription>Assessment completion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">89%</div>
          <div className="mt-2">
            <Progress value={89} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMetrics;
