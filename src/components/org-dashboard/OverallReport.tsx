import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { mockOverallReportData } from "./mockData";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AssessmentAnalysis from "./AssessmentAnalysis";

const OverallReport = () => {
  const [activeSubTab, setActiveSubTab] = useState("cohort-scoring");
  const { cohortScoring } = mockOverallReportData;

  // Transform the cohort scoring curve data for the line chart
  const cohortScoringCurveData = cohortScoring.cohortScoringCurve.map((value, index) => ({
    score: index + 1,
    value
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Overall Report - Pre Only
      </h1>

      <Tabs defaultValue="cohort-scoring" className="w-full" onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cohort-scoring">Cohort Scoring</TabsTrigger>
          <TabsTrigger value="student-rankings">Student Rankings</TabsTrigger>
          <TabsTrigger value="assessment-analysis">Assessment Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cohort-scoring" className="mt-6">
          {activeSubTab === "cohort-scoring" && (
            <div className="space-y-8">
              {/* Cohort Scoring Curve */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-green-800">Cohort Scoring Curve</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={cohortScoringCurveData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="score"
                          label={{ 
                            value: 'Score', 
                            position: 'insideBottom', 
                            offset: -10 
                          }}
                        />
                        <YAxis 
                          label={{ 
                            value: 'Percentage', 
                            angle: -90, 
                            position: 'insideLeft' 
                          }}
                          domain={[0, 1]}
                          tickFormatter={(value) => `${(Number(value) * 100)}%`}
                        />
                        <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(2)}%`} />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Overall Proficiency Levels */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-green-800">Overall Proficiency Levels for Cohort</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/3">Scoring</TableHead>
                          <TableHead className="w-1/6">Student</TableHead>
                          <TableHead className="w-1/6">%</TableHead>
                          <TableHead className="w-1/3">
                            <div className="flex justify-between text-xs">
                              <span>0%</span>
                              <span>20%</span>
                              <span>40%</span>
                              <span>60%</span>
                              <span>80%</span>
                              <span>100%</span>
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cohortScoring.proficiencyLevels.map((level, index) => (
                          <TableRow key={index}>
                            <TableCell>{level.level}</TableCell>
                            <TableCell>{level.students}</TableCell>
                            <TableCell>{level.percentage}</TableCell>
                            <TableCell>
                              {level.percentage !== "0%" && (
                                <div 
                                  className="h-6 bg-orange-500" 
                                  style={{ 
                                    width: level.percentage,
                                    borderRadius: '4px'
                                  }}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="font-bold">
                          <TableCell>Total</TableCell>
                          <TableCell>{cohortScoring.totalStudents}</TableCell>
                          <TableCell>100%</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Average Score per Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-orange-800">Average Score per Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={cohortScoring.categoryScores}
                            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              type="number"
                              domain={[0, 8]}
                              label={{ 
                                value: 'Score', 
                                position: 'insideBottom', 
                                offset: -10 
                              }}
                            />
                            <YAxis 
                              dataKey="category" 
                              type="category" 
                              width={150} 
                              tick={{ fontSize: 12 }}
                            />
                            <Tooltip />
                            <Legend />
                            <Bar 
                              dataKey="score" 
                              name="Pre-Program" 
                              fill="#8884d8" 
                              background={{ fill: '#eee' }}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Summary</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Total Students</p>
                          <p className="text-2xl font-semibold">{cohortScoring.totalStudents}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Average Overall Score</p>
                          <p className="text-2xl font-semibold">{cohortScoring.averageOverallScore}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Highest Category</p>
                          <p className="text-2xl font-semibold">{cohortScoring.highestCategory}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Lowest Category</p>
                          <p className="text-2xl font-semibold">{cohortScoring.lowestCategory}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Number of Students per Scoring and Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-green-800">Number of Students per Scoring and Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="mb-6">
                      <div className="flex justify-end mb-2">
                        <div className="flex justify-between w-full max-w-[500px] text-xs">
                          <span>0%</span>
                          <span>10%</span>
                          <span>20%</span>
                          <span>30%</span>
                          <span>40%</span>
                          <span>50%</span>
                          <span>60%</span>
                          <span>70%</span>
                          <span>80%</span>
                          <span>90%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      {Object.entries({
                        "Resilience and Adaptability": "resilienceAdaptability",
                        "Team Dynamics & Collaboration": "teamDynamics",
                        "Decision-Making & Problem-Solving": "decisionMaking",
                        "Self-Awareness & Emotional Intelligence": "selfAwareness",
                        "Communication & Active Listening": "communication"
                      }).map(([displayName, key]) => (
                        <div key={key} className="flex items-center mb-2">
                          <div className="w-64 text-sm">{displayName}</div>
                          <div className="flex-1">
                            <div className="h-6 w-full bg-red-500"></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-6 gap-1 mb-4">
                      <div className="col-span-1"></div>
                      <div className="col-span-1 bg-red-500 p-2 text-center text-white font-medium">
                        Needs Development
                      </div>
                      <div className="col-span-1 bg-yellow-400 p-2 text-center text-white font-medium">
                        Developing Proficiency
                      </div>
                      <div className="col-span-1 bg-green-500 p-2 text-center text-white font-medium">
                        Moderate Proficiency
                      </div>
                      <div className="col-span-1 bg-blue-500 p-2 text-center text-white font-medium">
                        High Proficiency
                      </div>
                      <div className="col-span-1 bg-purple-500 p-2 text-center text-white font-medium">
                        Exceptional Proficiency
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Number of Student</TableHead>
                          <TableHead>Needs Development</TableHead>
                          <TableHead>Developing Proficiency</TableHead>
                          <TableHead>Moderate Proficiency</TableHead>
                          <TableHead>High Proficiency</TableHead>
                          <TableHead>Exceptional Proficiency</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries({
                          "Resilience and Adaptability": "resilienceAdaptability",
                          "Team Dynamics & Collaboration": "teamDynamics",
                          "Decision-Making & Problem-Solving": "decisionMaking",
                          "Self-Awareness & Emotional Intelligence": "selfAwareness",
                          "Communication & Active Listening": "communication"
                        }).map(([displayName, key]) => (
                          <TableRow key={key}>
                            <TableCell>{displayName}</TableCell>
                            <TableCell>{cohortScoring.categoryBreakdown[key][4].students}</TableCell>
                            <TableCell>{cohortScoring.categoryBreakdown[key][3].students}</TableCell>
                            <TableCell>{cohortScoring.categoryBreakdown[key][2].students}</TableCell>
                            <TableCell>{cohortScoring.categoryBreakdown[key][1].students}</TableCell>
                            <TableCell>{cohortScoring.categoryBreakdown[key][0].students}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Percent of Students in Each Proficiency Level, by Skill Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-green-800">Percent of Students in Each Proficiency Level, by Skill Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {Object.entries({
                      "Resilience and Adaptability": "resilienceAdaptability",
                      "Team Dynamics & Collaboration": "teamDynamics",
                      "Decision-Making & Problem-Solving": "decisionMaking",
                      "Self-Awareness & Emotional Intelligence": "selfAwareness",
                      "Communication & Active Listening": "communication"
                    }).map(([displayName, key]) => (
                      <div key={key} className="space-y-2">
                        <h3 className="text-lg font-semibold">• {displayName}</h3>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-1/3">Scoring</TableHead>
                                <TableHead className="w-1/6">Student</TableHead>
                                <TableHead className="w-1/6">%</TableHead>
                                <TableHead className="w-1/3">
                                  <div className="flex justify-between text-xs">
                                    <span>0%</span>
                                    <span>20%</span>
                                    <span>40%</span>
                                    <span>60%</span>
                                    <span>80%</span>
                                    <span>100%</span>
                                  </div>
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {cohortScoring.categoryBreakdown[key].map((level, index) => (
                                <TableRow key={index}>
                                  <TableCell>{level.level}</TableCell>
                                  <TableCell>{level.students}</TableCell>
                                  <TableCell>{level.percentage}</TableCell>
                                  <TableCell>
                                    {level.percentage !== "0%" && (
                                      <div 
                                        className="h-6 bg-green-500" 
                                        style={{ 
                                          width: level.percentage,
                                          borderRadius: '4px'
                                        }}
                                      />
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow className="font-bold">
                                <TableCell>Total Student</TableCell>
                                <TableCell>{cohortScoring.totalStudents}</TableCell>
                                <TableCell>100%</TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="student-rankings" className="mt-6">
          {activeSubTab === "student-rankings" && (
            <div className="space-y-8">
              {/* Overall Student Rankings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-green-800">Students Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/12">No.</TableHead>
                          <TableHead className="w-3/12">Student</TableHead>
                          <TableHead className="w-1/12">Score</TableHead>
                          <TableHead className="w-1/12">Score in %</TableHead>
                          <TableHead className="w-6/12">
                            <div className="flex justify-between text-xs">
                              <span>0%</span>
                              <span>20%</span>
                              <span>40%</span>
                              <span>60%</span>
                              <span>80%</span>
                              <span>100%</span>
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockOverallReportData.studentRankings.overall.map((student) => (
                          <TableRow key={student.no}>
                            <TableCell>{student.no}</TableCell>
                            <TableCell>{student.student}</TableCell>
                            <TableCell>{student.score}</TableCell>
                            <TableCell>{student.scorePercentage}</TableCell>
                            <TableCell>
                              {student.scorePercentage !== "0%" && (
                                <div 
                                  className="h-6 bg-blue-500" 
                                  style={{ 
                                    width: student.scorePercentage,
                                    borderRadius: '4px'
                                  }}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Category Rankings */}
              {Object.entries({
                "Resilience and Adaptability": "resilienceAdaptability",
                "Team Dynamics & Collaboration": "teamDynamics",
                "Decision-Making & Problem-Solving": "decisionMaking",
                "Self-Awareness & Emotional Intelligence": "selfAwareness",
                "Communication & Active Listening": "communication"
              }).map(([displayName, key]) => (
                <Card key={key} className="mt-8">
                  <CardHeader>
                    <CardTitle className="text-xl text-center">{displayName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Top 10 Scores */}
                      <div>
                        <h3 className="text-lg font-semibold text-orange-500 mb-4">Top 10 Score</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>No</TableHead>
                              <TableHead>Student</TableHead>
                              <TableHead>Score</TableHead>
                              <TableHead>Score in %</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mockOverallReportData.studentRankings.categories[key].top10.map((student) => (
                              <TableRow key={student.no}>
                                <TableCell>{student.no}</TableCell>
                                <TableCell>{student.student}</TableCell>
                                <TableCell>{student.score}</TableCell>
                                <TableCell className="bg-green-200">{student.scorePercentage}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Bottom 10 Scores */}
                      <div>
                        <h3 className="text-lg font-semibold text-orange-500 mb-4">Bottom 10 Score</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>No</TableHead>
                              <TableHead>Student</TableHead>
                              <TableHead>Score</TableHead>
                              <TableHead>Score in %</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mockOverallReportData.studentRankings.categories[key].bottom10.map((student) => (
                              <TableRow key={student.no}>
                                <TableCell>{student.no}</TableCell>
                                <TableCell>{student.student}</TableCell>
                                <TableCell>{student.score}</TableCell>
                                <TableCell className="bg-green-200">{student.scorePercentage}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="assessment-analysis" className="mt-6">
          {activeSubTab === "assessment-analysis" && (
            <AssessmentAnalysis />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OverallReport; 