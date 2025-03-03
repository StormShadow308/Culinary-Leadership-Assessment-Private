
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AllStudents() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">All Students</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search students..."
            className="max-w-sm"
          />
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Roster</CardTitle>
          <CardDescription>
            Manage and view all students in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Cohort</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Overall Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>Student {i + 1}</TableCell>
                  <TableCell>student{i + 1}@example.com</TableCell>
                  <TableCell>Cohort {Math.floor(i / 3) + 1}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${i % 3 === 0 ? 'bg-green-100 text-green-800' : i % 3 === 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                      {i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Pending' : 'Completed'}
                    </span>
                  </TableCell>
                  <TableCell>{Math.floor(70 + Math.random() * 30)}%</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
