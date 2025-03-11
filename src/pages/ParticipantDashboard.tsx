
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Download, Mail } from "lucide-react";
import { mockStudentData } from "@/components/org-dashboard/mockData";

const ParticipantDashboard = () => {
  // Assume the logged-in student is the first student in the mock data
  // In a real app, this would come from authentication context
  const reportStudent = mockStudentData[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 animate-fade-in">
              Your Assessment Results
            </h1>
            <div className="flex gap-4 w-full sm:w-auto">
              <button className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-brand-blue text-white hover:bg-brand-blue/90 transition-colors text-sm md:text-base w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
              <button className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-brand-orange text-white hover:bg-brand-orange/90 transition-colors text-sm md:text-base w-full sm:w-auto">
                <Mail className="h-4 w-4 mr-2" />
                Email Results
              </button>
            </div>
          </div>

          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg">Student Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 md:mb-6">
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Name</p>
                  <p className="font-medium text-sm md:text-base">{reportStudent.name}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Client</p>
                  <p className="font-medium text-sm md:text-base">{reportStudent.client}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Cohort</p>
                  <p className="font-medium text-sm md:text-base">{reportStudent.cohort}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Status</p>
                  <p className="font-medium text-green-600 text-sm md:text-base">{reportStudent.status}</p>
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
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-4">{reportStudent.name}: 0 out of 40 - Needs Development</h3>
                <p className="text-base md:text-lg mb-4 md:mb-6">Lacks foundational leadership skills; requires extensive support.</p>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h2 className="text-xl md:text-2xl font-bold text-blue-800">Improvement Recommendations</h2>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
                  <h3 className="font-semibold text-blue-800 mb-2">Resilience and Adaptability</h3>
                  <p className="text-sm md:text-base text-gray-700">Focus on developing strategies to manage stress and adapt to changing circumstances. Practice reframing challenges as opportunities for growth.</p>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
                  <h3 className="font-semibold text-blue-800 mb-2">Team Dynamics & Collaboration</h3>
                  <p className="text-sm md:text-base text-gray-700">Work on active participation in team settings. Seek opportunities to contribute meaningfully to group discussions and projects.</p>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
                  <h3 className="font-semibold text-blue-800 mb-2">Next Steps</h3>
                  <p className="text-sm md:text-base text-gray-700">Schedule a 1:1 with your mentor to discuss specific areas for improvement and create a personalized development plan.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ParticipantDashboard;
