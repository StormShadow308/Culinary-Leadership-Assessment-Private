
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart } from "@/components/ui/chart";

const ComparisonReport: React.FC = () => {
  const [comparisonType, setComparisonType] = useState("cohorts");
  const [timePeriod, setTimePeriod] = useState("6months");

  // Mock cohort comparison data
  const cohortData = [
    { name: "Module 1", "Spring 2023": 85, "Summer 2023": 82, "Fall 2023": 88 },
    { name: "Module 2", "Spring 2023": 78, "Summer 2023": 80, "Fall 2023": 83 },
    { name: "Module 3", "Spring 2023": 90, "Summer 2023": 85, "Fall 2023": 92 },
    { name: "Module 4", "Spring 2023": 82, "Summer 2023": 79, "Fall 2023": 86 },
    { name: "Module 5", "Spring 2023": 88, "Summer 2023": 90, "Fall 2023": 91 },
    { name: "Module 6", "Spring 2023": 92, "Summer 2023": 88, "Fall 2023": 94 },
  ];

  // Mock trend data
  const trendData = [
    { month: "Jan", "Spring 2023": 75, "Summer 2023": 0, "Fall 2023": 0 },
    { month: "Feb", "Spring 2023": 78, "Summer 2023": 0, "Fall 2023": 0 },
    { month: "Mar", "Spring 2023": 80, "Summer 2023": 0, "Fall 2023": 0 },
    { month: "Apr", "Spring 2023": 83, "Summer 2023": 0, "Fall 2023": 0 },
    { month: "May", "Spring 2023": 85, "Summer 2023": 0, "Fall 2023": 0 },
    { month: "Jun", "Spring 2023": 88, "Summer 2023": 72, "Fall 2023": 0 },
    { month: "Jul", "Spring 2023": 90, "Summer 2023": 76, "Fall 2023": 0 },
    { month: "Aug", "Spring 2023": 92, "Summer 2023": 80, "Fall 2023": 0 },
    { month: "Sep", "Spring 2023": 94, "Summer 2023": 84, "Fall 2023": 75 },
    { month: "Oct", "Spring 2023": 95, "Summer 2023": 87, "Fall 2023": 79 },
    { month: "Nov", "Spring 2023": 0, "Summer 2023": 90, "Fall 2023": 83 },
    { month: "Dec", "Spring 2023": 0, "Summer 2023": 92, "Fall 2023": 86 },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Comparison Report</h1>
        <div className="flex gap-4">
          <Select value={comparisonType} onValueChange={setComparisonType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Compare by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cohorts">Cohorts</SelectItem>
              <SelectItem value="instructors">Instructors</SelectItem>
              <SelectItem value="locations">Locations</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="module-performance" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="module-performance">Module Performance</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="completion">Completion Rates</TabsTrigger>
        </TabsList>
        <TabsContent value="module-performance">
          <Card>
            <CardHeader>
              <CardTitle>Module Performance Comparison</CardTitle>
              <CardDescription>
                Average scores by module across {comparisonType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={cohortData}
                categories={["Spring 2023", "Summer 2023", "Fall 2023"]}
                index="name"
                colors={["blue", "green", "purple"]}
                valueFormatter={(value) => `${value}%`}
                className="aspect-[3/2]"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>
                Monthly average scores across {comparisonType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                data={trendData}
                categories={["Spring 2023", "Summer 2023", "Fall 2023"]}
                index="month"
                colors={["blue", "green", "purple"]}
                valueFormatter={(value) => `${value}%`}
                className="aspect-[3/2]"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completion">
          <Card>
            <CardHeader>
              <CardTitle>Completion Rates</CardTitle>
              <CardDescription>
                Program completion rates across {comparisonType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={[
                  { name: "Spring 2023", value: 92 },
                  { name: "Summer 2023", value: 85 },
                  { name: "Fall 2023", value: 78 },
                ]}
                categories={["value"]}
                index="name"
                colors={["blue"]}
                valueFormatter={(value) => `${value}%`}
                className="aspect-[3/2]"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComparisonReport;
