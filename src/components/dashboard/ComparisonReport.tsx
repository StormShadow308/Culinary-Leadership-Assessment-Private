
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function ComparisonReport() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Comparison Report</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compare Cohorts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cohort 1</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Cohort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="c1">Cohort 1 (Spring 2023)</SelectItem>
                  <SelectItem value="c2">Cohort 2 (Summer 2023)</SelectItem>
                  <SelectItem value="c3">Cohort 3 (Fall 2023)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cohort 2</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Cohort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="c1">Cohort 1 (Spring 2023)</SelectItem>
                  <SelectItem value="c2">Cohort 2 (Summer 2023)</SelectItem>
                  <SelectItem value="c3">Cohort 3 (Fall 2023)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="mb-4">Compare</Button>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Cohort 1</TableHead>
                <TableHead>Cohort 2</TableHead>
                <TableHead>Difference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Average Overall Score</TableCell>
                <TableCell>82%</TableCell>
                <TableCell>79%</TableCell>
                <TableCell className="text-green-600">+3%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Technical Skills</TableCell>
                <TableCell>85%</TableCell>
                <TableCell>82%</TableCell>
                <TableCell className="text-green-600">+3%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Problem Solving</TableCell>
                <TableCell>80%</TableCell>
                <TableCell>78%</TableCell>
                <TableCell className="text-green-600">+2%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Communication</TableCell>
                <TableCell>79%</TableCell>
                <TableCell>81%</TableCell>
                <TableCell className="text-red-600">-2%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Teamwork</TableCell>
                <TableCell>83%</TableCell>
                <TableCell>80%</TableCell>
                <TableCell className="text-green-600">+3%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Completion Rate</TableCell>
                <TableCell>95%</TableCell>
                <TableCell>92%</TableCell>
                <TableCell className="text-green-600">+3%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Retention Rate</TableCell>
                <TableCell>88%</TableCell>
                <TableCell>90%</TableCell>
                <TableCell className="text-red-600">-2%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
