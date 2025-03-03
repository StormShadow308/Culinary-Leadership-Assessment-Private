
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function CohortScoring() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold">Cohort Scoring</h3>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Cohort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cohorts</SelectItem>
              <SelectItem value="c1">Cohort 1</SelectItem>
              <SelectItem value="c2">Cohort 2</SelectItem>
              <SelectItem value="c3">Cohort 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cohort</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead>Min Score</TableHead>
                <TableHead>Max Score</TableHead>
                <TableHead>Standard Deviation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Cohort 1</TableCell>
                <TableCell>32</TableCell>
                <TableCell>82.5%</TableCell>
                <TableCell>68%</TableCell>
                <TableCell>98%</TableCell>
                <TableCell>6.2%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cohort 2</TableCell>
                <TableCell>28</TableCell>
                <TableCell>79.8%</TableCell>
                <TableCell>65%</TableCell>
                <TableCell>95%</TableCell>
                <TableCell>7.5%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cohort 3</TableCell>
                <TableCell>30</TableCell>
                <TableCell>84.2%</TableCell>
                <TableCell>71%</TableCell>
                <TableCell>97%</TableCell>
                <TableCell>5.8%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Cohort 1</TableHead>
                <TableHead>Cohort 2</TableHead>
                <TableHead>Cohort 3</TableHead>
                <TableHead>Overall Avg</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Technical Skills</TableCell>
                <TableCell>83%</TableCell>
                <TableCell>81%</TableCell>
                <TableCell>85%</TableCell>
                <TableCell>83%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Problem Solving</TableCell>
                <TableCell>80%</TableCell>
                <TableCell>78%</TableCell>
                <TableCell>83%</TableCell>
                <TableCell>80.3%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Communication</TableCell>
                <TableCell>82%</TableCell>
                <TableCell>84%</TableCell>
                <TableCell>81%</TableCell>
                <TableCell>82.3%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Teamwork</TableCell>
                <TableCell>85%</TableCell>
                <TableCell>79%</TableCell>
                <TableCell>86%</TableCell>
                <TableCell>83.3%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Leadership</TableCell>
                <TableCell>78%</TableCell>
                <TableCell>76%</TableCell>
                <TableCell>82%</TableCell>
                <TableCell>78.7%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
