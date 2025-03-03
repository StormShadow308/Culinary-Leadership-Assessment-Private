
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import StudentTable from './StudentTable';

// Mock data
const mockStudents = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    cohort: "2023 Fall",
    progress: 75,
    lastActive: "Today"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    cohort: "2023 Fall",
    progress: 92,
    lastActive: "Yesterday"
  },
  {
    id: "3",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    cohort: "2023 Summer",
    progress: 68,
    lastActive: "3 days ago"
  },
  {
    id: "4",
    name: "Emily Brown",
    email: "emily.b@example.com",
    cohort: "2023 Summer",
    progress: 88,
    lastActive: "Today"
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael.w@example.com",
    cohort: "2023 Spring",
    progress: 100,
    lastActive: "Yesterday"
  },
  {
    id: "6",
    name: "Olivia Davis",
    email: "olivia.d@example.com",
    cohort: "2023 Spring",
    progress: 95,
    lastActive: "Today"
  },
  {
    id: "7",
    name: "William Miller",
    email: "william.m@example.com",
    cohort: "2022 Fall",
    progress: 100,
    lastActive: "1 week ago"
  },
  {
    id: "8",
    name: "Sophia Moore",
    email: "sophia.m@example.com",
    cohort: "2022 Fall",
    progress: 100,
    lastActive: "2 weeks ago"
  }
];

const AllStudents: React.FC = () => {
  const handleViewDetails = (studentId: string) => {
    console.log("View details for student:", studentId);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">All Students</h1>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Student
        </Button>
      </div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="graduates">Graduates</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <StudentTable students={mockStudents} onViewDetails={handleViewDetails} />
        </TabsContent>
        <TabsContent value="active">
          <StudentTable students={mockStudents.filter(s => s.progress < 100)} onViewDetails={handleViewDetails} />
        </TabsContent>
        <TabsContent value="inactive">
          <StudentTable students={mockStudents.filter(s => s.lastActive.includes("week"))} onViewDetails={handleViewDetails} />
        </TabsContent>
        <TabsContent value="graduates">
          <StudentTable students={mockStudents.filter(s => s.progress === 100)} onViewDetails={handleViewDetails} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllStudents;
