
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface StudentReportProps {
  data?: any;
}

const StudentReport: React.FC<StudentReportProps> = ({ data }) => {
  const [selectedStudent, setSelectedStudent] = useState("1");
  const [selectedAssessment, setSelectedAssessment] = useState("all");

  // Dummy data for charts
  const performanceData = [
    { name: "Resilience", score: 82, avg: 75 },
    { name: "Team Dynamics", score: 88, avg: 70 },
    { name: "Problem Solving", score: 76, avg: 72 },
    { name: "Communication", score: 90, avg: 80 },
    { name: "Leadership", score: 85, avg: 68 },
  ];

  const timelineData = [
    { date: "Jan 2023", score: 75 },
    { date: "Feb 2023", score: 78 },
    { date: "Mar 2023", score: 80 },
    { date: "Apr 2023", score: 82 },
    { date: "May 2023", score: 85 },
    { date: "Jun 2023", score: 83 },
    { date: "Jul 2023", score: 88 },
  ];

  const assessmentData = [
    { name: "Leadership Assessment", date: "Jul 15, 2023", score: 88, status: "Completed" },
    { name: "Team Dynamics Assessment", date: "Jun 10, 2023", score: 83, status: "Completed" },
    { name: "Communication Assessment", date: "May 5, 2023", score: 90, status: "Completed" },
    { name: "Problem Solving Assessment", date: "Apr 2, 2023", score: 76, status: "Completed" },
    { name: "Resilience Assessment", date: "Mar 1, 2023", score: 82, status: "Completed" },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Select Student" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Jane Smith (ID: ST001)</SelectItem>
            <SelectItem value="2">John Doe (ID: ST002)</SelectItem>
            <SelectItem value="3">Emily Johnson (ID: ST003)</SelectItem>
            <SelectItem value="4">Michael Brown (ID: ST004)</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Filter by Assessment" />
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">85.4%</div>
            <p className="text-xs text-muted-foreground mt-1">
              +3.2% from previous assessments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Assessments Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5/5</div>
            <p className="text-xs text-muted-foreground mt-1">
              100% completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Class Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">#3</div>
            <p className="text-xs text-muted-foreground mt-1">
              Top 5% of cohort
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Performance by Category</TabsTrigger>
          <TabsTrigger value="timeline">Performance Timeline</TabsTrigger>
          <TabsTrigger value="assessments">Assessment History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" name="Student Score" fill="#8884d8">
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                    <Bar dataKey="avg" name="Class Average" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Score Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={timelineData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[50, 100]} />
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
        </TabsContent>
        
        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assessment History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assessment Name</TableHead>
                    <TableHead>Date Completed</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessmentData.map((assessment, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{assessment.name}</TableCell>
                      <TableCell>{assessment.date}</TableCell>
                      <TableCell>{assessment.score}%</TableCell>
                      <TableCell>{assessment.status}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentReport;
