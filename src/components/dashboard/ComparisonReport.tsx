
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ComparisonReportProps {
  data?: any;
}

const ComparisonReport: React.FC<ComparisonReportProps> = ({ data }) => {
  const [cohort1, setCohort1] = useState("2023A");
  const [cohort2, setCohort2] = useState("2023B");
  const [assessmentType, setAssessmentType] = useState("all");

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
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Select value={cohort1} onValueChange={setCohort1}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Cohort 1" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023A">Cohort 2023A</SelectItem>
              <SelectItem value="2023B">Cohort 2023B</SelectItem>
              <SelectItem value="2023C">Cohort 2023C</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={cohort2} onValueChange={setCohort2}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Cohort 2" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023A">Cohort 2023A</SelectItem>
              <SelectItem value="2023B">Cohort 2023B</SelectItem>
              <SelectItem value="2023C">Cohort 2023C</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Select value={assessmentType} onValueChange={setAssessmentType}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Assessment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assessments</SelectItem>
            <SelectItem value="leadership">Leadership Assessment</SelectItem>
            <SelectItem value="team">Team Dynamics Assessment</SelectItem>
            <SelectItem value="communication">Communication Assessment</SelectItem>
            <SelectItem value="problem">Problem Solving Assessment</SelectItem>
            <SelectItem value="resilience">Resilience Assessment</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
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
                  <Bar dataKey="cohort1" name="Cohort 2023A" fill="#8884d8" />
                  <Bar dataKey="cohort2" name="Cohort 2023B" fill="#82ca9d" />
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
                    name="Cohort 2023A"
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cohort2" 
                    name="Cohort 2023B"
                    stroke="#82ca9d" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Bar dataKey="cohort1" name="Cohort 2023A" fill="#8884d8" />
                  <Bar dataKey="cohort2" name="Cohort 2023B" fill="#82ca9d" />
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
                    name="Cohort 2023A"
                    dataKey="cohort1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Cohort 2023B"
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
    </div>
  );
};

export default ComparisonReport;
