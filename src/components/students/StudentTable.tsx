
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  cohort: string;
  progress: number;
  lastActive: string;
}

interface StudentTableProps {
  students: Student[];
  onViewDetails?: (studentId: string) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({ students, onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Student>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (column: keyof Student) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.cohort.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    }
    
    return 0;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-[250px]"
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                sortable 
                sortDirection={sortColumn === "name" ? sortDirection : undefined}
                onSort={() => handleSort("name")}
              >
                Name
              </TableHead>
              <TableHead 
                sortable 
                sortDirection={sortColumn === "email" ? sortDirection : undefined}
                onSort={() => handleSort("email")}
              >
                Email
              </TableHead>
              <TableHead 
                sortable 
                sortDirection={sortColumn === "cohort" ? sortDirection : undefined}
                onSort={() => handleSort("cohort")}
              >
                Cohort
              </TableHead>
              <TableHead 
                sortable 
                sortDirection={sortColumn === "progress" ? sortDirection : undefined}
                onSort={() => handleSort("progress")}
              >
                Progress
              </TableHead>
              <TableHead 
                sortable 
                sortDirection={sortColumn === "lastActive" ? sortDirection : undefined}
                onSort={() => handleSort("lastActive")}
              >
                Last Active
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              sortedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.cohort}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {student.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{student.lastActive}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails && onViewDetails(student.id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StudentTable;
