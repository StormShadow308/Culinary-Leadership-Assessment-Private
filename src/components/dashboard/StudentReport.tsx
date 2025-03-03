
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function StudentReport() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Student Report</h2>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Select Student</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="search-student" className="text-sm font-medium">Search</label>
              <Input id="search-student" placeholder="Search by name or ID..." />
            </div>
            <div className="space-y-2">
              <label htmlFor="cohort" className="text-sm font-medium">Filter by Cohort</label>
              <Select>
                <SelectTrigger id="cohort">
                  <SelectValue placeholder="All Cohorts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cohorts</SelectItem>
                  <SelectItem value="c1">Cohort 1</SelectItem>
                  <SelectItem value="c2">Cohort 2</SelectItem>
                  <SelectItem value="c3">Cohort 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="border rounded-md max-h-[500px] overflow-y-auto">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="p-3 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer"
                >
                  <div className="font-medium">Student Name {i + 1}</div>
                  <div className="text-sm text-muted-foreground">ID: ST-{1000 + i}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Student Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <div className="border rounded-md p-4 text-center">
                  <div className="text-sm font-medium text-muted-foreground">Overall Score</div>
                  <div className="text-3xl font-bold mt-1">85%</div>
                </div>
                <div className="border rounded-md p-4 text-center">
                  <div className="text-sm font-medium text-muted-foreground">Assessments Completed</div>
                  <div className="text-3xl font-bold mt-1">12/15</div>
                </div>
                <div className="border rounded-md p-4 text-center">
                  <div className="text-sm font-medium text-muted-foreground">Rank in Cohort</div>
                  <div className="text-3xl font-bold mt-1">5 / 30</div>
                </div>
              </div>

              <Tabs defaultValue="scores">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="scores">Category Scores</TabsTrigger>
                  <TabsTrigger value="assessments">Assessments</TabsTrigger>
                  <TabsTrigger value="progress">Progress</TabsTrigger>
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                </TabsList>
                <TabsContent value="scores" className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Cohort Average</TableHead>
                        <TableHead>Difference</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Technical Skills</TableCell>
                        <TableCell>88%</TableCell>
                        <TableCell>82%</TableCell>
                        <TableCell className="text-green-600">+6%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Problem Solving</TableCell>
                        <TableCell>92%</TableCell>
                        <TableCell>79%</TableCell>
                        <TableCell className="text-green-600">+13%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Communication</TableCell>
                        <TableCell>78%</TableCell>
                        <TableCell>81%</TableCell>
                        <TableCell className="text-red-600">-3%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Teamwork</TableCell>
                        <TableCell>85%</TableCell>
                        <TableCell>84%</TableCell>
                        <TableCell className="text-green-600">+1%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Leadership</TableCell>
                        <TableCell>75%</TableCell>
                        <TableCell>77%</TableCell>
                        <TableCell className="text-red-600">-2%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="assessments" className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assessment Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>Assessment {i + 1}</TableCell>
                          <TableCell>{`2023-${(i % 3) + 10}-${10 + i}`}</TableCell>
                          <TableCell>{75 + Math.floor(Math.random() * 20)}%</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              Completed
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
