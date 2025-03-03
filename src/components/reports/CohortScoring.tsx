
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface CohortScoringProps {
  data: {
    name: string;
    students: number;
    avgScore: number;
    completionRate: number;
    trend: "up" | "down" | "neutral";
  }[];
}

const CohortScoring: React.FC<CohortScoringProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cohort Scoring Overview</CardTitle>
        <CardDescription>Performance metrics across all cohorts</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cohort</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Avg. Score</TableHead>
              <TableHead>Completion</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((cohort) => (
              <TableRow key={cohort.name}>
                <TableCell className="font-medium">{cohort.name}</TableCell>
                <TableCell>{cohort.students}</TableCell>
                <TableCell>{cohort.avgScore}%</TableCell>
                <TableCell>{cohort.completionRate}%</TableCell>
                <TableCell>
                  {cohort.trend === "up" ? (
                    <Badge className="bg-green-500">↑ Improving</Badge>
                  ) : cohort.trend === "down" ? (
                    <Badge className="bg-red-500">↓ Declining</Badge>
                  ) : (
                    <Badge variant="outline">→ Stable</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CohortScoring;
