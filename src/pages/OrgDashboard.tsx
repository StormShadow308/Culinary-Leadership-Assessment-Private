
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger, TabsHeader, SubTabsList, SubTabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableFooter, 
  TableHead, 
  TableHeader, 
  TableRow,
  RankingTable,
  RankingTableHead,
  RankingTableCell
} from "@/components/ui/table";

const OrgDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSubTab, setActiveSubTab] = useState('overall-performance');
  const [activeReportSubTab, setActiveReportSubTab] = useState('cohort-scoring');

  // Dummy data for charts and tables
  const overallPerformanceData = [
    { month: 'Jan', score: 65 },
    { month: 'Feb', score: 59 },
    { month: 'Mar', score: 80 },
    { month: 'Apr', score: 81 },
    { month: 'May', score: 56 },
    { month: 'Jun', score: 55 },
    { month: 'Jul', score: 40 },
  ];

  // Dummy data for student rankings
  const generateStudentData = (count: number) => {
    return Array.from({ length: count }).map((_, index) => ({
      id: index + 1,
      name: `Student ${index + 1}`,
      score: Math.floor(Math.random() * 100),
      percentage: `${Math.floor(Math.random() * 100)}%`
    }));
  };

  const students = generateStudentData(20);
  const topStudents = [...students].sort((a, b) => b.score - a.score).slice(0, 10);
  const bottomStudents = [...students].sort((a, b) => a.score - b.score).slice(0, 10);

  // Categories for ranking tables
  const categories = [
    "Resilience and Adaptability",
    "Team Dynamics & Collaboration",
    "Decision-Making & Problem-Solving",
    "Self-Awareness & Emotional Intelligence",
    "Communication & Active Listening"
  ];

  // Returns the percentage display bar for the overall ranking table
  const renderScoreBar = (score: number) => {
    return (
      <div className="w-full bg-gray-200 h-6 relative">
        <div 
          className="h-full bg-green-400" 
          style={{ width: `${score}%` }}
        ></div>
      </div>
    );
  };

  // Component for the overall students ranking table
  const OverallRankingTable = () => (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4">Students Rankings</h2>
      <RankingTable>
        <TableHeader>
          <TableRow>
            <RankingTableHead className="w-16">No.</RankingTableHead>
            <RankingTableHead className="w-1/4">Student</RankingTableHead>
            <RankingTableHead className="w-24">Score</RankingTableHead>
            <RankingTableHead className="w-24">Score in %</RankingTableHead>
            <RankingTableHead colSpan={6} className="text-center">Overall Score</RankingTableHead>
          </TableRow>
          <TableRow>
            <RankingTableHead className="invisible"></RankingTableHead>
            <RankingTableHead className="invisible"></RankingTableHead>
            <RankingTableHead className="invisible"></RankingTableHead>
            <RankingTableHead className="invisible"></RankingTableHead>
            <RankingTableHead className="font-normal">0%</RankingTableHead>
            <RankingTableHead className="font-normal">20%</RankingTableHead>
            <RankingTableHead className="font-normal">40%</RankingTableHead>
            <RankingTableHead className="font-normal">60%</RankingTableHead>
            <RankingTableHead className="font-normal">80%</RankingTableHead>
            <RankingTableHead className="font-normal">100%</RankingTableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topStudents.map((student) => (
            <TableRow key={student.id}>
              <RankingTableCell>{student.id}</RankingTableCell>
              <RankingTableCell>{student.name}</RankingTableCell>
              <RankingTableCell>{student.score}</RankingTableCell>
              <RankingTableCell>{student.percentage}</RankingTableCell>
              <RankingTableCell colSpan={6} className="p-0">
                {renderScoreBar(student.score)}
              </RankingTableCell>
            </TableRow>
          ))}
        </TableBody>
      </RankingTable>
    </div>
  );

  // Component for category ranking tables (top and bottom 10)
  const CategoryRankingTable = ({ category }: { category: string }) => (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-center mb-4">{category}</h2>
      <div className="flex gap-4">
        {/* Top 10 Students */}
        <div className="flex-1">
          <h3 className="text-lg font-medium text-brand-orange mb-2">Top 10 Score</h3>
          <RankingTable>
            <TableHeader>
              <TableRow>
                <RankingTableHead>No</RankingTableHead>
                <RankingTableHead>Student</RankingTableHead>
                <RankingTableHead>Score</RankingTableHead>
                <RankingTableHead>Score in %</RankingTableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topStudents.map((student) => (
                <TableRow key={`top-${student.id}`}>
                  <RankingTableCell>{student.id}</RankingTableCell>
                  <RankingTableCell>{student.name}</RankingTableCell>
                  <RankingTableCell>{student.score}</RankingTableCell>
                  <RankingTableCell className="bg-green-300">0%</RankingTableCell>
                </TableRow>
              ))}
            </TableBody>
          </RankingTable>
        </div>
        
        {/* Bottom 10 Students */}
        <div className="flex-1">
          <h3 className="text-lg font-medium text-brand-orange mb-2">Bottom 10 Score</h3>
          <RankingTable>
            <TableHeader>
              <TableRow>
                <RankingTableHead>No</RankingTableHead>
                <RankingTableHead>Student</RankingTableHead>
                <RankingTableHead>Score</RankingTableHead>
                <RankingTableHead>Score in %</RankingTableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bottomStudents.map((student) => (
                <TableRow key={`bottom-${student.id}`}>
                  <RankingTableCell>{student.id}</RankingTableCell>
                  <RankingTableCell>{student.name}</RankingTableCell>
                  <RankingTableCell>{student.score}</RankingTableCell>
                  <RankingTableCell className="bg-green-300">0%</RankingTableCell>
                </TableRow>
              ))}
            </TableBody>
          </RankingTable>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Organization Dashboard</h1>
      
      <TabsHeader className="mb-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger 
            value="overview" 
            onClick={() => setActiveTab('overview')}
            className={activeTab === 'overview' ? 'bg-gray-200' : ''}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            onClick={() => setActiveTab('analytics')}
            className={activeTab === 'analytics' ? 'bg-gray-200' : ''}
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="participants" 
            onClick={() => setActiveTab('participants')}
            className={activeTab === 'participants' ? 'bg-gray-200' : ''}
          >
            Participants
          </TabsTrigger>
          <TabsTrigger 
            value="overall-report" 
            onClick={() => setActiveTab('overall-report')}
            className={activeTab === 'overall-report' ? 'bg-gray-200' : ''}
          >
            Overall Report - Pre Only
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            onClick={() => setActiveTab('settings')}
            className={activeTab === 'settings' ? 'bg-gray-200' : ''}
          >
            Settings
          </TabsTrigger>
        </TabsList>
      </TabsHeader>

      {activeTab === 'overview' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">1,245</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active Cohorts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">8</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">72%</div>
                <Progress value={72} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <SubTabsList className="mb-4">
            <SubTabsTrigger 
              value="overall-performance" 
              onClick={() => setActiveSubTab('overall-performance')}
              className={activeSubTab === 'overall-performance' ? 'border-brand-orange text-brand-orange' : ''}
            >
              Overall Performance
            </SubTabsTrigger>
            <SubTabsTrigger 
              value="completion-rates" 
              onClick={() => setActiveSubTab('completion-rates')}
              className={activeSubTab === 'completion-rates' ? 'border-brand-orange text-brand-orange' : ''}
            >
              Completion Rates
            </SubTabsTrigger>
            <SubTabsTrigger 
              value="demographics" 
              onClick={() => setActiveSubTab('demographics')}
              className={activeSubTab === 'demographics' ? 'border-brand-orange text-brand-orange' : ''}
            >
              Demographics
            </SubTabsTrigger>
          </SubTabsList>

          {activeSubTab === 'overall-performance' && (
            <Card>
              <CardHeader>
                <CardTitle>Overall Performance Trend</CardTitle>
                <CardDescription>Average scores across all cohorts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={overallPerformanceData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area type="monotone" dataKey="score" stroke="#8884d8" fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'overall-report' && (
        <div>
          <SubTabsList className="mb-6">
            <SubTabsTrigger 
              value="cohort-scoring" 
              onClick={() => setActiveReportSubTab('cohort-scoring')}
              className={activeReportSubTab === 'cohort-scoring' ? 'border-brand-orange text-brand-orange' : ''}
            >
              Cohort Scoring
            </SubTabsTrigger>
            <SubTabsTrigger 
              value="student-rankings" 
              onClick={() => setActiveReportSubTab('student-rankings')}
              className={activeReportSubTab === 'student-rankings' ? 'border-brand-orange text-brand-orange' : ''}
            >
              Student Rankings
            </SubTabsTrigger>
          </SubTabsList>

          {activeReportSubTab === 'cohort-scoring' && (
            <Card>
              <CardHeader>
                <CardTitle>Cohort Scoring Curve</CardTitle>
                <CardDescription>Distribution of participant scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-5 gap-4">
                    <div className="col-span-3">
                      <h3 className="text-lg font-semibold mb-2">Score Distribution</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { range: '0-20', count: 12 },
                            { range: '21-40', count: 28 },
                            { range: '41-60', count: 56 },
                            { range: '61-80', count: 40 },
                            { range: '81-100', count: 18 },
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="range" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <h3 className="text-lg font-semibold mb-2">Proficiency Levels</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Beginner', value: 20 },
                                { name: 'Intermediate', value: 45 },
                                { name: 'Advanced', value: 25 },
                                { name: 'Expert', value: 10 },
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              <Cell fill="#FF8042" />
                              <Cell fill="#00C49F" />
                              <Cell fill="#FFBB28" />
                              <Cell fill="#0088FE" />
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeReportSubTab === 'student-rankings' && (
            <div>
              <OverallRankingTable />
              
              {categories.map((category) => (
                <CategoryRankingTable key={category} category={category} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrgDashboard;
