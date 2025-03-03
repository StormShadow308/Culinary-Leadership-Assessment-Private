
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsHeader, SubTabsList, SubTabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableHeadColored,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table"

const OrgDashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="overall-report-pre" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="overall-report-pre">Overall Report - Pre Only</TabsTrigger>
          <TabsTrigger value="overall-report-post">Overall Report - Post Only</TabsTrigger>
          <TabsTrigger value="pre-vs-post-comparison">Pre vs Post Comparison</TabsTrigger>
        </TabsList>
        
        {/* Overall Report - Pre Only */}
        <TabsContent value="overall-report-pre">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Overall Report - Pre Only</h2>

            <Tabs defaultValue="cohort-scoring" className="w-full">
              <SubTabsList className="border-b mb-6">
                <SubTabsTrigger value="cohort-scoring">Cohort Scoring</SubTabsTrigger>
                <SubTabsTrigger value="student-rankings">Student Rankings</SubTabsTrigger>
              </SubTabsList>

              {/* Cohort Scoring subtab */}
              <TabsContent value="cohort-scoring" className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Cohort Scoring Content</h3>
                  <p>This section will display cohort scoring data.</p>
                </div>
              </TabsContent>

              {/* Student Rankings subtab */}
              <TabsContent value="student-rankings" className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Students Rankings</h3>

                  {/* Overall Score Rankings Table */}
                  <div className="overflow-x-auto border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">No.</TableHead>
                          <TableHead className="w-64">Student</TableHead>
                          <TableHead className="w-32">Score</TableHead>
                          <TableHead className="w-32">Score in %</TableHead>
                          <TableHead className="w-full">Overall Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from({ length: 15 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>Student {index + 1}</TableCell>
                            <TableCell>{Math.floor(Math.random() * 100)}</TableCell>
                            <TableCell>{Math.floor(Math.random() * 100)}%</TableCell>
                            <TableCell>
                              <div className="w-full bg-gray-200 h-6 rounded-sm">
                                <div
                                  className="bg-blue-500 h-full rounded-sm"
                                  style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Category Rankings Tables */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {/* Resilience and Adaptability */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-[#FF8C42]">Top 10 Score</h3>
                        <h3 className="text-xl font-bold text-center">Resilience and Adaptability</h3>
                        <h3 className="text-xl font-semibold text-[#FF8C42]">Bottom 10 Score</h3>
                      </div>
                      <div className="flex gap-4">
                        {/* Top 10 Scores */}
                        <div className="flex-1 border rounded-lg overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead className="w-24">Score</TableHead>
                                <TableHead className="w-28">Score in %</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Array.from({ length: 10 }).map((_, index) => (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>Student {index + 1}</TableCell>
                                  <TableCell>{Math.floor(Math.random() * 50) + 50}</TableCell>
                                  <TableCell className="bg-green-300">
                                    {Math.floor(Math.random() * 50) + 50}%
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Bottom 10 Scores */}
                        <div className="flex-1 border rounded-lg overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead className="w-24">Score</TableHead>
                                <TableHead className="w-28">Score in %</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Array.from({ length: 10 }).map((_, index) => (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>Student {index + 91}</TableCell>
                                  <TableCell>{Math.floor(Math.random() * 30) + 10}</TableCell>
                                  <TableCell className="bg-green-300">
                                    {Math.floor(Math.random() * 30) + 10}%
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>

                    {/* Team Dynamics & Collaboration */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-[#FF8C42]">Top 10 Score</h3>
                        <h3 className="text-xl font-bold text-center">Team Dynamics & Collaboration</h3>
                        <h3 className="text-xl font-semibold text-[#FF8C42]">Bottom 10 Score</h3>
                      </div>
                      <div className="flex gap-4">
                        {/* Top 10 Scores */}
                        <div className="flex-1 border rounded-lg overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead className="w-24">Score</TableHead>
                                <TableHead className="w-28">Score in %</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Array.from({ length: 10 }).map((_, index) => (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>Student {index + 3}</TableCell>
                                  <TableCell>{Math.floor(Math.random() * 50) + 50}</TableCell>
                                  <TableCell className="bg-green-300">
                                    {Math.floor(Math.random() * 50) + 50}%
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Bottom 10 Scores */}
                        <div className="flex-1 border rounded-lg overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead className="w-24">Score</TableHead>
                                <TableHead className="w-28">Score in %</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Array.from({ length: 10 }).map((_, index) => (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>Student {index + 93}</TableCell>
                                  <TableCell>{Math.floor(Math.random() * 30) + 10}</TableCell>
                                  <TableCell className="bg-green-300">
                                    {Math.floor(Math.random() * 30) + 10}%
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>

                    {/* Decision-Making & Problem-Solving */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-[#FF8C42]">Top 10 Score</h3>
                        <h3 className="text-xl font-bold text-center">Decision-Making & Problem-Solving</h3>
                        <h3 className="text-xl font-semibold text-[#FF8C42]">Bottom 10 Score</h3>
                      </div>
                      <div className="flex gap-4">
                        {/* Top 10 Scores */}
                        <div className="flex-1 border rounded-lg overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead className="w-24">Score</TableHead>
                                <TableHead className="w-28">Score in %</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Array.from({ length: 10 }).map((_, index) => (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>Student {index + 5}</TableCell>
                                  <TableCell>{Math.floor(Math.random() * 50) + 50}</TableCell>
                                  <TableCell className="bg-green-300">
                                    {Math.floor(Math.random() * 50) + 50}%
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Bottom 10 Scores */}
                        <div className="flex-1 border rounded-lg overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead className="w-24">Score</TableHead>
                                <TableHead className="w-28">Score in %</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Array.from({ length: 10 }).map((_, index) => (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>Student {index + 95}</TableCell>
                                  <TableCell>{Math.floor(Math.random() * 30) + 10}</TableCell>
                                  <TableCell className="bg-green-300">
                                    {Math.floor(Math.random() * 30) + 10}%
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>

                    {/* Self-Awareness & Emotional Intelligence */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-[#FF8C42]">Top 10 Score</h3>
                        <h3 className="text-xl font-bold text-center">Self-Awareness & Emotional Intelligence</h3>
                        <h3 className="text-xl font-semibold text-[#FF8C42]">Bottom 10 Score</h3>
                      </div>
                      <div className="flex gap-4">
                        {/* Top 10 Scores */}
                        <div className="flex-1 border rounded-lg overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead className="w-24">Score</TableHead>
                                <TableHead className="w-28">Score in %</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Array.from({ length: 10 }).map((_, index) => (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>Student {index + 7}</TableCell>
                                  <TableCell>{Math.floor(Math.random() * 50) + 50}</TableCell>
                                  <TableCell className="bg-green-300">
                                    {Math.floor(Math.random() * 50) + 50}%
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Bottom 10 Scores */}
                        <div className="flex-1 border rounded-lg overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead className="w-24">Score</TableHead>
                                <TableHead className="w-28">Score in %</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Array.from({ length: 10 }).map((_, index) => (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>Student {index + 97}</TableCell>
                                  <TableCell>{Math.floor(Math.random() * 30) + 10}</TableCell>
                                  <TableCell className="bg-green-300">
                                    {Math.floor(Math.random() * 30) + 10}%
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>

                    {/* Communication & Active Listening */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-[#FF8C42]">Top 10 Score</h3>
                        <h3 className="text-xl font-bold text-center">Communication & Active Listening</h3>
                        <h3 className="text-xl font-semibold text-[#FF8C42]">Bottom 10 Score</h3>
                      </div>
                      <div className="flex gap-4">
                        {/* Top 10 Scores */}
                        <div className="flex-1 border rounded-lg overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead className="w-24">Score</TableHead>
                                <TableHead className="w-28">Score in %</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Array.from({ length: 10 }).map((_, index) => (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>Student {index + 9}</TableCell>
                                  <TableCell>{Math.floor(Math.random() * 50) + 50}</TableCell>
                                  <TableCell className="bg-green-300">
                                    {Math.floor(Math.random() * 50) + 50}%
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Bottom 10 Scores */}
                        <div className="flex-1 border rounded-lg overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead className="w-24">Score</TableHead>
                                <TableHead className="w-28">Score in %</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Array.from({ length: 10 }).map((_, index) => (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>Student {index + 99}</TableCell>
                                  <TableCell>{Math.floor(Math.random() * 30) + 10}</TableCell>
                                  <TableCell className="bg-green-300">
                                    {Math.floor(Math.random() * 30) + 10}%
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        <TabsContent value="overall-report-post">
          <h2 className="text-2xl font-bold mb-4">Overall Report - Post Only Content</h2>
          <p>This tab will display post-assessment data and analysis.</p>
        </TabsContent>
        
        <TabsContent value="pre-vs-post-comparison">
          <h2 className="text-2xl font-bold mb-4">Pre vs Post Comparison Content</h2>
          <p>This tab will display comparative analysis between pre and post assessments.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrgDashboard;
