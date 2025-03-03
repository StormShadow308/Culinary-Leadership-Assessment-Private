
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface DashboardOverviewProps {
  data?: any;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ data }) => {
  // Dummy data for charts
  const performanceData = [
    { name: "Jan", score: 65 },
    { name: "Feb", score: 59 },
    { name: "Mar", score: 80 },
    { name: "Apr", score: 81 },
    { name: "May", score: 56 },
    { name: "Jun", score: 55 },
    { name: "Jul", score: 40 },
  ];

  const categoryData = [
    { name: "Resilience", value: 85 },
    { name: "Team Dynamics", value: 65 },
    { name: "Problem Solving", value: 78 },
    { name: "Communication", value: 92 },
    { name: "Leadership", value: 70 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="p-6 space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Average scores over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={performanceData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Scores by assessment category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Student assessment submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <span className="font-semibold text-primary">JS</span>
                </div>
                <div>
                  <p className="font-medium">John Smith completed Leadership Assessment</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
                <div className="ml-auto">
                  <span className="font-medium">Score: 87%</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <span className="font-semibold text-primary">AD</span>
                </div>
                <div>
                  <p className="font-medium">Alice Dunn completed Team Dynamics Assessment</p>
                  <p className="text-sm text-muted-foreground">5 hours ago</p>
                </div>
                <div className="ml-auto">
                  <span className="font-medium">Score: 92%</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <span className="font-semibold text-primary">RJ</span>
                </div>
                <div>
                  <p className="font-medium">Robert Johnson completed Problem Solving Assessment</p>
                  <p className="text-sm text-muted-foreground">Yesterday</p>
                </div>
                <div className="ml-auto">
                  <span className="font-medium">Score: 78%</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <span className="font-semibold text-primary">EW</span>
                </div>
                <div>
                  <p className="font-medium">Emma White completed Communication Assessment</p>
                  <p className="text-sm text-muted-foreground">Yesterday</p>
                </div>
                <div className="ml-auto">
                  <span className="font-medium">Score: 85%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
