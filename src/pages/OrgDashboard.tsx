import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsHeader, SubTabsList, SubTabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { cn } from "@/lib/utils"

const OrgDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Organization Dashboard</h1>
      
      <Tabs defaultValue="overallReport">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overallReport">Overall Report</TabsTrigger>
          <TabsTrigger value="cohortComparison">Cohort Comparison</TabsTrigger>
          <TabsTrigger value="participantProgress">Participant Progress</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overallReport" className="mt-6">
          <Tabs defaultValue="preOnly">
            <TabsList>
              <TabsTrigger value="preOnly">Pre Only</TabsTrigger>
              <TabsTrigger value="prePost">Pre/Post</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preOnly" className="mt-4">
              <TabsHeader>
                <Tabs defaultValue="cohortScoring">
                  <SubTabsList>
                    <SubTabsTrigger value="cohortScoring">Cohort Scoring</SubTabsTrigger>
                    <SubTabsTrigger value="studentRankings">Student Rankings</SubTabsTrigger>
                    <SubTabsTrigger value="assessmentAnalysis">Assessment Analysis</SubTabsTrigger>
                  </SubTabsList>
                  
                  <TabsContent value="cohortScoring" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Cohort A</CardTitle>
                          <CardDescription>Details about Cohort A scoring</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>Cohort A scoring content will be displayed here.</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Cohort B</CardTitle>
                          <CardDescription>Details about Cohort B scoring</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>Cohort B scoring content will be displayed here.</p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="studentRankings" className="mt-4">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold">Overall Rankings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">Top 10 Students</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead className="w-[40%]">Progress</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {[...Array(10)].map((_, index) => (
                                    <TableRow key={index}>
                                      <TableCell className="font-medium">{index + 1}</TableCell>
                                      <TableCell>Student {100 - index}</TableCell>
                                      <TableCell>{90 - index}</TableCell>
                                      <TableCell>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                          <div
                                            className="bg-brand-orange h-2.5 rounded-full"
                                            style={{ width: `${90 - index}%` }}
                                          />
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">Bottom 10 Students</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead className="w-[40%]">Progress</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {[...Array(10)].map((_, index) => (
                                    <TableRow key={index}>
                                      <TableCell className="font-medium">{91 + index}</TableCell>
                                      <TableCell>Student {index + 1}</TableCell>
                                      <TableCell>{40 + index}</TableCell>
                                      <TableCell>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                          <div
                                            className="bg-brand-orange h-2.5 rounded-full"
                                            style={{ width: `${40 + index}%` }}
                                          />
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      
                      {/* Category-specific Rankings */}
                      {['Resilience', 'Team Dynamics', 'Decision-Making', 'Self-Awareness', 'Communication'].map((category) => (
                        <div key={category} className="space-y-4">
                          <h3 className="text-xl font-bold">{category} Rankings</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Top 10 Students</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Rank</TableHead>
                                      <TableHead>Name</TableHead>
                                      <TableHead>Score</TableHead>
                                      <TableHead className="w-[40%]">Progress</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {[...Array(10)].map((_, index) => (
                                      <TableRow key={index}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell>Student {100 - index}</TableCell>
                                        <TableCell>{85 - (index * 2)}</TableCell>
                                        <TableCell>
                                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                              className="bg-brand-orange h-2.5 rounded-full"
                                              style={{ width: `${85 - (index * 2)}%` }}
                                            />
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Bottom 10 Students</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Rank</TableHead>
                                      <TableHead>Name</TableHead>
                                      <TableHead>Score</TableHead>
                                      <TableHead className="w-[40%]">Progress</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {[...Array(10)].map((_, index) => (
                                      <TableRow key={index}>
                                        <TableCell className="font-medium">{91 + index}</TableCell>
                                        <TableCell>Student {index + 1}</TableCell>
                                        <TableCell>{35 + index}</TableCell>
                                        <TableCell>
                                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                              className="bg-brand-orange h-2.5 rounded-full"
                                              style={{ width: `${35 + index}%` }}
                                            />
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="assessmentAnalysis" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Assessment Analysis</CardTitle>
                          <CardDescription>Details about assessment performance</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>Assessment analysis content will be displayed here.</p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsHeader>
            </TabsContent>
            
            <TabsContent value="prePost" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pre/Post Assessment</CardTitle>
                  <CardDescription>Details about pre and post assessment results</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Pre/Post assessment content will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="cohortComparison" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Cohort Comparison</CardTitle>
              <CardDescription>Compare different cohorts</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Cohort comparison content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="participantProgress" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Participant Progress</CardTitle>
              <CardDescription>Track individual participant progress</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Participant progress content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure dashboard settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Settings content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrgDashboard;
