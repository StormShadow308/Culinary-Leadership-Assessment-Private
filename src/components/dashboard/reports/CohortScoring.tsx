
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Cell, 
  Legend, 
  Line, 
  LineChart, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";

interface CohortScoringProps {
  cohort: string;
  timeRange: string;
}

const CohortScoring: React.FC<CohortScoringProps> = ({ cohort, timeRange }) => {
  // Dummy data for charts
  const trendData = [
    { month: "Jan", average: 78 },
    { month: "Feb", average: 80 },
    { month: "Mar", average: 79 },
    { month: "Apr", average: 82 },
    { month: "May", average: 84 },
    { month: "Jun", average: 85 },
    { month: "Jul", average: 88 },
  ];

  const categoryAverages = [
    { name: "Resilience", value: 82 },
    { name: "Team Dynamics", value: 78 },
    { name: "Problem Solving", value: 85 },
    { name: "Communication", value: 90 },
    { name: "Leadership", value: 83 },
  ];

  const distributionData = [
    { score: "90-100", count: 42 },
    { score: "80-89", count: 85 },
    { score: "70-79", count: 95 },
    { score: "60-69", count: 35 },
    { score: "Below 60", count: 18 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">83.5%</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2.8% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Highest Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Communication</div>
            <p className="text-xs text-muted-foreground mt-1">
              90% average score
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Lowest Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Team Dynamics</div>
            <p className="text-xs text-muted-foreground mt-1">
              78% average score
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Score Trend Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[50, 100]} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="average" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Category Averages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryAverages}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[50, 100]} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {categoryAverages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={distributionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="score" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CohortScoring;
