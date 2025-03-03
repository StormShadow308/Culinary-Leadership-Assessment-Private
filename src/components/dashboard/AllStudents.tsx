
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";

interface AllStudentsProps {
  data?: any;
}

const AllStudents: React.FC<AllStudentsProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cohortFilter, setCohortFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Dummy data for students
  const students = [
    { id: 1, name: "Jane Smith", email: "jane.smith@example.com", cohort: "2023A", completedAssessments: 5, averageScore: 87 },
    { id: 2, name: "John Doe", email: "john.doe@example.com", cohort: "2023A", completedAssessments: 4, averageScore: 92 },
    { id: 3, name: "Emily Johnson", email: "emily.j@example.com", cohort: "2023B", completedAssessments: 5, averageScore: 78 },
    { id: 4, name: "Michael Brown", email: "michael.b@example.com", cohort: "2023B", completedAssessments: 3, averageScore: 85 },
    { id: 5, name: "Alex Williams", email: "alex.w@example.com", cohort: "2023C", completedAssessments: 5, averageScore: 91 },
    { id: 6, name: "Sarah Miller", email: "sarah.m@example.com", cohort: "2023C", completedAssessments: 4, averageScore: 84 },
    { id: 7, name: "David Wilson", email: "david.w@example.com", cohort: "2023A", completedAssessments: 5, averageScore: 76 },
    { id: 8, name: "Jessica Taylor", email: "jessica.t@example.com", cohort: "2023B", completedAssessments: 5, averageScore: 89 },
    { id: 9, name: "Robert Martinez", email: "robert.m@example.com", cohort: "2023C", completedAssessments: 4, averageScore: 81 },
    { id: 10, name: "Lisa Anderson", email: "lisa.a@example.com", cohort: "2023A", completedAssessments: 5, averageScore: 93 },
  ];

  // Filter students based on search query and cohort
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCohort = cohortFilter === 'all' || student.cohort === cohortFilter;
    return matchesSearch && matchesCohort;
  });

  // Pagination
  const studentsPerPage = 5;
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Students</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={cohortFilter}
              onValueChange={setCohortFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Cohort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cohorts</SelectItem>
                <SelectItem value="2023A">Cohort 2023A</SelectItem>
                <SelectItem value="2023B">Cohort 2023B</SelectItem>
                <SelectItem value="2023C">Cohort 2023C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cohort</TableHead>
                  <TableHead>Completed Assessments</TableHead>
                  <TableHead>Average Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.cohort}</TableCell>
                    <TableCell>{student.completedAssessments}</TableCell>
                    <TableCell>{student.averageScore}%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex-1 text-center text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllStudents;
