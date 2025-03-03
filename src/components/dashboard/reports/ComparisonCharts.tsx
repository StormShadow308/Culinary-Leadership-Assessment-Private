
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  Line, 
  LineChart, 
  PolarAngleAxis, 
  PolarGrid, 
  PolarRadiusAxis, 
  Radar, 
  RadarChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";

interface ComparisonChartsProps {
  cohort1: string;
  cohort2: string;
  assessmentType: string;
}

const ComparisonCharts: React.FC<ComparisonChartsProps> = ({ cohort1, cohort2, assessmentType }) => {
  // Dummy data for charts
  const averageScoresData = [
    { name: "Resilience", cohort1: 78, cohort2: 82 },
    { name: "Team Dynamics", cohort1: 72, cohort2: 68 },
    { name: "Problem Solving", cohort1: 85, cohort2: 80 },
    { name: "Communication", cohort1: 90, cohort2: 85 },
    { name: "Leadership", cohort1: 75, cohort2: 78 },
  ];

  const completionRateData = [
    { month: "Jan", cohort1: 65, cohort2: 75 },
    { month: "Feb", cohort1: 70, cohort2: 78 },
    { month: "Mar", cohort1: 80, cohort2: 82 },
    { month: "Apr", cohort1: 85, cohort2: 88 },
    { month: "May", cohort1: 90, cohort2: 85 },
    { month: "Jun", cohort1: 92, cohort2: 89 },
    { month: "Jul", cohort1: 95, cohort2: 92 },
  ];

  const distributionData = [
    { score: "90-100", cohort1: 15, cohort2: 18 },
    { score: "80-89", cohort1: 25, cohort2: 22 },
    { score: "70-79", cohort1: 35, cohort2: 32 },
    { score: "60-69", cohort1: 15, cohort2: 20 },
    { score: "Below 60", cohort1: 10, cohort2: 8 },
  ];

  const radarData = [
    { subject: 'Resilience', cohort1: 78, cohort2: 82, fullMark: 100 },
    { subject: 'Team Dynamics', cohort1: 72, cohort2: 68, fullMark: 100 },
    { subject: 'Problem Solving', cohort1: 85, cohort2: 80, fullMark: 100 },
    { subject: 'Communication', cohort1: 90, cohort2: 85, fullMark: 100 },
    { subject: 'Leadership', cohort1: 75, cohort2: 78, fullMark: 100 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Average Scores by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={averageScoresData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="cohort1" name={`Cohort ${cohort1}`} fill="#8884d8" />
                <Bar dataKey="cohort2" name={`Cohort ${cohort2}`} fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Completion Rate Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={completionRateData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cohort1" 
                  name={`Cohort ${cohort1}`}
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="cohort2" 
                  name={`Cohort ${cohort2}`}
                  stroke="#82ca9d" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

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
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="score" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="cohort1" name={`Cohort ${cohort1}`} fill="#8884d8" />
                <Bar dataKey="cohort2" name={`Cohort ${cohort2}`} fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Competency Radar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name={`Cohort ${cohort1}`}
                  dataKey="cohort1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Radar
                  name={`Cohort ${cohort2}`}
                  dataKey="cohort2"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonCharts;
