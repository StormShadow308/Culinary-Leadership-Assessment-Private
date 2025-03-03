
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function AssessmentAnalysis() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold">Assessment Analysis</h3>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Assessment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assessments</SelectItem>
              <SelectItem value="a1">Technical Skills</SelectItem>
              <SelectItem value="a2">Problem Solving</SelectItem>
              <SelectItem value="a3">Communication</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assessment</TableHead>
                <TableHead>Cohort</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Not Started</TableHead>
                <TableHead>Completion Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Technical Skills</TableCell>
                <TableCell>Cohort 1</TableCell>
                <TableCell>28</TableCell>
                <TableCell>3</TableCell>
                <TableCell>1</TableCell>
                <TableCell>88%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Problem Solving</TableCell>
                <TableCell>Cohort 1</TableCell>
                <TableCell>30</TableCell>
                <TableCell>2</TableCell>
                <TableCell>0</TableCell>
                <TableCell>94%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Technical Skills</TableCell>
                <TableCell>Cohort 2</TableCell>
                <TableCell>25</TableCell>
                <TableCell>2</TableCell>
                <TableCell>1</TableCell>
                <TableCell>89%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Problem Solving</TableCell>
                <TableCell>Cohort 2</TableCell>
                <TableCell>26</TableCell>
                <TableCell>2</TableCell>
                <TableCell>0</TableCell>
                <TableCell>93%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assessment</TableHead>
                <TableHead>Cohort</TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead>Min Score</TableHead>
                <TableHead>Max Score</TableHead>
                <TableHead>Std Deviation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Technical Skills</TableCell>
                <TableCell>Cohort 1</TableCell>
                <TableCell>83%</TableCell>
                <TableCell>65%</TableCell>
                <TableCell>98%</TableCell>
                <TableCell>7.2%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Problem Solving</TableCell>
                <TableCell>Cohort 1</TableCell>
                <TableCell>79%</TableCell>
                <TableCell>62%</TableCell>
                <TableCell>96%</TableCell>
                <TableCell>8.5%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Technical Skills</TableCell>
                <TableCell>Cohort 2</TableCell>
                <TableCell>81%</TableCell>
                <TableCell>67%</TableCell>
                <TableCell>95%</TableCell>
                <TableCell>6.8%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Problem Solving</TableCell>
                <TableCell>Cohort 2</TableCell>
                <TableCell>80%</TableCell>
                <TableCell>64%</TableCell>
                <TableCell>97%</TableCell>
                <TableCell>7.9%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
