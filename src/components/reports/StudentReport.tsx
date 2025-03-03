
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, BarChart } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StudentReport: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState("john-doe");
  const [viewPeriod, setViewPeriod] = useState("6months");

  // Mock progress data
  const progressData = [
    { date: "Week 1", score: 78 },
    { date: "Week 2", score: 82 },
    { date: "Week 3", score: 79 },
    { date: "Week 4", score: 85 },
    { date: "Week 5", score: 88 },
    { date: "Week 6", score: 91 },
    { date: "Week 7", score: 87 },
    { date: "Week 8", score: 92 },
    { date: "Week 9", score: 94 },
    { date: "Week 10", score: 90 },
    { date: "Week 11", score: 93 },
    { date: "Week 12", score: 95 },
  ];

  // Mock module performance data
  const moduleData = [
    { name: "Fundamentals", value: 88 },
    { name: "Web Development", value: 92 },
    { name: "Data Structures", value: 85 },
    { name: "Algorithms", value: 79 },
    { name: "Databases", value: 90 },
    { name: "Frontend Frameworks", value: 94 },
    { name: "Backend Development", value: 89 },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Student Report</h1>
        <div className="flex gap-4">
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="john-doe">John Doe</SelectItem>
              <SelectItem value="jane-smith">Jane Smith</SelectItem>
              <SelectItem value="alex-johnson">Alex Johnson</SelectItem>
            </SelectContent>
          </Select>
          <Select value={viewPeriod} onValueChange={setViewPeriod}>
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

      <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mb-4">
                <span className="text-4xl">JD</span>
              </div>
              <h3 className="text-xl font-medium">John Doe</h3>
              <p className="text-muted-foreground">john.doe@example.com</p>
              <div className="mt-4 w-full">
                <p className="text-sm text-muted-foreground mb-1">Cohort: 2023 Fall</p>
                <p className="text-sm text-muted-foreground mb-1">
                  Joined: Aug 15, 2023
                </p>
                <p className="text-sm text-muted-foreground mb-1">Status: Active</p>
                <p className="text-sm text-muted-foreground">
                  Overall Progress: 75%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3 grid gap-6">
          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>Progress Over Time</CardTitle>
                  <CardDescription>Weekly assessment scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart
                    data={progressData}
                    categories={["score"]}
                    index="date"
                    colors={["blue"]}
                    valueFormatter={(value) => `${value}%`}
                    className="aspect-[4/2]"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="modules">
              <Card>
                <CardHeader>
                  <CardTitle>Module Performance</CardTitle>
                  <CardDescription>Score by module</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={moduleData}
                    categories={["value"]}
                    index="name"
                    colors={["blue"]}
                    valueFormatter={(value) => `${value}%`}
                    className="aspect-[4/2]"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements & Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-5 w-5"
                        >
                          <circle cx="12" cy="8" r="6" />
                          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Fundamentals Certificate</p>
                        <p className="text-sm text-muted-foreground">
                          Completed on Oct 1, 2023
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-5 w-5"
                        >
                          <circle cx="12" cy="8" r="6" />
                          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Web Development Certificate</p>
                        <p className="text-sm text-muted-foreground">
                          Completed on Nov 15, 2023
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-5 w-5"
                        >
                          <circle cx="12" cy="8" r="6" />
                          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Data Structures Certificate</p>
                        <p className="text-sm text-muted-foreground">
                          Completed on Dec 10, 2023
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StudentReport;
