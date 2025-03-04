import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockStudentData } from "./mockData";
import { ChevronLeft, Search } from "lucide-react";

interface StudentReportProps {
  selectedStudent: number | null;
  onBackToStudentList: () => void;
  onStudentSelect: (studentId: number) => void;
}

const StudentReport = ({ selectedStudent, onBackToStudentList, onStudentSelect }: StudentReportProps) => {
  const [activeReportSubTab, setActiveReportSubTab] = useState("cohort-scoring");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Find the selected student from the mock data
  const reportStudent = selectedStudent 
    ? mockStudentData.find(student => student.id === selectedStudent) 
    : null;

  // Filter students based on search term
  const filteredStudents = mockStudentData.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.cohort.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If no student is selected, show the student list
  if (!selectedStudent) {
    return (
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-8">
          Student Reports
        </h1>
        
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">Select a Student</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, client, or cohort..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent text-sm md:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 md:p-2">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold text-xs md:text-sm">Name</TableHead>
                    <TableHead className="font-semibold text-xs md:text-sm">Client</TableHead>
                    <TableHead className="font-semibold text-xs md:text-sm">Cohort</TableHead>
                    <TableHead className="font-semibold text-xs md:text-sm">Status</TableHead>
                    <TableHead className="font-semibold text-xs md:text-sm">Pre-Score</TableHead>
                    <TableHead className="font-semibold text-xs md:text-sm">Post-Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow 
                      key={student.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => onStudentSelect(student.id)}
                    >
                      <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">{student.name}</TableCell>
                      <TableCell className="text-xs md:text-sm py-2 md:py-4">{student.client}</TableCell>
                      <TableCell className="text-xs md:text-sm py-2 md:py-4">{student.cohort}</TableCell>
                      <TableCell className="text-green-600 text-xs md:text-sm py-2 md:py-4">{student.status}</TableCell>
                      <TableCell className="text-xs md:text-sm py-2 md:py-4">{student.preAssessment.overallScore}</TableCell>
                      <TableCell className="text-xs md:text-sm py-2 md:py-4">{student.postAssessment.overallScore}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If a student is selected, show the detailed report
  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <div className="flex items-center mb-4 md:mb-8">
        <button 
          onClick={onBackToStudentList}
          className="mr-2 md:mr-4 p-1 md:p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
        </button>
        <h1 className="text-xl md:text-3xl font-bold text-gray-900 truncate">
          Student Report: {reportStudent?.name}
        </h1>
      </div>

      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg">Student Information</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 md:mb-6">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Name</p>
              <p className="font-medium text-sm md:text-base">{reportStudent?.name}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Client</p>
              <p className="font-medium text-sm md:text-base">{reportStudent?.client}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Cohort</p>
              <p className="font-medium text-sm md:text-base">{reportStudent?.cohort}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Status</p>
              <p className="font-medium text-green-600 text-sm md:text-base">{reportStudent?.status}</p>
            </div>
          </div>
          
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-blue-800 mb-3 md:mb-4">Summary</h2>
            
            <div className="overflow-x-auto mb-4 md:mb-6">
              <table className="min-w-full border-collapse text-xs md:text-sm">
                <thead>
                  <tr>
                    <th className="bg-gray-900 text-white text-center py-1 md:py-2 px-2 md:px-4 border border-gray-800">Overall Score</th>
                    <th className="bg-gray-900 text-white text-center py-1 md:py-2 px-2 md:px-4 border border-gray-800">0 out of 40</th>
                    <th className="bg-gray-900 text-white text-center py-1 md:py-2 px-2 md:px-4 border border-gray-800">Needs Development</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 py-1 md:py-2 px-2 md:px-4 whitespace-nowrap">Resilience and Adaptability</td>
                    <td className="border border-gray-300 py-1 md:py-2 px-2 md:px-4 text-center">0 out of 8</td>
                    <td className="border border-gray-300 py-1 md:py-2 px-2 md:px-4 bg-yellow-200"></td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 py-1 md:py-2 px-2 md:px-4 whitespace-nowrap">Team Dynamics & Collaboration</td>
                    <td className="border border-gray-300 py-1 md:py-2 px-2 md:px-4 text-center">0 out of 8</td>
                    <td className="border border-gray-300 py-1 md:py-2 px-2 md:px-4 bg-yellow-200"></td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 py-1 md:py-2 px-2 md:px-4 whitespace-nowrap">Decision-Making & Problem-Solving</td>
                    <td className="border border-gray-300 py-1 md:py-2 px-2 md:px-4 text-center">0 out of 8</td>
                    <td className="border border-gray-300 py-1 md:py-2 px-2 md:px-4 bg-yellow-200"></td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 py-1 md:py-2 px-2 md:px-4 whitespace-nowrap">Self-Awareness & Emotional Intelligence</td>
                    <td className="border border-gray-300 py-1 md:py-2 px-2 md:px-4 text-center">0 out of 8</td>
                    <td className="border border-gray-300 py-1 md:py-2 px-2 md:px-4 bg-yellow-200"></td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 py-1 md:py-2 px-2 md:px-4 whitespace-nowrap">Communication & Active Listening</td>
                    <td className="border border-gray-300 py-1 md:py-2 px-2 md:px-4 text-center">0 out of 8</td>
                    <td className="border border-gray-300 py-1 md:py-2 px-2 md:px-4 bg-yellow-200"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-blue-800 mb-3 md:mb-4">Details</h2>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4">{reportStudent?.name}: 0 out of 40 - Needs Development</h3>
            <p className="text-base md:text-lg mb-4 md:mb-6">Lacks foundational leadership skills; requires extensive support.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentReport; 