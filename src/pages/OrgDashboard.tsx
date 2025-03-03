
import React, { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  SubTabsList,
  SubTabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  RankingTableTitle,
  ScoreProgressBar
} from "@/components/ui/table";

const mockScoreData = [
  { id: 1, name: "John Doe", score: 92, scorePercentage: 92 },
  { id: 2, name: "Jane Smith", score: 88, scorePercentage: 88 },
  { id: 3, name: "Alex Johnson", score: 85, scorePercentage: 85 },
  { id: 4, name: "Taylor Brown", score: 83, scorePercentage: 83 },
  { id: 5, name: "Sam Wilson", score: 81, scorePercentage: 81 },
  { id: 6, name: "Morgan Davis", score: 79, scorePercentage: 79 },
  { id: 7, name: "Chris Martin", score: 77, scorePercentage: 77 },
  { id: 8, name: "Riley Thompson", score: 75, scorePercentage: 75 },
  { id: 9, name: "Jordan Lee", score: 72, scorePercentage: 72 },
  { id: 10, name: "Casey Miller", score: 70, scorePercentage: 70 },
  // For bottom 10
  { id: 11, name: "Jamie Clark", score: 45, scorePercentage: 45 },
  { id: 12, name: "Robin White", score: 43, scorePercentage: 43 },
  { id: 13, name: "Avery Garcia", score: 41, scorePercentage: 41 },
  { id: 14, name: "Charlie Hall", score: 40, scorePercentage: 40 },
  { id: 15, name: "Dakota Lewis", score: 39, scorePercentage: 39 },
  { id: 16, name: "Finley Allen", score: 37, scorePercentage: 37 },
  { id: 17, name: "Hayden Young", score: 35, scorePercentage: 35 },
  { id: 18, name: "Quinn Evans", score: 32, scorePercentage: 32 },
  { id: 19, name: "Reese Adams", score: 30, scorePercentage: 30 },
  { id: 20, name: "Sydney Nelson", score: 28, scorePercentage: 28 },
];

// Mock data for category-specific rankings
const categoryData = {
  resilience: {
    top: mockScoreData.slice(0, 10).map(s => ({ ...s, scorePercentage: Math.round(s.score * 0.9) })),
    bottom: mockScoreData.slice(10, 20).map(s => ({ ...s, scorePercentage: Math.round(s.score * 0.9) }))
  },
  teamDynamics: {
    top: mockScoreData.slice(0, 10).map(s => ({ ...s, scorePercentage: Math.round(s.score * 0.85) })),
    bottom: mockScoreData.slice(10, 20).map(s => ({ ...s, scorePercentage: Math.round(s.score * 0.85) }))
  },
  decisionMaking: {
    top: mockScoreData.slice(0, 10).map(s => ({ ...s, scorePercentage: Math.round(s.score * 0.88) })),
    bottom: mockScoreData.slice(10, 20).map(s => ({ ...s, scorePercentage: Math.round(s.score * 0.88) }))
  },
  selfAwareness: {
    top: mockScoreData.slice(0, 10).map(s => ({ ...s, scorePercentage: Math.round(s.score * 0.92) })),
    bottom: mockScoreData.slice(10, 20).map(s => ({ ...s, scorePercentage: Math.round(s.score * 0.92) }))
  },
  communication: {
    top: mockScoreData.slice(0, 10).map(s => ({ ...s, scorePercentage: Math.round(s.score * 0.87) })),
    bottom: mockScoreData.slice(10, 20).map(s => ({ ...s, scorePercentage: Math.round(s.score * 0.87) }))
  }
};

const OrgDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Organization Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="participant-data">Participant Data</TabsTrigger>
          <TabsTrigger value="pre-only">Overall Report - Pre Only</TabsTrigger>
          <TabsTrigger value="pre-post">Overall Report - Pre/Post</TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Organization Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Overview tab content */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Total Participants</h3>
              <p className="text-3xl font-bold">128</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Average Score</h3>
              <p className="text-3xl font-bold">72%</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Programs</h3>
              <p className="text-3xl font-bold">5</p>
            </div>
          </div>
        </TabsContent>

        {/* Participant Data Tab Content */}
        <TabsContent value="participant-data" className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Participant Data</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            {/* Participant data tab content */}
            <p>Participant data visualization and tables will be displayed here.</p>
          </div>
        </TabsContent>

        {/* Overall Report - Pre Only Tab Content */}
        <TabsContent value="pre-only" className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Overall Report - Pre Only</h2>
          
          <Tabs defaultValue="student-rankings">
            <SubTabsList className="mb-4">
              <SubTabsTrigger value="student-rankings">Student Rankings</SubTabsTrigger>
            </SubTabsList>
            
            <TabsContent value="student-rankings" className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-2xl font-bold mb-6">Students Rankings</h3>
                
                {/* Overall Rankings Table */}
                <div className="mb-8">
                  <Table className="border">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="border w-20">No.</TableHead>
                        <TableHead className="border w-64">Student</TableHead>
                        <TableHead className="border w-32">Score</TableHead>
                        <TableHead className="border w-32">Score in %</TableHead>
                        <TableHead className="border">Overall Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockScoreData.slice(0, 10).map((student, index) => (
                        <TableRow key={student.id}>
                          <TableCell className="border text-center">{index + 1}</TableCell>
                          <TableCell className="border">{student.name}</TableCell>
                          <TableCell className="border text-center">{student.score}</TableCell>
                          <TableCell className="border text-center">{student.scorePercentage}%</TableCell>
                          <TableCell className="border">
                            <div className="flex items-center">
                              <div className="grid grid-cols-6 w-full gap-0.5">
                                <div className="text-xs text-center">0%</div>
                                <div className="text-xs text-center">20%</div>
                                <div className="text-xs text-center">40%</div>
                                <div className="text-xs text-center">60%</div>
                                <div className="text-xs text-center">80%</div>
                                <div className="text-xs text-center">100%</div>
                              </div>
                            </div>
                            <ScoreProgressBar percentage={student.scorePercentage} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Resilience and Adaptability Rankings */}
                <RankingTableTitle 
                  leftTitle="Top 10 Score" 
                  centerTitle="Resilience and Adaptability" 
                  rightTitle="Bottom 10 Score" 
                />
                <div className="flex gap-4">
                  {/* Top 10 Table */}
                  <div className="w-1/2">
                    <Table className="border">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="border w-16">No</TableHead>
                          <TableHead className="border">Student</TableHead>
                          <TableHead className="border w-24">Score</TableHead>
                          <TableHead className="border w-28">Score in %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryData.resilience.top.map((student, index) => (
                          <TableRow key={`resilience-top-${student.id}`}>
                            <TableCell className="border text-center">{index + 1}</TableCell>
                            <TableCell className="border">{student.name}</TableCell>
                            <TableCell className="border text-center">{student.score}</TableCell>
                            <TableCell className="border text-center bg-green-300">{student.scorePercentage}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Bottom 10 Table */}
                  <div className="w-1/2">
                    <Table className="border">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="border w-16">No</TableHead>
                          <TableHead className="border">Student</TableHead>
                          <TableHead className="border w-24">Score</TableHead>
                          <TableHead className="border w-28">Score in %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryData.resilience.bottom.map((student, index) => (
                          <TableRow key={`resilience-bottom-${student.id}`}>
                            <TableCell className="border text-center">{index + 1}</TableCell>
                            <TableCell className="border">{student.name}</TableCell>
                            <TableCell className="border text-center">{student.score}</TableCell>
                            <TableCell className="border text-center bg-green-300">{student.scorePercentage}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                {/* Team Dynamics & Collaboration Rankings */}
                <RankingTableTitle 
                  leftTitle="Top 10 Score" 
                  centerTitle="Team Dynamics & Collaboration" 
                  rightTitle="Bottom 10 Score" 
                />
                <div className="flex gap-4">
                  {/* Top 10 Table */}
                  <div className="w-1/2">
                    <Table className="border">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="border w-16">No</TableHead>
                          <TableHead className="border">Student</TableHead>
                          <TableHead className="border w-24">Score</TableHead>
                          <TableHead className="border w-28">Score in %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryData.teamDynamics.top.map((student, index) => (
                          <TableRow key={`team-top-${student.id}`}>
                            <TableCell className="border text-center">{index + 1}</TableCell>
                            <TableCell className="border">{student.name}</TableCell>
                            <TableCell className="border text-center">{student.score}</TableCell>
                            <TableCell className="border text-center bg-green-300">{student.scorePercentage}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Bottom 10 Table */}
                  <div className="w-1/2">
                    <Table className="border">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="border w-16">No</TableHead>
                          <TableHead className="border">Student</TableHead>
                          <TableHead className="border w-24">Score</TableHead>
                          <TableHead className="border w-28">Score in %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryData.teamDynamics.bottom.map((student, index) => (
                          <TableRow key={`team-bottom-${student.id}`}>
                            <TableCell className="border text-center">{index + 1}</TableCell>
                            <TableCell className="border">{student.name}</TableCell>
                            <TableCell className="border text-center">{student.score}</TableCell>
                            <TableCell className="border text-center bg-green-300">{student.scorePercentage}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                {/* Decision-Making & Problem-Solving Rankings */}
                <RankingTableTitle 
                  leftTitle="Top 10 Score" 
                  centerTitle="Decision-Making & Problem-Solving" 
                  rightTitle="Bottom 10 Score" 
                />
                <div className="flex gap-4">
                  {/* Top 10 Table */}
                  <div className="w-1/2">
                    <Table className="border">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="border w-16">No</TableHead>
                          <TableHead className="border">Student</TableHead>
                          <TableHead className="border w-24">Score</TableHead>
                          <TableHead className="border w-28">Score in %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryData.decisionMaking.top.map((student, index) => (
                          <TableRow key={`decision-top-${student.id}`}>
                            <TableCell className="border text-center">{index + 1}</TableCell>
                            <TableCell className="border">{student.name}</TableCell>
                            <TableCell className="border text-center">{student.score}</TableCell>
                            <TableCell className="border text-center bg-green-300">{student.scorePercentage}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Bottom 10 Table */}
                  <div className="w-1/2">
                    <Table className="border">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="border w-16">No</TableHead>
                          <TableHead className="border">Student</TableHead>
                          <TableHead className="border w-24">Score</TableHead>
                          <TableHead className="border w-28">Score in %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryData.decisionMaking.bottom.map((student, index) => (
                          <TableRow key={`decision-bottom-${student.id}`}>
                            <TableCell className="border text-center">{index + 1}</TableCell>
                            <TableCell className="border">{student.name}</TableCell>
                            <TableCell className="border text-center">{student.score}</TableCell>
                            <TableCell className="border text-center bg-green-300">{student.scorePercentage}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                {/* Self-Awareness & Emotional Intelligence Rankings */}
                <RankingTableTitle 
                  leftTitle="Top 10 Score" 
                  centerTitle="Self-Awareness & Emotional Intelligence" 
                  rightTitle="Bottom 10 Score" 
                />
                <div className="flex gap-4">
                  {/* Top 10 Table */}
                  <div className="w-1/2">
                    <Table className="border">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="border w-16">No</TableHead>
                          <TableHead className="border">Student</TableHead>
                          <TableHead className="border w-24">Score</TableHead>
                          <TableHead className="border w-28">Score in %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryData.selfAwareness.top.map((student, index) => (
                          <TableRow key={`self-top-${student.id}`}>
                            <TableCell className="border text-center">{index + 1}</TableCell>
                            <TableCell className="border">{student.name}</TableCell>
                            <TableCell className="border text-center">{student.score}</TableCell>
                            <TableCell className="border text-center bg-green-300">{student.scorePercentage}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Bottom 10 Table */}
                  <div className="w-1/2">
                    <Table className="border">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="border w-16">No</TableHead>
                          <TableHead className="border">Student</TableHead>
                          <TableHead className="border w-24">Score</TableHead>
                          <TableHead className="border w-28">Score in %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryData.selfAwareness.bottom.map((student, index) => (
                          <TableRow key={`self-bottom-${student.id}`}>
                            <TableCell className="border text-center">{index + 1}</TableCell>
                            <TableCell className="border">{student.name}</TableCell>
                            <TableCell className="border text-center">{student.score}</TableCell>
                            <TableCell className="border text-center bg-green-300">{student.scorePercentage}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                {/* Communication & Active Listening Rankings */}
                <RankingTableTitle 
                  leftTitle="Top 10 Score" 
                  centerTitle="Communication & Active Listening" 
                  rightTitle="Bottom 10 Score" 
                />
                <div className="flex gap-4">
                  {/* Top 10 Table */}
                  <div className="w-1/2">
                    <Table className="border">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="border w-16">No</TableHead>
                          <TableHead className="border">Student</TableHead>
                          <TableHead className="border w-24">Score</TableHead>
                          <TableHead className="border w-28">Score in %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryData.communication.top.map((student, index) => (
                          <TableRow key={`comm-top-${student.id}`}>
                            <TableCell className="border text-center">{index + 1}</TableCell>
                            <TableCell className="border">{student.name}</TableCell>
                            <TableCell className="border text-center">{student.score}</TableCell>
                            <TableCell className="border text-center bg-green-300">{student.scorePercentage}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Bottom 10 Table */}
                  <div className="w-1/2">
                    <Table className="border">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="border w-16">No</TableHead>
                          <TableHead className="border">Student</TableHead>
                          <TableHead className="border w-24">Score</TableHead>
                          <TableHead className="border w-28">Score in %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryData.communication.bottom.map((student, index) => (
                          <TableRow key={`comm-bottom-${student.id}`}>
                            <TableCell className="border text-center">{index + 1}</TableCell>
                            <TableCell className="border">{student.name}</TableCell>
                            <TableCell className="border text-center">{student.score}</TableCell>
                            <TableCell className="border text-center bg-green-300">{student.scorePercentage}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Overall Report - Pre/Post Tab Content */}
        <TabsContent value="pre-post" className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Overall Report - Pre/Post</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            {/* Pre/Post report tab content */}
            <p>Pre/Post comparison reports will be displayed here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrgDashboard;
