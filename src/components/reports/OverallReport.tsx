
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, LineChart } from "@/components/ui/chart";
import CohortScoring from './CohortScoring';

// Mock cohort data
const cohortData = [
  { name: "Fall 2023", students: 45, avgScore: 87, completionRate: 92, trend: "up" as const },
  { name: "Summer 2023", students: 38, avgScore: 85, completionRate: 95, trend: "up" as const },
  { name: "Spring 2023", students: 42, avgScore: 89, completionRate: 97, trend: "neutral" as const },
  { name: "Fall 2022", students: 36, avgScore: 82, completionRate: 94, trend: "up" as const },
  { name: "Summer 2022", students: 30, avgScore: 80, completionRate: 90, trend: "down" as const },
  { name: "Spring 2022", students: 35, avgScore: 84, completionRate: 93, trend: "up" as const },
];

const OverallReport: React.FC = () => {
  const [timeRange, setTimeRange] = useState("year");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Overall Report</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Overall Performance</CardTitle>
            <CardDescription>
              Average scores across all cohorts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={[
                { month: "Jan", score: 78 },
                { month: "Feb", score: 80 },
                { month: "Mar", score: 82 },
                { month: "Apr", score: 83 },
                { month: "May", score: 85 },
                { month: "Jun", score: 87 },
                { month: "Jul", score: 84 },
                { month: "Aug", score: 86 },
                { month: "Sep", score: 88 },
                { month: "Oct", score: 87 },
                { month: "Nov", score: 89 },
                { month: "Dec", score: 91 },
              ]}
              categories={["score"]}
              index="month"
              colors={["blue"]}
              valueFormatter={(value) => `${value}%`}
              className="aspect-[3/2]"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
            <CardDescription>
              Program completion rate over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={[
                { month: "Jan", rate: 85 },
                { month: "Feb", rate: 86 },
                { month: "Mar", rate: 88 },
                { month: "Apr", rate: 89 },
                { month: "May", rate: 90 },
                { month: "Jun", rate: 91 },
                { month: "Jul", rate: 92 },
                { month: "Aug", rate: 93 },
                { month: "Sep", rate: 91 },
                { month: "Oct", rate: 92 },
                { month: "Nov", rate: 94 },
                { month: "Dec", rate: 95 },
              ]}
              categories={["rate"]}
              index="month"
              colors={["green"]}
              valueFormatter={(value) => `${value}%`}
              className="aspect-[3/2]"
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="cohorts" className="w-full mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="cohorts">Cohorts</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>
        <TabsContent value="cohorts">
          <CohortScoring data={cohortData} />
        </TabsContent>
        <TabsContent value="modules">
          <Card>
            <CardHeader>
              <CardTitle>Module Performance</CardTitle>
              <CardDescription>
                Average scores by module across all cohorts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={[
                  { module: "Fundamentals", score: 88 },
                  { module: "Web Development", score: 85 },
                  { module: "Data Structures", score: 79 },
                  { module: "Algorithms", score: 77 },
                  { module: "Databases", score: 86 },
                  { module: "Frontend Frameworks", score: 89 },
                  { module: "Backend Development", score: 84 },
                  { module: "DevOps", score: 82 },
                  { module: "Final Project", score: 91 },
                ]}
                categories={["score"]}
                index="module"
                colors={["blue"]}
                valueFormatter={(value) => `${value}%`}
                className="aspect-[3/2]"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="demographics">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>
                  Student gender across all cohorts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { gender: "Male", count: 55 },
                    { gender: "Female", count: 43 },
                    { gender: "Non-Binary", count: 2 },
                  ]}
                  categories={["count"]}
                  index="gender"
                  colors={["purple"]}
                  valueFormatter={(value) => `${value}%`}
                  className="aspect-[3/2]"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>
                  Student age groups across all cohorts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { age: "18-24", count: 28 },
                    { age: "25-34", count: 45 },
                    { age: "35-44", count: 22 },
                    { age: "45+", count: 5 },
                  ]}
                  categories={["count"]}
                  index="age"
                  colors={["orange"]}
                  valueFormatter={(value) => `${value}%`}
                  className="aspect-[3/2]"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OverallReport;
