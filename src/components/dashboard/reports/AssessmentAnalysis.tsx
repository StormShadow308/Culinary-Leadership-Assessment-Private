
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface AssessmentAnalysisProps {
  cohort: string;
  timeRange: string;
}

const AssessmentAnalysis: React.FC<AssessmentAnalysisProps> = ({ cohort, timeRange }) => {
  // Dummy data for assessment analysis
  const assessmentCompletionData = [
    { name: "Leadership", completed: 245, pending: 30 },
    { name: "Team Dynamics", completed: 260, pending: 15 },
    { name: "Communication", completed: 235, pending: 40 },
    { name: "Problem Solving", completed: 255, pending: 20 },
    { name: "Resilience", completed: 240, pending: 35 },
  ];
  
  const difficultyData = [
    { name: "Leadership", value: 3.2, fill: "#8884d8" },
    { name: "Team Dynamics", value: 2.8, fill: "#83a6ed" },
    { name: "Communication", value: 2.5, fill: "#8dd1e1" },
    { name: "Problem Solving", value: 3.6, fill: "#82ca9d" },
    { name: "Resilience", value: 3.4, fill: "#a4de6c" },
  ];
  
  const questionAnalysisData = [
    { id: "Q1", description: "Describe a situation where you had to adapt to a significant change", category: "Resilience", avgScore: 3.8, maxScore: 5.0 },
    { id: "Q2", description: "How do you handle conflicting priorities in a team setting?", category: "Team Dynamics", avgScore: 4.2, maxScore: 5.0 },
    { id: "Q3", description: "Explain your approach to solving complex problems", category: "Problem Solving", avgScore: 3.5, maxScore: 5.0 },
    { id: "Q4", description: "How do you ensure clear communication in a diverse team?", category: "Communication", avgScore: 4.5, maxScore: 5.0 },
    { id: "Q5", description: "Describe a situation where you demonstrated leadership skills", category: "Leadership", avgScore: 3.9, maxScore: 5.0 },
    { id: "Q6", description: "How do you manage stress during challenging situations?", category: "Resilience", avgScore: 3.6, maxScore: 5.0 },
    { id: "Q7", description: "Describe your experience with team conflict resolution", category: "Team Dynamics", avgScore: 3.8, maxScore: 5.0 },
    { id: "Q8", description: "How do you approach decision-making with limited information?", category: "Problem Solving", avgScore: 3.3, maxScore: 5.0 },
  ];
  
  const completionData = [
    { name: "Completed", value: 85, fill: "#0088FE" },
    { name: "Pending", value: 15, fill: "#FFBB28" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Assessment Completion Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={assessmentCompletionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" stackId="a" fill="#8884d8" name="Completed" />
                  <Bar dataKey="pending" stackId="a" fill="#82ca9d" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Assessment Difficulty Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={difficultyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5]} label={{ value: 'Difficulty (1-5)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="value">
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Question Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Avg. Score</TableHead>
                  <TableHead>Max Score</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questionAnalysisData.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-medium">{question.id}</TableCell>
                    <TableCell>{question.description}</TableCell>
                    <TableCell>{question.category}</TableCell>
                    <TableCell>{question.avgScore.toFixed(1)}</TableCell>
                    <TableCell>{question.maxScore.toFixed(1)}</TableCell>
                    <TableCell>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(question.avgScore / question.maxScore) * 100}%` }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overall Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Time to Complete</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex flex-col justify-center items-center">
              <div className="text-5xl font-bold text-center mb-2">28</div>
              <div className="text-xl text-center text-muted-foreground">Minutes Average</div>
              <div className="mt-6 space-y-3 w-full max-w-md">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Resilience Assessment</span>
                    <span>32 min</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "80%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Team Dynamics Assessment</span>
                    <span>25 min</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "62.5%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Problem Solving Assessment</span>
                    <span>35 min</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "87.5%" }} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentAnalysis;
