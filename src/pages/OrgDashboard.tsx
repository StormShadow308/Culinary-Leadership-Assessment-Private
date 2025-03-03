
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsHeader } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const OrgDashboard = () => {
  const [selectedCohort, setSelectedCohort] = React.useState("all");
  const [dateRange, setDateRange] = React.useState("all-time");
  const [showFilters, setShowFilters] = React.useState(false);

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Organization Dashboard</h1>
            <div className="flex space-x-2">
              <select 
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="all">All Cohorts</option>
                <option value="cohort-1">Cohort 1</option>
                <option value="cohort-2">Cohort 2</option>
              </select>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="all-time">All Time</option>
                <option value="last-30-days">Last 30 Days</option>
                <option value="last-90-days">Last 90 Days</option>
              </select>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="border rounded px-2 py-1 text-sm"
              >
                More Filters
              </button>
            </div>
          </div>
          <div>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
              Export Data
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Overall Report - Pre Only</h1>
        </div>

        <Tabs defaultValue="cohort-scoring">
          <TabsHeader>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="cohort-scoring">Cohort Scoring</TabsTrigger>
              <TabsTrigger value="student-rankings">Student Rankings</TabsTrigger>
              <TabsTrigger value="assessment-analysis">Assessment Analysis</TabsTrigger>
            </TabsList>
          </TabsHeader>

          <TabsContent value="cohort-scoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cohort Performance Overview</CardTitle>
                <CardDescription>
                  Summary of cohort performance across all assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Average Score</h3>
                    <div className="text-3xl font-bold">72%</div>
                    <p className="text-sm text-gray-500">+5% from previous</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Completion Rate</h3>
                    <div className="text-3xl font-bold">89%</div>
                    <p className="text-sm text-gray-500">+2% from previous</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Pass Rate</h3>
                    <div className="text-3xl font-bold">78%</div>
                    <p className="text-sm text-gray-500">+7% from previous</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="student-rankings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Rankings</CardTitle>
                <CardDescription>
                  View top and bottom performing students across different categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <h3 className="text-xl font-semibold">Overall Rankings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-medium mb-4">Top 10 Students</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Progress</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Array.from({ length: 10 }).map((_, i) => (
                            <TableRow key={`top-${i}`}>
                              <TableCell>Student {i + 1}</TableCell>
                              <TableCell>{90 - i}</TableCell>
                              <TableCell className="w-[40%]">
                                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-green-500 rounded-full" 
                                    style={{ width: `${90 - i}%` }}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-4">Bottom 10 Students</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Progress</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Array.from({ length: 10 }).map((_, i) => (
                            <TableRow key={`bottom-${i}`}>
                              <TableCell>Student {100 - i}</TableCell>
                              <TableCell>{40 + i}</TableCell>
                              <TableCell className="w-[40%]">
                                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-red-500 rounded-full" 
                                    style={{ width: `${40 + i}%` }}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessment-analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Analysis</CardTitle>
                <CardDescription>
                  Detailed analysis of assessment responses and patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Response Patterns</h3>
                  <p>Analysis of response patterns across all students shows trends in understanding key concepts.</p>
                  
                  <div className="mt-6">
                    <h4 className="text-lg font-medium mb-2">Common Misconceptions</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Understanding of leadership frameworks (43% of students)</li>
                      <li>Application of conflict resolution techniques (38% of students)</li>
                      <li>Differentiating between management and leadership (35% of students)</li>
                    </ul>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-lg font-medium mb-2">Areas of Strength</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Communication skills (72% proficiency)</li>
                      <li>Team collaboration concepts (68% proficiency)</li>
                      <li>Personal development planning (65% proficiency)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrgDashboard;
